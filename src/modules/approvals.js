// 审批流程
import { state, versions, approvals } from './state.js';
import { nowStr } from '../utils/format.js';
import { validateField, btnLoading, btnReset } from './ui-helpers.js';
import { showToast, hideModal, showModal, showConfirm } from './navigation.js';
import { updateNavBadges } from './dashboard.js';
import { logAction } from './enhancements.js';

// ===== APPROVALS =====
const approverMap = {'主管审批':'王主管','品质审核':'赵品质','总监审批':'陈总监'};

function getFilteredApprovals() {
  const search = (document.getElementById('aprSearch')?.value || '').toLowerCase();
  const status = document.getElementById('aprStatusFilter')?.value || 'all';
  let data = approvals.slice();
  if (status !== 'all') data = data.filter(a => a.status === status);
  if (search) data = data.filter(a => a.id.toLowerCase().includes(search) || a.ver.toLowerCase().includes(search) || a.applicant.includes(search));
  return data;
}

function renderApprovalStats() {
  const el = document.getElementById('aprStatCards');
  if (!el) return;
  const total = approvals.length;
  const pending = approvals.filter(a => a.status === '待审批').length;
  const passed = approvals.filter(a => a.status === '已通过').length;
  const rejected = approvals.filter(a => a.status === '已驳回').length;
  const withdrawn = approvals.filter(a => a.status === '已撤回').length;
  el.innerHTML = '<div class="stat-card"><div class="stat-num" style="color:var(--accent)">'+total+'</div><div class="stat-label">总审批</div></div>'
    +'<div class="stat-card"><div class="stat-num" style="color:var(--yellow)">'+pending+'</div><div class="stat-label">待审批</div></div>'
    +'<div class="stat-card"><div class="stat-num" style="color:var(--green)">'+passed+'</div><div class="stat-label">已通过</div></div>'
    +'<div class="stat-card"><div class="stat-num" style="color:var(--red)">'+rejected+'</div><div class="stat-label">已驳回</div></div>'
    +(withdrawn?'<div class="stat-card"><div class="stat-num" style="color:var(--text-muted)">'+withdrawn+'</div><div class="stat-label">已撤回</div></div>':'');
}

function canCurrentUserApprove(a) {
  if (!state.currentUser || !a) return false;
  const activeStep = a.timeline.find(t => t.state === 'active');
  if (!activeStep) return false;
  return activeStep.user === state.currentUser.name;
}

function isApplicant(a) {
  return state.currentUser && a && a.applicant === state.currentUser.name;
}
function renderApprovals() {
  renderApprovalStats();
  const data = getFilteredApprovals();
  const list = document.getElementById('approvalList');
  if (data.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">暂无匹配的审批记录</div>';
    return;
  }
  list.innerHTML = data.map((a, _) => {
    const idx = approvals.indexOf(a);
    const urgBadge = a.urgency === '紧急' ? '<span class="badge badge-yellow" style="margin-left:6px">⚡ 紧急</span>' : a.urgency === '特急' ? '<span class="badge badge-red" style="margin-left:6px">🔥 特急</span>' : '';
    const canApprove = canCurrentUserApprove(a);
    const canWithdraw = isApplicant(a) && a.status === '待审批';
    const canResubmit = isApplicant(a) && a.status === '已驳回';
    const headerActions = [];
    if (canWithdraw) headerActions.push('<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();withdrawApproval('+idx+')" title="撤回">↩ 撤回</button>');
    if (canResubmit) headerActions.push('<button class="btn btn-primary btn-xs" onclick="event.stopPropagation();resubmitApproval('+idx+')" title="重新提交">🔄 重新提交</button>');
    if (canApprove) headerActions.push('<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();remindApproval('+idx+')" title="催办" style="display:none">⏰</button>');

    return '<div class="approval-row" data-idx="'+idx+'">'
      +'<div class="approval-header" onclick="toggleApproval('+idx+')">'
      +'<span class="expand-icon" id="apExp'+idx+'">▶</span>'
      +'<span style="font-weight:500;width:130px">'+a.id+'</span>'
      +'<span style="width:50px">'+a.ver+'</span>'
      +'<span style="width:70px">'+a.applicant+'</span>'
      +'<span style="color:var(--text-muted);width:100px">'+a.date+'</span>'
      +'<span style="color:var(--text-secondary);flex:1">'+a.node+urgBadge+'</span>'
      +'<span style="display:flex;gap:4px;align-items:center">'+headerActions.join('')+'</span>'
      +'<span class="badge '+a.statusClass+'">'+a.status+'</span>'
      +'</div>'
      +'<div class="approval-body" id="apBody'+idx+'">'
      +'<div style="display:flex;gap:16px;margin-bottom:12px;padding:12px;background:var(--bg-primary);border-radius:var(--radius);border:1px solid var(--border)">'
      +'<div class="detail-field"><span class="label">审批单号</span><span class="value" style="color:var(--accent)">'+a.id+'</span></div>'
      +'<div class="detail-field"><span class="label">版本</span><span class="value">'+a.ver+'</span></div>'
      +'<div class="detail-field"><span class="label">类型</span><span class="value">'+(a.type||'新版本发布')+'</span></div>'
      +'<div class="detail-field"><span class="label">申请人</span><span class="value">'+a.applicant+'</span></div>'
      +(a.materials?'<div class="detail-field"><span class="label">涉及物料</span><span class="value">'+a.materials+'</span></div>':'')
      +'</div>'
      +'<div class="timeline">'
      +a.timeline.map(function(t,ti) {
        var canAct = t.state==='active' && canCurrentUserApprove(a);
        var actions = '';
        if (canAct) actions = '<div class="timeline-actions"><button class="btn btn-success btn-xs" onclick="event.stopPropagation();showApproveModal('+idx+',\'approve\')">✓ 通过</button><button class="btn btn-danger btn-xs" onclick="event.stopPropagation();showApproveModal('+idx+',\'reject\')">✕ 驳回</button></div>';
        else if (t.state==='active' && !canAct) actions = '<div style="font-size:11px;color:var(--text-muted);margin-top:4px">⏳ 等待 '+t.user+' 审批</div>';
        var canRemind = t.state==='active' && isApplicant(a);
        if (canRemind) actions += '<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();remindApproval('+idx+')" style="margin-top:4px">⏰ 催办</button>';
        return '<div class="timeline-item">'
          +'<div class="timeline-dot '+t.state+'">'+(t.state==='done'?'✓':t.state==='active'?'◉':t.state==='rejected'?'✕':t.state==='withdrawn'?'↩':'○')+'</div>'
          +'<div class="timeline-content">'
          +'<div class="tl-title">'+t.title+(t.user!=='—'?' <span style="color:var(--text-muted);font-weight:400"> · '+t.user+'</span>':'')+'</div>'
          +'<div class="tl-meta">'+t.date+(t.note?' · '+t.note:'')+'</div>'
          +actions
          +'</div></div>';
      }).join('')
      +'</div></div></div>';
  }).join('');
}
function toggleApproval(idx) { document.getElementById('apBody'+idx).classList.toggle('open'); document.getElementById('apExp'+idx).classList.toggle('open'); }
function submitApproval() {
  const ver = document.getElementById('aprFormVer').value;
  const type = document.getElementById('aprFormType').value;
  const desc = document.getElementById('aprFormDesc').value.trim();
  const urgency = document.getElementById('aprFormUrgency')?.value || '普通';
  const materials = document.getElementById('aprFormMaterials')?.value.trim() || '';
  const applicant = state.currentUser ? state.currentUser.name : '张工';
  if (!desc) { showToast('请填写变更说明', 'error'); return; }
  const newId = 'APR-' + new Date().getFullYear() + '-' + String(approvals.length).padStart(3,'0');
  approvals.unshift({
    id: newId, ver, applicant: applicant, date: todayStr(), node: '主管审批', status: '待审批', statusClass: 'badge-yellow',
    type: type, urgency: urgency, materials: materials,
    timeline: [
      {title:'提交申请',user:applicant,date:nowStr(),state:'done',note:type+' — '+desc},
      {title:'主管审批',user:'王主管',date:'—',state:'active',note:'审批中…'},
      {title:'品质审核',user:'赵品质',date:'—',state:'pending'},
      {title:'总监审批',user:'陈总监',date:'—',state:'pending'},
      {title:'完成发布',user:'—',date:'—',state:'pending'}
    ]
  });
  hideModal('newApprovalModal');
  renderApprovals(); updateNavBadges();
  showToast('审批 '+newId+' 已提交', 'success');
}

function showApproveModal(idx, action) {
  const a = approvals[idx];
  if (!a) return;
  document.getElementById('approveIdx').value = idx;
  document.getElementById('approveAction').value = action;
  var ctx = document.getElementById('approveContextInfo');
  if (ctx) {
    ctx.innerHTML = '<div style="padding:12px;background:var(--bg-primary);border-radius:var(--radius-sm);border:1px solid var(--border);margin-bottom:4px">'
      +'<div style="display:flex;gap:16px;font-size:12px">'
      +'<div><span style="color:var(--text-muted)">审批单：</span><b style="color:var(--accent)">'+a.id+'</b></div>'
      +'<div><span style="color:var(--text-muted)">版本：</span><b>'+a.ver+'</b></div>'
      +'<div><span style="color:var(--text-muted)">申请人：</span><b>'+a.applicant+'</b></div>'
      +'<div><span style="color:var(--text-muted)">类型：</span><b>'+(a.type||'新版本发布')+'</b></div>'
      +'</div>'
      +(a.materials?'<div style="font-size:11px;color:var(--text-muted);margin-top:6px">涉及物料：'+a.materials+'</div>':'')
      +'</div>';
  }
  if (action === 'approve') {
    document.getElementById('approveModalTitle').textContent = '审批通过 — ' + a.id;
    document.getElementById('approveLabel').textContent = '审批意见（可选）';
    document.getElementById('approveSubmitBtn').className = 'btn btn-success';
    document.getElementById('approveSubmitBtn').textContent = '确认通过';
  } else {
    document.getElementById('approveModalTitle').textContent = '驳回申请 — ' + a.id;
    document.getElementById('approveLabel').textContent = '驳回原因（必填）';
    document.getElementById('approveSubmitBtn').className = 'btn btn-danger';
    document.getElementById('approveSubmitBtn').textContent = '确认驳回';
  }
  document.getElementById('approveComment').value = '';
  showModal('approveModal');
}
function doApprove() {
  var action = document.getElementById('approveAction').value;
  if (!validateField('approveComment', '审批意见')) return;
  var btn = document.getElementById('approveSubmitBtn');
  btnLoading(btn, action === 'approve' ? '提交中…' : '驳回中…');
  setTimeout(function() {
    btnReset(btn);
    const idx = parseInt(document.getElementById('approveIdx').value);
    const comment = document.getElementById('approveComment').value.trim();
    if (action === 'reject' && !comment) { showToast('请填写驳回原因', 'error'); return; }
    const a = approvals[idx];
    if (!a) return;
    const activeIdx = a.timeline.findIndex(t => t.state === 'active');
    if (activeIdx < 0) return;
    if (action === 'approve') {
      a.timeline[activeIdx].state = 'done';
      a.timeline[activeIdx].date = nowStr();
      a.timeline[activeIdx].note = comment || '同意';
      if (activeIdx + 1 < a.timeline.length) {
        if (a.timeline[activeIdx + 1].title === '完成发布') {
          a.timeline[activeIdx + 1].state = 'done'; a.timeline[activeIdx + 1].date = nowStr(); a.timeline[activeIdx + 1].user = '系统';
          a.status = '已通过'; a.statusClass = 'badge-green'; a.node = '完成';
        } else {
          a.timeline[activeIdx + 1].state = 'active';
          a.timeline[activeIdx + 1].note = '审批中…';
          a.node = a.timeline[activeIdx + 1].title;
        }
      }
      hideModal('approveModal');
      renderApprovals(); updateNavBadges();
      showToast(a.id + ' 审批通过', 'success');
    } else {
      a.timeline[activeIdx].state = 'rejected';
      a.timeline[activeIdx].date = nowStr();
      a.timeline[activeIdx].note = comment;
      a.status = '已驳回'; a.statusClass = 'badge-red'; a.node = a.timeline[activeIdx].title;
      hideModal('approveModal');
      renderApprovals(); updateNavBadges();
      showToast(a.id + ' 已驳回', 'info');
    }
    logAction(action === 'approve' ? '审批通过' : '审批驳回', document.getElementById('approveIdx').value);
  }, 300);
}

function withdrawApproval(idx) {
  const a = approvals[idx];
  if (!a || a.status !== '待审批') return;
  showConfirm('确定撤回审批单 "'+a.id+'" 吗？', function() {
    a.timeline.forEach(function(t) { if (t.state === 'active') { t.state = 'withdrawn'; t.date = nowStr(); t.note = '申请人撤回'; } });
    a.status = '已撤回'; a.statusClass = 'badge-gray'; a.node = '已撤回';
    renderApprovals(); updateNavBadges();
    showToast(a.id + ' 已撤回', 'info');
  });
}

function resubmitApproval(idx) {
  const a = approvals[idx];
  if (!a || a.status !== '已驳回') return;
  showConfirm('确定重新提交审批单 "'+a.id+'" 吗？将重新进入审批流程。', function() {
    a.timeline.forEach(function(t) {
      if (t.state === 'rejected' || t.state === 'withdrawn') { t.state = 'pending'; t.date = '—'; t.note = ''; }
    });
    var firstPending = a.timeline.findIndex(function(t) { return t.state === 'pending' && t.title !== '提交申请' && t.title !== '完成发布'; });
    if (firstPending >= 0) { a.timeline[firstPending].state = 'active'; a.timeline[firstPending].note = '审批中…'; a.node = a.timeline[firstPending].title; }
    a.status = '待审批'; a.statusClass = 'badge-yellow'; a.date = todayStr();
    renderApprovals(); updateNavBadges();
    showToast(a.id + ' 已重新提交', 'success');
  });
}

function remindApproval(idx) {
  const a = approvals[idx];
  if (!a) return;
  const activeStep = a.timeline.find(function(t) { return t.state === 'active'; });
  if (!activeStep) return;
  showToast('已向 ' + activeStep.user + ' 发送催办提醒（'+a.id+'）', 'success');
}

function exportApprovals() {
  var csv = '\uFEFF审批单号,版本,申请人,日期,当前环节,状态,类型,紧急度,涉及物料\n';
  approvals.forEach(function(a) { csv += '"'+a.id+'","'+a.ver+'","'+a.applicant+'","'+a.date+'","'+a.node+'","'+a.status+'","'+(a.type||'')+'","'+(a.urgency||'')+'","'+(a.materials||'')+'"\n'; });
  var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  var link = document.createElement('a');
  link.href = URL.createObjectURL(blob); link.download = '审批记录_'+todayStr()+'.csv';
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
  showToast('审批记录导出完成', 'success');
}



export { getFilteredApprovals, renderApprovalStats, canCurrentUserApprove, isApplicant, renderApprovals, toggleApproval, submitApproval, showApproveModal, doApprove, withdrawApproval, resubmitApproval, remindApproval, exportApprovals };
