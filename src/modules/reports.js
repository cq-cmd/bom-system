// 报表中心
import { state, versions, changesData, projectsData, qualityData, suppliersData } from './state.js';
import { renderPieChart, renderGauge, renderTreemap } from './charts.js';
import { renderCostTrend, renderDuplicateCheck, renderSingleSourceRisk } from './advanced-ops.js';

// ===== REPORTS =====
function renderReports() {
  // Stat cards
  const totalMats = state.materialsFlat.length;
  const totalCost = state.materialsFlat.reduce((s,m) => s + m.price * m.qty, 0);
  const activeCount = state.materialsFlat.filter(m => m.status === '有效').length;
  const supplierCount = new Set(state.materialsFlat.map(m => m.supplier)).size;
  document.getElementById('statCards').innerHTML = `
    <div class="stat-card"><div class="stat-num" style="color:var(--accent)">${totalMats}</div><div class="stat-label">物料总数</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--green)">¥${totalCost.toFixed(0)}</div><div class="stat-label">总成本</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--blue)">${activeCount}</div><div class="stat-label">有效物料</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--orange)">${supplierCount}</div><div class="stat-label">供应商数</div></div>
  `;
  // Charts
  const supplierMap = {}; const statusMap = {'有效':0,'待审':0,'停用':0};
  const groupMap = {};
  state.materialsFlat.forEach(m => {
    supplierMap[m.supplier] = (supplierMap[m.supplier]||0) + m.price * m.qty;
    statusMap[m.status] = (statusMap[m.status]||0) + 1;
    const g = m.id.split('-')[0]; groupMap[g] = (groupMap[g]||0) + m.price * m.qty;
  });
  const maxSupplier = Math.max(...Object.values(supplierMap), 1);
  const colors = ['#7c3aed','#2563eb','#22c55e','#f59e0b','#ef4444','#f97316','#06b6d4','#ec4899'];
  let supplierHtml = Object.entries(supplierMap).sort((a,b)=>b[1]-a[1]).map(([k,v],i) =>
    `<div class="stat-row"><span style="width:100px;color:var(--text-secondary)">${k}</span><div class="stat-bar"><div class="stat-bar-fill" style="width:${(v/maxSupplier*100).toFixed(0)}%;background:${colors[i%colors.length]}"></div></div><span style="width:70px;text-align:right;font-weight:500">¥${v.toFixed(0)}</span></div>`
  ).join('');
  const maxGroup = Math.max(...Object.values(groupMap), 1);
  let groupHtml = Object.entries(groupMap).sort((a,b)=>b[1]-a[1]).map(([k,v],i) =>
    `<div class="stat-row"><span style="width:80px;color:var(--text-secondary)">${k}</span><div class="stat-bar"><div class="stat-bar-fill" style="width:${(v/maxGroup*100).toFixed(0)}%;background:${colors[i%colors.length]}"></div></div><span style="width:70px;text-align:right;font-weight:500">¥${v.toFixed(0)}</span></div>`
  ).join('');
  let statusHtml = Object.entries(statusMap).map(([k,v]) => {
    const c = k==='有效'?'var(--green)':k==='停用'?'var(--red)':'var(--yellow)';
    return `<div class="stat-row"><span style="width:60px;color:${c}">${k}</span><div class="stat-bar"><div class="stat-bar-fill" style="width:${(v/totalMats*100).toFixed(0)}%;background:${c}"></div></div><span style="width:40px;text-align:right;font-weight:500">${v}</span></div>`;
  }).join('');
  document.getElementById('chartGrid').innerHTML = `
    <div class="chart-card"><h4>📊 供应商成本分布</h4>${supplierHtml}</div>
    <div class="chart-card"><h4>📦 物料类别成本</h4>${groupHtml}</div>
    <div class="chart-card"><h4>🏷 物料状态分布</h4>${statusHtml}</div>
    <div class="chart-card"><h4>📋 版本发布统计</h4>
      ${versions.map(v => `<div class="stat-row"><span style="width:60px;font-weight:600;color:${v.status==='当前'?'var(--accent)':'var(--text-secondary)'}">${v.ver}</span><span style="flex:1;color:var(--text-muted);font-size:11px">${v.desc.substring(0,30)}${v.desc.length>30?'…':''}</span><span class="badge ${v.statusClass}">${v.status}</span></div>`).join('')}
    </div>
  ` + renderCostTrend() + renderDuplicateCheck() + renderSingleSourceRisk();
  var extra = '';
  if(typeof changesData!=='undefined'){var chgTypes={ECR:0,ECO:0,ECN:0};var chgSt={草稿:0,待审批:0,审批中:0,执行中:0,已关闭:0,已驳回:0};changesData.forEach(function(c){chgTypes[c.type]=(chgTypes[c.type]||0)+1;chgSt[c.status]=(chgSt[c.status]||0)+1});var maxChg=Math.max.apply(null,Object.values(chgTypes).concat([1]));extra+='<div class="chart-card"><h4>🔄 变更类型分布</h4>'+Object.entries(chgTypes).map(function(e,i){return '<div class="stat-row"><span style="width:60px;font-weight:600">'+e[0]+'</span><div class="stat-bar"><div class="stat-bar-fill" style="width:'+(e[1]/maxChg*100).toFixed(0)+'%;background:'+['#2563eb','#7c3aed','#22c55e'][i]+'"></div></div><span style="width:40px;text-align:right;font-weight:500">'+e[1]+'</span></div>'}).join('')+'</div>';var maxChgSt=Math.max.apply(null,Object.values(chgSt).concat([1]));extra+='<div class="chart-card"><h4>🔄 变更状态分布</h4>'+Object.entries(chgSt).filter(function(e){return e[1]>0}).map(function(e){var c=({草稿:'#9ca3af',待审批:'#f59e0b',审批中:'#f59e0b',执行中:'#2563eb',已关闭:'#22c55e',已驳回:'#ef4444'})[e[0]]||'#9ca3af';return '<div class="stat-row"><span style="width:60px;color:'+c+'">'+e[0]+'</span><div class="stat-bar"><div class="stat-bar-fill" style="width:'+(e[1]/maxChgSt*100).toFixed(0)+'%;background:'+c+'"></div></div><span style="width:40px;text-align:right;font-weight:500">'+e[1]+'</span></div>'}).join('')+'</div>'}
  if(typeof projectsData!=='undefined'){var projPhases={P0:0,P1:0,P2:0,EVT:0,DVT:0,PVT:0,MP:0};projectsData.forEach(function(p){projPhases[p.phase]=(projPhases[p.phase]||0)+1});extra+='<div class="chart-card"><h4>📁 项目阶段分布</h4>'+Object.entries(projPhases).filter(function(e){return e[1]>0}).map(function(e){return '<div class="stat-row"><span style="width:40px;font-weight:600">'+e[0]+'</span><div class="stat-bar"><div class="stat-bar-fill" style="width:'+(e[1]/projectsData.length*100).toFixed(0)+'%;background:var(--accent)"></div></div><span style="width:40px;text-align:right;font-weight:500">'+e[1]+'</span></div>'}).join('')+'</div>'}
  if(typeof qualityData!=='undefined'){var qaTypes={};qualityData.forEach(function(r){qaTypes[r.type]=(qaTypes[r.type]||0)+1});var maxQa=Math.max.apply(null,Object.values(qaTypes).concat([1]));var qaColors={'来料不良':'#ef4444','制程不良':'#f97316','客诉':'#7c3aed','内部发现':'#2563eb'};extra+='<div class="chart-card"><h4>🔬 质量问题类型</h4>'+Object.entries(qaTypes).sort(function(a,b){return b[1]-a[1]}).map(function(e){return '<div class="stat-row"><span style="width:70px;color:'+(qaColors[e[0]]||'#9ca3af')+'">'+e[0]+'</span><div class="stat-bar"><div class="stat-bar-fill" style="width:'+(e[1]/maxQa*100).toFixed(0)+'%;background:'+(qaColors[e[0]]||'#9ca3af')+'"></div></div><span style="width:40px;text-align:right;font-weight:500">'+e[1]+'</span></div>'}).join('')+'</div>';var sevMap={};qualityData.forEach(function(r){sevMap[r.severity]=(sevMap[r.severity]||0)+1});var maxSev=Math.max.apply(null,Object.values(sevMap).concat([1]));var sevColors={致命:'#ef4444',严重:'#f97316',一般:'#f59e0b',轻微:'#9ca3af'};extra+='<div class="chart-card"><h4>🔬 严重程度分布</h4>'+Object.entries(sevMap).sort(function(a,b){var o={致命:0,严重:1,一般:2,轻微:3};return (o[a[0]]||9)-(o[b[0]]||9)}).map(function(e){return '<div class="stat-row"><span style="width:40px;color:'+(sevColors[e[0]]||'#9ca3af')+'">'+e[0]+'</span><div class="stat-bar"><div class="stat-bar-fill" style="width:'+(e[1]/maxSev*100).toFixed(0)+'%;background:'+(sevColors[e[0]]||'#9ca3af')+'"></div></div><span style="width:40px;text-align:right;font-weight:500">'+e[1]+'</span></div>'}).join('')+'</div>'}
  if(typeof suppliersData!=='undefined'){var topSup=suppliersData.slice().sort(function(a,b){return b.score-a.score}).slice(0,8);extra+='<div class="chart-card"><h4>🏭 供应商评分 TOP8</h4>'+topSup.map(function(s){var c=s.score>=90?'#22c55e':s.score>=80?'#2563eb':s.score>=70?'#f59e0b':'#ef4444';return '<div class="stat-row"><span style="width:80px;color:var(--text-secondary)">'+s.name+'</span><div class="stat-bar"><div class="stat-bar-fill" style="width:'+s.score+'%;background:'+c+'"></div></div><span style="width:40px;text-align:right;font-weight:600;color:'+c+'">'+s.score+'</span></div>'}).join('')+'</div>'}
  document.getElementById('chartGrid').innerHTML += extra;
  // Enhanced charts (merged from enhancement layer)
  var chartGrid = document.getElementById('chartGrid');
  if (chartGrid) {
    var pieDiv = document.createElement('div');
    pieDiv.className = 'chart-card';
    pieDiv.id = 'statusPieChart';
    chartGrid.insertBefore(pieDiv, chartGrid.firstChild);
    var active = state.materialsFlat.filter(function(m) { return m.status === '有效'; }).length;
    var pending = state.materialsFlat.filter(function(m) { return m.status === '待审'; }).length;
    var stopped = state.materialsFlat.filter(function(m) { return m.status === '停用'; }).length;
    if (typeof renderPieChart === 'function') renderPieChart('statusPieChart', [
      {label: '有效', value: active, color: '#10B981'},
      {label: '待审', value: pending, color: '#F59E0B'},
      {label: '停用', value: stopped, color: '#EF4444'}
    ], '🏷 物料状态分布');
    var gaugeDiv = document.createElement('div');
    gaugeDiv.className = 'chart-card';
    gaugeDiv.id = 'healthGauge';
    chartGrid.insertBefore(gaugeDiv, chartGrid.children[1] || null);
    var healthScore = Math.round((active / Math.max(state.materialsFlat.length, 1)) * 100 - stopped * 2 - pending);
    healthScore = Math.max(0, Math.min(100, healthScore));
    if (typeof renderGauge === 'function') renderGauge('healthGauge', healthScore, 'BOM健康度');
    gaugeDiv.innerHTML = '<h4 style="margin-bottom:12px">💚 BOM 健康度</h4>' + gaugeDiv.innerHTML;
    var tmDiv = document.createElement('div');
    tmDiv.className = 'chart-card';
    tmDiv.id = 'costTreemap';
    chartGrid.appendChild(tmDiv);
    var tmGroupMap = {};
    state.materialsFlat.forEach(function(m) { var g = m.id.split('-')[0]; tmGroupMap[g] = (tmGroupMap[g] || 0) + m.price * m.qty; });
    tmDiv.innerHTML = '<h4 style="margin-bottom:12px">🗺 成本结构 Treemap</h4><div id="costTreemapInner"></div>';
    if (typeof renderTreemap === 'function') renderTreemap('costTreemapInner', Object.entries(tmGroupMap).map(function(e) { return {label: e[0], value: e[1]}; }));
  }
}


export { renderReports };
