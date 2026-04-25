<<<<<<< HEAD
// 仪表盘 + 通知 + 待办
import { state, versions, approvals, changesData, qualityData, documentsData, demoUsers, projectsData } from './state.js';
import { nowStr } from '../utils/format.js';
import { navigateTo } from './navigation.js';
import { showChgDetail, showQaDetail, showDocDetail } from './page-modules.js';
import { renderRecentAccess, applyPermissions } from './enhancements.js';
import { renderPieChart, renderBarChart } from './charts.js';
import { buildLoginPill, quickLoginFromDataset, restoreQuickLoginSelection } from './auth.js';
import { renderMaterials } from './materials.js';

// ===== DASHBOARD =====
function renderDashboard() {
  const name = state.currentUser ? state.currentUser.name : '访客';
  const role = state.currentUser ? state.currentUser.role : '';
  document.getElementById('dashWelcome').textContent = '欢迎回来，' + name;
  document.getElementById('dashRole').innerHTML = role ? '<span class="badge badge-purple">' + role + '</span>' : '';
  const totalMats = state.materialsFlat.length;
  const activeMats = state.materialsFlat.filter(m => m.status === '有效').length;
  const pendingMats = state.materialsFlat.filter(m => m.status === '待审').length;
  const pendingApprovals = approvals.filter(a => a.status === '待审批').length;
  const curVer = versions.find(v => v.status === '当前');
  const activeProj = typeof projectsData!=='undefined'?projectsData.filter(p=>p.status==='进行中').length:0;
  const pendChg = typeof changesData!=='undefined'?changesData.filter(c=>c.status==='待审批'||c.status==='审批中').length:0;
  const openQa = typeof qualityData!=='undefined'?qualityData.filter(r=>r.status!=='已关闭').length:0;
  document.getElementById('dashStats').innerHTML =
    '<div class="stat-card" style="cursor:pointer" onclick="navigateTo(\'materials\')"><div class="stat-num" style="color:var(--accent)">'+totalMats+'</div><div class="stat-label">物料总数</div></div>'
    +'<div class="stat-card" style="cursor:pointer" onclick="navigateTo(\'projects\')"><div class="stat-num" style="color:var(--blue)">'+activeProj+'</div><div class="stat-label">进行中项目</div></div>'
    +'<div class="stat-card" style="cursor:pointer" onclick="navigateTo(\'changes\')"><div class="stat-num" style="color:var(--yellow)">'+pendChg+'</div><div class="stat-label">待审变更</div></div>'
    +'<div class="stat-card" style="cursor:pointer" onclick="navigateTo(\'approvals\')"><div class="stat-num" style="color:var(--orange)">'+pendingApprovals+'</div><div class="stat-label">待审批</div></div>'
    +'<div class="stat-card" style="cursor:pointer" onclick="navigateTo(\'quality\')"><div class="stat-num" style="color:var(--red)">'+openQa+'</div><div class="stat-label">质量问题</div></div>'
    +'<div class="stat-card"><div class="stat-num" style="color:var(--green)">'+(curVer?curVer.ver:'—')+'</div><div class="stat-label">当前版本</div></div>'
    +'<div class="stat-card" style="cursor:pointer" onclick="navigateTo(\'lifecycle\')"><div class="stat-num" style="color:var(--cyan)">♻️</div><div class="stat-label">生命周期</div></div>'
    +'<div class="stat-card" style="cursor:pointer" onclick="navigateTo(\'inventory\')"><div class="stat-num" style="color:var(--pink)">📋</div><div class="stat-label">库存采购</div></div>';
  // Dashboard mini charts
  var dashChartRow = document.getElementById('dashChartRow');
  if (!dashChartRow) {
    dashChartRow = document.createElement('div');
    dashChartRow.id = 'dashChartRow';
    dashChartRow.className = 'chart-grid';
    dashChartRow.style.cssText = 'grid-template-columns:1fr 1fr;margin-bottom:20px';
    var statsEl = document.getElementById('dashStats');
    if (statsEl && statsEl.nextSibling) statsEl.parentNode.insertBefore(dashChartRow, statsEl.nextSibling);
    else if (statsEl) statsEl.parentNode.appendChild(dashChartRow);
  }
  dashChartRow.innerHTML = '<div class="chart-card" id="dashStatusPie"></div><div class="chart-card" id="dashCostBar"></div>';
  renderPieChart('dashStatusPie', [
    { label: '有效', value: activeMats, color: '#5D9B74' },
    { label: '待审', value: pendingMats, color: '#C49B3C' },
    { label: '停用', value: totalMats - activeMats - pendingMats, color: '#C06058' }
  ], '🏷 物料状态分布');
  var catCost = {};
  state.materialsFlat.forEach(function(m) { var g = m.id.split('-')[0]; catCost[g] = (catCost[g] || 0) + m.price * m.qty; });
  var topCats = Object.entries(catCost).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
  var catColors = ['#4F6D7A', '#5B8FA8', '#5D9B74', '#C49B3C', '#C47F42'];
  renderBarChart('dashCostBar', topCats.map(function(e, i) { return { label: e[0], value: Math.round(e[1]), color: catColors[i], format: 'currency' }; }), '📦 类别成本 Top5');
  updateNavBadges();
  renderDashTodos();
  var activities = [
    {text:'张工 创建了版本 V3.0，新增四大模组',time:'2025-06-15 09:00',color:'var(--green)',nav:'bom',act:"document.querySelector('[data-tab=versions]').click()"}
  ];
  if(typeof changesData!=='undefined')changesData.slice(0,3).forEach(function(c){activities.push({text:c.initiator+' '+({草稿:'创建了',待审批:'提交了',审批中:'审批中',执行中:'执行中',已关闭:'完成了',已驳回:'被驳回'}[c.status]||'更新了')+' '+c.type+' '+c.title,time:c.date+' 10:00',color:c.status==='已关闭'?'var(--green)':c.status==='已驳回'?'var(--red)':'var(--blue)',nav:'changes',act:"showChgDetail('"+c.id+"')"})});
  if(typeof qualityData!=='undefined')qualityData.filter(function(r){return r.status!=='已关闭'}).slice(0,2).forEach(function(r){activities.push({text:r.owner+' 发现 '+r.severity+'问题: '+r.title,time:r.date+' 14:00',color:r.severity==='致命'?'var(--red)':r.severity==='严重'?'var(--orange)':'var(--yellow)',nav:'quality',act:"showQaDetail('"+r.id+"')"})});
  if(typeof documentsData!=='undefined')documentsData.filter(function(d){return d.status==='已发布'}).slice(0,2).forEach(function(d){activities.push({text:d.uploader+' 发布了文档 '+d.name,time:d.date+' 11:00',color:'var(--green)',nav:'documents',act:"showDocDetail('"+d.id+"')"})});
  activities.sort(function(a,b){return b.time.localeCompare(a.time)});
  var af=document.getElementById('dashActivity');
  if(af)af.innerHTML='<h3>📰 最近动态</h3>'+activities.slice(0,8).map(function(a){return '<div class="activity-item" style="cursor:pointer" onclick="navigateTo(\''+a.nav+'\');setTimeout(function(){'+a.act+'},200)"><div class="activity-dot" style="background:'+a.color+'"></div><div><div class="activity-text">'+a.text+'</div><div class="activity-time">'+a.time+'</div></div></div>'}).join('');
  // Recent access & permissions (merged from enhancement layer)
  var dashTodos = document.getElementById('dashTodos');
  if (dashTodos && !document.getElementById('dashRecent')) {
    var recentDiv = document.createElement('div');
    recentDiv.id = 'dashRecent';
    recentDiv.style.cssText = 'margin-top:20px;padding:16px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius)';
    dashTodos.parentNode.insertBefore(recentDiv, dashTodos.nextSibling);
  }
  if (typeof renderRecentAccess === 'function') renderRecentAccess();
  if (typeof applyPermissions === 'function') applyPermissions();
}

function updateNavBadges() {
  const pendingApprovals = approvals.filter(a => a.status === '待审批').length;
  const el1 = document.getElementById('navBadgeBom');
  const el2 = document.getElementById('navBadgeMat');
  if (el1) el1.textContent = pendingApprovals;
  if (el2) el2.textContent = state.materialsFlat.length;
}

// ===== NOTIFICATION BELL =====
function initNotifBell() {
  const bell = document.getElementById('notifBell');
  const dropdown = document.getElementById('notifDropdown');
  if (!bell || !dropdown) return;
  bell.addEventListener('click', e => { e.stopPropagation(); dropdown.classList.toggle('show'); });
  document.addEventListener('click', () => dropdown.classList.remove('show'));
}

// ===== LOGIN ACCOUNT PILLS =====
function renderLoginPills() {
  const container = document.getElementById('loginAccounts');
  if (!container) return;
  container.innerHTML = demoUsers.map(u => buildLoginPill(u)).join('');
  container.onclick = e => {
    const pill = e.target.closest('.login-pill');
    if (!pill) return;
    quickLoginFromDataset(pill);
  };
  restoreQuickLoginSelection();
}


// ===== DASHBOARD TODO LIST =====
function renderDashTodos() {
  var el = document.getElementById('dashTodos');
  if (!el) return;
  var name = state.currentUser ? state.currentUser.name : '';
  var myApprovals = approvals.filter(function(a) {
    var active = a.timeline.find(function(t) { return t.state === 'active'; });
    return active && active.user === name;
  });
  var pendingMats = state.materialsFlat.filter(function(m) { return m.status === '待审'; });
  var myChanges = typeof changesData!=='undefined'?changesData.filter(function(c){return c.reviewer===name&&(c.status==='待审批'||c.status==='审批中')}):[];
  var myQa = typeof qualityData!=='undefined'?qualityData.filter(function(r){return r.owner===name&&r.status!=='已关闭'}):[];
  var totalTodos = myApprovals.length+pendingMats.length+myChanges.length+myQa.length;
  var html = '<h3 style="font-size:15px;font-weight:600;margin-bottom:14px">📌 我的待办 <span class="badge badge-yellow" style="font-size:11px;vertical-align:middle">'+totalTodos+'</span></h3>';
  if (totalTodos === 0) {
    html += '<div style="text-align:center;padding:20px;color:var(--text-muted)">🎉 暂无待办事项</div>';
  } else {
    myApprovals.forEach(function(a) {
      html += '<div class="todo-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--border);border-left:3px solid var(--yellow);border-radius:var(--radius);margin-bottom:8px;cursor:pointer;transition:all .15s;font-size:12px" onclick="navigateTo(\'bom\');setTimeout(function(){document.querySelector(\'[data-tab=approval]\').click()},100)"><span style="font-size:16px">📋</span><div style="flex:1"><div style="color:var(--text-primary);font-weight:500">审批 '+a.id+' — '+a.ver+'</div><div style="color:var(--text-muted);margin-top:2px">等待您审批 · '+(a.type||'新版本发布')+'</div></div><span class="badge badge-yellow">待审批</span></div>';
    });
    myChanges.forEach(function(c) {
      html += '<div class="todo-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--border);border-left:3px solid var(--purple);border-radius:var(--radius);margin-bottom:8px;cursor:pointer;transition:all .15s;font-size:12px" onclick="navigateTo(\'changes\');setTimeout(function(){showChgDetail(\''+c.id+'\')},200)"><span style="font-size:16px">🔄</span><div style="flex:1"><div style="color:var(--text-primary);font-weight:500">'+c.id+' '+c.title+'</div><div style="color:var(--text-muted);margin-top:2px">变更审批 · '+c.initiator+' 发起</div></div><span class="badge badge-purple">'+c.type+'</span></div>';
    });
    myQa.slice(0,3).forEach(function(r) {
      html += '<div class="todo-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--border);border-left:3px solid var(--red);border-radius:var(--radius);margin-bottom:8px;cursor:pointer;transition:all .15s;font-size:12px" onclick="navigateTo(\'quality\');setTimeout(function(){showQaDetail(\''+r.id+'\')},200)"><span style="font-size:16px">🔬</span><div style="flex:1"><div style="color:var(--text-primary);font-weight:500">'+r.id+' '+r.title+'</div><div style="color:var(--text-muted);margin-top:2px">'+r.type+' · '+r.status+'</div></div><span class="badge badge-red">'+r.severity+'</span></div>';
    });
    pendingMats.slice(0,3).forEach(function(m) {
      html += '<div class="todo-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--border);border-left:3px solid var(--orange);border-radius:var(--radius);margin-bottom:8px;cursor:pointer;transition:all .15s;font-size:12px" onclick="navigateTo(\'materials\');document.getElementById(\'matFilter\').value=\'待审\';state.matPage=1;renderMaterials()"><span style="font-size:16px">📦</span><div style="flex:1"><div style="color:var(--text-primary);font-weight:500">'+m.name+' ('+m.id+')</div><div style="color:var(--text-muted);margin-top:2px">物料待审核 · '+m.supplier+'</div></div><span class="badge badge-yellow">待审</span></div>';
    });
    if (pendingMats.length > 3) html += '<div style="text-align:center;font-size:11px;color:var(--text-muted);padding:4px">还有 '+(pendingMats.length-3)+' 项待审物料…</div>';
    if (myQa.length > 3) html += '<div style="text-align:center;font-size:11px;color:var(--text-muted);padding:4px">还有 '+(myQa.length-3)+' 项质量问题…</div>';
  }
  el.innerHTML = html;
}


export { renderDashboard, updateNavBadges, initNotifBell, renderLoginPills, renderDashTodos };
=======
import { getBomData, getMaterialsFlat } from '../modules/bom.js';
import { getCurrentUser } from '../modules/auth.js';

export function renderDashboard() {
  const user = getCurrentUser();
  const welcome = document.getElementById('dashWelcome');
  const role = document.getElementById('dashRole');

  if (welcome && user) {
    welcome.textContent = `欢迎回来，${user.name}`;
  }
  if (role && user) {
    role.textContent = user.role || '';
  }

  renderStats();
  renderActivity();
}

function renderStats() {
  const container = document.getElementById('dashStats');
  if (!container) return;

  const materials = getMaterialsFlat();
  const bom = getBomData();

  const totalMaterials = materials.length;
  const activeMaterials = materials.filter(m => m.status === '有效').length;
  const pendingMaterials = materials.filter(m => m.status === '待审').length;
  const inactiveMaterials = materials.filter(m => m.status === '停用').length;

  let totalNodes = 0;
  let maxDepth = 0;
  function count(node, depth) {
    totalNodes++;
    if (depth > maxDepth) maxDepth = depth;
    if (node.children) node.children.forEach(c => count(c, depth + 1));
  }
  count(bom, 1);

  container.innerHTML = `
    <div class="stat-card">
      <div class="stat-num" style="color:var(--accent)">${totalMaterials}</div>
      <div class="stat-label">物料总数</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--green)">${activeMaterials}</div>
      <div class="stat-label">有效物料</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--yellow)">${pendingMaterials}</div>
      <div class="stat-label">待审批</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--red)">${inactiveMaterials}</div>
      <div class="stat-label">已停用</div>
    </div>
  `;
}

function renderActivity() {
  const container = document.getElementById('dashActivity');
  if (!container) return;

  // Recent activity can be enhanced based on actual usage
  const activities = [
    { type: 'approval', text: 'V3.0 BOM 等待品质审核', time: '10 分钟前' },
    { type: 'material', text: '新物料 RF-20047 提交入库审批', time: '1 小时前' },
    { type: 'system', text: '系统将于今日 22:00 进行维护', time: '3 小时前' },
  ];

  container.innerHTML = activities.map(act => `
    <div class="activity-item">
      <div class="activity-text">${act.text}</div>
      <div class="activity-time">${act.time}</div>
    </div>
  `).join('');
}

export function updateNavBadges() {
  const materials = getMaterialsFlat();
  const pending = materials.filter(m => m.status === '待审').length;
  const inactive = materials.filter(m => m.status === '停用').length;

  const navBadgeMat = document.getElementById('navBadgeMat');
  const navBadgeInv = document.getElementById('navBadgeInv');

  if (navBadgeMat) navBadgeMat.textContent = materials.length;
  if (navBadgeInv) navBadgeInv.textContent = pending + inactive;
}

export function getDashboardStats() {
  const materials = getMaterialsFlat();
  const bom = getBomData();

  return {
    totalMaterials: materials.length,
    activeMaterials: materials.filter(m => m.status === '有效').length,
    pendingMaterials: materials.filter(m => m.status === '待审').length,
    inactiveMaterials: materials.filter(m => m.status === '停用').length,
  };
}
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
