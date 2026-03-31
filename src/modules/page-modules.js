// 项目/变更/文档/供应商/质量 等页面模块
import { state, allBOMs, projectsData, changesData, documentsData, suppliersData, qualityData, modSortState, modPageState } from './state.js';
import { todayISO, genId, detailGrid } from './ui-helpers.js';
import { showToast, showModal, hideModal, showConfirm, navigateTo } from './navigation.js';
import { trackRecentAccess } from './enhancements.js';
import { renderMaterials } from './materials.js';

// ===== NEW MODULE DATA & RENDER =====

function renderProjects() {
  const q = (document.getElementById('projSearch')?.value||'').toLowerCase();
  const pf = document.getElementById('projPhaseFilter')?.value||'all';
  const sf = document.getElementById('projStatusFilter')?.value||'all';
  const data = projectsData.filter(p => {
    if (q && !p.id.toLowerCase().includes(q) && !p.name.toLowerCase().includes(q)) return false;
    if (pf !== 'all' && p.phase !== pf) return false;
    if (sf !== 'all' && p.status !== sf) return false;
    return true;
  });
  const sc = document.getElementById('projStatCards');
  if (sc) sc.innerHTML = [{l:'总项目数',v:projectsData.length,c:'var(--accent)'},{l:'进行中',v:projectsData.filter(p=>p.status==='进行中').length,c:'var(--blue)'},{l:'已完成',v:projectsData.filter(p=>p.status==='已完成').length,c:'var(--green)'},{l:'延期',v:projectsData.filter(p=>p.status==='延期').length,c:'var(--red)'}].map(s=>'<div class="stat-card"><div class="stat-num" style="color:'+s.c+'">'+s.v+'</div><div class="stat-label">'+s.l+'</div></div>').join('');
  const statusBadge = s => ({进行中:'badge-blue',已完成:'badge-green',暂停:'badge-gray',延期:'badge-red'}[s]||'badge-gray');
  const phaseBadge = s => ({P0:'badge-gray',P1:'badge-gray',P2:'badge-blue',EVT:'badge-blue',DVT:'badge-purple',PVT:'badge-yellow',MP:'badge-green'}[s]||'badge-gray');
  const progressColor = p => p>=80?'var(--green)':p>=50?'var(--blue)':p>=30?'var(--yellow)':'var(--red)';
  const sorted = modSortData('proj', data);
  const pg = modPaginate('proj', sorted);
  const tb = document.getElementById('projBody');
  if (tb) tb.innerHTML = pg.pageData.map((p,i) => { let ops='<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();showProjDetail(\''+p.id+'\')">查看</button><button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();editProject(\''+p.id+'\')">编辑</button>';if(p.status!=='已完成')ops+='<button class="btn btn-ghost btn-xs" style="color:var(--red)" onclick="event.stopPropagation();deleteProject(\''+p.id+'\')">删除</button>';return '<tr style="cursor:pointer" onclick="showProjDetail(\''+p.id+'\')"><td>'+(pg.start+i+1)+'</td><td style="color:var(--accent);font-weight:500">'+p.id+'</td><td style="font-weight:500">'+p.name+'</td><td><span class="badge '+phaseBadge(p.phase)+'">'+p.phase+'</span></td><td>'+p.owner+'</td><td>'+p.start+'</td><td>'+p.end+'</td><td><span class="badge '+statusBadge(p.status)+'">'+p.status+'</span></td><td style="min-width:120px"><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:6px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden"><div style="height:100%;width:'+p.progress+'%;background:'+progressColor(p.progress)+';border-radius:4px"></div></div><span style="font-size:11px;color:var(--text-muted);min-width:32px">'+p.progress+'%</span></div></td><td style="white-space:nowrap">'+ops+'</td></tr>'}).join('');
}


let chgTab = 'all';
function switchChgTab(tab) {
  chgTab = tab;
  ['all','mine','review'].forEach(t => {
    const btn = document.getElementById('chgTab' + (t==='all'?'All':t==='mine'?'Mine':'Review'));
    if (btn) { btn.className = 'btn btn-sm ' + (t===tab?'btn-primary':'btn-secondary'); if(t===tab) btn.style.boxShadow='none'; else btn.style.boxShadow=''; }
  });
  renderChanges();
}
function renderChanges() {
  const q = (document.getElementById('chgSearch')?.value||'').toLowerCase();
  const tf = document.getElementById('chgTypeFilter')?.value||'all';
  const sf = document.getElementById('chgStatusFilter')?.value||'all';
  const pf = document.getElementById('chgPriorityFilter')?.value||'all';
  const uname = state.currentUser ? state.currentUser.name : '张工';
  let data = changesData;
  if (chgTab === 'mine') data = data.filter(c => c.initiator === uname);
  else if (chgTab === 'review') data = data.filter(c => c.reviewer === uname && (c.status==='待审批'||c.status==='审批中'));
  data = data.filter(c => {
    if (q && !c.id.toLowerCase().includes(q) && !c.title.toLowerCase().includes(q)) return false;
    if (tf !== 'all' && c.type !== tf) return false;
    if (sf !== 'all' && c.status !== sf) return false;
    if (pf !== 'all' && c.priority !== pf) return false;
    return true;
  });
  const sc = document.getElementById('chgStatCards');
  if (sc) sc.innerHTML = [{l:'总变更单',v:changesData.length,c:'var(--accent)'},{l:'待审批',v:changesData.filter(c=>c.status==='待审批'||c.status==='审批中').length,c:'var(--yellow)'},{l:'执行中',v:changesData.filter(c=>c.status==='执行中').length,c:'var(--blue)'},{l:'已关闭',v:changesData.filter(c=>c.status==='已关闭').length,c:'var(--green)'},{l:'已驳回',v:changesData.filter(c=>c.status==='已驳回').length,c:'var(--red)'}].map(s=>'<div class="stat-card"><div class="stat-num" style="color:'+s.c+'">'+s.v+'</div><div class="stat-label">'+s.l+'</div></div>').join('');
  const typeBadge = t => ({ECR:'badge-blue',ECO:'badge-purple',ECN:'badge-green'}[t]||'badge-gray');
  const statusBadge = s => ({草稿:'badge-gray',待审批:'badge-yellow',审批中:'badge-yellow',执行中:'badge-blue',已关闭:'badge-green',已驳回:'badge-red'}[s]||'badge-gray');
  const priBadge = p => p==='特急'?'<span class="badge badge-red">🔥 '+p+'</span>':p==='紧急'?'<span class="badge badge-yellow">⚡ '+p+'</span>':'<span class="badge badge-gray">'+p+'</span>';
  const sorted = modSortData('chg', data);
  const pg = modPaginate('chg', sorted);
  const tb = document.getElementById('chgBody');
  if (!tb) return;
  tb.innerHTML = pg.pageData.map((c,i) => {
    let ops = '<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();showChgDetail(\''+c.id+'\')">查看</button>';
    if (c.status==='草稿') ops += '<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();editChange(\''+c.id+'\')">编辑</button><button class="btn btn-ghost btn-xs" style="color:var(--red)" onclick="event.stopPropagation();deleteChange(\''+c.id+'\')">删除</button>';
    if ((c.status==='待审批') && c.reviewer===uname) ops += '<button class="btn btn-success btn-xs" onclick="event.stopPropagation();chgAction(\''+c.id+'\',\'approve\')">通过</button>';
    return '<tr style="cursor:pointer" onclick="showChgDetail(\''+c.id+'\')"><td>'+(pg.start+i+1)+'</td><td style="color:var(--accent);font-weight:500">'+c.id+'</td><td><span class="badge '+typeBadge(c.type)+'">'+c.type+'</span></td><td style="font-weight:500;max-width:200px;overflow:hidden;text-overflow:ellipsis">'+c.title+'</td><td>'+c.scope+'</td><td>'+c.initiator+'</td><td>'+c.reviewer+'</td><td>'+c.date+'</td><td>'+priBadge(c.priority)+'</td><td><span class="badge '+statusBadge(c.status)+'">'+c.status+'</span></td><td style="white-space:nowrap">'+ops+'</td></tr>';
  }).join('');
}


let aprCenterTab = 'mine';
function switchAprTab(tab) {
  aprCenterTab = tab;
  ['mine','initiated','all'].forEach(t => {
    const btn = document.getElementById('aprTab' + (t==='mine'?'Mine':t==='initiated'?'Initiated':'All'));
    if (btn) { btn.className = 'btn btn-sm ' + (t===tab?'btn-primary':'btn-secondary'); if(t===tab) btn.style.boxShadow='none'; }
  });
  renderApprovalCenter();
}
function renderApprovalCenter() {
  const q = (document.getElementById('aprCenterSearch')?.value||'').toLowerCase();
  let data = aprCenterData;
  if (aprCenterTab === 'mine') data = data.filter(a => a.target === 'mine');
  else if (aprCenterTab === 'initiated') data = data.filter(a => a.target === 'initiated');
  if (q) data = data.filter(a => a.id.toLowerCase().includes(q) || a.title.toLowerCase().includes(q));
  const mineCount = aprCenterData.filter(a=>a.target==='mine'&&a.status==='待审批').length;
  const initiatedCount = aprCenterData.filter(a=>a.target==='initiated').length;
  const doneCount = aprCenterData.filter(a=>a.status==='已通过').length;
  const sc = document.getElementById('aprCenterStats');
  if (sc) sc.innerHTML = [{l:'待我审批',v:mineCount,c:'var(--yellow)'},{l:'我发起的',v:initiatedCount,c:'var(--blue)'},{l:'已审批',v:doneCount,c:'var(--green)'},{l:'已超期',v:1,c:'var(--red)'}].map(s=>'<div class="stat-card"><div class="stat-num" style="color:'+s.c+'">'+s.v+'</div><div class="stat-label">'+s.l+'</div></div>').join('');
  const typeBadge = t => ({变更审批:'badge-purple',BOM审批:'badge-blue',物料审批:'badge-green',文档审批:'badge-yellow',质量审批:'badge-red'}[t]||'badge-gray');
  const statusBadge = s => ({待审批:'badge-yellow',审批中:'badge-yellow',已通过:'badge-green',已驳回:'badge-red'}[s]||'badge-gray');
  const urgIcon = u => u==='特急'?'🔥 ':'⚡ ';
  const list = document.getElementById('aprCenterList');
  if (list) list.innerHTML = data.length === 0 ? '<div style="text-align:center;padding:40px;color:var(--text-muted)">暂无审批记录</div>' : data.map((a,di) => {
    const tl=[{title:'提交申请',user:a.applicant,date:a.time,state:'done',note:''},{title:'审批处理',user:'当前用户',date:'',state:a.status==='待审批'?'active':a.status==='已通过'?'done':a.status==='已驳回'?'rejected':'pending',note:a.status==='已通过'?'审批通过':a.status==='已驳回'?'已驳回':''},{title:'完成',user:'系统',date:'',state:a.status==='已通过'?'done':'pending',note:''}];
    const tlHtml='<div class="timeline" style="margin-top:8px">'+tl.map(t=>'<div class="timeline-item"><div class="timeline-dot '+t.state+'">'+(t.state==='done'?'✓':t.state==='active'?'◉':t.state==='rejected'?'✕':'○')+'</div><div class="timeline-content"><div class="tl-title">'+t.title+' <span style="color:var(--text-muted);font-weight:400"> · '+t.user+'</span></div><div class="tl-meta">'+(t.date||'待处理')+(t.note?' · '+t.note:'')+'</div></div></div>').join('')+'</div>';
    return '<div class="approval-row"><div class="approval-header" style="gap:12px;cursor:pointer" onclick="document.getElementById(\'aprCBody'+di+'\').classList.toggle(\'open\');this.querySelector(\'.expand-icon\').classList.toggle(\'open\')"><span class="expand-icon" style="font-size:10px;color:var(--text-muted);transition:transform .2s">▶</span><div style="flex:1"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="font-weight:600;font-size:13px">'+(a.urgency!=='普通'?urgIcon(a.urgency):'')+a.title+'</span><span class="badge '+typeBadge(a.type)+'">'+a.type+'</span><span class="badge '+statusBadge(a.status)+'">'+a.status+'</span></div><div style="font-size:11px;color:var(--text-muted)">'+a.id+' · '+a.applicant+' · '+a.time+'</div></div>'+(a.status==='待审批'&&a.target==='mine'?'<button class="btn btn-success btn-xs" onclick="event.stopPropagation();doAprCenterAction(\''+a.id+'\',\'approve\')">✓ 通过</button><button class="btn btn-danger btn-xs" onclick="event.stopPropagation();doAprCenterAction(\''+a.id+'\',\'reject\')">✕ 驳回</button>':'')+'</div><div class="approval-body" id="aprCBody'+di+'"><div style="padding:14px 0 0 26px">'+tlHtml+'</div></div></div>'}).join('');
}

// documentsData is now imported from state.js
function renderDocuments() {
  const q = (document.getElementById('docSearch')?.value||'').toLowerCase();
  const tf = document.getElementById('docTypeFilter')?.value||'all';
  const sf = document.getElementById('docStatusFilter')?.value||'all';
  const data = documentsData.filter(d => {
    if (q && !d.id.toLowerCase().includes(q) && !d.name.toLowerCase().includes(q)) return false;
    if (tf !== 'all' && d.type !== tf) return false;
    if (sf !== 'all' && d.status !== sf) return false;
    return true;
  });
  const sc = document.getElementById('docStatCards');
  if (sc) sc.innerHTML = [{l:'总文档数',v:documentsData.length,c:'var(--accent)'},{l:'本周新增',v:3,c:'var(--blue)'},{l:'待审核',v:documentsData.filter(d=>d.status==='审核中').length,c:'var(--yellow)'},{l:'已归档',v:documentsData.filter(d=>d.status==='已归档').length,c:'var(--green)'}].map(s=>'<div class="stat-card"><div class="stat-num" style="color:'+s.c+'">'+s.v+'</div><div class="stat-label">'+s.l+'</div></div>').join('');
  const typeIcon = t => ({'设计图纸':'📐','测试报告':'📋','规格书':'📄','工艺文件':'🔧','会议纪要':'📝'}[t]||'📄');
  const statusBadge = s => ({草稿:'badge-gray',审核中:'badge-yellow',已发布:'badge-green',已归档:'badge-blue'}[s]||'badge-gray');
  const sortedD = modSortData('doc', data);
  const pgD = modPaginate('doc', sortedD);
  const tb = document.getElementById('docBody');
  if (tb) tb.innerHTML = pgD.pageData.map((d,i) => { let ops='<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();showDocDetail(\''+d.id+'\')">查看</button>';if(d.status==='草稿')ops+='<button class="btn btn-ghost btn-xs" style="color:var(--red)" onclick="event.stopPropagation();deleteDoc(\''+d.id+'\')">删除</button>';if(d.status==='已发布')ops+='<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();docAction(\''+d.id+'\',\'upgrade\')">升版</button>';return '<tr style="cursor:pointer" onclick="showDocDetail(\''+d.id+'\')"><td>'+(pgD.start+i+1)+'</td><td style="color:var(--accent);font-weight:500">'+d.id+'</td><td style="font-weight:500">'+typeIcon(d.type)+' '+d.name+'</td><td>'+d.type+'</td><td><span class="badge badge-purple">'+d.ver+'</span></td><td>'+d.project+'</td><td>'+d.uploader+'</td><td>'+d.date+'</td><td><span class="badge '+statusBadge(d.status)+'">'+d.status+'</span></td><td style="white-space:nowrap">'+ops+'</td></tr>'}).join('');
}

// suppliersData — imported from ./modules/state.js
function renderSuppliers() {
  const q = (document.getElementById('supSearch')?.value||'').toLowerCase();
  const tf = document.getElementById('supTypeFilter')?.value||'all';
  const sf = document.getElementById('supStatusFilter')?.value||'all';
  const data = suppliersData.filter(s => {
    if (q && !s.id.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q)) return false;
    if (tf !== 'all' && s.type !== tf) return false;
    if (sf !== 'all' && s.status !== sf) return false;
    return true;
  });
  const sc = document.getElementById('supStatCards');
  if (sc) sc.innerHTML = [{l:'供应商总数',v:suppliersData.length,c:'var(--accent)'},{l:'合格供应商',v:suppliersData.filter(s=>s.status==='合格').length,c:'var(--green)'},{l:'待评审',v:suppliersData.filter(s=>s.status==='待评审').length,c:'var(--yellow)'},{l:'暂停/黑名单',v:suppliersData.filter(s=>s.status==='暂停'||s.status==='黑名单').length,c:'var(--red)'}].map(s=>'<div class="stat-card"><div class="stat-num" style="color:'+s.c+'">'+s.v+'</div><div class="stat-label">'+s.l+'</div></div>').join('');
  const gradeBadge = g => ({A:'badge-green',B:'badge-blue',C:'badge-yellow',D:'badge-red'}[g]||'badge-gray');
  const statusBadge = s => ({合格:'badge-green',待评审:'badge-yellow',暂停:'badge-red',黑名单:'badge-red'}[s]||'badge-gray');
  const scoreColor = s => s>=90?'var(--green)':s>=80?'var(--blue)':s>=70?'var(--yellow)':'var(--red)';
  const sortedS = modSortData('sup', data);
  const pgS = modPaginate('sup', sortedS);
  const tb = document.getElementById('supBody');
  if (tb) tb.innerHTML = pgS.pageData.map((s,i) => { let ops='<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();showSupDetail(\''+s.id+'\')">查看</button><button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();editSupplier(\''+s.id+'\')">编辑</button>';if(s.status==='待评审')ops+='<button class="btn btn-success btn-xs" onclick="event.stopPropagation();supAction(\''+s.id+'\',\'approve\')">通过</button>';return '<tr style="cursor:pointer" onclick="showSupDetail(\''+s.id+'\')"><td>'+(pgS.start+i+1)+'</td><td style="color:var(--accent);font-weight:500">'+s.id+'</td><td style="font-weight:500">'+s.name+'</td><td>'+s.type+'</td><td><span class="badge '+gradeBadge(s.grade)+'">'+s.grade+'级</span></td><td>'+s.contact+'</td><td style="text-align:center">'+s.matCount+'</td><td><span class="badge '+statusBadge(s.status)+'">'+s.status+'</span></td><td><div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:6px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden;min-width:60px"><div style="height:100%;width:'+s.score+'%;background:'+scoreColor(s.score)+';border-radius:4px"></div></div><span style="font-size:11px;font-weight:600;color:'+scoreColor(s.score)+'">'+s.score+'</span></div></td><td style="white-space:nowrap">'+ops+'</td></tr>'}).join('');
}

// qualityData — imported from ./modules/state.js
function renderQuality() {
  const q = (document.getElementById('qaSearch')?.value||'').toLowerCase();
  const tf = document.getElementById('qaTypeFilter')?.value||'all';
  const svf = document.getElementById('qaSeverityFilter')?.value||'all';
  const sf = document.getElementById('qaStatusFilter')?.value||'all';
  const data = qualityData.filter(r => {
    if (q && !r.id.toLowerCase().includes(q) && !r.title.toLowerCase().includes(q)) return false;
    if (tf !== 'all' && r.type !== tf) return false;
    if (svf !== 'all' && r.severity !== svf) return false;
    if (sf !== 'all' && r.status !== sf) return false;
    return true;
  });
  const sc = document.getElementById('qaStatCards');
  if (sc) sc.innerHTML = [{l:'质量问题总数',v:qualityData.length,c:'var(--accent)'},{l:'待处理',v:qualityData.filter(r=>r.status==='待处理').length,c:'var(--red)'},{l:'处理中',v:qualityData.filter(r=>['分析中','整改中','待验证'].includes(r.status)).length,c:'var(--yellow)'},{l:'已关闭',v:qualityData.filter(r=>r.status==='已关闭').length,c:'var(--green)'}].map(s=>'<div class="stat-card"><div class="stat-num" style="color:'+s.c+'">'+s.v+'</div><div class="stat-label">'+s.l+'</div></div>').join('');
  const sevBadge = s => ({致命:'badge-red',严重:'badge-yellow',一般:'badge-blue',轻微:'badge-gray'}[s]||'badge-gray');
  const statusBadge = s => ({待处理:'badge-red',分析中:'badge-yellow',整改中:'badge-yellow',待验证:'badge-blue',已关闭:'badge-green'}[s]||'badge-gray');
  const tb = document.getElementById('qaBody');
  const nextSt={待处理:'分析中',分析中:'整改中',整改中:'待验证',待验证:'已关闭'};
  const sortedQ = modSortData('qa', data);
  const pgQ = modPaginate('qa', sortedQ);
  if (tb) tb.innerHTML = pgQ.pageData.map((r,i) => { let ops='<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();showQaDetail(\''+r.id+'\')">查看</button>';const ns=nextSt[r.status];if(ns)ops+='<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();qaAction(\''+r.id+'\',\'advance\')">→'+ns+'</button>';if(r.status!=='已关闭')ops+='<button class="btn btn-ghost btn-xs" style="color:var(--red)" onclick="event.stopPropagation();deleteQa(\''+r.id+'\')">删除</button>';return '<tr style="cursor:pointer" onclick="showQaDetail(\''+r.id+'\')"><td>'+(pgQ.start+i+1)+'</td><td style="color:var(--accent);font-weight:500">'+r.id+'</td><td style="font-weight:500">'+r.title+'</td><td>'+r.type+'</td><td><span class="badge '+sevBadge(r.severity)+'">'+r.severity+'</span></td><td style="color:var(--accent)">'+r.material+'</td><td>'+r.owner+'</td><td>'+r.date+'</td><td><span class="badge '+statusBadge(r.status)+'">'+r.status+'</span></td><td style="white-space:nowrap">'+ops+'</td></tr>'}).join('');
}

// ===== NEW MODULE INTERACTIONS =====
// modSortState, modPageState — imported from ./modules/state.js
function modSort(mod,field){var s=modSortState[mod];if(s.field===field)s.asc=!s.asc;else{s.field=field;s.asc=true}modPageState[mod].page=1;var fn={proj:renderProjects,chg:renderChanges,doc:renderDocuments,sup:renderSuppliers,qa:renderQuality}[mod];if(fn)fn()}
function modPage(mod,delta){var p=modPageState[mod];p.page+=delta;var fn={proj:renderProjects,chg:renderChanges,doc:renderDocuments,sup:renderSuppliers,qa:renderQuality}[mod];if(fn)fn()}
function modSortData(mod,data){var s=modSortState[mod];if(!s.field)return data;return data.slice().sort(function(a,b){var va=a[s.field],vb=b[s.field];if(typeof va==='number')return s.asc?va-vb:vb-va;va=String(va||'');vb=String(vb||'');return s.asc?va.localeCompare(vb):vb.localeCompare(va)})}
function modPaginate(mod,data){var p=modPageState[mod];var total=Math.max(1,Math.ceil(data.length/p.size));if(p.page>total)p.page=total;if(p.page<1)p.page=1;var start=(p.page-1)*p.size;var pageData=data.slice(start,start+p.size);var sumEl=document.getElementById(mod+'Summary');if(sumEl)sumEl.textContent='共 '+data.length+' 条'+(data.length>p.size?' (第'+(start+1)+'-'+Math.min(start+p.size,data.length)+'条)':'');var infoEl=document.getElementById(mod+'PageInfo');if(infoEl)infoEl.textContent='第 '+p.page+' / '+total+' 页';var prevEl=document.getElementById(mod+'Prev');if(prevEl)prevEl.disabled=p.page<=1;var nextEl=document.getElementById(mod+'Next');if(nextEl)nextEl.disabled=p.page>=total;return{pageData:pageData,start:start}}
function handleDocFileSelect(e){var f=e.target.files[0];if(!f)return;var el=document.getElementById('docFileName');if(el){el.textContent='📎 '+f.name+' ('+Math.round(f.size/1024)+'KB)';el.style.display='block'}showToast('文件 '+f.name+' 已选择','success')}
document.addEventListener('DOMContentLoaded',function(){var area=document.getElementById('docUploadArea');if(area)area.addEventListener('click',function(){document.getElementById('docFileInput').click()})});
// todayISO, genId, detailGrid — imported from ./modules/ui-helpers.js

function showNewProjectModal(){document.getElementById('projFormId').value=genId('PRJ',projectsData);document.getElementById('projFormStart').value=todayISO();document.getElementById('projFormEnd').value='';document.getElementById('projFormProgress').value='0';document.getElementById('projFormName').value='';document.getElementById('projModalTitle').textContent='新建项目';showModal('projModal')}
function editProject(id){const p=projectsData.find(x=>x.id===id);if(!p)return;document.getElementById('projFormId').value=p.id;document.getElementById('projFormName').value=p.name;document.getElementById('projFormPhase').value=p.phase;document.getElementById('projFormOwner').value=p.owner;document.getElementById('projFormStart').value=p.start;document.getElementById('projFormEnd').value=p.end==='待定'?'':p.end;document.getElementById('projFormStatus').value=p.status;document.getElementById('projFormProgress').value=p.progress;document.getElementById('projModalTitle').textContent='编辑项目';showModal('projModal')}
function saveProject(){const n=document.getElementById('projFormName').value.trim();if(!n){showToast('请填写项目名称','error');return}const id=document.getElementById('projFormId').value;const existing=projectsData.find(x=>x.id===id);const obj={id:id,name:n,phase:document.getElementById('projFormPhase').value,owner:document.getElementById('projFormOwner').value,start:document.getElementById('projFormStart').value,end:document.getElementById('projFormEnd').value||'待定',status:document.getElementById('projFormStatus').value,progress:parseInt(document.getElementById('projFormProgress').value)||0};if(existing){Object.assign(existing,obj);showToast('项目已更新','success')}else{projectsData.unshift(obj);showToast('项目 '+n+' 创建成功','success')}hideModal('projModal');renderProjects()}
function deleteProject(id){const p=projectsData.find(x=>x.id===id);if(!p)return;showConfirm('确定删除项目 "'+p.name+'" 吗？',function(){const i=projectsData.indexOf(p);if(i>-1)projectsData.splice(i,1);renderProjects();showToast('项目已删除','info')})}
function projAction(id,action){const p=projectsData.find(x=>x.id===id);if(!p)return;if(action==='complete'){p.status='已完成';p.progress=100}else if(action==='pause'){p.status='暂停'}else if(action==='resume'){p.status='进行中'}hideModal('genericDetailModal');renderProjects();showToast('项目状态已更新','success')}
function showProjDetail(id){const p=projectsData.find(x=>x.id===id);if(!p)return;if(typeof trackRecentAccess==='function')trackRecentAccess('projects',id,p.name,'📁');const sb=s=>({进行中:'badge-blue',已完成:'badge-green',暂停:'badge-gray',延期:'badge-red'}[s]||'badge-gray');const pc=v=>v>=80?'var(--green)':v>=50?'var(--blue)':v>=30?'var(--yellow)':'var(--red)';const relBoms=allBOMs?allBOMs.filter(b=>b.name.includes(p.name.split(' ')[0])||p.name.includes(b.name.split(' ')[0])):[];const bomList=relBoms.length?relBoms.map(b=>'<span class="badge badge-blue" style="margin:2px;cursor:pointer" onclick="event.stopPropagation();navigateTo(\'bom\')">📦 '+b.name+'</span>').join(' '):'—';const milestones=[{n:'P0',d:'概念评审'},{n:'P1',d:'计划评审'},{n:'P2',d:'需求冻结'},{n:'EVT',d:'工程验证'},{n:'DVT',d:'设计验证'},{n:'PVT',d:'生产验证'},{n:'MP',d:'量产'}];const phaseIdx=milestones.findIndex(m=>m.n===p.phase);const msHtml='<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px">'+milestones.map((m,i)=>'<span class="badge '+(i<phaseIdx?'badge-green':i===phaseIdx?'badge-blue':'badge-gray')+'" style="font-size:10px">'+m.n+'</span>').join('')+'</div>';document.getElementById('genericDetailTitle').textContent='📁 '+p.name;document.getElementById('genericDetailBody').innerHTML='<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📋 基本信息</h3>'+detailGrid([['项目编号','<span style="color:var(--accent);font-weight:600">'+p.id+'</span>'],['项目名称',p.name],['当前阶段','<span class="badge badge-purple">'+p.phase+'</span>'],['负责人',p.owner],['开始日期',p.start],['计划完成',p.end],['状态','<span class="badge '+sb(p.status)+'">'+p.status+'</span>'],['进度','<span style="font-weight:700;color:'+pc(p.progress)+'">'+p.progress+'%</span>']])+'<div style="margin-top:12px"><div style="height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden"><div style="height:100%;width:'+p.progress+'%;background:'+pc(p.progress)+';border-radius:4px"></div></div></div></div>'+'<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">🏁 里程碑进度</h3>'+msHtml+'</div>'+'<div class="detail-card" style="margin-bottom:0"><h3 style="font-size:14px">📦 关联BOM</h3><div style="padding:4px 0">'+bomList+'</div></div>';let acts='<button class="btn btn-secondary btn-sm" onclick="hideModal(\'genericDetailModal\');editProject(\''+p.id+'\')">✏️ 编辑</button>';if(p.status==='进行中')acts+='<button class="btn btn-success btn-sm" onclick="projAction(\''+p.id+'\',\'complete\')">✓ 标记完成</button><button class="btn btn-ghost btn-sm" onclick="projAction(\''+p.id+'\',\'pause\')">⏸ 暂停</button>';else if(p.status==='暂停')acts+='<button class="btn btn-primary btn-sm" onclick="projAction(\''+p.id+'\',\'resume\')">▶ 恢复</button>';document.getElementById('genericDetailActions').innerHTML=acts;showModal('genericDetailModal')}

function showChgModal(editId) {
  document.getElementById('chgEditId').value = editId||'';
  document.getElementById('chgModalTitle').textContent = editId ? '编辑变更' : '发起变更';
  document.getElementById('chgFormSubmitBtn').textContent = editId ? '保存' : '提交';
  if (editId) {
    const c = changesData.find(x=>x.id===editId);
    if (!c) return;
    document.getElementById('chgFormType').value = c.type;
    document.getElementById('chgFormPriority').value = c.priority;
    document.getElementById('chgFormTitle').value = c.title;
    document.getElementById('chgFormScope').value = c.scope;
    document.getElementById('chgFormInit').value = c.initiator;
    document.getElementById('chgFormMaterials').value = c.materials||'';
    document.getElementById('chgFormReviewer').value = c.reviewer||'王主管';
    document.getElementById('chgFormReason').value = c.reason||'';
  } else {
    document.getElementById('chgFormTitle').value='';document.getElementById('chgFormScope').value='';document.getElementById('chgFormMaterials').value='';document.getElementById('chgFormReason').value='';document.getElementById('chgFormPriority').value='普通';document.getElementById('chgFormType').value='ECR';
    if (state.currentUser) { var initSel=document.getElementById('chgFormInit'); for(var o of initSel.options){if(o.value===state.currentUser.name){initSel.value=state.currentUser.name;break}} }
  }
  showModal('chgModal');
}
function saveChange(){
  const t=document.getElementById('chgFormTitle').value.trim();
  if(!t){showToast('请填写变更标题','error');return}
  const editId=document.getElementById('chgEditId').value;
  const type=document.getElementById('chgFormType').value;
  const priority=document.getElementById('chgFormPriority').value;
  const scope=document.getElementById('chgFormScope').value||'—';
  const initiator=document.getElementById('chgFormInit').value;
  const materials=document.getElementById('chgFormMaterials').value.trim();
  const reviewer=document.getElementById('chgFormReviewer').value;
  const reason=document.getElementById('chgFormReason').value.trim();
  if(editId){
    const c=changesData.find(x=>x.id===editId);
    if(c){c.type=type;c.title=t;c.scope=scope;c.priority=priority;c.materials=materials;c.reviewer=reviewer;c.reason=reason}
    hideModal('chgModal');renderChanges();showToast('变更单已更新','success');
  }else{
    const id=type+'-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*9000)+1000).padStart(4,'0');
    changesData.unshift({id:id,type:type,title:t,scope:scope,initiator:initiator,date:todayISO(),priority:priority,status:'草稿',reason:reason,materials:materials,reviewer:reviewer,
      timeline:[{title:'创建草稿',user:initiator,date:nowStr(),state:'done',note:''},{title:'主管审批',user:reviewer,date:'',state:'pending',note:''},{title:'品质审核',user:'赵品质',date:'',state:'pending',note:''},{title:'执行确认',user:initiator,date:'',state:'pending',note:''}]
    });
    hideModal('chgModal');renderChanges();showToast('变更单 '+t+' 已创建','success');
  }
}
function editChange(id){showChgModal(id)}
function deleteChange(id){
  const c=changesData.find(x=>x.id===id);
  if(!c)return;
  showConfirm('确定删除变更单 "'+c.id+' '+c.title+'" 吗？此操作不可恢复。',function(){
    const idx=changesData.indexOf(c);if(idx>-1)changesData.splice(idx,1);
    renderChanges();showToast('变更单已删除','info');
  });
}
function chgAction(id, action) {
  const c=changesData.find(x=>x.id===id);if(!c)return;
  const ns=nowStr();
  if(action==='submit'){
    c.status='待审批';
    const step=c.timeline.find(t=>t.state==='pending');
    if(step){step.state='active'}
    showToast('已提交审批','success');
  }else if(action==='approve'){
    const activeStep=c.timeline.find(t=>t.state==='active');
    if(activeStep){activeStep.state='done';activeStep.date=ns;activeStep.note='审批通过'}
    const nextPending=c.timeline.find(t=>t.state==='pending');
    if(nextPending){nextPending.state='active';c.status=nextPending.title.includes('执行')?'执行中':'审批中'}
    else{c.status='已关闭'}
    showToast('审批通过','success');
  }else if(action==='reject'){
    const activeStep=c.timeline.find(t=>t.state==='active');
    if(activeStep){activeStep.state='rejected';activeStep.date=ns;activeStep.note='审批驳回'}
    c.status='已驳回';
    showToast('已驳回','error');
  }else if(action==='execute'){
    c.timeline.forEach(t=>{if(t.state==='active'||t.state==='pending'){t.state='done';t.date=t.date||ns;t.note=t.note||'确认完成'}});
    c.status='已关闭';
    showToast('变更已关闭','success');
  }else if(action==='withdraw'){
    c.status='草稿';
    c.timeline.forEach((t,i)=>{if(i===0){t.state='done'}else{t.state='pending';t.date='';t.note=''}});
    showToast('已撤回','info');
  }else if(action==='resubmit'){
    c.status='待审批';
    c.timeline.forEach((t,i)=>{if(t.state==='rejected'){t.state='active';t.date='';t.note=''}});
    showToast('已重新提交','success');
  }
  hideModal('genericDetailModal');renderChanges();
}
function showChgDetail(id){
  const c=changesData.find(x=>x.id===id);if(!c)return;
  const uname=state.currentUser?state.currentUser.name:'张工';
  const sb=s=>({草稿:'badge-gray',待审批:'badge-yellow',审批中:'badge-yellow',执行中:'badge-blue',已关闭:'badge-green',已驳回:'badge-red'}[s]||'badge-gray');
  const tb=t=>({ECR:'badge-blue',ECO:'badge-purple',ECN:'badge-green'}[t]||'badge-gray');
  const priBadge=p=>p==='特急'?'<span class="badge badge-red">🔥 特急</span>':p==='紧急'?'<span class="badge badge-yellow">⚡ 紧急</span>':'<span class="badge badge-gray">普通</span>';
  let matBadges='—';
  if(c.materials){matBadges=c.materials.split(',').map(m=>m.trim()).filter(Boolean).map(m=>'<span class="badge badge-blue" style="margin:2px;cursor:pointer" onclick="event.stopPropagation();navigateTo(\'materials\');document.getElementById(\'matSearch\').value=\''+m+'\';state.matPage=1;renderMaterials()">'+m+'</span>').join(' ')}
  let timelineHtml='<div class="timeline" style="margin-top:0">';
  if(c.timeline){c.timeline.forEach(function(t){
    const icon=t.state==='done'?'✓':t.state==='active'?'◉':t.state==='rejected'?'✕':'○';
    timelineHtml+='<div class="timeline-item"><div class="timeline-dot '+t.state+'">'+icon+'</div><div class="timeline-content"><div class="tl-title">'+t.title+(t.user!=='—'?' <span style="color:var(--text-muted);font-weight:400"> · '+t.user+'</span>':'')+'</div><div class="tl-meta">'+(t.date||'待处理')+(t.note?' · '+t.note:'')+'</div></div></div>';
  });timelineHtml+='</div>'}
  document.getElementById('genericDetailTitle').textContent='🔄 '+c.id+' '+c.title;
  document.getElementById('genericDetailBody').innerHTML=
    '<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📋 基本信息</h3>'+detailGrid([['变更单号','<span style="color:var(--accent);font-weight:600">'+c.id+'</span>'],['类型','<span class="badge '+tb(c.type)+'">'+c.type+'</span>'],['标题',c.title],['影响范围',c.scope],['发起人',c.initiator],['审批人',c.reviewer],['发起日期',c.date],['优先级',priBadge(c.priority)],['状态','<span class="badge '+sb(c.status)+'">'+c.status+'</span>'],['影响物料',matBadges]])+'</div>'
    +'<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📝 变更说明</h3><div style="font-size:13px;color:var(--text-secondary);line-height:1.6;padding:4px 0">'+(c.reason||'暂无说明')+'</div></div>'
    +'<div class="detail-card" style="margin-bottom:0"><h3 style="font-size:14px">⏱ 审批流程</h3>'+timelineHtml+'</div>';
  let acts='';
  if(c.status==='草稿'){acts='<button class="btn btn-secondary btn-sm" onclick="hideModal(\'genericDetailModal\');editChange(\''+c.id+'\')">✏️ 编辑</button><button class="btn btn-primary btn-sm" onclick="chgAction(\''+c.id+'\',\'submit\')">提交审批</button><button class="btn btn-danger btn-sm" onclick="hideModal(\'genericDetailModal\');deleteChange(\''+c.id+'\')">删除</button>'}
  else if((c.status==='待审批'||c.status==='审批中')&&c.reviewer===uname){acts='<button class="btn btn-success btn-sm" onclick="chgAction(\''+c.id+'\',\'approve\')">✓ 审批通过</button><button class="btn btn-danger btn-sm" onclick="chgAction(\''+c.id+'\',\'reject\')">✕ 驳回</button>'}
  else if(c.status==='待审批'&&c.initiator===uname){acts='<button class="btn btn-secondary btn-sm" onclick="chgAction(\''+c.id+'\',\'withdraw\')">↩ 撤回</button>'}
  else if(c.status==='执行中'&&c.initiator===uname){acts='<button class="btn btn-primary btn-sm" onclick="chgAction(\''+c.id+'\',\'execute\')">✓ 确认完成</button>'}
  else if(c.status==='已驳回'&&c.initiator===uname){acts='<button class="btn btn-primary btn-sm" onclick="chgAction(\''+c.id+'\',\'resubmit\')">🔄 重新提交</button>'}
  document.getElementById('genericDetailActions').innerHTML=acts;
  showModal('genericDetailModal');
}

function saveDocument(){const n=document.getElementById('docFormName').value.trim();if(!n){showToast('请填写文档名称','error');return}documentsData.unshift({id:'DOC-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*9000)+1000).padStart(4,'0'),name:n,type:document.getElementById('docFormType').value,ver:document.getElementById('docFormVer').value||'V1.0',project:document.getElementById('docFormProject').value,uploader:state.currentUser?state.currentUser.name:'张工',date:todayISO(),status:'草稿'});hideModal('docModal');renderDocuments();showToast('文档 '+n+' 已上传','success')}
function deleteDoc(id){const d=documentsData.find(x=>x.id===id);if(!d)return;showConfirm('确定删除文档 "'+d.name+'" 吗？',function(){const i=documentsData.indexOf(d);if(i>-1)documentsData.splice(i,1);renderDocuments();showToast('文档已删除','info')})}
function docAction(id,action){const d=documentsData.find(x=>x.id===id);if(!d)return;if(action==='submit')d.status='审核中';else if(action==='publish')d.status='已发布';else if(action==='archive')d.status='已归档';else if(action==='upgrade'){const vp=d.ver.match(/V(\d+)\.(\d+)/);if(vp){d.ver='V'+vp[1]+'.'+(parseInt(vp[2])+1);d.date=todayISO();d.status='草稿'}}hideModal('genericDetailModal');renderDocuments();showToast(action==='upgrade'?'版本已升级为 '+d.ver:'状态已更新','success')}
function showDocDetail(id){const d=documentsData.find(x=>x.id===id);if(!d)return;const sb=s=>({草稿:'badge-gray',审核中:'badge-yellow',已发布:'badge-green',已归档:'badge-blue'}[s]||'badge-gray');const ti=t=>({'设计图纸':'📐','测试报告':'📋','规格书':'📄','工艺文件':'🔧','会议纪要':'📝'}[t]||'📄');const history=[{ver:d.ver,date:d.date,user:d.uploader,note:'当前版本'}];if(d.ver!=='V1.0'&&d.ver!=='V0.5'&&d.ver!=='V0.8')history.push({ver:'V1.0',date:'2025-04-01',user:d.uploader,note:'初始版本'});document.getElementById('genericDetailTitle').textContent=ti(d.type)+' '+d.name;document.getElementById('genericDetailBody').innerHTML='<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📋 基本信息</h3>'+detailGrid([['文档编号','<span style="color:var(--accent);font-weight:600">'+d.id+'</span>'],['文档名称',d.name],['类型',ti(d.type)+' '+d.type],['版本','<span class="badge badge-purple">'+d.ver+'</span>'],['关联项目',d.project],['上传人',d.uploader],['更新日期',d.date],['状态','<span class="badge '+sb(d.status)+'">'+d.status+'</span>']])+'</div><div class="detail-card" style="margin-bottom:0"><h3 style="font-size:14px">📜 版本历史</h3><div class="version-list" style="gap:8px">'+history.map(h=>'<div class="version-card" style="padding:12px 16px;cursor:default"><div class="version-num" style="font-size:13px;width:auto">'+h.ver+'</div><div class="version-info"><div class="desc" style="font-size:12px">'+h.note+'</div><div class="meta"><span>'+h.user+'</span><span>'+h.date+'</span></div></div></div>').join('')+'</div></div>';let acts='';if(d.status==='草稿')acts='<button class="btn btn-primary btn-sm" onclick="docAction(\''+d.id+'\',\'submit\')">提交审核</button><button class="btn btn-danger btn-sm" onclick="hideModal(\'genericDetailModal\');deleteDoc(\''+d.id+'\')">删除</button>';else if(d.status==='审核中')acts='<button class="btn btn-success btn-sm" onclick="docAction(\''+d.id+'\',\'publish\')">✓ 发布</button>';else if(d.status==='已发布')acts='<button class="btn btn-secondary btn-sm" onclick="docAction(\''+d.id+'\',\'archive\')">📥 归档</button><button class="btn btn-primary btn-sm" onclick="docAction(\''+d.id+'\',\'upgrade\')">⬆ 升版</button>';document.getElementById('genericDetailActions').innerHTML=acts;showModal('genericDetailModal')}

function saveSupplier(){const n=document.getElementById('supFormName').value.trim();if(!n){showToast('请填写供应商名称','error');return}suppliersData.unshift({id:'SUP-'+String(suppliersData.length+1).padStart(3,'0'),name:n,type:document.getElementById('supFormType').value,grade:document.getElementById('supFormGrade').value,contact:document.getElementById('supFormContact').value||'—',matCount:0,status:'待评审',score:70});hideModal('supModal');renderSuppliers();showToast('供应商 '+n+' 已添加','success')}
function editSupplier(id){const s=suppliersData.find(x=>x.id===id);if(!s)return;document.getElementById('supFormName').value=s.name;document.getElementById('supFormType').value=s.type;document.getElementById('supFormContact').value=s.contact;document.getElementById('supFormGrade').value=s.grade;document.getElementById('supModalTitle').textContent='编辑供应商';showModal('supModal')}
function supAction(id,action){const s=suppliersData.find(x=>x.id===id);if(!s)return;if(action==='approve'){s.status='合格';s.score=Math.min(s.score+5,100)}else if(action==='suspend'){s.status='暂停'}else if(action==='blacklist'){s.status='黑名单';s.score=Math.max(s.score-20,0)}else if(action==='restore'){s.status='合格'}else if(action==='upgrade'){const g={D:'C',C:'B',B:'A'};if(g[s.grade])s.grade=g[s.grade]}else if(action==='downgrade'){const g={A:'B',B:'C',C:'D'};if(g[s.grade])s.grade=g[s.grade]}hideModal('genericDetailModal');renderSuppliers();showToast('供应商状态已更新','success')}
function showSupReviewModal(){const sel=document.getElementById('supReviewTarget');sel.innerHTML=suppliersData.map(s=>'<option value="'+s.id+'">'+s.name+' ('+s.id+')</option>').join('');document.getElementById('supReviewDate').value=todayISO();document.getElementById('supReviewNote').value='';showModal('supReviewModal')}
function saveSupReview(){const id=document.getElementById('supReviewTarget').value;const s=suppliersData.find(x=>x.id===id);if(s){s.status='待评审';renderSuppliers()}hideModal('supReviewModal');showToast('已对 '+(s?s.name:id)+' 发起评审','success')}
function showSupDetail(id){const s=suppliersData.find(x=>x.id===id);if(!s)return;const gb=g=>({A:'badge-green',B:'badge-blue',C:'badge-yellow',D:'badge-red'}[g]||'badge-gray');const stb=st=>({合格:'badge-green',待评审:'badge-yellow',暂停:'badge-red',黑名单:'badge-red'}[st]||'badge-gray');const sc=v=>v>=90?'var(--green)':v>=80?'var(--blue)':v>=70?'var(--yellow)':'var(--red)';const matList=state.materialsFlat?state.materialsFlat.filter(m=>m.supplier===s.name).slice(0,8):[];const matHtml=matList.length?matList.map(m=>'<span class="badge badge-blue" style="margin:2px;cursor:pointer" onclick="event.stopPropagation();navigateTo(\'materials\');document.getElementById(\'matSearch\').value=\''+m.id+'\';state.matPage=1;renderMaterials()">'+m.icon+' '+m.id+'</span>').join(' '):'<span style="color:var(--text-muted)">暂无关联物料</span>';const dims=[{n:'质量',v:s.score},{n:'交期',v:Math.min(s.score+5,100)},{n:'价格',v:Math.max(s.score-8,50)},{n:'服务',v:Math.min(s.score+3,100)}];const radarHtml=dims.map(d=>'<div style="display:flex;align-items:center;gap:8px;padding:4px 0"><span style="width:36px;font-size:11px;color:var(--text-muted)">'+d.n+'</span><div style="flex:1;height:6px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden"><div style="height:100%;width:'+d.v+'%;background:'+sc(d.v)+';border-radius:4px"></div></div><span style="font-size:11px;font-weight:600;color:'+sc(d.v)+';width:28px;text-align:right">'+d.v+'</span></div>').join('');document.getElementById('genericDetailTitle').textContent='🏭 '+s.name;document.getElementById('genericDetailBody').innerHTML='<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📋 基本信息</h3>'+detailGrid([['供应商编号','<span style="color:var(--accent);font-weight:600">'+s.id+'</span>'],['供应商名称',s.name],['类型',s.type],['等级','<span class="badge '+gb(s.grade)+'">'+s.grade+'级</span>'],['联系人',s.contact],['供货物料数',s.matCount+'种'],['合作状态','<span class="badge '+stb(s.status)+'">'+s.status+'</span>'],['综合评分','<span style="font-weight:700;color:'+sc(s.score)+'">'+s.score+'/100</span>']])+'</div><div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📊 评估维度</h3>'+radarHtml+'</div><div class="detail-card" style="margin-bottom:0"><h3 style="font-size:14px">📦 供货物料</h3><div style="padding:4px 0">'+matHtml+'</div></div>';let acts='<button class="btn btn-secondary btn-sm" onclick="hideModal(\'genericDetailModal\');editSupplier(\''+s.id+'\')">✏️ 编辑</button>';if(s.status==='待评审')acts+='<button class="btn btn-success btn-sm" onclick="supAction(\''+s.id+'\',\'approve\')">✓ 评审通过</button>';if(s.status==='合格')acts+='<button class="btn btn-ghost btn-sm" onclick="supAction(\''+s.id+'\',\'suspend\')">⏸ 暂停合作</button><button class="btn btn-ghost btn-sm" onclick="supAction(\''+s.id+'\',\'upgrade\')">⬆ 升级</button><button class="btn btn-ghost btn-sm" onclick="supAction(\''+s.id+'\',\'downgrade\')">⬇ 降级</button>';if(s.status==='暂停')acts+='<button class="btn btn-primary btn-sm" onclick="supAction(\''+s.id+'\',\'restore\')">▶ 恢复合作</button><button class="btn btn-danger btn-sm" onclick="supAction(\''+s.id+'\',\'blacklist\')">🚫 加入黑名单</button>';document.getElementById('genericDetailActions').innerHTML=acts;showModal('genericDetailModal')}

function saveQuality(){const t=document.getElementById('qaFormTitle').value.trim();if(!t){showToast('请填写问题标题','error');return}qualityData.unshift({id:'QA-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*9000)+1000).padStart(4,'0'),title:t,type:document.getElementById('qaFormType').value,severity:document.getElementById('qaFormSeverity').value,material:document.getElementById('qaFormMaterial').value||'—',owner:document.getElementById('qaFormOwner').value,date:todayISO(),status:'待处理',rootCause:'',corrective:'',timeline:[{title:'问题登记',user:document.getElementById('qaFormOwner').value,date:nowStr(),state:'done',note:''},{title:'原因分析',user:document.getElementById('qaFormOwner').value,date:'',state:'pending',note:''},{title:'整改实施',user:document.getElementById('qaFormOwner').value,date:'',state:'pending',note:''},{title:'效果验证',user:'赵品质',date:'',state:'pending',note:''},{title:'关闭归档',user:'赵品质',date:'',state:'pending',note:''}]});hideModal('qaModal');renderQuality();showToast('质量问题 '+t+' 已创建','success')}
function deleteQa(id){const r=qualityData.find(x=>x.id===id);if(!r)return;showConfirm('确定删除质量问题 "'+r.title+'" 吗？',function(){const i=qualityData.indexOf(r);if(i>-1)qualityData.splice(i,1);renderQuality();showToast('已删除','info')})}
function qaAction(id,action){const r=qualityData.find(x=>x.id===id);if(!r)return;const ns=nowStr();const flow={'待处理':'分析中','分析中':'整改中','整改中':'待验证','待验证':'已关闭'};if(action==='advance'){const newSt=flow[r.status];if(newSt){r.status=newSt;if(r.timeline){const active=r.timeline.find(t=>t.state==='active');if(active){active.state='done';active.date=ns;active.note='已完成'}const next=r.timeline.find(t=>t.state==='pending');if(next)next.state='active'}showToast('状态更新为: '+newSt,'success')}}else if(action==='reopen'){r.status='分析中';if(r.timeline)r.timeline.forEach((t,i)=>{if(i<=1){t.state='done'}else if(i===2){t.state='active';t.date='';t.note=''}else{t.state='pending';t.date='';t.note=''}});showToast('已重新打开','info')}hideModal('genericDetailModal');renderQuality()}
function showQaDetail(id){const r=qualityData.find(x=>x.id===id);if(!r)return;const svb=s=>({致命:'badge-red',严重:'badge-yellow',一般:'badge-blue',轻微:'badge-gray'}[s]||'badge-gray');const stb=s=>({待处理:'badge-red',分析中:'badge-yellow',整改中:'badge-yellow',待验证:'badge-blue',已关闭:'badge-green'}[s]||'badge-gray');const nextStatus={待处理:'分析中',分析中:'整改中',整改中:'待验证',待验证:'已关闭'};let timelineHtml='';if(r.timeline){timelineHtml='<div class="timeline" style="margin-top:0">';r.timeline.forEach(function(t){const icon=t.state==='done'?'✓':t.state==='active'?'◉':'○';timelineHtml+='<div class="timeline-item"><div class="timeline-dot '+t.state+'">'+icon+'</div><div class="timeline-content"><div class="tl-title">'+t.title+' <span style="color:var(--text-muted);font-weight:400"> · '+t.user+'</span></div><div class="tl-meta">'+(t.date||'待处理')+(t.note?' · '+t.note:'')+'</div></div></div>'});timelineHtml+='</div>'}else{timelineHtml='<div style="color:var(--text-muted);font-size:12px">历史记录数据将在新建的问题中记录</div>'}document.getElementById('genericDetailTitle').textContent='🔬 '+r.id+' '+r.title;document.getElementById('genericDetailBody').innerHTML='<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📋 基本信息</h3>'+detailGrid([['问题编号','<span style="color:var(--accent);font-weight:600">'+r.id+'</span>'],['问题标题',r.title],['类型',r.type],['严重程度','<span class="badge '+svb(r.severity)+'">'+r.severity+'</span>'],['关联物料','<span class="badge badge-blue" style="cursor:pointer" onclick="event.stopPropagation();navigateTo(\'materials\');document.getElementById(\'matSearch\').value=\''+r.material+'\';state.matPage=1;renderMaterials()">'+r.material+'</span>'],['责任人',r.owner],['发现日期',r.date],['状态','<span class="badge '+stb(r.status)+'">'+r.status+'</span>']])+'</div>'+'<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">⏱ 处理流程</h3>'+timelineHtml+'</div>'+'<div class="detail-card" style="margin-bottom:0"><h3 style="font-size:14px">📊 8D 分析</h3><div style="font-size:12px;color:var(--text-secondary);line-height:1.6">'+(r.rootCause?'<b>根本原因：</b>'+r.rootCause+'<br>':'<span style="color:var(--text-muted)">待分析根本原因</span><br>')+(r.corrective?'<b>整改措施：</b>'+r.corrective:'<span style="color:var(--text-muted)">待制定整改措施</span>')+'</div></div>';let acts='';const ns=nextStatus[r.status];if(ns)acts+='<button class="btn btn-primary btn-sm" onclick="qaAction(\''+r.id+'\',\'advance\')">推进至 '+ns+'</button>';if(r.status==='已关闭')acts+='<button class="btn btn-secondary btn-sm" onclick="qaAction(\''+r.id+'\',\'reopen\')">🔄 重新打开</button>';if(r.status!=='已关闭')acts+='<button class="btn btn-danger btn-sm" onclick="hideModal(\'genericDetailModal\');deleteQa(\''+r.id+'\')">删除</button>';document.getElementById('genericDetailActions').innerHTML=acts;showModal('genericDetailModal')}

function doAprCenterAction(id,action){const a=aprCenterData.find(x=>x.id===id);if(!a)return;if(action==='approve'){a.status='已通过';showToast('已通过: '+a.title,'success')}else{a.status='已驳回';showToast('已驳回: '+a.title,'error')}renderApprovalCenter()}

function exportModuleCSV(mod){let headers=[],rows=[];if(mod==='projects'){headers=['项目编号','项目名称','阶段','负责人','开始日期','计划完成','状态','进度'];rows=projectsData.map(p=>[p.id,p.name,p.phase,p.owner,p.start,p.end,p.status,p.progress+'%'])}else if(mod==='changes'){headers=['变更单号','类型','标题','影响范围','发起人','发起日期','优先级','状态'];rows=changesData.map(c=>[c.id,c.type,c.title,c.scope,c.initiator,c.date,c.priority,c.status])}else if(mod==='documents'){headers=['文档编号','文档名称','类型','版本','关联项目','上传人','更新日期','状态'];rows=documentsData.map(d=>[d.id,d.name,d.type,d.ver,d.project,d.uploader,d.date,d.status])}else if(mod==='suppliers'){headers=['供应商编号','供应商名称','类型','等级','联系人','供货物料数','合作状态','评分'];rows=suppliersData.map(s=>[s.id,s.name,s.type,s.grade,s.contact,s.matCount,s.status,s.score])}else if(mod==='quality'){headers=['问题编号','问题标题','类型','严重程度','关联物料','责任人','发现日期','状态'];rows=qualityData.map(r=>[r.id,r.title,r.type,r.severity,r.material,r.owner,r.date,r.status])}const bom='\uFEFF';const csv=bom+[headers.join(','),...rows.map(r=>r.map(c=>'"'+(c+'').replace(/"/g,'""')+'"').join(','))].join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a2=document.createElement('a');a2.href=url;a2.download=mod+'_export_'+todayISO()+'.csv';document.body.appendChild(a2);a2.click();document.body.removeChild(a2);URL.revokeObjectURL(url);showToast('已导出 '+rows.length+' 条记录','success')}


export { renderProjects, switchChgTab, renderChanges, switchAprTab, renderApprovalCenter, renderDocuments, renderSuppliers, renderQuality, modSort, modPage, modSortData, modPaginate, handleDocFileSelect, showNewProjectModal, editProject, saveProject, deleteProject, projAction, showProjDetail, showChgModal, saveChange, editChange, deleteChange, chgAction, showChgDetail, saveDocument, deleteDoc, docAction, showDocDetail, saveSupplier, editSupplier, supAction, showSupReviewModal, saveSupReview, showSupDetail, saveQuality, deleteQa, qaAction, showQaDetail, doAprCenterAction, exportModuleCSV };
