import { bomDataA100 } from './data/bom-a100.js';
import { bomDataB200 } from './data/bom-b200.js';
import { bomDataC300 } from './data/bom-c300.js';
import { bomDataP12A } from './data/bom-p12a.js';
import { bomDataD400 } from './data/bom-d400.js';
import { bomDataW100 } from './data/bom-w100.js';
import { bomDataM500 } from './data/bom-m500.js';
import { bomDataF100 } from './data/bom-f100.js';
import { bomDataR900 } from './data/bom-r900.js';
import { bomDataT800 } from './data/bom-t800.js';
import { bomDataH200 } from './data/bom-h200.js';
import { versions as _versions } from './data/versions.js';
import { approvals as _approvals } from './data/approvals.js';
import { demoUsers } from './data/users.js';
import { substituteMap as _substituteMap } from './data/substitutes.js';
import { versionDiffs } from './data/diffs.js';
import { enumConfig } from './data/enums.js';
import { projectsData as _projectsData } from './data/projects.js';
import { changesData as _changesData } from './data/changes.js';
import { escapeHtml } from './utils/dom.js';
import { nowStr, todayStr } from './utils/format.js';
import { getStorage, setStorage, getSessionStorage, setSessionStorage } from './utils/storage.js';


const versions = JSON.parse(JSON.stringify(_versions));
const approvals = JSON.parse(JSON.stringify(_approvals));
const substituteMap = JSON.parse(JSON.stringify(_substituteMap));
const projectsData = JSON.parse(JSON.stringify(_projectsData));
const changesData = JSON.parse(JSON.stringify(_changesData));
const allBOMs = [
  bomDataA100,
  bomDataB200,
  bomDataC300,
  bomDataP12A,
  bomDataD400,
  bomDataW100,
  bomDataM500,
  bomDataF100,
  bomDataR900,
  bomDataT800,
  bomDataH200
];

let settingsUsers = [
  {name:'张工',role:'高级工程师',email:'zhang@example.com',status:'在线'},
  {name:'王主管',role:'研发主管',email:'wang@example.com',status:'在线'},
  {name:'赵品质',role:'品质工程师',email:'zhao@example.com',status:'离线'},
  {name:'陈总监',role:'技术总监',email:'chen@example.com',status:'在线'},
  {name:'李工',role:'硬件工程师',email:'li@example.com',status:'离线'},
  {name:'刘采购',role:'采购专员',email:'liu@example.com',status:'在线'},
  {name:'孙测试',role:'测试工程师',email:'sun@example.com',status:'在线'},
  {name:'周结构',role:'结构工程师',email:'zhou@example.com',status:'离线'},
  {name:'吴射频',role:'射频工程师',email:'wu@example.com',status:'在线'},
  {name:'郑产品',role:'产品经理',email:'zheng@example.com',status:'在线'}
];

const aprCenterData = [
  {id:'APR-0042',title:'主板电源模块IC替换审批',type:'变更审批',applicant:'张工',time:'2025-06-10 14:30',urgency:'紧急',status:'待审批',target:'mine'},
  {id:'APR-0041',title:'V3.0 BOM版本发布审批',type:'BOM审批',applicant:'张工',time:'2025-06-09 09:00',urgency:'普通',status:'待审批',target:'mine'},
  {id:'APR-0040',title:'新物料 RF-20047 入库审批',type:'物料审批',applicant:'李工',time:'2025-06-08 16:20',urgency:'普通',status:'待审批',target:'mine'},
  {id:'APR-0039',title:'T800 产品规格书发布',type:'文档审批',applicant:'王主管',time:'2025-06-07 11:00',urgency:'普通',status:'待审批',target:'mine'},
  {id:'APR-0038',title:'USB接口升级变更单',type:'变更审批',applicant:'张工',time:'2025-06-05 10:15',urgency:'特急',status:'待审批',target:'mine'},
  {id:'APR-0037',title:'电容供应商切换ECR',type:'变更审批',applicant:'张工',time:'2025-06-12 08:30',urgency:'普通',status:'审批中',target:'initiated'},
  {id:'APR-0036',title:'D400 手环BOM V2.0发布',type:'BOM审批',applicant:'张工',time:'2025-06-01 14:00',urgency:'普通',status:'已通过',target:'initiated'},
];

let bomData;







bomData = allBOMs[0];

let materialsFlat = [];
function rebuildFlat() {
  materialsFlat.length = 0;
  function walk(node) { if (node.level >= 2) materialsFlat.push(node); if (node.children) node.children.forEach(walk); }
  walk(bomData);
  cleanupFavoriteMaterials();
}
rebuildFlat();

function cleanupFavoriteMaterials() {
  if (!favoriteMaterials.size) return;
  const valid = new Set(materialsFlat.map(m => m.id));
  let changed = false;
  favoriteMaterials.forEach(id => {
    if (!valid.has(id)) { favoriteMaterials.delete(id); changed = true; }
  });
  if (changed) persistFavorites();
}

function persistFavorites() {
  try { localStorage.setItem('bom_mat_favs', JSON.stringify([...favoriteMaterials])); } catch(e) {}
}
function persistFavoriteFilter() {
  try { localStorage.setItem('bom_mat_fav_only', showFavoriteOnly ? '1' : '0'); } catch(e) {}
}
function updateFavToggleButton() {
  const btn = document.getElementById('favToggleBtn');
  if (!btn) return;
  btn.classList.toggle('fav-active', showFavoriteOnly);
  btn.textContent = (showFavoriteOnly ? '★ 仅看收藏' : '☆ 收藏筛选');
}
function toggleFavoriteFilter() {
  showFavoriteOnly = !showFavoriteOnly;
  persistFavoriteFilter();
  updateFavToggleButton();
  matPage = 1;
  renderMaterials();
}
function toggleFavorite(id) {
  if (favoriteMaterials.has(id)) {
    favoriteMaterials.delete(id);
    showToast('已从收藏移除 ' + id, 'info');
  } else {
    favoriteMaterials.add(id);
    showToast('已收藏物料 ' + id, 'success');
  }
  persistFavorites();
  renderMaterials();
}









// Mock diff data for version comparison




let selectedNodeId = bomData.id;
let ctxNode = null;
let ctxTreeNodeEl = null;
let selectedMatIds = new Set();
let importedData = null;
let currentUser = null;
let favoriteMaterials = new Set();
let showFavoriteOnly = false;
let pinnedNodeIds = new Set();

try {
  const rawFavs = JSON.parse(localStorage.getItem('bom_mat_favs') || '[]');
  if (Array.isArray(rawFavs)) favoriteMaterials = new Set(rawFavs);
} catch(e) {}
try {
  showFavoriteOnly = localStorage.getItem('bom_mat_fav_only') === '1';
} catch(e) {}
try {
  const rawPins = JSON.parse(localStorage.getItem('bom_node_pins') || '[]');
  if (Array.isArray(rawPins)) pinnedNodeIds = new Set(rawPins);
} catch(e) {}

function findUserByIdentifier(identifier) {
  if (!identifier) return null;
  return demoUsers.find(u => u.name === identifier || u.account === identifier);
}

function setCurrentUser(user, skipNav) {
  currentUser = user;
  const app = document.getElementById('appRoot');
  const login = document.getElementById('loginScreen');
  const avatar = document.getElementById('userAvatar');
  const menuLabel = document.getElementById('userMenuLabel');
  const menuName = document.getElementById('userMenuName');
  const menuRole = document.getElementById('userMenuRole');
  const dropdown = document.getElementById('userDropdown');
  if (user) {
    try { localStorage.setItem('bom_user', user.name); } catch(e) {}
    avatar.textContent = user.initial || user.name.charAt(0);
    avatar.title = user.name;
    menuLabel.textContent = user.name;
    menuName.textContent = user.name;
    menuRole.textContent = user.role;
    if (login) login.style.display = 'none';
    if (app) app.style.display = 'flex';
    dropdown?.classList.remove('show');
    if (!skipNav) {
      navigateTo('dashboard');
      showToast('欢迎回来，' + user.name, 'success');
    }
  } else {
    try { localStorage.removeItem('bom_user'); localStorage.removeItem('bom_page'); } catch(e) {}
    avatar.textContent = '—';
    avatar.title = '未登录';
    menuLabel.textContent = '未登录';
    menuName.textContent = '—';
    menuRole.textContent = '—';
    if (app) app.style.display = 'none';
    if (login) login.style.display = 'flex';
    dropdown?.classList.remove('show');
    const pwd = document.getElementById('loginPassword');
    if (pwd) pwd.value = '';
  }
}

function handleLoginSubmit() {
  const nameInput = document.getElementById('loginUsername');
  const passInput = document.getElementById('loginPassword');
  const errorBox = document.getElementById('loginError');
  const username = nameInput?.value.trim();
  const password = passInput?.value.trim();
  const user = findUserByIdentifier(username);
  if (!user || user.password !== password) {
    if (errorBox) errorBox.textContent = '账号或密码错误，请重试';
    return;
  }
  if (errorBox) errorBox.textContent = '';
  setCurrentUser(user);
}

function initLoginUI() {
  const submitBtn = document.getElementById('loginSubmit');
  const logoutBtn = document.getElementById('logoutBtn');
  submitBtn?.addEventListener('click', handleLoginSubmit);
  document.getElementById('loginPassword')?.addEventListener('keydown', e => { if (e.key === 'Enter') handleLoginSubmit(); });
  document.getElementById('loginUsername')?.addEventListener('keydown', e => { if (e.key === 'Enter') handleLoginSubmit(); });
  logoutBtn?.addEventListener('click', e => {
    e.stopPropagation();
    setCurrentUser(null);
    const err = document.getElementById('loginError');
    if (err) err.textContent = '';
    const loginEl = document.getElementById('loginScreen');
    if (loginEl) loginEl.style.display = 'flex';
  });
  try {
    var savedUser = localStorage.getItem('bom_user');
    if (savedUser) {
      var user = findUserByIdentifier(savedUser);
      if (user) {
        setCurrentUser(user, true);
        var savedPage = localStorage.getItem('bom_page') || 'dashboard';
        navigateTo(savedPage);
        return;
      }
    }
  } catch(e) {}
  const userMenu = document.getElementById('userMenu');
  const dropdown = document.getElementById('userDropdown');
  userMenu?.addEventListener('click', e => {
    e.stopPropagation();
    if (!currentUser) return;
    dropdown?.classList.toggle('show');
  });
  document.addEventListener('click', () => dropdown?.classList.remove('show'));
  setCurrentUser(null);
}

// ===== UTILITY =====
function populateEnumSelect(selectId, enumKey, allowEmpty) {
  const el = document.getElementById(selectId);
  if (!el) return;
  const items = enumConfig[enumKey]?.items || [];
  el.innerHTML = (allowEmpty ? '<option value="">请选择</option>' : '') + items.map(i => '<option value="'+i+'">'+i+'</option>').join('');
}
function populateAllEnumSelects() {
  populateEnumSelect('matFormUnit','unit'); populateEnumSelect('matFormStatus','status');
  populateEnumSelect('matFormGrade','materialGrade',true); populateEnumSelect('matFormStorage','storage',true);
  populateEnumSelect('nodeFormUnit','unit'); populateEnumSelect('nodeFormStatus','status');
}
function findNode(id, node) {
  if (!node) node = bomData;
  if (node.id === id) return node;
  if (node.children) { for (const c of node.children) { const r = findNode(id, c); if (r) return r; } }
  return null;
}
function findParent(id, node) {
  if (!node) node = bomData;
  if (node.children) { for (const c of node.children) { if (c.id === id) return node; const r = findParent(id, c); if (r) return r; } }
  return null;
}


function updateStatusBar() {
  rebuildFlat();
  document.getElementById('sbMaterials').innerHTML = '物料总计: <b style="color:var(--text-secondary)">'+materialsFlat.length+' 种</b>';
  document.getElementById('sbUpdate').textContent = '最后更新: ' + nowStr();
}

// ===== BOM TREE =====
let treeSearchTerm = '';
let expandedNodeIds = new Set();
function saveTreeState() {
  expandedNodeIds.clear();
  document.querySelectorAll('.tree-children.open').forEach(function(el) {
    var parent = el.closest('.tree-node');
    if (parent && parent.dataset.nodeId) expandedNodeIds.add(parent.dataset.nodeId);
  });
}
function restoreTreeState() {
  expandedNodeIds.forEach(function(id) {
    var node = document.querySelector('.tree-node[data-node-id="'+id+'"]');
    if (!node) return;
    var children = node.querySelector(':scope > .tree-children');
    var arrow = node.querySelector(':scope > .tree-row > .tree-arrow');
    if (children) children.classList.add('open');
    if (arrow) arrow.classList.add('expanded');
  });
}
function renderTree() {
  saveTreeState();
  const container = document.getElementById('bomTree');
  container.innerHTML = '';
  container.appendChild(buildTreeNode(bomData, 0));
  restoreTreeState();
  updateTreeStats();
  renderPinBoard();
}
function buildTreeNode(node, depth) {
  const div = document.createElement('div');
  div.className = 'tree-node';
  div.dataset.nodeId = node.id;
  const hasChildren = node.children && node.children.length > 0;
  const shouldOpen = treeSearchTerm ? nodeMatchesSearch(node) : depth < 1;
  const row = document.createElement('div');
  row.className = 'tree-row' + (node.id === selectedNodeId ? ' selected' : '');
  row.style.paddingLeft = (12 + depth * 20) + 'px';
  const arrow = document.createElement('span');
  arrow.className = 'tree-arrow' + (hasChildren ? (shouldOpen ? ' expanded' : '') : ' empty');
  arrow.textContent = '▶';
  const icon = document.createElement('span');
  icon.className = 'tree-icon';
  icon.textContent = node.icon || '📄';
  const label = document.createElement('span');
  label.className = 'tree-label';
  if (treeSearchTerm && node.name.toLowerCase().includes(treeSearchTerm.toLowerCase())) {
    const idx = node.name.toLowerCase().indexOf(treeSearchTerm.toLowerCase());
    label.innerHTML = node.name.slice(0,idx)+'<span class="highlight">'+node.name.slice(idx,idx+treeSearchTerm.length)+'</span>'+node.name.slice(idx+treeSearchTerm.length);
  } else { label.textContent = node.name; }
  const qty = document.createElement('span');
  qty.className = 'tree-qty';
  qty.textContent = node.qty > 1 ? '×' + node.qty : '';
  row.appendChild(arrow);row.appendChild(icon);row.appendChild(label);row.appendChild(qty);
  div.appendChild(row);
  if (hasChildren) {
    const childContainer = document.createElement('div');
    childContainer.className = 'tree-children' + (shouldOpen ? ' open' : '');
    node.children.forEach(c => childContainer.appendChild(buildTreeNode(c, depth + 1)));
    div.appendChild(childContainer);
    arrow.addEventListener('click', e => { e.stopPropagation(); childContainer.classList.toggle('open'); arrow.classList.toggle('expanded'); });
  }
  row.addEventListener('click', () => {
    selectedNodeId = node.id;
    document.querySelectorAll('.tree-row').forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
    showDetail(node);
  });
  row.addEventListener('dblclick', () => {
    ctxNode = node; ctxAction('edit');
  });
  row.addEventListener('contextmenu', e => { e.preventDefault(); ctxNode = node; ctxTreeNodeEl = div; showContextMenu(e.clientX, e.clientY); });
  return div;
}
function nodeMatchesSearch(node) {
  if (!treeSearchTerm) return false;
  const s = treeSearchTerm.toLowerCase();
  if (node.name.toLowerCase().includes(s) || node.id.toLowerCase().includes(s)) return true;
  if (node.children) return node.children.some(c => nodeMatchesSearch(c));
  return false;
}
function showDetail(node) {
  const grid = document.getElementById('detailGrid');
  document.getElementById('detailTitle').textContent = node.icon + ' ' + node.name;
  const fields = [
    ['物料编号', node.id], ['物料名称', node.name], ['规格型号', node.spec], ['单位', node.unit],
    ['用量', node.qty], ['层级', 'Level ' + node.level], ['供应商', node.supplier],
    ['单价', '¥ ' + node.price.toFixed(2)],
    ['状态', `<span class="badge ${node.status==='有效'?'badge-green':node.status==='停用'?'badge-red':'badge-yellow'}">${node.status}</span>`],
    ['版本', 'V2.0 (当前)'], ['创建时间', '2024-10-15'], ['最后修改', todayStr()]
  ];
  grid.innerHTML = fields.map(f => `<div class="detail-field"><span class="label">${f[0]}</span><span class="value">${f[1]}</span></div>`).join('');
  updateCostSummary(node);
  renderNodeInsights(node);
  updatePinButton(node);
}
function expandAll() { document.querySelectorAll('.tree-children').forEach(c => c.classList.add('open')); document.querySelectorAll('.tree-arrow:not(.empty)').forEach(a => a.classList.add('expanded')); }
function collapseAll() { document.querySelectorAll('.tree-children').forEach(c => c.classList.remove('open')); document.querySelectorAll('.tree-arrow').forEach(a => a.classList.remove('expanded')); }
function editSelectedNode() { const node = findNode(selectedNodeId); if (node) { ctxNode = node; ctxAction('edit'); } }
function addChildToSelected() { const node = findNode(selectedNodeId); if (node) { ctxNode = node; ctxAction('addChild'); } }

function computeNodeCost(node) {
  const self = (node.price || 0) * (node.qty || 1);
  let children = 0;
  if (node.children && node.children.length) {
    node.children.forEach(child => { children += computeNodeCost(child).total; });
  }
  return {self, children, total: self + children};
}

function formatCurrency(val) {
  return '¥ ' + (val || 0).toFixed(2);
}

function updateCostSummary(node) {
  const costGrid = document.getElementById('detailCostGrid');
  if (!costGrid || !node) return;
  const cost = computeNodeCost(node);
  const childCost = Math.max(cost.total - cost.self, 0);
  costGrid.innerHTML = `
    <div class="detail-cost-item"><span class="label">直接物料成本</span><span class="value">${formatCurrency(cost.self)}</span></div>
    <div class="detail-cost-item"><span class="label">子组件成本</span><span class="value">${formatCurrency(childCost)}</span></div>
    <div class="detail-cost-item"><span class="label">总成本</span><span class="value" style="color:var(--accent)">${formatCurrency(cost.total)}</span></div>
  `;
}

function calcSubtreeStats(node) {
  const stats = {nodes:0, leaves:0, risk:0, pending:0, totalCost:0, suppliers:new Map()};
  (function walk(n) {
    stats.nodes++;
    const hasChildren = n.children && n.children.length;
    if (!hasChildren) stats.leaves++;
    if (n.status && n.status !== '有效') stats.risk++;
    if (n.status === '待审') stats.pending++;
    stats.totalCost += (n.price || 0) * (n.qty || 1);
    const sup = n.supplier || '—';
    stats.suppliers.set(sup, (stats.suppliers.get(sup) || 0) + 1);
    if (hasChildren) n.children.forEach(walk);
  })(node);
  const supplierEntries = [...stats.suppliers.entries()];
  const singleSource = supplierEntries.filter(([,count]) => count === 1).length;
  return {
    ...stats,
    uniqueSuppliers: supplierEntries.length,
    singleSource,
    avgCost: stats.nodes ? stats.totalCost / stats.nodes : 0
  };
}

function renderNodeInsights(node) {
  const grid = document.getElementById('nodeInsightGrid');
  if (!grid || !node) return;
  const stats = calcSubtreeStats(node);
  grid.innerHTML = `
    <div class="detail-cost-item"><span class="label">覆盖节点</span><span class="value">${stats.nodes}</span></div>
    <div class="detail-cost-item"><span class="label">叶子节点</span><span class="value">${stats.leaves}</span></div>
    <div class="detail-cost-item"><span class="label">风险物料</span><span class="value">${stats.risk}</span></div>
    <div class="detail-cost-item"><span class="label">待审批</span><span class="value">${stats.pending}</span></div>
    <div class="detail-cost-item"><span class="label">供应商数</span><span class="value">${stats.uniqueSuppliers}</span></div>
    <div class="detail-cost-item"><span class="label">单一供应商</span><span class="value">${stats.singleSource}</span></div>
    <div class="detail-cost-item"><span class="label">均摊成本</span><span class="value">${formatCurrency(stats.avgCost)}</span></div>
  `;
}

function persistPinnedNodes() {
  try { localStorage.setItem('bom_node_pins', JSON.stringify([...pinnedNodeIds])); } catch(e) {}
}
function updatePinButton(node) {
  const btn = document.getElementById('pinNodeBtn');
  if (!btn || !node) return;
  const pinned = pinnedNodeIds.has(node.id);
  btn.textContent = pinned ? '📍 已关注' : '📌 关注节点';
  btn.classList.toggle('fav-active', pinned);
}
function togglePinNode() {
  const node = findNode(selectedNodeId);
  if (!node) return;
  const pinned = pinnedNodeIds.has(node.id);
  if (pinned) {
    pinnedNodeIds.delete(node.id);
    showToast('已取消关注 ' + node.name, 'info');
  } else {
    pinnedNodeIds.add(node.id);
    showToast('已关注节点 ' + node.name, 'success');
  }
  persistPinnedNodes();
  updatePinButton(node);
  renderPinBoard();
}
function removePinnedNode(id) {
  if (!pinnedNodeIds.has(id)) return;
  pinnedNodeIds.delete(id);
  persistPinnedNodes();
  renderPinBoard();
  if (selectedNodeId === id) updatePinButton(findNode(id) || bomData);
}
function focusPinnedNode(id) {
  const node = findNode(id);
  if (!node) {
    removePinnedNode(id);
    return;
  }
  navigateTo('bom');
  selectedNodeId = id;
  renderTree();
  showDetail(node);
}
function renderPinBoard() {
  const list = document.getElementById('pinList');
  if (!list) return;
  if (!pinnedNodeIds.size) {
    list.innerHTML = '<div class="pin-empty"><span class="pin-empty-icon">📌</span><div>暂无关注节点，选中节点后点击“关注”即可快速跳转。</div></div>';
    return;
  }
  let mutated = false;
  const html = Array.from(pinnedNodeIds).map(id => {
    const node = findNode(id);
    if (!node) {
      pinnedNodeIds.delete(id);
      mutated = true;
      return '';
    }
    return '<div class="pin-item" onclick="focusPinnedNode(\''+id+'\')"><div class="pin-meta"><span class="pin-icon">'+(node.icon||'📄')+'</span><span>'+node.name+'</span></div><button class="pin-remove" onclick="event.stopPropagation();removePinnedNode(\''+id+'\')">✕</button></div>';
  }).join('');
  if (mutated) persistPinnedNodes();
  list.innerHTML = html || '<div class="pin-empty"><span class="pin-empty-icon">📌</span><div>暂无关注节点</div></div>';
}


function exportCurrentBOM() {
  const node = findNode(selectedNodeId);
  if (!node) return;
  const lines = [];
  (function walk(n, depth) {
    const indent = '  '.repeat(depth);
    lines.push(`${indent}- ${n.id} | ${n.name} | ×${n.qty}`);
    if (n.children) n.children.forEach(child => walk(child, depth + 1));
  })(node, 0);
  const blob = new Blob([lines.join('\n')], {type:'text/plain;charset=utf-8'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `BOM_${node.id}_${todayStr()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('BOM 导出完成', 'success');
}

function updateTreeStats() {
  const statsEl = document.getElementById('treeStats');
  if (!statsEl) return;
  const stats = {nodes:0, leaves:0, maxLevel:0};
  (function walk(node) {
    stats.nodes++;
    const lvl = node.level || 0;
    if (lvl > stats.maxLevel) stats.maxLevel = lvl;
    if (node.children && node.children.length) node.children.forEach(walk);
    else stats.leaves++;
  })(bomData);
  statsEl.innerHTML = `<span>节点数 <b>${stats.nodes}</b></span><span>层级 <b>${stats.maxLevel + 1}</b></span><span>叶子 <b>${stats.leaves}</b></span>`;
}

// Tree search
document.getElementById('treeSearch').addEventListener('input', e => { treeSearchTerm = e.target.value; renderTree(); });

// ===== CONTEXT MENU =====
function showContextMenu(x, y) {
  const menu = document.getElementById('contextMenu');
  menu.style.left = Math.min(x, window.innerWidth - 200) + 'px';
  menu.style.top = Math.min(y, window.innerHeight - 250) + 'px';
  menu.classList.add('show');
}
function hideContextMenu() { document.getElementById('contextMenu').classList.remove('show'); }
document.addEventListener('click', hideContextMenu);

function ctxAction(action) {
  hideContextMenu();
  if (!ctxNode) return;
  if (action === 'addChild') {
    populateAllEnumSelects();
    document.getElementById('nodeModalTitle').textContent = '新增子项 - ' + ctxNode.name;
    document.getElementById('nodeEditMode').value = 'add';
    ['nodeFormId','nodeFormName','nodeFormSpec','nodeFormSupplier','nodeFormIcon'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('nodeFormQty').value = '1';
    document.getElementById('nodeFormPrice').value = '';
    document.getElementById('nodeFormUnit').value = '个';
    document.getElementById('nodeFormStatus').value = '有效';
    showModal('nodeModal');
  } else if (action === 'edit') {
    populateAllEnumSelects();
    document.getElementById('nodeModalTitle').textContent = '编辑 - ' + ctxNode.name;
    document.getElementById('nodeEditMode').value = 'edit';
    document.getElementById('nodeFormId').value = ctxNode.id;
    document.getElementById('nodeFormName').value = ctxNode.name;
    document.getElementById('nodeFormSpec').value = ctxNode.spec;
    document.getElementById('nodeFormUnit').value = ctxNode.unit;
    document.getElementById('nodeFormQty').value = ctxNode.qty;
    document.getElementById('nodeFormPrice').value = ctxNode.price;
    document.getElementById('nodeFormSupplier').value = ctxNode.supplier;
    document.getElementById('nodeFormStatus').value = ctxNode.status;
    document.getElementById('nodeFormIcon').value = ctxNode.icon || '';
    showModal('nodeModal');
  } else if (action === 'delete') {
    if (ctxNode.id === bomData.id) return;
    showConfirm('确定删除物料 "' + ctxNode.name + '" 吗？其所有子项也将被删除。', () => {
      const parent = findParent(ctxNode.id);
      if (parent && parent.children) { parent.children = parent.children.filter(c => c.id !== ctxNode.id); }
      rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
      if (selectedNodeId === ctxNode.id) { selectedNodeId = bomData.id; showDetail(bomData); }
    });
  } else if (action === 'copy') {
    navigator.clipboard.writeText(ctxNode.id).then(function() {
      showToast('已复制物料编号: ' + ctxNode.id, 'success');
    }).catch(function() {
      showToast('复制失败，请手动复制: ' + ctxNode.id, 'error');
    });
  } else if (action === 'expandChildren') {
    if (ctxTreeNodeEl) ctxTreeNodeEl.querySelectorAll('.tree-children').forEach(c => c.classList.add('open'));
    if (ctxTreeNodeEl) ctxTreeNodeEl.querySelectorAll('.tree-arrow:not(.empty)').forEach(a => a.classList.add('expanded'));
  } else if (action === 'collapseChildren') {
    if (ctxTreeNodeEl) ctxTreeNodeEl.querySelectorAll('.tree-children').forEach(c => c.classList.remove('open'));
    if (ctxTreeNodeEl) ctxTreeNodeEl.querySelectorAll('.tree-arrow').forEach(a => a.classList.remove('expanded'));
  } else if (action === 'clone') {
    if (ctxNode) cloneNode(ctxNode.id);
  }
}
function saveNode() {
  const mode = document.getElementById('nodeEditMode').value;
  const data = {
    id: document.getElementById('nodeFormId').value.trim(),
    name: document.getElementById('nodeFormName').value.trim(),
    spec: document.getElementById('nodeFormSpec').value.trim(),
    unit: document.getElementById('nodeFormUnit').value.trim(),
    qty: parseInt(document.getElementById('nodeFormQty').value) || 1,
    price: parseFloat(document.getElementById('nodeFormPrice').value) || 0,
    supplier: document.getElementById('nodeFormSupplier').value.trim() || '—',
    status: document.getElementById('nodeFormStatus').value,
    icon: document.getElementById('nodeFormIcon').value.trim() || '📄'
  };
  if (!data.id || !data.name) return;
  if (mode === 'add') {
    data.level = (ctxNode.level || 0) + 1;
    if (!ctxNode.children) ctxNode.children = [];
    ctxNode.children.push(data);
    expandedNodeIds.add(ctxNode.id);
  } else {
    Object.assign(ctxNode, data);
  }
  hideModal('nodeModal');
  rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
  showDetail(findNode(selectedNodeId) || bomData);
  showToast(mode === 'add' ? '子项 "'+data.name+'" 已添加' : '"'+data.name+'" 已更新', 'success');
}

// ===== MATERIALS TABLE (Enhanced) =====
let matSortField = null, matSortAsc = true, matPage = 1, matPageSize = 20;
const categoryNames = {R:'电阻',C:'电容',IC:'芯片',L:'电感',D:'二极管',LED:'LED',X:'晶振',CN:'连接器',PCB:'PCB',CASE:'机壳',LCD:'显示',BAT:'电池',RF:'射频',PWR:'电源',SEN:'传感器',PKG:'包装'};
function getCategory(id) { const p = id.split('-')[0]; return categoryNames[p] || p; }
function buildFilterDropdowns() {
  const cats = [...new Set(materialsFlat.map(m => getCategory(m.id)))].sort();
  const sups = [...new Set(materialsFlat.map(m => m.supplier))].sort();
  const catSel = document.getElementById('matCategoryFilter');
  const supSel = document.getElementById('matSupplierFilter');
  const statusSel = document.getElementById('matFilter');
  if (catSel) catSel.innerHTML = '<option value="all">全部分类</option>' + cats.map(c => '<option value="'+c+'">'+c+'</option>').join('');
  if (supSel) supSel.innerHTML = '<option value="all">全部供应商</option>' + sups.map(s => '<option value="'+s+'">'+s+'</option>').join('');
  if (statusSel) statusSel.innerHTML = '<option value="all">全部状态</option>' + (enumConfig.status?.items || []).map(s => '<option value="'+s+'">'+s+'</option>').join('');
}
function getFilteredMaterials() {
  const filter = document.getElementById('matFilter')?.value || 'all';
  const search = (document.getElementById('matSearch')?.value || '').toLowerCase();
  const cat = document.getElementById('matCategoryFilter')?.value || 'all';
  const sup = document.getElementById('matSupplierFilter')?.value || 'all';
  let data = materialsFlat.slice();
  if (filter !== 'all') data = data.filter(m => m.status === filter);
  if (cat !== 'all') data = data.filter(m => getCategory(m.id) === cat);
  if (sup !== 'all') data = data.filter(m => m.supplier === sup);
  if (search) data = data.filter(m => m.id.toLowerCase().includes(search) || m.name.toLowerCase().includes(search) || m.supplier.toLowerCase().includes(search));
  if (showFavoriteOnly) data = data.filter(m => favoriteMaterials.has(m.id));
  if (matSortField) {
    data.sort((a,b) => {
      let va, vb;
      if (matSortField === 'subtotal') { va = a.price*a.qty; vb = b.price*b.qty; }
      else { va = a[matSortField]; vb = b[matSortField]; }
      if (typeof va === 'string') return matSortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      return matSortAsc ? va - vb : vb - va;
    });
  }
  return data;
}
function renderMaterials() {
  const data = getFilteredMaterials();
  updateFavToggleButton();
  const totalCost = data.reduce((s,m) => s + m.price*m.qty, 0);
  const totalPages = Math.max(1, Math.ceil(data.length / matPageSize));
  if (matPage > totalPages) matPage = totalPages;
  const start = (matPage - 1) * matPageSize;
  const pageData = data.slice(start, start + matPageSize);
  const tbody = document.getElementById('matBody');
  tbody.innerHTML = pageData.map((m, i) => {
    const sub = m.price * m.qty;
    const cls = m.status==='有效'?'badge-green':m.status==='停用'?'badge-red':'badge-yellow';
    const checked = selectedMatIds.has(m.id) ? 'checked' : '';
    const rowCls = selectedMatIds.has(m.id) ? ' class="selected-row"' : '';
    const cat = getCategory(m.id);
    const fav = favoriteMaterials.has(m.id);
    const star = '<button class="star-btn'+(fav?' active':'')+'" onclick="event.stopPropagation();toggleFavorite(\''+m.id+'\')" title="'+(fav?'取消收藏':'收藏该物料')+'">'+(fav?'★':'☆')+'</button>';
    return '<tr'+rowCls+' ondblclick="editMaterial(\''+m.id+'\')"><td><input type="checkbox" '+checked+' onchange="toggleMatSelect(\''+m.id+'\',this.checked)" /></td><td class="star-cell">'+star+'</td><td>'+(start+i+1)+'</td><td style="color:var(--accent);font-weight:500;cursor:pointer" onclick="showMatDetail(\''+m.id+'\')">'+m.id+'</td><td style="cursor:pointer" onclick="showMatDetail(\''+m.id+'\')">'+m.name+'</td><td><span class="badge badge-purple">'+cat+'</span></td><td style="color:var(--text-secondary)">'+m.spec+'</td><td>'+m.unit+'</td><td class="text-right">'+m.qty+'</td><td>'+m.supplier+'</td><td class="text-right">'+m.price.toFixed(2)+'</td><td class="text-right" style="font-weight:500">'+sub.toFixed(2)+'</td><td><span class="badge '+cls+'" title="'+m.status+'">'+m.status+'</span></td><td><button class="btn btn-ghost btn-xs" onclick="showMatDetail(\''+m.id+'\')" title="查看详情">👁</button><button class="btn btn-ghost btn-xs" onclick="editMaterial(\''+m.id+'\')" title="编辑">✏️</button><button class="btn btn-ghost btn-xs" onclick="deleteMaterial(\''+m.id+'\')" title="删除">🗑</button></td></tr>';
  }).join('');
  document.getElementById('matSummary').textContent = '共 '+data.length+' 种物料（显示 '+(start+1)+'-'+Math.min(start+matPageSize, data.length)+'）';
  document.getElementById('matCost').textContent = '总成本: ¥ '+totalCost.toFixed(2);
  document.getElementById('pageInfo').textContent = '第 '+matPage+' / '+totalPages+' 页';
  document.getElementById('prevPage').disabled = matPage <= 1;
  document.getElementById('nextPage').disabled = matPage >= totalPages;
  updateBatchBar();
  renderMatStats(data, totalCost);
  renderBomHealth();
}
function renderMatStats(data, totalCost) {
  const el = document.getElementById('matStatCards');
  if (!el) return;
  const active = data.filter(m => m.status==='有效').length;
  const pending = data.filter(m => m.status==='待审').length;
  const stopped = data.filter(m => m.status==='停用').length;
  const avgPrice = data.length ? (totalCost / data.reduce((s,m) => s+m.qty, 0)).toFixed(2) : '0.00';
  el.innerHTML = '<div class="stat-card"><div class="stat-num" style="color:var(--accent)">'+data.length+'</div><div class="stat-label">物料总数</div></div><div class="stat-card"><div class="stat-num" style="color:var(--green)">'+active+'</div><div class="stat-label">有效</div></div><div class="stat-card"><div class="stat-num" style="color:var(--yellow)">'+pending+'</div><div class="stat-label">待审</div></div><div class="stat-card"><div class="stat-num" style="color:var(--red)">'+stopped+'</div><div class="stat-label">停用</div></div><div class="stat-card"><div class="stat-num" style="color:var(--blue)">¥'+totalCost.toFixed(0)+'</div><div class="stat-label">总成本</div></div><div class="stat-card"><div class="stat-num" style="color:var(--orange)">¥'+avgPrice+'</div><div class="stat-label">均价</div></div>';
}

function renderBomHealth() {
  const el = document.getElementById('healthList');
  if (!el) return;
  const inactive = materialsFlat.filter(m => m.status === '停用');
  const pending = materialsFlat.filter(m => m.status === '待审');
  const supplierCount = {};
  materialsFlat.forEach(m => {
    if (!m.supplier || m.supplier === '—') return;
    supplierCount[m.supplier] = (supplierCount[m.supplier] || 0) + 1;
  });
  const risk = materialsFlat.filter(m => m.status === '有效' && m.supplier && m.supplier !== '—' && supplierCount[m.supplier] === 1).slice(0,3);
  const formatList = list => list.length ? list.map(m => m.name).slice(0,3).join('、') : '暂无';
  el.innerHTML = `
    <div class="health-item"><span>停用物料</span><span><span class="badge badge-red">${inactive.length}</span>${formatList(inactive)}</span></div>
    <div class="health-item"><span>待审物料</span><span><span class="badge badge-yellow">${pending.length}</span>${formatList(pending)}</span></div>
    <div class="health-item"><span>单一供应商风险</span><span><span class="badge badge-purple">${risk.length}</span>${formatList(risk)}</span></div>
  `;
}
function sortMaterials(field) {
  if (matSortField === field) matSortAsc = !matSortAsc;
  else { matSortField = field; matSortAsc = true; }
  matPage = 1;
  renderMaterials();
  updateSortIndicators();
}
function changePage(delta) { matPage += delta; renderMaterials(); }
function changePageSize() { matPageSize = parseInt(document.getElementById('pageSizeSelect').value); matPage = 1; renderMaterials(); }
function showMatDetail(id) {
  const m = findNode(id);
  if (!m) return;
  const cat = getCategory(m.id);
  const parent = findParent(m.id);
  const parentName = parent ? parent.name : '—';
  const subtotal = (m.price * m.qty).toFixed(2);
  const cls = m.status==='有效'?'badge-green':m.status==='停用'?'badge-red':'badge-yellow';
  const leadTime = Math.floor(Math.random()*14+3);
  const moq = Math.max(1, m.qty * 10);
  document.getElementById('matDetailTitle').textContent = m.icon + ' ' + m.name;
  const baseHtml = `
    <div class="detail-grid">
      <div class="detail-field"><span class="label">物料编号</span><span class="value" style="color:var(--accent);font-weight:500">${m.id}</span></div>
      <div class="detail-field"><span class="label">物料名称</span><span class="value">${m.name}</span></div>
      <div class="detail-field"><span class="label">分类</span><span class="value"><span class="badge badge-purple">${cat}</span></span></div>
      <div class="detail-field"><span class="label">所属组件</span><span class="value">${parentName}</span></div>
      <div class="detail-field"><span class="label">规格型号</span><span class="value">${m.spec}</span></div>
      <div class="detail-field"><span class="label">单位</span><span class="value">${m.unit}</span></div>
      <div class="detail-field"><span class="label">用量</span><span class="value">${m.qty}</span></div>
      <div class="detail-field"><span class="label">单价</span><span class="value">¥ ${m.price.toFixed(2)}</span></div>
      <div class="detail-field"><span class="label">小计</span><span class="value" style="font-weight:600">¥ ${subtotal}</span></div>
      <div class="detail-field"><span class="label">状态</span><span class="value"><span class="badge ${cls}">${m.status}</span></span></div>
      <div class="detail-field"><span class="label">供应商</span><span class="value">${m.supplier}</span></div>
      <div class="detail-field"><span class="label">层级</span><span class="value">Level ${m.level}</span></div>
    </div>
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">
      <h4 style="font-size:13px;font-weight:600;margin-bottom:12px">📦 供应商信息</h4>
      <div class="detail-grid">
        <div class="detail-field"><span class="label">供应商名称</span><span class="value">${m.supplier}</span></div>
        <div class="detail-field"><span class="label">供货周期</span><span class="value">${leadTime} 天</span></div>
        <div class="detail-field"><span class="label">最小起订量</span><span class="value">${moq} ${m.unit}</span></div>
        <div class="detail-field"><span class="label">质量等级</span><span class="value">A</span></div>
      </div>
    </div>
  `;
  const subs = substituteMap[m.id] || [];
  const subsHtml = subs.length
    ? subs.map(s => `<span class="substitute-pill">${s.id} · ${s.name}（${s.supplier}）</span>`).join('')
    : '<span class="badge badge-gray">暂无推荐</span>';
  document.getElementById('matDetailBody').innerHTML = baseHtml + `<div class="substitute-list"><h4>🔁 替代物料</h4>${subsHtml}</div>`;
  document.getElementById('matDetailEditBtn').onclick = function() { hideModal('matDetailModal'); editMaterial(id); };
  document.getElementById('matDetailWhereUsedBtn').onclick = function() { hideModal('matDetailModal'); showWhereUsed(id); };
  document.getElementById('matDetailSubBtn').onclick = function() { hideModal('matDetailModal'); editSubstitutes(id); };
  showModal('matDetailModal');
}
function toggleMatSelect(id, checked) { if (checked) selectedMatIds.add(id); else selectedMatIds.delete(id); renderMaterials(); }
function toggleSelectAll() { const all = document.getElementById('selectAll').checked; const data = getFilteredMaterials(); data.forEach(m => { if (all) selectedMatIds.add(m.id); else selectedMatIds.delete(m.id); }); renderMaterials(); }
function clearSelection() { selectedMatIds.clear(); document.getElementById('selectAll').checked = false; renderMaterials(); }
function updateBatchBar() {
  const bar = document.getElementById('batchBar');
  if (selectedMatIds.size > 0) { bar.style.display = 'flex'; document.getElementById('batchCount').textContent = '已选 ' + selectedMatIds.size + ' 项'; }
  else { bar.style.display = 'none'; }
}
function showMaterialModal(editId) {
  populateAllEnumSelects();
  document.getElementById('materialModalTitle').textContent = editId ? '编辑物料' : '新增物料';
  document.getElementById('matEditId').value = editId || '';
  if (editId) {
    const m = materialsFlat.find(x => x.id === editId);
    if (m) { document.getElementById('matFormId').value=m.id; document.getElementById('matFormName').value=m.name; document.getElementById('matFormSpec').value=m.spec; document.getElementById('matFormUnit').value=m.unit; document.getElementById('matFormQty').value=m.qty; document.getElementById('matFormPrice').value=m.price; document.getElementById('matFormSupplier').value=m.supplier; document.getElementById('matFormStatus').value=m.status; document.getElementById('matFormIcon').value=m.icon||''; document.getElementById('matFormGrade').value=m.grade||''; document.getElementById('matFormStorage').value=m.storage||''; }
  } else {
    ['matFormId','matFormName','matFormSpec','matFormSupplier','matFormIcon'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('matFormQty').value = '1'; document.getElementById('matFormPrice').value = ''; document.getElementById('matFormStatus').value = '有效'; document.getElementById('matFormUnit').value = '个'; document.getElementById('matFormGrade').value = ''; document.getElementById('matFormStorage').value = '';
  }
  showModal('materialModal');
}
function editMaterial(id) { showMaterialModal(id); }
function saveMaterial() {
  const editId = document.getElementById('matEditId').value;
  const data = {
    id: document.getElementById('matFormId').value.trim(), name: document.getElementById('matFormName').value.trim(),
    spec: document.getElementById('matFormSpec').value.trim(), unit: document.getElementById('matFormUnit').value.trim(),
    qty: parseInt(document.getElementById('matFormQty').value)||1, price: parseFloat(document.getElementById('matFormPrice').value)||0,
    supplier: document.getElementById('matFormSupplier').value.trim()||'—', status: document.getElementById('matFormStatus').value,
    icon: document.getElementById('matFormIcon').value.trim()||'📄',
    grade: document.getElementById('matFormGrade').value, storage: document.getElementById('matFormStorage').value
  };
  if (!data.id || !data.name) return;
  if (editId) {
    const node = findNode(editId);
    if (node) Object.assign(node, data);
  } else {
    data.level = 2;
    if (bomData.children && bomData.children[0]) {
      if (!bomData.children[0].children) bomData.children[0].children = [];
      bomData.children[0].children.push(data);
    }
  }
  hideModal('materialModal');
  rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar(); updateNavBadges();
  showToast('物料保存成功', 'success');
}
function deleteMaterial(id) {
  const m = findNode(id);
  if (!m) return;
  showConfirm('确定删除物料 "' + m.name + '" 吗？', () => {
    const parent = findParent(id);
    if (parent && parent.children) parent.children = parent.children.filter(c => c.id !== id);
    selectedMatIds.delete(id);
    rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar(); updateNavBadges();
    showToast('物料已删除', 'info');
  });
}
function batchDelete() {
  if (selectedMatIds.size === 0) return;
  showConfirm('确定删除选中的 ' + selectedMatIds.size + ' 个物料吗？', () => {
    selectedMatIds.forEach(id => { const parent = findParent(id); if (parent && parent.children) parent.children = parent.children.filter(c => c.id !== id); });
    selectedMatIds.clear();
    rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
  });
}
document.getElementById('batchStatus').addEventListener('change', function() {
  if (!this.value || selectedMatIds.size === 0) return;
  const count = selectedMatIds.size;
  const newStatus = this.value;
  selectedMatIds.forEach(id => { const node = findNode(id); if (node) node.status = newStatus; });
  this.value = '';
  rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
  showToast('已更新 ' + count + ' 项物料状态为「' + newStatus + '」', 'success');
});

// ===== VERSIONS =====
function renderVersions() {
  const list = document.getElementById('versionList');
  list.innerHTML = versions.map((v, i) => `
    <div class="version-card${v.status==='当前'?' current':''}" onclick="viewVersion('${v.ver}')" style="cursor:pointer">
      <div class="version-num" style="${v.status==='当前'?'color:var(--accent)':''}">${v.ver}</div>
      <div class="version-info"><div class="desc">${v.desc}</div><div class="meta"><span>${v.creator}</span><span>${v.date}</span></div></div>
      <span class="badge ${v.statusClass}">${v.status}</span>
      <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showCompare('${v.ver}')" style="${v.status==='当前'?'color:var(--accent)':''}">对比</button>
      ${v.status!=='当前'?'<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();viewVersion(\''+v.ver+'\')">查看</button>':''}
      ${v.status!=='当前'?'<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();rollbackVersion(\''+v.ver+'\')" title="回滚到此版本">↩ 回滚</button>':''}
    </div>
  `).join('');
}
function viewVersion(ver) {
  const v = versions.find(x => x.ver === ver);
  if (!v) return;
  const verIdx = versions.indexOf(v);
  const matCount = materialsFlat.length - (verIdx * 5);
  const compCount = (bomData.children ? bomData.children.length : 0) - Math.min(verIdx, 4);
  document.getElementById('versionViewTitle').textContent = '版本详情 — ' + v.ver;
  document.getElementById('versionViewBody').innerHTML = `
    <div class="detail-grid">
      <div class="detail-field"><span class="label">版本号</span><span class="value" style="font-weight:600;color:var(--accent)">${v.ver}</span></div>
      <div class="detail-field"><span class="label">状态</span><span class="value"><span class="badge ${v.statusClass}">${v.status}</span></span></div>
      <div class="detail-field"><span class="label">创建人</span><span class="value">${v.creator}</span></div>
      <div class="detail-field"><span class="label">创建日期</span><span class="value">${v.date}</span></div>
    </div>
    <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
      <div class="detail-field"><span class="label">变更说明</span><span class="value" style="line-height:1.5">${v.desc}</span></div>
    </div>
    <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">
      <h4 style="font-size:13px;font-weight:600;margin-bottom:10px">📊 版本快照</h4>
      <div class="stat-cards" style="margin-bottom:0">
        <div class="stat-card"><div class="stat-num" style="color:var(--accent)">${Math.max(matCount, 10)}</div><div class="stat-label">物料数</div></div>
        <div class="stat-card"><div class="stat-num" style="color:var(--green)">${Math.max(compCount, 2)}</div><div class="stat-label">组件数</div></div>
        <div class="stat-card"><div class="stat-num" style="color:var(--blue)">${v.ver.replace('V','').split('.').length + 1}</div><div class="stat-label">BOM层级</div></div>
      </div>
    </div>
  `;
  document.getElementById('versionViewCompareBtn').onclick = function() { hideModal('versionViewModal'); showCompare(ver); };
  showModal('versionViewModal');
}
function createVersion() {
  const ver = document.getElementById('verFormNum').value.trim();
  const desc = document.getElementById('verFormDesc').value.trim();
  if (!ver) { showToast('请输入版本号', 'error'); return; }
  if (!desc) { showToast('请输入变更说明', 'error'); return; }
  if (versions.find(v => v.ver === ver)) { showToast('版本号 '+ver+' 已存在', 'error'); return; }
  const creator = currentUser ? currentUser.name : '张工';
  versions.forEach(v => { if (v.status === '当前') { v.status = '历史'; v.statusClass = 'badge-gray'; } });
  versions.unshift({ ver, creator: creator, date: todayStr(), desc: desc, status: '当前', statusClass: 'badge-green' });
  hideModal('versionModal');
  renderVersions();
  showToast('版本 ' + ver + ' 已创建', 'success');
}

// ===== VERSION COMPARE =====
function showCompare(ver) {
  const selFrom = document.getElementById('cmpFrom');
  const selTo = document.getElementById('cmpTo');
  selFrom.innerHTML = selTo.innerHTML = versions.map(v => `<option value="${v.ver}">${v.ver}</option>`).join('');
  const idx = versions.findIndex(v => v.ver === ver);
  if (idx >= 0 && idx + 1 < versions.length) { selFrom.value = versions[idx + 1].ver; selTo.value = ver; }
  else { selFrom.value = versions[1]?.ver || versions[0].ver; selTo.value = ver; }
  runCompare();
  showModal('compareModal');
}
function runCompare() {
  const from = document.getElementById('cmpTo').value;
  const to = document.getElementById('cmpFrom').value;
  const key = from + '_' + to;
  const diff = versionDiffs[key];
  const result = document.getElementById('compareResult');
  if (!diff) {
    result.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted)">暂无 ' + to + ' → ' + from + ' 的对比数据</div>';
    return;
  }
  let html = '<div style="display:flex;gap:12px;margin-bottom:16px"><span class="badge badge-green">新增 '+diff.added.length+'</span><span class="badge badge-red">删除 '+diff.removed.length+'</span><span class="badge badge-yellow">修改 '+diff.modified.length+'</span></div>';
  html += '<table class="diff-table"><thead><tr><th>变更类型</th><th>物料编号</th><th>物料名称</th><th>详情</th></tr></thead><tbody>';
  diff.added.forEach(a => { html += `<tr class="diff-added"><td><span class="badge badge-green">新增</span></td><td>${a.id}</td><td>${a.name}</td><td>${a.spec}</td></tr>`; });
  diff.removed.forEach(r => { html += `<tr class="diff-removed"><td><span class="badge badge-red">删除</span></td><td>${r.id}</td><td>${r.name}</td><td>${r.spec||''}</td></tr>`; });
  diff.modified.forEach(m => { html += `<tr class="diff-modified"><td><span class="badge badge-yellow">修改</span></td><td>${m.id}</td><td>${m.name}</td><td>${m.field}: <del style="color:var(--red)">${m.oldVal}</del> → <b style="color:var(--green)">${m.newVal}</b></td></tr>`; });
  html += '</tbody></table>';
  result.innerHTML = html;
}

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
  if (!currentUser || !a) return false;
  const activeStep = a.timeline.find(t => t.state === 'active');
  if (!activeStep) return false;
  return activeStep.user === currentUser.name;
}

function isApplicant(a) {
  return currentUser && a && a.applicant === currentUser.name;
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
  const applicant = currentUser ? currentUser.name : '张工';
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
  const idx = parseInt(document.getElementById('approveIdx').value);
  const action = document.getElementById('approveAction').value;
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


// ===== EXPORT / IMPORT =====
function exportCSV() {
  let csv = '\uFEFF物料编号,物料名称,规格型号,单位,用量,供应商,单价,状态\n';
  materialsFlat.forEach(m => { csv += `"${m.id}","${m.name}","${m.spec}","${m.unit}",${m.qty},"${m.supplier}",${m.price},"${m.status}"\n`; });
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob); link.download = 'BOM_物料清单_' + todayStr() + '.csv';
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
  showToast('导出完成', 'success');
}
function downloadTemplate(e) {
  e.preventDefault();
  let csv = '\uFEFF物料编号,物料名称,规格型号,单位,用量,供应商,单价,状态\nR-XXXXX,示例物料,规格,个,1,供应商名,0.00,有效\n';
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'BOM导入模板.csv';
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
}
function handleFileSelect(e) { if (e.target.files[0]) parseCSV(e.target.files[0]); }
function handleFileDrop(e) { e.preventDefault(); e.currentTarget.classList.remove('dragover'); if (e.dataTransfer.files[0]) parseCSV(e.dataTransfer.files[0]); }
function parseCSV(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split('\n').filter(l => l.trim());
    if (lines.length < 2) return;
    const headers = lines[0].split(',').map(h => h.replace(/"/g,'').trim());
    importedData = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].match(/(".*?"|[^,]+)/g)?.map(v => v.replace(/"/g,'').trim()) || [];
      if (vals.length >= 4) importedData.push({ id:vals[0]||'', name:vals[1]||'', spec:vals[2]||'', unit:vals[3]||'个', qty:parseInt(vals[4])||1, supplier:vals[5]||'—', price:parseFloat(vals[6])||0, status:vals[7]||'有效' });
    }
    const preview = document.getElementById('uploadPreview');
    preview.classList.add('show');
    preview.innerHTML = `<div style="font-size:12px;margin-bottom:8px;color:var(--text-secondary)">预览 (${importedData.length} 条记录)：</div><table><thead><tr><th>编号</th><th>名称</th><th>规格</th><th>用量</th><th>单价</th></tr></thead><tbody>${importedData.slice(0,5).map(m=>`<tr><td>${m.id}</td><td>${m.name}</td><td>${m.spec}</td><td>${m.qty}</td><td>${m.price}</td></tr>`).join('')}${importedData.length>5?'<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">...还有 '+(importedData.length-5)+' 条</td></tr>':''}</tbody></table>`;
    document.getElementById('importBtn').disabled = false;
  };
  reader.readAsText(file);
}
function doImport() {
  if (!importedData || importedData.length === 0) return;
  const target = bomData.children && bomData.children[0];
  if (!target) return;
  if (!target.children) target.children = [];
  importedData.forEach(m => { m.level = 2; m.icon = '📄'; target.children.push(m); });
  importedData = null;
  document.getElementById('uploadPreview').classList.remove('show');
  document.getElementById('importBtn').disabled = true;
  hideModal('importModal');
  rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
}

// ===== REPORTS =====
function renderReports() {
  // Stat cards
  const totalMats = materialsFlat.length;
  const totalCost = materialsFlat.reduce((s,m) => s + m.price * m.qty, 0);
  const activeCount = materialsFlat.filter(m => m.status === '有效').length;
  const supplierCount = new Set(materialsFlat.map(m => m.supplier)).size;
  document.getElementById('statCards').innerHTML = `
    <div class="stat-card"><div class="stat-num" style="color:var(--accent)">${totalMats}</div><div class="stat-label">物料总数</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--green)">¥${totalCost.toFixed(0)}</div><div class="stat-label">总成本</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--blue)">${activeCount}</div><div class="stat-label">有效物料</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--orange)">${supplierCount}</div><div class="stat-label">供应商数</div></div>
  `;
  // Charts
  const supplierMap = {}; const statusMap = {'有效':0,'待审':0,'停用':0};
  const groupMap = {};
  materialsFlat.forEach(m => {
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
}

// ===== SETTINGS =====
function renderSettings() {
  const users = settingsUsers;
  const badgeColors = {purple:'badge-purple',green:'badge-green',blue:'badge-blue',yellow:'badge-yellow',red:'badge-red',orange:'badge-yellow',gray:'badge-gray'};
  let enumHtml = '';
  Object.entries(enumConfig).forEach(([key, cfg]) => {
    const bc = badgeColors[cfg.color] || 'badge-gray';
    enumHtml += '<div class="settings-section"><h3>'+cfg.icon+' '+cfg.label+'<span style="font-size:11px;font-weight:400;color:var(--text-muted);margin-left:8px">('+cfg.items.length+' 项)</span></h3><div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">';
    cfg.items.forEach((item, idx) => {
      enumHtml += '<div style="display:inline-flex;align-items:center;gap:4px;background:var(--bg-primary);border:1px solid var(--border);border-radius:16px;padding:4px 6px 4px 12px;font-size:12px"><span class="badge '+bc+'">'+item+'</span><button class="btn btn-ghost btn-xs" style="padding:0 4px;font-size:14px;color:var(--text-muted)" onclick="removeEnumItem(\''+key+'\','+idx+')" title="删除">×</button></div>';
    });
    enumHtml += '</div><div style="display:flex;gap:8px;align-items:center"><input type="text" id="enumAdd_'+key+'" placeholder="新增'+cfg.label+'项…" style="flex:1;max-width:240px;background:var(--bg-primary);border:1px solid var(--border);border-radius:var(--radius-sm);padding:6px 10px;color:var(--text-primary);outline:none;font-size:12px" onkeydown="if(event.key===\'Enter\')addEnumItem(\''+key+'\')" /><button class="btn btn-primary btn-sm" onclick="addEnumItem(\''+key+'\')">＋ 添加</button></div></div>';
  });
  document.getElementById('settingsContent').innerHTML =
    '<div class="settings-section"><h3>👤 用户管理</h3><div class="table-wrap"><table class="user-table"><thead><tr><th>姓名</th><th>角色</th><th>邮箱</th><th>状态</th><th>操作</th></tr></thead><tbody>'+users.map((u, idx) => '<tr><td style="font-weight:500">'+u.name+'</td><td>'+u.role+'</td><td style="color:var(--text-muted)">'+u.email+'</td><td><span class="badge '+(u.status==='在线'?'badge-green':'badge-gray')+'">'+u.status+'</span></td><td><button class="btn btn-ghost btn-xs" onclick="editUser('+idx+')">✏️ 编辑</button></td></tr>').join('')+'</tbody></table></div></div>'+
    '<div class="settings-section"><h3>📋 物料属性配置</h3><p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">管理物料的枚举属性值，修改后自动同步到新增/编辑表单和筛选器。</p></div>'+
    enumHtml+
    '<div class="settings-section"><h3>🔐 权限设置</h3><div class="settings-row"><div><div class="sr-label">BOM 编辑权限</div><div class="sr-desc">允许工程师修改 BOM 结构和物料信息</div></div><button class="toggle on" onclick="this.classList.toggle(\'on\');showToast(\'设置已更新\',\'success\')"></button></div><div class="settings-row"><div><div class="sr-label">审批权限</div><div class="sr-desc">仅主管及以上角色可审批</div></div><button class="toggle on" onclick="this.classList.toggle(\'on\');showToast(\'设置已更新\',\'success\')"></button></div><div class="settings-row"><div><div class="sr-label">导出权限</div><div class="sr-desc">允许所有用户导出物料数据</div></div><button class="toggle on" onclick="this.classList.toggle(\'on\');showToast(\'设置已更新\',\'success\')"></button></div><div class="settings-row"><div><div class="sr-label">物料删除确认</div><div class="sr-desc">删除物料时需要二次确认</div></div><button class="toggle on" onclick="this.classList.toggle(\'on\');showToast(\'设置已更新\',\'success\')"></button></div></div>'+
    '<div class="settings-section"><h3>🔧 系统参数</h3><div class="settings-row"><div><div class="sr-label">默认版本格式</div><div class="sr-desc">新建版本时的默认格式</div></div><select class="filter-select" style="width:120px" onchange="showToast(\'参数已保存\',\'success\')"><option>V{major}.{minor}</option><option>v{major}.{minor}.{patch}</option></select></div><div class="settings-row"><div><div class="sr-label">自动保存间隔</div><div class="sr-desc">自动保存编辑中的BOM数据</div></div><select class="filter-select" style="width:100px" onchange="showToast(\'参数已保存\',\'success\')"><option>30 秒</option><option>1 分钟</option><option>5 分钟</option><option>关闭</option></select></div><div class="settings-row"><div><div class="sr-label">物料编号前缀</div><div class="sr-desc">自动生成物料编号的前缀规则</div></div><input type="text" value="A100-" style="width:100px;background:var(--bg-primary);border:1px solid var(--border);border-radius:var(--radius-sm);padding:4px 8px;color:var(--text-primary);outline:none" onchange="showToast(\'参数已保存\',\'success\')" /></div><div class="settings-row"><div><div class="sr-label">货币单位</div><div class="sr-desc">物料价格显示的货币</div></div><select class="filter-select" style="width:100px" onchange="showToast(\'参数已保存\',\'success\')"><option>¥ CNY</option><option>$ USD</option><option>€ EUR</option></select></div></div>';
}
function addEnumItem(key) {
  const input = document.getElementById('enumAdd_' + key);
  const val = input.value.trim();
  if (!val || !enumConfig[key]) return;
  if (enumConfig[key].items.includes(val)) return;
  enumConfig[key].items.push(val);
  input.value = '';
  populateAllEnumSelects(); buildFilterDropdowns(); renderSettings();
}
function removeEnumItem(key, idx) {
  if (!enumConfig[key]) return;
  const item = enumConfig[key].items[idx];
  enumConfig[key].items.splice(idx, 1);
  populateAllEnumSelects(); buildFilterDropdowns(); renderSettings();
}

// ===== TABS =====
document.querySelectorAll('.tab-item').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ===== SIDEBAR NAVIGATION =====
const pageMap = { dashboard:'page-dashboard', bom:'page-bom', materials:'page-materials', projects:'page-projects', changes:'page-changes', approvals:'page-approvals', documents:'page-documents', suppliers:'page-suppliers', quality:'page-quality', reports:'page-reports', settings:'page-settings', lifecycle:'page-lifecycle', cost:'page-cost', inventory:'page-inventory', process:'page-process', config:'page-config', compliance:'page-compliance' };
document.querySelectorAll('.sidebar .nav-item').forEach(item => {
  item.addEventListener('click', () => { navigateTo(item.dataset.nav); });
});

// ===== SEARCH & FILTER =====
document.getElementById('matSearch').addEventListener('input', () => { matPage = 1; renderMaterials(); });
document.getElementById('matFilter').addEventListener('change', () => { matPage = 1; renderMaterials(); });
document.getElementById('matCategoryFilter').addEventListener('change', () => { matPage = 1; renderMaterials(); });
document.getElementById('matSupplierFilter').addEventListener('change', () => { matPage = 1; renderMaterials(); });

// ===== MODALS =====
function showModal(id) {
  document.getElementById(id).classList.add('show');
  if (id === 'newApprovalModal') {
    const sel = document.getElementById('aprFormVer');
    sel.innerHTML = versions.map(v => `<option value="${v.ver}">${v.ver}${v.status==='当前'?' (当前)':''}</option>`).join('');
    const aprApplicant = document.getElementById('aprFormApplicant');
    if (aprApplicant) aprApplicant.value = currentUser ? currentUser.name : '未登录';
    const aprDesc = document.getElementById('aprFormDesc');
    if (aprDesc) aprDesc.value = '';
    const aprMat = document.getElementById('aprFormMaterials');
    if (aprMat) aprMat.value = '';
    const aprUrg = document.getElementById('aprFormUrgency');
    if (aprUrg) aprUrg.value = '普通';
  }
  if (id === 'versionModal') {
    const baseSel = document.getElementById('verFormBase');
    if (baseSel) baseSel.innerHTML = versions.map(v => `<option value="${v.ver}">${v.ver}${v.status==='当前'?' (当前)':''}</option>`).join('');
    var numInput = document.getElementById('verFormNum');
    if (numInput) numInput.value = '';
    var descInput = document.getElementById('verFormDesc');
    if (descInput) descInput.value = '';
  }
}
function hideModal(id) { document.getElementById(id).classList.remove('show'); }
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('show'); });
});

// ===== CONFIRM =====
let confirmCallback = null;
function showConfirm(msg, callback) {
  document.getElementById('confirmMsg').textContent = msg;
  confirmCallback = callback;
  document.getElementById('confirmBtn').onclick = () => { hideModal('confirmModal'); if (confirmCallback) confirmCallback(); confirmCallback = null; };
  showModal('confirmModal');
}

// ===== GLOBAL SEARCH =====
document.getElementById('globalSearch').addEventListener('input', function(e) {
  const q = e.target.value.trim();
  renderSearchDropdown(q);
});
document.getElementById('globalSearch').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    hideSearchDropdown();
    const q = this.value.trim().toLowerCase();
    if (!q) return;
    const match = materialsFlat.find(m => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q));
    if (match) {
      navigateTo('materials');
      document.getElementById('matSearch').value = q;
      matPage = 1; buildFilterDropdowns(); renderMaterials();
    }
  }
});
document.addEventListener('click', function(e) {
  if (!e.target.closest('.global-search')) hideSearchDropdown();
});

// ===== TOAST =====
function showToast(msg, type) {
  type = type || 'info';
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 3200);
}

// ===== NAVIGATE HELPER =====
function navigateTo(nav) {
  try { localStorage.setItem('bom_page', nav); } catch(e) {}
  document.querySelectorAll('.sidebar .nav-item').forEach(i => i.classList.remove('active'));
  const target = document.querySelector('[data-nav="'+nav+'"]');
  if (target) target.classList.add('active');
  document.querySelectorAll('.page-panel').forEach(p => p.classList.remove('active'));
  const page = pageMap[nav] || 'page-dashboard';
  document.getElementById(page)?.classList.add('active');
  const labels = { dashboard:'仪表盘', bom:'BOM管理', materials:'物料库', projects:'项目管理', changes:'变更管理', approvals:'审批中心', documents:'文档中心', suppliers:'供应商管理', quality:'质量管理', reports:'报表中心', settings:'系统设置', lifecycle:'生命周期', cost:'成本分析', inventory:'库存/采购', process:'工艺路线', config:'产品配置', compliance:'合规认证' };
  const bc = document.getElementById('breadcrumb');
  if (bc) bc.innerHTML = '<span onclick="navigateTo(\'dashboard\')" style="cursor:pointer">工作区</span><span class="sep">/</span><span style="color:var(--text-primary)">' + (labels[nav]||'仪表盘') + '</span>';
  if (nav === 'dashboard') renderDashboard();
  if (nav === 'materials') { buildFilterDropdowns(); renderMaterials(); }
  if (nav === 'reports') renderReports();
  if (nav === 'settings') renderSettings();
  if (nav === 'projects') renderProjects();
  if (nav === 'changes') renderChanges();
  if (nav === 'approvals') renderApprovalCenter();
  if (nav === 'documents') renderDocuments();
  if (nav === 'suppliers') renderSuppliers();
  if (nav === 'quality') renderQuality();
  if (nav === 'lifecycle') renderLifecycle();
  if (nav === 'cost') renderCostAnalysis();
  if (nav === 'inventory') renderInventory();
  if (nav === 'process') renderProcessRoutes();
  if (nav === 'config') renderProductConfig();
  if (nav === 'compliance') renderCompliance();
}

// ===== DASHBOARD =====
function renderDashboard() {
  const name = currentUser ? currentUser.name : '访客';
  const role = currentUser ? currentUser.role : '';
  document.getElementById('dashWelcome').textContent = '欢迎回来，' + name;
  document.getElementById('dashRole').innerHTML = role ? '<span class="badge badge-purple">' + role + '</span>' : '';
  const totalMats = materialsFlat.length;
  const activeMats = materialsFlat.filter(m => m.status === '有效').length;
  const pendingMats = materialsFlat.filter(m => m.status === '待审').length;
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
}

function updateNavBadges() {
  const pendingApprovals = approvals.filter(a => a.status === '待审批').length;
  const el1 = document.getElementById('navBadgeBom');
  const el2 = document.getElementById('navBadgeMat');
  if (el1) el1.textContent = pendingApprovals;
  if (el2) el2.textContent = materialsFlat.length;
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
  container.innerHTML = demoUsers.map(u =>
    '<span class="login-pill" data-name="'+u.name+'" data-pw="'+u.password+'">'+u.name+'</span>'
  ).join('');
  container.addEventListener('click', e => {
    const pill = e.target.closest('.login-pill');
    if (!pill) return;
    document.getElementById('loginUsername').value = pill.dataset.name;
    document.getElementById('loginPassword').value = pill.dataset.pw;
  });
}


// ===== DASHBOARD TODO LIST =====
function renderDashTodos() {
  var el = document.getElementById('dashTodos');
  if (!el) return;
  var name = currentUser ? currentUser.name : '';
  var myApprovals = approvals.filter(function(a) {
    var active = a.timeline.find(function(t) { return t.state === 'active'; });
    return active && active.user === name;
  });
  var pendingMats = materialsFlat.filter(function(m) { return m.status === '待审'; });
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
      html += '<div class="todo-item" style="display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--border);border-left:3px solid var(--orange);border-radius:var(--radius);margin-bottom:8px;cursor:pointer;transition:all .15s;font-size:12px" onclick="navigateTo(\'materials\');document.getElementById(\'matFilter\').value=\'待审\';matPage=1;renderMaterials()"><span style="font-size:16px">📦</span><div style="flex:1"><div style="color:var(--text-primary);font-weight:500">'+m.name+' ('+m.id+')</div><div style="color:var(--text-muted);margin-top:2px">物料待审核 · '+m.supplier+'</div></div><span class="badge badge-yellow">待审</span></div>';
    });
    if (pendingMats.length > 3) html += '<div style="text-align:center;font-size:11px;color:var(--text-muted);padding:4px">还有 '+(pendingMats.length-3)+' 项待审物料…</div>';
    if (myQa.length > 3) html += '<div style="text-align:center;font-size:11px;color:var(--text-muted);padding:4px">还有 '+(myQa.length-3)+' 项质量问题…</div>';
  }
  el.innerHTML = html;
}

// ===== BATCH EDIT =====
function showBatchEditModal() {
  if (selectedMatIds.size === 0) { showToast('请先选择物料', 'error'); return; }
  document.getElementById('batchEditCount').textContent = selectedMatIds.size;
  document.getElementById('batchEditSupplier').value = '';
  document.getElementById('batchEditPrice').value = '';
  document.getElementById('batchEditStatus').value = '';
  showModal('batchEditModal');
}
function doBatchEdit() {
  var supplier = document.getElementById('batchEditSupplier').value.trim();
  var price = document.getElementById('batchEditPrice').value.trim();
  var status = document.getElementById('batchEditStatus').value;
  var count = 0;
  selectedMatIds.forEach(function(id) {
    var node = findNode(id);
    if (!node) return;
    if (supplier) node.supplier = supplier;
    if (price && !isNaN(parseFloat(price))) node.price = parseFloat(price);
    if (status) node.status = status;
    count++;
  });
  hideModal('batchEditModal');
  rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
  var changes = [];
  if (supplier) changes.push('供应商→'+supplier);
  if (price) changes.push('单价→¥'+price);
  if (status) changes.push('状态→'+status);
  showToast('已批量更新 '+count+' 项物料：'+changes.join('、'), 'success');
}

// ===== WHERE-USED =====
function showWhereUsed(matId) {
  var mat = materialsFlat.find(function(m) { return m.id === matId; });
  if (!mat) return;
  var parents = [];
  function searchParents(node, path) {
    if (node.children) {
      node.children.forEach(function(child) {
        if (child.id === matId) parents.push({node: node, path: path + ' > ' + node.name});
        searchParents(child, path + ' > ' + node.name);
      });
    }
  }
  searchParents(bomData, bomData.name);
  document.getElementById('whereUsedTitle').textContent = '物料引用 — ' + mat.name;
  var html = '<div style="margin-bottom:12px;font-size:12px;color:var(--text-secondary)">物料 <b style="color:var(--accent)">'+mat.id+'</b> 被以下节点引用：</div>';
  if (parents.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:var(--text-muted)">未找到引用</div>';
  } else {
    parents.forEach(function(p) {
      html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:6px;font-size:12px;cursor:pointer;transition:background .15s" onmouseover="this.style.background=\'var(--bg-hover)\'" onmouseout="this.style.background=\'transparent\'" onclick="hideModal(\'whereUsedModal\');navigateTo(\'bom\');selectedNodeId=\''+p.node.id+'\';renderTree();showDetail(findNode(\''+p.node.id+'\'))">'
        + '<span style="font-size:14px">'+p.node.icon+'</span>'
        + '<div><div style="font-weight:500">'+p.node.name+'</div><div style="color:var(--text-muted);font-size:11px">'+p.path+'</div></div></div>';
    });
  }
  document.getElementById('whereUsedBody').innerHTML = html;
  showModal('whereUsedModal');
}

// ===== SUBSTITUTE EDIT =====
function editSubstitutes(matId) {
  var mat = materialsFlat.find(function(m) { return m.id === matId; });
  if (!mat) return;
  var subs = substituteMap[matId] || [];
  document.getElementById('subEditTitle').textContent = '替代物料 — ' + mat.name;
  document.getElementById('subEditMatId').value = matId;
  var html = '<div style="margin-bottom:12px;font-size:12px;color:var(--text-secondary)">当前 <b style="color:var(--accent)">'+mat.id+'</b> 的替代物料：</div>';
  html += '<div id="subEditList">';
  subs.forEach(function(s, i) {
    html += '<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:6px;font-size:12px"><span style="flex:1"><b>'+s.id+'</b> · '+s.name+' ('+s.supplier+')</span><button class="btn btn-ghost btn-xs" onclick="removeSubstitute(\''+matId+'\','+i+')">✕</button></div>';
  });
  html += '</div>';
  html += '<div style="display:flex;gap:8px;margin-top:12px"><input type="text" id="subAddId" placeholder="物料编号" style="flex:1;background:var(--bg-primary);border:1px solid var(--border);border-radius:var(--radius-sm);padding:6px 10px;color:var(--text-primary);outline:none;font-size:12px" /><button class="btn btn-primary btn-sm" onclick="addSubstitute()">添加</button></div>';
  document.getElementById('subEditBody').innerHTML = html;
  showModal('subEditModal');
}
function addSubstitute() {
  var matId = document.getElementById('subEditMatId').value;
  var subId = document.getElementById('subAddId').value.trim();
  if (!subId) return;
  var subMat = materialsFlat.find(function(m) { return m.id === subId; });
  if (!subMat) { showToast('物料 '+subId+' 不存在', 'error'); return; }
  if (!substituteMap[matId]) substituteMap[matId] = [];
  if (substituteMap[matId].find(function(s) { return s.id === subId; })) { showToast('已存在该替代物料', 'error'); return; }
  substituteMap[matId].push({id:subMat.id, name:subMat.name, supplier:subMat.supplier});
  editSubstitutes(matId);
  showToast('替代物料 '+subId+' 已添加', 'success');
}
function removeSubstitute(matId, idx) {
  if (!substituteMap[matId]) return;
  substituteMap[matId].splice(idx, 1);
  editSubstitutes(matId);
  showToast('已移除替代物料', 'info');
}

// ===== CLONE BOM NODE =====
function cloneNode(nodeId) {
  var node = findNode(nodeId);
  if (!node) return;
  var parent = findParent(nodeId);
  if (!parent || !parent.children) return;
  var clone = JSON.parse(JSON.stringify(node));
  clone.id = node.id + '-COPY';
  clone.name = node.name + ' (副本)';
  function fixIds(n) { n.id = n.id + '-C'; if (n.children) n.children.forEach(fixIds); }
  if (clone.children) clone.children.forEach(fixIds);
  parent.children.push(clone);
  rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
  showToast('已克隆节点 '+node.name, 'success');
}

// ===== VERSION ROLLBACK =====
function rollbackVersion(ver) {
  var v = versions.find(function(x) { return x.ver === ver; });
  if (!v) return;
  if (v.status === '当前') { showToast('当前版本无需回滚', 'error'); return; }
  showConfirm('确定回滚到版本 '+ver+' 吗？当前版本将标记为历史版本。', function() {
    versions.forEach(function(x) { if (x.status === '当前') { x.status = '历史'; x.statusClass = 'badge-gray'; } });
    v.status = '当前'; v.statusClass = 'badge-green';
    renderVersions();
    showToast('已回滚到版本 '+ver, 'success');
  });
}

// ===== ENHANCED REPORTS =====
function renderCostTrend() {
  var data = versions.slice().reverse();
  var maxCost = materialsFlat.reduce(function(s,m){return s+m.price*m.qty;},0);
  var html = '<div class="chart-card"><h4>📈 版本成本趋势</h4>';
  data.forEach(function(v, i) {
    var cost = maxCost * (0.6 + i * 0.08);
    if (v.status === '当前') cost = maxCost;
    var pct = Math.min(100, (cost/maxCost*100));
    html += '<div class="stat-row"><span style="width:50px;font-weight:600;color:'+(v.status==='当前'?'var(--accent)':'var(--text-secondary)')+'">'+v.ver+'</span><div class="stat-bar"><div class="stat-bar-fill" style="width:'+pct.toFixed(0)+'%;background:linear-gradient(90deg,var(--accent),var(--blue))"></div></div><span style="width:80px;text-align:right;font-weight:500">¥'+cost.toFixed(0)+'</span></div>';
  });
  html += '</div>';
  return html;
}

function renderDuplicateCheck() {
  var nameMap = {};
  materialsFlat.forEach(function(m) {
    var key = m.name.replace(/\s/g,'').toLowerCase();
    if (!nameMap[key]) nameMap[key] = [];
    nameMap[key].push(m);
  });
  var dupes = Object.entries(nameMap).filter(function(e) { return e[1].length > 1; });
  var html = '<div class="chart-card"><h4>🔍 重复物料检测</h4>';
  if (dupes.length === 0) {
    html += '<div style="text-align:center;padding:16px;color:var(--green);font-size:12px">✅ 未发现重复物料</div>';
  } else {
    dupes.forEach(function(d) {
      html += '<div style="padding:8px 0;border-bottom:1px solid var(--border-light);font-size:12px">';
      html += '<div style="font-weight:500;color:var(--yellow);margin-bottom:4px">⚠ "'+d[1][0].name+'" 出现 '+d[1].length+' 次</div>';
      d[1].forEach(function(m) {
        html += '<span style="display:inline-block;margin-right:8px;color:var(--text-secondary)">'+m.id+' ('+m.supplier+')</span>';
      });
      html += '</div>';
    });
  }
  html += '</div>';
  return html;
}

function renderSingleSourceRisk() {
  var supplierMats = {};
  materialsFlat.forEach(function(m) {
    if (!supplierMats[m.id]) supplierMats[m.id] = {mat:m, suppliers:new Set()};
    supplierMats[m.id].suppliers.add(m.supplier);
  });
  var singleSource = Object.values(supplierMats).filter(function(x) { return x.suppliers.size === 1 && !substituteMap[x.mat.id]; });
  var html = '<div class="chart-card"><h4>⚠️ 单一来源风险</h4>';
  if (singleSource.length === 0) {
    html += '<div style="text-align:center;padding:16px;color:var(--green);font-size:12px">✅ 所有物料均有替代方案</div>';
  } else {
    html += '<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">以下物料仅有单一供应商且无替代物料：</div>';
    singleSource.slice(0,8).forEach(function(x) {
      var cost = x.mat.price * x.mat.qty;
      html += '<div class="stat-row" style="font-size:12px"><span style="width:80px;color:var(--accent)">'+x.mat.id+'</span><span style="flex:1">'+x.mat.name+'</span><span style="width:60px;color:var(--text-muted)">'+x.mat.supplier+'</span><span style="width:60px;text-align:right;font-weight:500;color:var(--red)">¥'+cost.toFixed(0)+'</span></div>';
    });
    if (singleSource.length > 8) html += '<div style="text-align:center;font-size:11px;color:var(--text-muted);padding:4px">还有 '+(singleSource.length-8)+' 项…</div>';
  }
  html += '</div>';
  return html;
}


// ===== MULTI-BOM MANAGEMENT =====
function populateBOMSelector() {
  var sel = document.getElementById('bomSelector');
  if (!sel) return;
  var currentIdx = allBOMs.indexOf(bomData);
  sel.innerHTML = allBOMs.map(function(b, i) {
    return '<option value="'+i+'"'+(i===currentIdx?' selected':'')+'>'+b.icon+' '+b.name+' ('+b.id+')</option>';
  }).join('');
}

function switchBOM(idx) {
  if (idx < 0 || idx >= allBOMs.length) return;
  bomData = allBOMs[idx];
  selectedNodeId = bomData.id;
  rebuildFlat();
  renderTree();
  buildFilterDropdowns();
  renderMaterials();
  showDetail(bomData);
  updateStatusBar();
  updateNavBadges();
  var bc = document.getElementById('breadcrumb');
  if (bc) bc.innerHTML = '<span onclick="navigateTo(\'dashboard\')" style="cursor:pointer">工作区</span><span class="sep">/</span><span>BOM管理</span><span class="sep">/</span><span style="color:var(--text-primary)">'+bomData.name+'</span>';
  try { localStorage.setItem('bom_active_idx', idx); } catch(e) {}
  showToast('已切换到 '+bomData.name, 'info');
}

function showNewBOMModal() { showModal('newBOMModal'); }

function createNewBOM() {
  var id = document.getElementById('newBomId').value.trim();
  var name = document.getElementById('newBomName').value.trim();
  var icon = document.getElementById('newBomIcon').value.trim() || '📦';
  var spec = document.getElementById('newBomSpec').value.trim();
  var unit = document.getElementById('newBomUnit').value.trim() || '台';
  if (!id || !name) { showToast('请填写产品编号和名称', 'error'); return; }
  if (allBOMs.find(function(b) { return b.id === id; })) { showToast('产品编号已存在', 'error'); return; }
  var newBom = {id:id, name:name, spec:spec||id, unit:unit, qty:1, price:0, supplier:'—', status:'有效', level:0, icon:icon, children:[]};
  allBOMs.push(newBom);
  hideModal('newBOMModal');
  populateBOMSelector();
  document.getElementById('bomSelector').value = allBOMs.length - 1;
  switchBOM(allBOMs.length - 1);
  showToast('BOM "'+name+'" 已创建', 'success');
}

function deleteBOM(idx) {
  if (idx < 0 || idx >= allBOMs.length) return;
  if (allBOMs.length <= 1) { showToast('至少保留一个BOM', 'error'); return; }
  var b = allBOMs[idx];
  showConfirm('确定删除 BOM "'+b.name+'" 吗？此操作不可恢复。', function() {
    allBOMs.splice(idx, 1);
    if (bomData === b) switchBOM(0);
    populateBOMSelector();
    showToast('BOM "'+b.name+'" 已删除', 'info');
  });
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    const gs = document.getElementById('globalSearch');
    if (gs) gs.focus();
  }
  if (e.key === 'Escape') {
    hideContextMenu();
    hideSearchDropdown();
    document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
    document.getElementById('notifDropdown')?.classList.remove('show');
    document.getElementById('userDropdown')?.classList.remove('show');
  }
});

// ===== USER EDIT (Settings) =====


function editUser(idx) {
  const u = settingsUsers[idx];
  if (!u) return;
  document.getElementById('userEditIdx').value = idx;
  document.getElementById('userEditName').value = u.name;
  document.getElementById('userEditRole').value = u.role;
  document.getElementById('userEditEmail').value = u.email;
  document.getElementById('userEditStatus').value = u.status;
  document.getElementById('userEditTitle').textContent = '编辑用户 — ' + u.name;
  showModal('userEditModal');
}

function saveUserEdit() {
  const idx = parseInt(document.getElementById('userEditIdx').value);
  const u = settingsUsers[idx];
  if (!u) return;
  u.name = document.getElementById('userEditName').value.trim() || u.name;
  u.role = document.getElementById('userEditRole').value.trim() || u.role;
  u.email = document.getElementById('userEditEmail').value.trim() || u.email;
  u.status = document.getElementById('userEditStatus').value;
  hideModal('userEditModal');
  renderSettings();
  showToast('用户信息已更新', 'success');
}

// ===== GLOBAL SEARCH DROPDOWN =====
function renderSearchDropdown(query) {
  let dropdown = document.getElementById('searchDropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = 'searchDropdown';
    dropdown.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow-xl);max-height:320px;overflow-y:auto;z-index:300;display:none;margin-top:4px';
    document.querySelector('.global-search').appendChild(dropdown);
  }
  if (!query || query.length < 1) { dropdown.style.display = 'none'; return; }
  const q = query.toLowerCase();
  const results = materialsFlat.filter(m =>
    m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.supplier.toLowerCase().includes(q)
  ).slice(0, 8);
  if (results.length === 0) {
    dropdown.innerHTML = '<div style="padding:14px 16px;color:var(--text-muted);font-size:12px;text-align:center">未找到匹配结果</div>';
    dropdown.style.display = 'block';
    return;
  }
  dropdown.innerHTML = results.map(m => {
    const cls = m.status==='有效'?'badge-green':m.status==='停用'?'badge-red':'badge-yellow';
    return '<div class="search-result-item" data-id="'+m.id+'" style="display:flex;align-items:center;gap:10px;padding:10px 16px;cursor:pointer;border-bottom:1px solid var(--border-light);transition:background .1s;font-size:12px"><span style="color:var(--accent);font-weight:500;width:90px;flex-shrink:0">'+m.id+'</span><span style="flex:1;color:var(--text-primary)">'+m.name+'</span><span class="badge '+cls+'" style="font-size:10px">'+m.status+'</span></div>';
  }).join('');
  dropdown.style.display = 'block';
  dropdown.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('mouseenter', function() { this.style.background = 'var(--bg-hover)'; });
    item.addEventListener('mouseleave', function() { this.style.background = 'transparent'; });
    item.addEventListener('click', function() {
      const matId = this.dataset.id;
      hideSearchDropdown();
      document.getElementById('globalSearch').value = '';
      navigateTo('materials');
      document.getElementById('matSearch').value = matId;
      matPage = 1;
      renderMaterials();
      showToast('已定位到物料 ' + matId, 'info');
    });
  });
}

function hideSearchDropdown() {
  const d = document.getElementById('searchDropdown');
  if (d) d.style.display = 'none';
}

// ===== SORT INDICATORS =====
function updateSortIndicators() {
  document.querySelectorAll('#matTable th[data-sort]').forEach(th => {
    const field = th.dataset.sort;
    const baseText = th.textContent.replace(/ [↕▲▼]$/, '');
    if (field === matSortField) {
      th.textContent = baseText + (matSortAsc ? ' ▲' : ' ▼');
      th.style.color = 'var(--accent-light)';
    } else {
      th.textContent = baseText + ' ↕';
      th.style.color = '';
    }
  });
}

// ===== NOTIFICATION INTERACTIONS =====
function initNotifActions() {
  const items = document.querySelectorAll('.notif-item');
  if (items[0]) items[0].addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('notifDropdown').classList.remove('show');
    navigateTo('bom');
    setTimeout(function() { document.querySelector('[data-tab=approval]')?.click(); }, 100);
  });
  if (items[1]) items[1].addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('notifDropdown').classList.remove('show');
    navigateTo('materials');
    document.getElementById('matSearch').value = 'RF-20047';
    matPage = 1;
    renderMaterials();
  });
  if (items[2]) items[2].addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('notifDropdown').classList.remove('show');
    showToast('已阅：系统将于今晚 22:00 维护', 'info');
  });
}

function markAllNotifRead() {
  const dot = document.querySelector('.notif-dot');
  if (dot) dot.style.display = 'none';
  document.getElementById('notifDropdown').classList.remove('show');
  showToast('已全部标记为已读', 'success');
}

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
  const uname = currentUser ? currentUser.name : '张工';
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

const documentsData = [
  {id:'DOC-2025-0081',name:'P12A 手机整机结构设计图',type:'设计图纸',ver:'V2.3',project:'P12A 旗舰手机',uploader:'张工',date:'2025-06-14',status:'已发布'},
  {id:'DOC-2025-0080',name:'A100 主板PCBA Layout',type:'设计图纸',ver:'V3.0',project:'A100 整机',uploader:'李工',date:'2025-06-12',status:'审核中'},
  {id:'DOC-2025-0079',name:'D400 手环EVT测试报告',type:'测试报告',ver:'V1.0',project:'D400 智能手环',uploader:'赵品质',date:'2025-06-10',status:'已发布'},
  {id:'DOC-2025-0078',name:'T800 平板产品规格书',type:'规格书',ver:'V0.8',project:'T800 平板电脑',uploader:'王主管',date:'2025-06-08',status:'草稿'},
  {id:'DOC-2025-0077',name:'A100 SMT工艺指导书',type:'工艺文件',ver:'V2.1',project:'A100 整机',uploader:'张工',date:'2025-06-05',status:'已发布'},
  {id:'DOC-2025-0076',name:'P12A DVT阶段评审纪要',type:'会议纪要',ver:'V1.0',project:'P12A 旗舰手机',uploader:'陈总监',date:'2025-06-03',status:'已归档'},
  {id:'DOC-2025-0075',name:'W100 手表整机爆炸图',type:'设计图纸',ver:'V1.2',project:'W100 智能手表',uploader:'李工',date:'2025-05-30',status:'已发布'},
  {id:'DOC-2025-0074',name:'R900 路由器可靠性测试',type:'测试报告',ver:'V1.1',project:'R900 路由器',uploader:'赵品质',date:'2025-05-28',status:'已发布'},
  {id:'DOC-2025-0073',name:'全产品线ESD规范',type:'规格书',ver:'V3.0',project:'全产品线',uploader:'陈总监',date:'2025-05-25',status:'已发布'},
  {id:'DOC-2025-0072',name:'C300 车载终端散热分析',type:'测试报告',ver:'V0.5',project:'C300 车载终端',uploader:'张工',date:'2025-05-22',status:'审核中'},
  {id:'DOC-2025-0071',name:'M500 耳机注塑工艺文件',type:'工艺文件',ver:'V2.0',project:'M500 TWS耳机',uploader:'李工',date:'2025-05-20',status:'已归档'},
  {id:'DOC-2025-0070',name:'F100 折叠屏概念评审纪要',type:'会议纪要',ver:'V1.0',project:'F100 折叠屏手机',uploader:'陈总监',date:'2025-05-18',status:'已归档'},
  {id:'DOC-2025-0069',name:'H200 网关硬件规格书',type:'规格书',ver:'V1.0',project:'H200 智能家居网关',uploader:'王主管',date:'2025-05-15',status:'草稿'}
];
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

const suppliersData = [
  {id:'SUP-001',name:'国巨电子',type:'电子元器件',grade:'A',contact:'林经理',matCount:28,status:'合格',score:95},
  {id:'SUP-002',name:'三星电机',type:'电子元器件',grade:'A',contact:'Kim Manager',matCount:15,status:'合格',score:92},
  {id:'SUP-003',name:'意法半导体',type:'电子元器件',grade:'A',contact:'Pierre',matCount:8,status:'合格',score:94},
  {id:'SUP-004',name:'德州仪器',type:'电子元器件',grade:'A',contact:'John',matCount:12,status:'合格',score:96},
  {id:'SUP-005',name:'华邦电子',type:'电子元器件',grade:'B',contact:'陈主管',matCount:5,status:'合格',score:85},
  {id:'SUP-006',name:'顺络电子',type:'电子元器件',grade:'B',contact:'黄经理',matCount:6,status:'待评审',score:78},
  {id:'SUP-007',name:'中航光电',type:'结构件',grade:'A',contact:'刘总',matCount:10,status:'合格',score:91},
  {id:'SUP-008',name:'立讯精密',type:'结构件',grade:'A',contact:'王经理',matCount:14,status:'合格',score:93},
  {id:'SUP-009',name:'风华高科',type:'电子元器件',grade:'B',contact:'赵经理',matCount:9,status:'合格',score:82},
  {id:'SUP-010',name:'长电科技',type:'电子元器件',grade:'B',contact:'孙总监',matCount:7,status:'合格',score:86},
  {id:'SUP-011',name:'深圳兴旺包装',type:'包材',grade:'C',contact:'吴经理',matCount:4,status:'待评审',score:68},
  {id:'SUP-012',name:'东莞精密模具',type:'结构件',grade:'C',contact:'周总',matCount:3,status:'暂停',score:55},
  {id:'SUP-013',name:'京东方',type:'显示模组',grade:'A',contact:'李副总',matCount:6,status:'合格',score:90},
  {id:'SUP-014',name:'汇顶科技',type:'电子元器件',grade:'B',contact:'张经理',matCount:4,status:'合格',score:84}
];
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

const qualityData = [
  {id:'QA-2025-0031',title:'贴片电阻批次阻值偏移',type:'来料不良',severity:'严重',material:'R-20001',owner:'赵品质',date:'2025-06-14',status:'分析中'},
  {id:'QA-2025-0030',title:'主控芯片焊接虚焊',type:'制程不良',severity:'致命',material:'IC-20003',owner:'张工',date:'2025-06-12',status:'待处理'},
  {id:'QA-2025-0029',title:'USB接口插拔寿命不足',type:'客诉',severity:'严重',material:'CN-20028',owner:'李工',date:'2025-06-10',status:'整改中'},
  {id:'QA-2025-0028',title:'电容容值偏差超标',type:'来料不良',severity:'一般',material:'C-20002',owner:'赵品质',date:'2025-06-08',status:'待验证'},
  {id:'QA-2025-0027',title:'PCB板边毛刺',type:'制程不良',severity:'轻微',material:'PCB-10001',owner:'王主管',date:'2025-06-05',status:'已关闭'},
  {id:'QA-2025-0026',title:'LED亮度一致性差',type:'来料不良',severity:'一般',material:'LED-20024',owner:'赵品质',date:'2025-06-03',status:'已关闭'},
  {id:'QA-2025-0025',title:'天线座接触不良',type:'客诉',severity:'严重',material:'CN-20029',owner:'李工',date:'2025-05-30',status:'整改中'},
  {id:'QA-2025-0024',title:'电感啸叫异音',type:'内部发现',severity:'一般',material:'L-20005',owner:'张工',date:'2025-05-28',status:'已关闭'},
  {id:'QA-2025-0023',title:'Flash芯片读写速率下降',type:'来料不良',severity:'严重',material:'IC-20021',owner:'赵品质',date:'2025-05-25',status:'待验证'},
  {id:'QA-2025-0022',title:'二极管反向漏电流偏高',type:'内部发现',severity:'轻微',material:'D-20023',owner:'张工',date:'2025-05-22',status:'已关闭'},
  {id:'QA-2025-0021',title:'晶振频率偏移',type:'来料不良',severity:'一般',material:'X-20026',owner:'李工',date:'2025-05-20',status:'已关闭'}
];
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
var modSortState={proj:{field:null,asc:true},chg:{field:null,asc:true},doc:{field:null,asc:true},sup:{field:null,asc:true},qa:{field:null,asc:true}};
var modPageState={proj:{page:1,size:10},chg:{page:1,size:10},doc:{page:1,size:10},sup:{page:1,size:10},qa:{page:1,size:10}};
function modSort(mod,field){var s=modSortState[mod];if(s.field===field)s.asc=!s.asc;else{s.field=field;s.asc=true}modPageState[mod].page=1;var fn={proj:renderProjects,chg:renderChanges,doc:renderDocuments,sup:renderSuppliers,qa:renderQuality}[mod];if(fn)fn()}
function modPage(mod,delta){var p=modPageState[mod];p.page+=delta;var fn={proj:renderProjects,chg:renderChanges,doc:renderDocuments,sup:renderSuppliers,qa:renderQuality}[mod];if(fn)fn()}
function modSortData(mod,data){var s=modSortState[mod];if(!s.field)return data;return data.slice().sort(function(a,b){var va=a[s.field],vb=b[s.field];if(typeof va==='number')return s.asc?va-vb:vb-va;va=String(va||'');vb=String(vb||'');return s.asc?va.localeCompare(vb):vb.localeCompare(va)})}
function modPaginate(mod,data){var p=modPageState[mod];var total=Math.max(1,Math.ceil(data.length/p.size));if(p.page>total)p.page=total;if(p.page<1)p.page=1;var start=(p.page-1)*p.size;var pageData=data.slice(start,start+p.size);var sumEl=document.getElementById(mod+'Summary');if(sumEl)sumEl.textContent='共 '+data.length+' 条'+(data.length>p.size?' (第'+(start+1)+'-'+Math.min(start+p.size,data.length)+'条)':'');var infoEl=document.getElementById(mod+'PageInfo');if(infoEl)infoEl.textContent='第 '+p.page+' / '+total+' 页';var prevEl=document.getElementById(mod+'Prev');if(prevEl)prevEl.disabled=p.page<=1;var nextEl=document.getElementById(mod+'Next');if(nextEl)nextEl.disabled=p.page>=total;return{pageData:pageData,start:start}}
function handleDocFileSelect(e){var f=e.target.files[0];if(!f)return;var el=document.getElementById('docFileName');if(el){el.textContent='📎 '+f.name+' ('+Math.round(f.size/1024)+'KB)';el.style.display='block'}showToast('文件 '+f.name+' 已选择','success')}
document.addEventListener('DOMContentLoaded',function(){var area=document.getElementById('docUploadArea');if(area)area.addEventListener('click',function(){document.getElementById('docFileInput').click()})});
function todayISO(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function genId(prefix,arr){return prefix+'-'+(new Date().getFullYear())+'-'+String(arr.length+1).padStart(3,'0')}
function detailGrid(pairs){return '<div class="detail-grid">'+pairs.map(p=>'<div class="detail-field"><div class="label">'+p[0]+'</div><div class="value">'+p[1]+'</div></div>').join('')+'</div>'}

function showNewProjectModal(){document.getElementById('projFormId').value=genId('PRJ',projectsData);document.getElementById('projFormStart').value=todayISO();document.getElementById('projFormEnd').value='';document.getElementById('projFormProgress').value='0';document.getElementById('projFormName').value='';document.getElementById('projModalTitle').textContent='新建项目';showModal('projModal')}
function editProject(id){const p=projectsData.find(x=>x.id===id);if(!p)return;document.getElementById('projFormId').value=p.id;document.getElementById('projFormName').value=p.name;document.getElementById('projFormPhase').value=p.phase;document.getElementById('projFormOwner').value=p.owner;document.getElementById('projFormStart').value=p.start;document.getElementById('projFormEnd').value=p.end==='待定'?'':p.end;document.getElementById('projFormStatus').value=p.status;document.getElementById('projFormProgress').value=p.progress;document.getElementById('projModalTitle').textContent='编辑项目';showModal('projModal')}
function saveProject(){const n=document.getElementById('projFormName').value.trim();if(!n){showToast('请填写项目名称','error');return}const id=document.getElementById('projFormId').value;const existing=projectsData.find(x=>x.id===id);const obj={id:id,name:n,phase:document.getElementById('projFormPhase').value,owner:document.getElementById('projFormOwner').value,start:document.getElementById('projFormStart').value,end:document.getElementById('projFormEnd').value||'待定',status:document.getElementById('projFormStatus').value,progress:parseInt(document.getElementById('projFormProgress').value)||0};if(existing){Object.assign(existing,obj);showToast('项目已更新','success')}else{projectsData.unshift(obj);showToast('项目 '+n+' 创建成功','success')}hideModal('projModal');renderProjects()}
function deleteProject(id){const p=projectsData.find(x=>x.id===id);if(!p)return;showConfirm('确定删除项目 "'+p.name+'" 吗？',function(){const i=projectsData.indexOf(p);if(i>-1)projectsData.splice(i,1);renderProjects();showToast('项目已删除','info')})}
function projAction(id,action){const p=projectsData.find(x=>x.id===id);if(!p)return;if(action==='complete'){p.status='已完成';p.progress=100}else if(action==='pause'){p.status='暂停'}else if(action==='resume'){p.status='进行中'}hideModal('genericDetailModal');renderProjects();showToast('项目状态已更新','success')}
function showProjDetail(id){const p=projectsData.find(x=>x.id===id);if(!p)return;const sb=s=>({进行中:'badge-blue',已完成:'badge-green',暂停:'badge-gray',延期:'badge-red'}[s]||'badge-gray');const pc=v=>v>=80?'var(--green)':v>=50?'var(--blue)':v>=30?'var(--yellow)':'var(--red)';const relBoms=allBOMs?allBOMs.filter(b=>b.name.includes(p.name.split(' ')[0])||p.name.includes(b.name.split(' ')[0])):[];const bomList=relBoms.length?relBoms.map(b=>'<span class="badge badge-blue" style="margin:2px;cursor:pointer" onclick="event.stopPropagation();navigateTo(\'bom\')">📦 '+b.name+'</span>').join(' '):'—';const milestones=[{n:'P0',d:'概念评审'},{n:'P1',d:'计划评审'},{n:'P2',d:'需求冻结'},{n:'EVT',d:'工程验证'},{n:'DVT',d:'设计验证'},{n:'PVT',d:'生产验证'},{n:'MP',d:'量产'}];const phaseIdx=milestones.findIndex(m=>m.n===p.phase);const msHtml='<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:8px">'+milestones.map((m,i)=>'<span class="badge '+(i<phaseIdx?'badge-green':i===phaseIdx?'badge-blue':'badge-gray')+'" style="font-size:10px">'+m.n+'</span>').join('')+'</div>';document.getElementById('genericDetailTitle').textContent='📁 '+p.name;document.getElementById('genericDetailBody').innerHTML='<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📋 基本信息</h3>'+detailGrid([['项目编号','<span style="color:var(--accent);font-weight:600">'+p.id+'</span>'],['项目名称',p.name],['当前阶段','<span class="badge badge-purple">'+p.phase+'</span>'],['负责人',p.owner],['开始日期',p.start],['计划完成',p.end],['状态','<span class="badge '+sb(p.status)+'">'+p.status+'</span>'],['进度','<span style="font-weight:700;color:'+pc(p.progress)+'">'+p.progress+'%</span>']])+'<div style="margin-top:12px"><div style="height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden"><div style="height:100%;width:'+p.progress+'%;background:'+pc(p.progress)+';border-radius:4px"></div></div></div></div>'+'<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">🏁 里程碑进度</h3>'+msHtml+'</div>'+'<div class="detail-card" style="margin-bottom:0"><h3 style="font-size:14px">📦 关联BOM</h3><div style="padding:4px 0">'+bomList+'</div></div>';let acts='<button class="btn btn-secondary btn-sm" onclick="hideModal(\'genericDetailModal\');editProject(\''+p.id+'\')">✏️ 编辑</button>';if(p.status==='进行中')acts+='<button class="btn btn-success btn-sm" onclick="projAction(\''+p.id+'\',\'complete\')">✓ 标记完成</button><button class="btn btn-ghost btn-sm" onclick="projAction(\''+p.id+'\',\'pause\')">⏸ 暂停</button>';else if(p.status==='暂停')acts+='<button class="btn btn-primary btn-sm" onclick="projAction(\''+p.id+'\',\'resume\')">▶ 恢复</button>';document.getElementById('genericDetailActions').innerHTML=acts;showModal('genericDetailModal')}

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
    if (currentUser) { var initSel=document.getElementById('chgFormInit'); for(var o of initSel.options){if(o.value===currentUser.name){initSel.value=currentUser.name;break}} }
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
  const uname=currentUser?currentUser.name:'张工';
  const sb=s=>({草稿:'badge-gray',待审批:'badge-yellow',审批中:'badge-yellow',执行中:'badge-blue',已关闭:'badge-green',已驳回:'badge-red'}[s]||'badge-gray');
  const tb=t=>({ECR:'badge-blue',ECO:'badge-purple',ECN:'badge-green'}[t]||'badge-gray');
  const priBadge=p=>p==='特急'?'<span class="badge badge-red">🔥 特急</span>':p==='紧急'?'<span class="badge badge-yellow">⚡ 紧急</span>':'<span class="badge badge-gray">普通</span>';
  let matBadges='—';
  if(c.materials){matBadges=c.materials.split(',').map(m=>m.trim()).filter(Boolean).map(m=>'<span class="badge badge-blue" style="margin:2px;cursor:pointer" onclick="event.stopPropagation();navigateTo(\'materials\');document.getElementById(\'matSearch\').value=\''+m+'\';matPage=1;renderMaterials()">'+m+'</span>').join(' ')}
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

function saveDocument(){const n=document.getElementById('docFormName').value.trim();if(!n){showToast('请填写文档名称','error');return}documentsData.unshift({id:'DOC-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*9000)+1000).padStart(4,'0'),name:n,type:document.getElementById('docFormType').value,ver:document.getElementById('docFormVer').value||'V1.0',project:document.getElementById('docFormProject').value,uploader:currentUser?currentUser.name:'张工',date:todayISO(),status:'草稿'});hideModal('docModal');renderDocuments();showToast('文档 '+n+' 已上传','success')}
function deleteDoc(id){const d=documentsData.find(x=>x.id===id);if(!d)return;showConfirm('确定删除文档 "'+d.name+'" 吗？',function(){const i=documentsData.indexOf(d);if(i>-1)documentsData.splice(i,1);renderDocuments();showToast('文档已删除','info')})}
function docAction(id,action){const d=documentsData.find(x=>x.id===id);if(!d)return;if(action==='submit')d.status='审核中';else if(action==='publish')d.status='已发布';else if(action==='archive')d.status='已归档';else if(action==='upgrade'){const vp=d.ver.match(/V(\d+)\.(\d+)/);if(vp){d.ver='V'+vp[1]+'.'+(parseInt(vp[2])+1);d.date=todayISO();d.status='草稿'}}hideModal('genericDetailModal');renderDocuments();showToast(action==='upgrade'?'版本已升级为 '+d.ver:'状态已更新','success')}
function showDocDetail(id){const d=documentsData.find(x=>x.id===id);if(!d)return;const sb=s=>({草稿:'badge-gray',审核中:'badge-yellow',已发布:'badge-green',已归档:'badge-blue'}[s]||'badge-gray');const ti=t=>({'设计图纸':'📐','测试报告':'📋','规格书':'📄','工艺文件':'🔧','会议纪要':'📝'}[t]||'📄');const history=[{ver:d.ver,date:d.date,user:d.uploader,note:'当前版本'}];if(d.ver!=='V1.0'&&d.ver!=='V0.5'&&d.ver!=='V0.8')history.push({ver:'V1.0',date:'2025-04-01',user:d.uploader,note:'初始版本'});document.getElementById('genericDetailTitle').textContent=ti(d.type)+' '+d.name;document.getElementById('genericDetailBody').innerHTML='<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📋 基本信息</h3>'+detailGrid([['文档编号','<span style="color:var(--accent);font-weight:600">'+d.id+'</span>'],['文档名称',d.name],['类型',ti(d.type)+' '+d.type],['版本','<span class="badge badge-purple">'+d.ver+'</span>'],['关联项目',d.project],['上传人',d.uploader],['更新日期',d.date],['状态','<span class="badge '+sb(d.status)+'">'+d.status+'</span>']])+'</div><div class="detail-card" style="margin-bottom:0"><h3 style="font-size:14px">📜 版本历史</h3><div class="version-list" style="gap:8px">'+history.map(h=>'<div class="version-card" style="padding:12px 16px;cursor:default"><div class="version-num" style="font-size:13px;width:auto">'+h.ver+'</div><div class="version-info"><div class="desc" style="font-size:12px">'+h.note+'</div><div class="meta"><span>'+h.user+'</span><span>'+h.date+'</span></div></div></div>').join('')+'</div></div>';let acts='';if(d.status==='草稿')acts='<button class="btn btn-primary btn-sm" onclick="docAction(\''+d.id+'\',\'submit\')">提交审核</button><button class="btn btn-danger btn-sm" onclick="hideModal(\'genericDetailModal\');deleteDoc(\''+d.id+'\')">删除</button>';else if(d.status==='审核中')acts='<button class="btn btn-success btn-sm" onclick="docAction(\''+d.id+'\',\'publish\')">✓ 发布</button>';else if(d.status==='已发布')acts='<button class="btn btn-secondary btn-sm" onclick="docAction(\''+d.id+'\',\'archive\')">📥 归档</button><button class="btn btn-primary btn-sm" onclick="docAction(\''+d.id+'\',\'upgrade\')">⬆ 升版</button>';document.getElementById('genericDetailActions').innerHTML=acts;showModal('genericDetailModal')}

function saveSupplier(){const n=document.getElementById('supFormName').value.trim();if(!n){showToast('请填写供应商名称','error');return}suppliersData.unshift({id:'SUP-'+String(suppliersData.length+1).padStart(3,'0'),name:n,type:document.getElementById('supFormType').value,grade:document.getElementById('supFormGrade').value,contact:document.getElementById('supFormContact').value||'—',matCount:0,status:'待评审',score:70});hideModal('supModal');renderSuppliers();showToast('供应商 '+n+' 已添加','success')}
function editSupplier(id){const s=suppliersData.find(x=>x.id===id);if(!s)return;document.getElementById('supFormName').value=s.name;document.getElementById('supFormType').value=s.type;document.getElementById('supFormContact').value=s.contact;document.getElementById('supFormGrade').value=s.grade;document.getElementById('supModalTitle').textContent='编辑供应商';showModal('supModal')}
function supAction(id,action){const s=suppliersData.find(x=>x.id===id);if(!s)return;if(action==='approve'){s.status='合格';s.score=Math.min(s.score+5,100)}else if(action==='suspend'){s.status='暂停'}else if(action==='blacklist'){s.status='黑名单';s.score=Math.max(s.score-20,0)}else if(action==='restore'){s.status='合格'}else if(action==='upgrade'){const g={D:'C',C:'B',B:'A'};if(g[s.grade])s.grade=g[s.grade]}else if(action==='downgrade'){const g={A:'B',B:'C',C:'D'};if(g[s.grade])s.grade=g[s.grade]}hideModal('genericDetailModal');renderSuppliers();showToast('供应商状态已更新','success')}
function showSupReviewModal(){const sel=document.getElementById('supReviewTarget');sel.innerHTML=suppliersData.map(s=>'<option value="'+s.id+'">'+s.name+' ('+s.id+')</option>').join('');document.getElementById('supReviewDate').value=todayISO();document.getElementById('supReviewNote').value='';showModal('supReviewModal')}
function saveSupReview(){const id=document.getElementById('supReviewTarget').value;const s=suppliersData.find(x=>x.id===id);if(s){s.status='待评审';renderSuppliers()}hideModal('supReviewModal');showToast('已对 '+(s?s.name:id)+' 发起评审','success')}
function showSupDetail(id){const s=suppliersData.find(x=>x.id===id);if(!s)return;const gb=g=>({A:'badge-green',B:'badge-blue',C:'badge-yellow',D:'badge-red'}[g]||'badge-gray');const stb=st=>({合格:'badge-green',待评审:'badge-yellow',暂停:'badge-red',黑名单:'badge-red'}[st]||'badge-gray');const sc=v=>v>=90?'var(--green)':v>=80?'var(--blue)':v>=70?'var(--yellow)':'var(--red)';const matList=materialsFlat?materialsFlat.filter(m=>m.supplier===s.name).slice(0,8):[];const matHtml=matList.length?matList.map(m=>'<span class="badge badge-blue" style="margin:2px;cursor:pointer" onclick="event.stopPropagation();navigateTo(\'materials\');document.getElementById(\'matSearch\').value=\''+m.id+'\';matPage=1;renderMaterials()">'+m.icon+' '+m.id+'</span>').join(' '):'<span style="color:var(--text-muted)">暂无关联物料</span>';const dims=[{n:'质量',v:s.score},{n:'交期',v:Math.min(s.score+5,100)},{n:'价格',v:Math.max(s.score-8,50)},{n:'服务',v:Math.min(s.score+3,100)}];const radarHtml=dims.map(d=>'<div style="display:flex;align-items:center;gap:8px;padding:4px 0"><span style="width:36px;font-size:11px;color:var(--text-muted)">'+d.n+'</span><div style="flex:1;height:6px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden"><div style="height:100%;width:'+d.v+'%;background:'+sc(d.v)+';border-radius:4px"></div></div><span style="font-size:11px;font-weight:600;color:'+sc(d.v)+';width:28px;text-align:right">'+d.v+'</span></div>').join('');document.getElementById('genericDetailTitle').textContent='🏭 '+s.name;document.getElementById('genericDetailBody').innerHTML='<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📋 基本信息</h3>'+detailGrid([['供应商编号','<span style="color:var(--accent);font-weight:600">'+s.id+'</span>'],['供应商名称',s.name],['类型',s.type],['等级','<span class="badge '+gb(s.grade)+'">'+s.grade+'级</span>'],['联系人',s.contact],['供货物料数',s.matCount+'种'],['合作状态','<span class="badge '+stb(s.status)+'">'+s.status+'</span>'],['综合评分','<span style="font-weight:700;color:'+sc(s.score)+'">'+s.score+'/100</span>']])+'</div><div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📊 评估维度</h3>'+radarHtml+'</div><div class="detail-card" style="margin-bottom:0"><h3 style="font-size:14px">📦 供货物料</h3><div style="padding:4px 0">'+matHtml+'</div></div>';let acts='<button class="btn btn-secondary btn-sm" onclick="hideModal(\'genericDetailModal\');editSupplier(\''+s.id+'\')">✏️ 编辑</button>';if(s.status==='待评审')acts+='<button class="btn btn-success btn-sm" onclick="supAction(\''+s.id+'\',\'approve\')">✓ 评审通过</button>';if(s.status==='合格')acts+='<button class="btn btn-ghost btn-sm" onclick="supAction(\''+s.id+'\',\'suspend\')">⏸ 暂停合作</button><button class="btn btn-ghost btn-sm" onclick="supAction(\''+s.id+'\',\'upgrade\')">⬆ 升级</button><button class="btn btn-ghost btn-sm" onclick="supAction(\''+s.id+'\',\'downgrade\')">⬇ 降级</button>';if(s.status==='暂停')acts+='<button class="btn btn-primary btn-sm" onclick="supAction(\''+s.id+'\',\'restore\')">▶ 恢复合作</button><button class="btn btn-danger btn-sm" onclick="supAction(\''+s.id+'\',\'blacklist\')">🚫 加入黑名单</button>';document.getElementById('genericDetailActions').innerHTML=acts;showModal('genericDetailModal')}

function saveQuality(){const t=document.getElementById('qaFormTitle').value.trim();if(!t){showToast('请填写问题标题','error');return}qualityData.unshift({id:'QA-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*9000)+1000).padStart(4,'0'),title:t,type:document.getElementById('qaFormType').value,severity:document.getElementById('qaFormSeverity').value,material:document.getElementById('qaFormMaterial').value||'—',owner:document.getElementById('qaFormOwner').value,date:todayISO(),status:'待处理',rootCause:'',corrective:'',timeline:[{title:'问题登记',user:document.getElementById('qaFormOwner').value,date:nowStr(),state:'done',note:''},{title:'原因分析',user:document.getElementById('qaFormOwner').value,date:'',state:'pending',note:''},{title:'整改实施',user:document.getElementById('qaFormOwner').value,date:'',state:'pending',note:''},{title:'效果验证',user:'赵品质',date:'',state:'pending',note:''},{title:'关闭归档',user:'赵品质',date:'',state:'pending',note:''}]});hideModal('qaModal');renderQuality();showToast('质量问题 '+t+' 已创建','success')}
function deleteQa(id){const r=qualityData.find(x=>x.id===id);if(!r)return;showConfirm('确定删除质量问题 "'+r.title+'" 吗？',function(){const i=qualityData.indexOf(r);if(i>-1)qualityData.splice(i,1);renderQuality();showToast('已删除','info')})}
function qaAction(id,action){const r=qualityData.find(x=>x.id===id);if(!r)return;const ns=nowStr();const flow={'待处理':'分析中','分析中':'整改中','整改中':'待验证','待验证':'已关闭'};if(action==='advance'){const newSt=flow[r.status];if(newSt){r.status=newSt;if(r.timeline){const active=r.timeline.find(t=>t.state==='active');if(active){active.state='done';active.date=ns;active.note='已完成'}const next=r.timeline.find(t=>t.state==='pending');if(next)next.state='active'}showToast('状态更新为: '+newSt,'success')}}else if(action==='reopen'){r.status='分析中';if(r.timeline)r.timeline.forEach((t,i)=>{if(i<=1){t.state='done'}else if(i===2){t.state='active';t.date='';t.note=''}else{t.state='pending';t.date='';t.note=''}});showToast('已重新打开','info')}hideModal('genericDetailModal');renderQuality()}
function showQaDetail(id){const r=qualityData.find(x=>x.id===id);if(!r)return;const svb=s=>({致命:'badge-red',严重:'badge-yellow',一般:'badge-blue',轻微:'badge-gray'}[s]||'badge-gray');const stb=s=>({待处理:'badge-red',分析中:'badge-yellow',整改中:'badge-yellow',待验证:'badge-blue',已关闭:'badge-green'}[s]||'badge-gray');const nextStatus={待处理:'分析中',分析中:'整改中',整改中:'待验证',待验证:'已关闭'};let timelineHtml='';if(r.timeline){timelineHtml='<div class="timeline" style="margin-top:0">';r.timeline.forEach(function(t){const icon=t.state==='done'?'✓':t.state==='active'?'◉':'○';timelineHtml+='<div class="timeline-item"><div class="timeline-dot '+t.state+'">'+icon+'</div><div class="timeline-content"><div class="tl-title">'+t.title+' <span style="color:var(--text-muted);font-weight:400"> · '+t.user+'</span></div><div class="tl-meta">'+(t.date||'待处理')+(t.note?' · '+t.note:'')+'</div></div></div>'});timelineHtml+='</div>'}else{timelineHtml='<div style="color:var(--text-muted);font-size:12px">历史记录数据将在新建的问题中记录</div>'}document.getElementById('genericDetailTitle').textContent='🔬 '+r.id+' '+r.title;document.getElementById('genericDetailBody').innerHTML='<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">📋 基本信息</h3>'+detailGrid([['问题编号','<span style="color:var(--accent);font-weight:600">'+r.id+'</span>'],['问题标题',r.title],['类型',r.type],['严重程度','<span class="badge '+svb(r.severity)+'">'+r.severity+'</span>'],['关联物料','<span class="badge badge-blue" style="cursor:pointer" onclick="event.stopPropagation();navigateTo(\'materials\');document.getElementById(\'matSearch\').value=\''+r.material+'\';matPage=1;renderMaterials()">'+r.material+'</span>'],['责任人',r.owner],['发现日期',r.date],['状态','<span class="badge '+stb(r.status)+'">'+r.status+'</span>']])+'</div>'+'<div class="detail-card" style="margin-bottom:14px"><h3 style="font-size:14px">⏱ 处理流程</h3>'+timelineHtml+'</div>'+'<div class="detail-card" style="margin-bottom:0"><h3 style="font-size:14px">📊 8D 分析</h3><div style="font-size:12px;color:var(--text-secondary);line-height:1.6">'+(r.rootCause?'<b>根本原因：</b>'+r.rootCause+'<br>':'<span style="color:var(--text-muted)">待分析根本原因</span><br>')+(r.corrective?'<b>整改措施：</b>'+r.corrective:'<span style="color:var(--text-muted)">待制定整改措施</span>')+'</div></div>';let acts='';const ns=nextStatus[r.status];if(ns)acts+='<button class="btn btn-primary btn-sm" onclick="qaAction(\''+r.id+'\',\'advance\')">推进至 '+ns+'</button>';if(r.status==='已关闭')acts+='<button class="btn btn-secondary btn-sm" onclick="qaAction(\''+r.id+'\',\'reopen\')">🔄 重新打开</button>';if(r.status!=='已关闭')acts+='<button class="btn btn-danger btn-sm" onclick="hideModal(\'genericDetailModal\');deleteQa(\''+r.id+'\')">删除</button>';document.getElementById('genericDetailActions').innerHTML=acts;showModal('genericDetailModal')}

function doAprCenterAction(id,action){const a=aprCenterData.find(x=>x.id===id);if(!a)return;if(action==='approve'){a.status='已通过';showToast('已通过: '+a.title,'success')}else{a.status='已驳回';showToast('已驳回: '+a.title,'error')}renderApprovalCenter()}

function exportModuleCSV(mod){let headers=[],rows=[];if(mod==='projects'){headers=['项目编号','项目名称','阶段','负责人','开始日期','计划完成','状态','进度'];rows=projectsData.map(p=>[p.id,p.name,p.phase,p.owner,p.start,p.end,p.status,p.progress+'%'])}else if(mod==='changes'){headers=['变更单号','类型','标题','影响范围','发起人','发起日期','优先级','状态'];rows=changesData.map(c=>[c.id,c.type,c.title,c.scope,c.initiator,c.date,c.priority,c.status])}else if(mod==='documents'){headers=['文档编号','文档名称','类型','版本','关联项目','上传人','更新日期','状态'];rows=documentsData.map(d=>[d.id,d.name,d.type,d.ver,d.project,d.uploader,d.date,d.status])}else if(mod==='suppliers'){headers=['供应商编号','供应商名称','类型','等级','联系人','供货物料数','合作状态','评分'];rows=suppliersData.map(s=>[s.id,s.name,s.type,s.grade,s.contact,s.matCount,s.status,s.score])}else if(mod==='quality'){headers=['问题编号','问题标题','类型','严重程度','关联物料','责任人','发现日期','状态'];rows=qualityData.map(r=>[r.id,r.title,r.type,r.severity,r.material,r.owner,r.date,r.status])}const bom='\uFEFF';const csv=bom+[headers.join(','),...rows.map(r=>r.map(c=>'"'+(c+'').replace(/"/g,'""')+'"').join(','))].join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a2=document.createElement('a');a2.href=url;a2.download=mod+'_export_'+todayISO()+'.csv';document.body.appendChild(a2);a2.click();document.body.removeChild(a2);URL.revokeObjectURL(url);showToast('已导出 '+rows.length+' 条记录','success')}

// ========== PDM MODULES ==========

var lifecyclePhases = ['新建','试产','量产','EOL','停产'];
var lcPhaseColors = {'新建':'var(--blue)','试产':'var(--yellow)','量产':'var(--green)','EOL':'var(--orange)','停产':'var(--red)'};
var lcBadgeClass = {'新建':'badge-blue','试产':'badge-yellow','量产':'badge-green','EOL':'badge-yellow','停产':'badge-red'};

var lifecycleData = [];
function buildLifecycleData() {
  lifecycleData = materialsFlat.map(function(m) {
    var hash = 0; for(var i=0;i<m.id.length;i++) hash=((hash<<5)-hash)+m.id.charCodeAt(i);
    hash = Math.abs(hash);
    var phase = m.status === '停用' ? '停产' : m.status === '待审' ? '新建' : lifecyclePhases[hash % 3 + 1];
    var eolDate = phase === 'EOL' ? '2025-09-' + String(10 + (hash % 20)).padStart(2,'0') : phase === '量产' && hash % 5 === 0 ? '2026-03-' + String(1 + (hash % 28)).padStart(2,'0') : '';
    return {id:m.id, name:m.name, phase:phase, supplier:m.supplier, eolDate:eolDate, lastChange:m.id.includes('20') ? '2025-06-' + String(1 + hash % 14).padStart(2,'0') : '2025-05-01'};
  });
}

function renderLifecycle() {
  buildLifecycleData();
  var q = (document.getElementById('lcSearch')?.value || '').toLowerCase();
  var pf = document.getElementById('lcPhaseFilter')?.value || 'all';
  var data = lifecycleData;
  if (pf !== 'all') data = data.filter(function(d) { return d.phase === pf; });
  if (q) data = data.filter(function(d) { return d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q); });
  var counts = {}; lifecyclePhases.forEach(function(p) { counts[p] = 0; }); lifecycleData.forEach(function(d) { counts[d.phase]++; });
  var sc = document.getElementById('lcStatCards');
  if (sc) sc.innerHTML = lifecyclePhases.map(function(p) { return '<div class="stat-card"><div class="stat-num" style="color:'+lcPhaseColors[p]+'">'+counts[p]+'</div><div class="stat-label">'+p+'</div></div>'; }).join('');
  var flow = document.getElementById('lcFlowChart');
  if (flow) flow.innerHTML = lifecyclePhases.map(function(p, i) {
    return '<div style="display:flex;align-items:center;gap:8px">' +
      '<div style="padding:10px 20px;background:'+lcPhaseColors[p]+';color:#fff;border-radius:var(--radius);font-weight:600;font-size:13px;min-width:70px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.15)">' + p + '<div style="font-size:10px;font-weight:400;opacity:.8;margin-top:2px">'+counts[p]+' 项</div></div>' +
      (i < lifecyclePhases.length - 1 ? '<span style="font-size:18px;color:var(--text-muted)">→</span>' : '') + '</div>';
  }).join('');
  var kanban = document.getElementById('lcKanban');
  if (kanban) kanban.innerHTML = lifecyclePhases.map(function(p) {
    var items = data.filter(function(d) { return d.phase === p; }).slice(0, 8);
    return '<div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:12px;min-height:200px">' +
      '<div style="font-weight:600;font-size:12px;margin-bottom:10px;display:flex;justify-content:space-between"><span class="badge '+lcBadgeClass[p]+'">'+p+'</span><span style="color:var(--text-muted)">'+items.length+'</span></div>' +
      items.map(function(d) {
        return '<div style="padding:8px;background:var(--bg-primary);border:1px solid var(--border-light);border-radius:var(--radius-sm);margin-bottom:6px;font-size:11px;cursor:pointer" onclick="navigateTo(\'materials\');showMatDetail(\''+d.id+'\')">' +
          '<div style="font-weight:500;color:var(--accent)">'+d.id+'</div><div style="color:var(--text-secondary);margin-top:2px">'+d.name+'</div>' +
          (d.eolDate ? '<div style="color:var(--orange);margin-top:3px;font-size:10px">⚠ EOL: '+d.eolDate+'</div>' : '') + '</div>';
      }).join('') + '</div>';
  }).join('');
  var eolAlerts = document.getElementById('lcEolAlerts');
  var eolItems = lifecycleData.filter(function(d) { return d.eolDate; });
  if (eolAlerts) eolAlerts.innerHTML = eolItems.length === 0 ? '<div style="text-align:center;padding:16px;color:var(--green);font-size:12px">✅ 暂无EOL预警</div>' :
    eolItems.sort(function(a,b){return a.eolDate.localeCompare(b.eolDate);}).map(function(d) {
      var days = Math.max(0, Math.round((new Date(d.eolDate) - new Date()) / 86400000));
      var urgent = days < 90;
      return '<div style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid '+(urgent?'var(--red)':'var(--border)')+';border-left:3px solid '+(urgent?'var(--red)':'var(--orange)')+';border-radius:var(--radius);margin-bottom:6px;font-size:12px">' +
        '<span style="font-size:16px">'+(urgent?'🔴':'🟡')+'</span>' +
        '<div style="flex:1"><b style="color:var(--accent)">'+d.id+'</b> '+d.name+'</div>' +
        '<div style="text-align:right"><div style="font-weight:600;color:'+(urgent?'var(--red)':'var(--orange)')+'">'+d.eolDate+'</div><div style="font-size:10px;color:var(--text-muted)">剩余 '+days+' 天</div></div></div>';
    }).join('');
}

function renderCostAnalysis() {
  var totalCost = materialsFlat.reduce(function(s,m){return s+m.price*m.qty;},0);
  var directCost = totalCost * 0.65;
  var indirectCost = totalCost * 0.35;
  var avgUnit = materialsFlat.length ? totalCost / materialsFlat.reduce(function(s,m){return s+m.qty;},0) : 0;
  var sc = document.getElementById('costStatCards');
  if(sc) sc.innerHTML = '<div class="stat-card"><div class="stat-num" style="color:var(--accent)">¥'+totalCost.toFixed(0)+'</div><div class="stat-label">总BOM成本</div></div><div class="stat-card"><div class="stat-num" style="color:var(--green)">¥'+directCost.toFixed(0)+'</div><div class="stat-label">直接材料</div></div><div class="stat-card"><div class="stat-num" style="color:var(--blue)">¥'+indirectCost.toFixed(0)+'</div><div class="stat-label">间接成本</div></div><div class="stat-card"><div class="stat-num" style="color:var(--orange)">¥'+avgUnit.toFixed(2)+'</div><div class="stat-label">平均单价</div></div>';
  var rollup = document.getElementById('costRollup');
  if(rollup && bomData.children) {
    rollup.innerHTML = '<table style="width:100%;font-size:12px"><thead><tr><th>组件</th><th>直接成本</th><th>子项成本</th><th>总成本</th><th>占比</th></tr></thead><tbody>' +
      bomData.children.map(function(child) {
        var cost = computeNodeCost(child);
        var pct = totalCost > 0 ? (cost.total / totalCost * 100).toFixed(1) : '0';
        return '<tr><td style="font-weight:500">'+child.icon+' '+child.name+'</td><td class="text-right">¥'+cost.self.toFixed(2)+'</td><td class="text-right">¥'+cost.children.toFixed(2)+'</td><td class="text-right" style="font-weight:600;color:var(--accent)">¥'+cost.total.toFixed(2)+'</td><td><div style="display:flex;align-items:center;gap:6px"><div style="flex:1;height:6px;background:var(--bg-tertiary);border-radius:3px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:var(--accent);border-radius:3px"></div></div><span style="min-width:36px;text-align:right;color:var(--text-muted)">'+pct+'%</span></div></td></tr>';
      }).join('') + '</tbody></table>';
  }
  var track = document.getElementById('costDownTrack');
  var targets = [{name:'V1.0→V2.0 电容国产化',saved:320,target:500},{name:'V2.0→V3.0 IC替代降本',saved:180,target:400},{name:'Q3 包材优化',saved:50,target:200},{name:'Q4 供应商议价',saved:0,target:600}];
  if(track) track.innerHTML = targets.map(function(t) {
    var pct = Math.min(100, (t.saved / t.target * 100));
    return '<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span style="font-weight:500">'+t.name+'</span><span style="color:var(--green)">¥'+t.saved+' / ¥'+t.target+'</span></div><div style="height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,var(--green),var(--accent));border-radius:4px;transition:width .3s"></div></div></div>';
  }).join('');
  var selA = document.getElementById('costVerA');
  var selB = document.getElementById('costVerB');
  if(selA && versions) { selA.innerHTML = versions.map(function(v){return '<option value="'+v.ver+'">'+v.ver+'</option>';}).join(''); selA.value = versions[1]?.ver || versions[0].ver; }
  if(selB && versions) { selB.innerHTML = versions.map(function(v){return '<option value="'+v.ver+'">'+v.ver+'</option>';}).join(''); selB.value = versions[0].ver; }
  renderCostCompare();
}

function renderCostCompare() {
  var el = document.getElementById('costCompare');
  if (!el) return;
  var verA = document.getElementById('costVerA')?.value || '';
  var verB = document.getElementById('costVerB')?.value || '';
  var totalA = materialsFlat.reduce(function(s,m){return s+m.price*m.qty;},0) * 0.85;
  var totalB = materialsFlat.reduce(function(s,m){return s+m.price*m.qty;},0);
  var diff = totalB - totalA;
  var pct = totalA > 0 ? ((diff / totalA) * 100).toFixed(1) : '0';
  el.innerHTML = '<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center;text-align:center;padding:16px"><div><div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">'+verA+'</div><div style="font-size:22px;font-weight:700;color:var(--text-secondary)">¥'+totalA.toFixed(0)+'</div></div><div style="font-size:24px;color:'+(diff>0?'var(--red)':'var(--green)')+'">→ '+(diff>0?'↑':'↓')+' '+(diff>0?'+':'')+pct+'%</div><div><div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">'+verB+'</div><div style="font-size:22px;font-weight:700;color:var(--accent)">¥'+totalB.toFixed(0)+'</div></div></div>' +
    '<div style="font-size:12px;color:var(--text-muted);text-align:center;margin-top:8px">成本变化: <b style="color:'+(diff>0?'var(--red)':'var(--green)');+'">'+(diff>0?'+':'')+'¥'+diff.toFixed(0)+'</b></div>';
}

var inventoryData = [];
function buildInventoryData() {
  inventoryData = materialsFlat.map(function(m) {
    var hash = 0; for(var i=0;i<m.id.length;i++) hash=((hash<<5)-hash)+m.id.charCodeAt(i); hash=Math.abs(hash);
    var demand = m.qty * (10 + hash % 50);
    var stock = Math.round(demand * (0.3 + (hash % 150) / 100));
    var safety = Math.round(demand * 0.3);
    var moq = Math.max(100, Math.round(demand / 10) * 10);
    var leadDays = 7 + hash % 28;
    var status = stock < safety ? 'shortage' : stock > demand * 2 ? 'overstock' : stock < safety * 1.5 ? 'reorder' : 'ok';
    return {id:m.id, name:m.name, demand:demand, stock:stock, safety:safety, moq:moq, leadDays:leadDays, status:status, supplier:m.supplier, price:m.price};
  });
}

function renderInventory() {
  buildInventoryData();
  var q = (document.getElementById('invSearch')?.value||'').toLowerCase();
  var af = document.getElementById('invAlertFilter')?.value||'all';
  var data = inventoryData;
  if(af!=='all') data=data.filter(function(d){return d.status===af;});
  if(q) data=data.filter(function(d){return d.id.toLowerCase().includes(q)||d.name.toLowerCase().includes(q);});
  var sc = document.getElementById('invStatCards');
  var shortage=inventoryData.filter(function(d){return d.status==='shortage';}).length;
  var reorder=inventoryData.filter(function(d){return d.status==='reorder';}).length;
  var overstock=inventoryData.filter(function(d){return d.status==='overstock';}).length;
  var totalVal=inventoryData.reduce(function(s,d){return s+d.stock*d.price;},0);
  if(sc) sc.innerHTML='<div class="stat-card"><div class="stat-num" style="color:var(--red)">'+shortage+'</div><div class="stat-label">缺料预警</div></div><div class="stat-card"><div class="stat-num" style="color:var(--yellow)">'+reorder+'</div><div class="stat-label">需要补货</div></div><div class="stat-card"><div class="stat-num" style="color:var(--blue)">'+overstock+'</div><div class="stat-label">库存过剩</div></div><div class="stat-card"><div class="stat-num" style="color:var(--green)">¥'+Math.round(totalVal/10000)+'万</div><div class="stat-label">库存总值</div></div>';
  var statusBadge={'shortage':'<span class="badge badge-red">缺料</span>','reorder':'<span class="badge badge-yellow">补货</span>','overstock':'<span class="badge badge-blue">过剩</span>','ok':'<span class="badge badge-green">正常</span>'};
  var actionMap={'shortage':'紧急采购','reorder':'建议补货','overstock':'控制入库','ok':'—'};
  var tb=document.getElementById('invBody');
  if(tb) tb.innerHTML=data.slice(0,30).map(function(d){
    return '<tr><td style="color:var(--accent);font-weight:500">'+d.id+'</td><td>'+d.name+'</td><td class="text-right">'+d.demand+'</td><td class="text-right" style="font-weight:600;color:'+(d.stock<d.safety?'var(--red)':'var(--text-primary)')+'">'+d.stock+'</td><td class="text-right">'+d.safety+'</td><td class="text-right">'+d.moq+'</td><td class="text-right">'+d.leadDays+'天</td><td>'+statusBadge[d.status]+'</td><td style="font-size:11px;color:'+(d.status==='shortage'?'var(--red)':'var(--text-secondary)')+'">'+actionMap[d.status]+'</td></tr>';
  }).join('');
  var sa=document.getElementById('shortageAnalysis');
  var shortItems=inventoryData.filter(function(d){return d.status==='shortage';});
  var shortVal=shortItems.reduce(function(s,d){return s+(d.safety-d.stock)*d.price;},0);
  if(sa) sa.innerHTML='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px"><div class="stat-card"><div class="stat-num" style="color:var(--red)">'+shortItems.length+'</div><div class="stat-label">缺料物料数</div></div><div class="stat-card"><div class="stat-num" style="color:var(--orange)">¥'+shortVal.toFixed(0)+'</div><div class="stat-label">预估采购金额</div></div><div class="stat-card"><div class="stat-num" style="color:var(--yellow)">'+Math.round(shortItems.reduce(function(s,d){return s+d.leadDays;},0)/Math.max(shortItems.length,1))+'天</div><div class="stat-label">平均交期</div></div></div>';
}

function exportInventoryReport() {
  buildInventoryData();
  var shortage = inventoryData.filter(function(d){return d.status==='shortage'||d.status==='reorder';});
  var csv = '\uFEFF物料编号,物料名称,需求量,库存量,缺口,MOQ,建议采购量,供应商\n';
  shortage.forEach(function(d) { var gap=Math.max(0,d.safety-d.stock); var order=Math.max(d.moq,Math.ceil(gap/d.moq)*d.moq); csv+='"'+d.id+'","'+d.name+'",'+d.demand+','+d.stock+','+gap+','+d.moq+','+order+',"'+d.supplier+'"\n'; });
  var blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});var link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='采购需求_'+todayStr()+'.csv';document.body.appendChild(link);link.click();document.body.removeChild(link);
  showToast('采购需求已导出 ('+shortage.length+' 项)','success');
}

var processRoutes = [
  {id:'PRC-001',name:'主板PCBA加工',product:'A100 整机',steps:[{name:'钢网印刷',type:'SMT',time:5},{name:'贴片',type:'SMT',time:15},{name:'回流焊',type:'SMT',time:8},{name:'AOI检测',type:'检测',time:3},{name:'DIP插件',type:'DIP',time:10},{name:'波峰焊',type:'DIP',time:6},{name:'ICT测试',type:'测试',time:5},{name:'功能测试',type:'测试',time:8}],status:'已发布',creator:'张工'},
  {id:'PRC-002',name:'整机组装',product:'A100 整机',steps:[{name:'主板安装',type:'组装',time:3},{name:'屏幕贴合',type:'组装',time:5},{name:'排线连接',type:'组装',time:4},{name:'外壳装配',type:'组装',time:6},{name:'整机测试',type:'测试',time:10},{name:'包装',type:'包装',time:3}],status:'已发布',creator:'李工'},
  {id:'PRC-003',name:'手环PCBA加工',product:'D400 手环',steps:[{name:'钢网印刷',type:'SMT',time:4},{name:'贴片',type:'SMT',time:12},{name:'回流焊',type:'SMT',time:7},{name:'X-Ray检测',type:'检测',time:5},{name:'功能测试',type:'测试',time:6}],status:'审核中',creator:'王主管'},
  {id:'PRC-004',name:'路由器组装',product:'R900 路由器',steps:[{name:'主板安装',type:'组装',time:4},{name:'天线焊接',type:'焊接',time:8},{name:'外壳装配',type:'组装',time:5},{name:'RF测试',type:'测试',time:12},{name:'老化测试',type:'测试',time:24},{name:'包装',type:'包装',time:2}],status:'草稿',creator:'张工'}
];

function renderProcessRoutes() {
  var sc=document.getElementById('procStatCards');
  if(sc) sc.innerHTML='<div class="stat-card"><div class="stat-num" style="color:var(--accent)">'+processRoutes.length+'</div><div class="stat-label">工艺路线</div></div><div class="stat-card"><div class="stat-num" style="color:var(--green)">'+processRoutes.filter(function(p){return p.status==='已发布';}).length+'</div><div class="stat-label">已发布</div></div><div class="stat-card"><div class="stat-num" style="color:var(--blue)">'+processRoutes.reduce(function(s,p){return s+p.steps.length;},0)+'</div><div class="stat-label">总工序数</div></div><div class="stat-card"><div class="stat-num" style="color:var(--orange)">'+processRoutes.reduce(function(s,p){return s+p.steps.reduce(function(t,st){return t+st.time;},0);},0)+'min</div><div class="stat-label">总工时</div></div>';
  var list=document.getElementById('processList');
  var typeColors={'SMT':'#2563eb','DIP':'#7c3aed','组装':'#059669','测试':'#d97706','检测':'#0891b2','焊接':'#dc2626','包装':'#64748b'};
  if(list) list.innerHTML=processRoutes.map(function(p) {
    var totalTime=p.steps.reduce(function(s,st){return s+st.time;},0);
    var stBadge={'已发布':'badge-green','审核中':'badge-yellow','草稿':'badge-gray'}[p.status]||'badge-gray';
    return '<div style="padding:16px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:12px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><div><span style="font-weight:600;font-size:14px;color:var(--accent)">'+p.id+'</span> <span style="font-weight:600">'+p.name+'</span> <span class="badge badge-purple" style="margin-left:6px">'+p.product+'</span></div><div style="display:flex;gap:8px;align-items:center"><span style="font-size:11px;color:var(--text-muted)">'+p.creator+' · '+totalTime+'min</span><span class="badge '+stBadge+'">'+p.status+'</span></div></div>' +
      '<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap">' + p.steps.map(function(st,i) {
        var c=typeColors[st.type]||'#94a3b8';
        return '<div style="display:flex;align-items:center;gap:4px">' +
          '<div style="padding:8px 12px;background:'+c+'15;border:1px solid '+c+'30;border-radius:var(--radius-sm);font-size:11px;text-align:center;min-width:70px"><div style="font-weight:600;color:'+c+'">'+st.name+'</div><div style="color:var(--text-muted);font-size:10px;margin-top:2px">'+st.type+' · '+st.time+'min</div></div>' +
          (i<p.steps.length-1?'<span style="color:var(--text-muted);font-size:12px">→</span>':'') + '</div>';
      }).join('') + '</div></div>';
  }).join('');
}
function showNewProcessModal() { showToast('工艺路线编辑器开发中…','info'); }

var productConfigs = [
  {id:'CFG-A100',product:'A100 整机',variants:[{name:'标准版',sku:'A100-STD',ram:'4GB',storage:'64GB',color:'黑色',price:299},{name:'高配版',sku:'A100-PRO',ram:'8GB',storage:'128GB',color:'黑色',price:399},{name:'尊享版',sku:'A100-MAX',ram:'8GB',storage:'256GB',color:'白色',price:499}]},
  {id:'CFG-P12A',product:'P12A 手机',variants:[{name:'标准版',sku:'P12A-128',ram:'8GB',storage:'128GB',color:'星空黑',price:3999},{name:'Pro版',sku:'P12A-256',ram:'12GB',storage:'256GB',color:'远峰蓝',price:4999},{name:'Ultra版',sku:'P12A-512',ram:'16GB',storage:'512GB',color:'暗夜紫',price:6999}]},
  {id:'CFG-D400',product:'D400 手环',variants:[{name:'运动版',sku:'D400-SPT',sensor:'心率+血氧',strap:'硅胶',color:'黑色',price:199},{name:'时尚版',sku:'D400-FSH',sensor:'心率+血氧+体温',strap:'不锈钢',color:'银色',price:299}]}
];
var optionalParts = [
  {group:'充电器',required:false,options:[{name:'5W充电器',id:'CHG-5W',price:15},{name:'18W快充',id:'CHG-18W',price:35},{name:'无(不含充电器)',id:'CHG-NONE',price:0}]},
  {group:'耳机',required:false,options:[{name:'有线耳机',id:'EAR-WIRE',price:12},{name:'TWS无线耳机',id:'EAR-TWS',price:89},{name:'无',id:'EAR-NONE',price:0}]},
  {group:'保护壳',required:false,options:[{name:'硅胶壳',id:'CASE-SIL',price:8},{name:'钢化膜+壳套装',id:'CASE-SET',price:25},{name:'无',id:'CASE-NONE',price:0}]},
  {group:'存储扩展',required:false,options:[{name:'无',id:'SD-NONE',price:0},{name:'64GB TF卡',id:'SD-64',price:39},{name:'128GB TF卡',id:'SD-128',price:69}]}
];

function renderProductConfig() {
  var totalVariants=productConfigs.reduce(function(s,c){return s+c.variants.length;},0);
  var sc=document.getElementById('cfgStatCards');
  if(sc) sc.innerHTML='<div class="stat-card"><div class="stat-num" style="color:var(--accent)">'+productConfigs.length+'</div><div class="stat-label">产品系列</div></div><div class="stat-card"><div class="stat-num" style="color:var(--blue)">'+totalVariants+'</div><div class="stat-label">总变型数</div></div><div class="stat-card"><div class="stat-num" style="color:var(--green)">'+optionalParts.length+'</div><div class="stat-label">可选配置组</div></div><div class="stat-card"><div class="stat-num" style="color:var(--orange)">'+optionalParts.reduce(function(s,g){return s+g.options.length;},0)+'</div><div class="stat-label">可选项总数</div></div>';
  var vm=document.getElementById('variantMatrix');
  if(vm) vm.innerHTML=productConfigs.map(function(cfg) {
    var cols=Object.keys(cfg.variants[0]).filter(function(k){return k!=='name'&&k!=='sku';});
    return '<div style="margin-bottom:16px"><div style="font-weight:600;font-size:13px;margin-bottom:8px;color:var(--accent)">'+cfg.product+'</div>' +
      '<table style="width:100%;font-size:11px"><thead><tr><th>变型</th><th>SKU</th>'+cols.map(function(c){return '<th>'+c+'</th>';}).join('')+'</tr></thead><tbody>'+
      cfg.variants.map(function(v){return '<tr><td style="font-weight:500">'+v.name+'</td><td style="color:var(--accent)">'+v.sku+'</td>'+cols.map(function(c){var val=v[c];return '<td>'+(c==='price'?'¥'+val:val)+'</td>';}).join('')+'</tr>';}).join('')+
      '</tbody></table></div>';
  }).join('');
  var op=document.getElementById('optionalParts');
  if(op) op.innerHTML=optionalParts.map(function(g) {
    return '<div style="margin-bottom:14px"><div style="font-weight:600;font-size:12px;margin-bottom:6px">'+g.group+(g.required?' <span class="badge badge-red" style="font-size:9px">必选</span>':' <span class="badge badge-gray" style="font-size:9px">可选</span>')+'</div>' +
      g.options.map(function(o){return '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid var(--border-light);border-radius:var(--radius-sm);margin-bottom:4px;font-size:11px"><span style="color:var(--accent);width:70px">'+o.id+'</span><span style="flex:1">'+o.name+'</span><span style="font-weight:500;color:var(--text-secondary)">'+(o.price>0?'+¥'+o.price:'—')+'</span></div>';}).join('') +
      '</div>';
  }).join('');
}

var complianceData = [];
function buildComplianceData() {
  complianceData = materialsFlat.map(function(m) {
    var hash=0;for(var i=0;i<m.id.length;i++)hash=((hash<<5)-hash)+m.id.charCodeAt(i);hash=Math.abs(hash);
    var rohs = hash%10<8?'合规':(hash%10===8?'待检':'不合规');
    var reach = hash%12<9?'合规':(hash%12===9?'待检':'不合规');
    var conflict = hash%8<6?'无风险':(hash%8===6?'待查':'有风险');
    var ul = m.id.startsWith('IC')||m.id.startsWith('PWR')?(hash%6<4?'已认证':'即将到期'):'N/A';
    var expiry = ul==='即将到期'?'2025-'+(7+hash%5)+'-'+(1+hash%28):'';
    return {id:m.id,name:m.name,rohs:rohs,reach:reach,conflict:conflict,ul:ul,expiry:expiry};
  });
}

function renderCompliance() {
  buildComplianceData();
  var tf=document.getElementById('compTypeFilter')?.value||'all';
  var sf=document.getElementById('compStatusFilter')?.value||'all';
  var data=complianceData;
  if(sf!=='all') data=data.filter(function(d){return d.rohs===sf||d.reach===sf||d.ul===sf||(sf==='不合规'&&d.conflict==='有风险');});
  var rohsOk=complianceData.filter(function(d){return d.rohs==='合规';}).length;
  var rohsFail=complianceData.filter(function(d){return d.rohs==='不合规';}).length;
  var ulExpiry=complianceData.filter(function(d){return d.ul==='即将到期';}).length;
  var conflictRisk=complianceData.filter(function(d){return d.conflict==='有风险';}).length;
  var sc=document.getElementById('compStatCards');
  if(sc) sc.innerHTML='<div class="stat-card"><div class="stat-num" style="color:var(--green)">'+rohsOk+'</div><div class="stat-label">RoHS合规</div></div><div class="stat-card"><div class="stat-num" style="color:var(--red)">'+rohsFail+'</div><div class="stat-label">RoHS不合规</div></div><div class="stat-card"><div class="stat-num" style="color:var(--yellow)">'+ulExpiry+'</div><div class="stat-label">认证即将到期</div></div><div class="stat-card"><div class="stat-num" style="color:var(--orange)">'+conflictRisk+'</div><div class="stat-label">冲突矿物风险</div></div>';
  var compBadge=function(v){return v==='合规'||v==='无风险'||v==='已认证'?'<span class="badge badge-green">'+v+'</span>':v==='待检'||v==='待查'||v==='即将到期'?'<span class="badge badge-yellow">'+v+'</span>':v==='不合规'||v==='有风险'?'<span class="badge badge-red">'+v+'</span>':'<span class="badge badge-gray">'+v+'</span>';};
  var tb=document.getElementById('compBody');
  if(tb) tb.innerHTML=data.slice(0,40).map(function(d){
    var overallStatus=d.rohs==='不合规'||d.conflict==='有风险'?'不合规':d.rohs==='待检'||d.reach==='待检'||d.ul==='即将到期'?'待检':'合规';
    return '<tr><td style="color:var(--accent);font-weight:500">'+d.id+'</td><td>'+d.name+'</td><td>'+compBadge(d.rohs)+'</td><td>'+compBadge(d.reach)+'</td><td>'+compBadge(d.conflict)+'</td><td>'+compBadge(d.ul)+'</td><td style="font-size:11px;color:var(--text-muted)">'+(d.expiry||'—')+'</td><td>'+compBadge(overallStatus)+'</td></tr>';
  }).join('');
  var alerts=document.getElementById('compAlerts');
  var alertItems=complianceData.filter(function(d){return d.ul==='即将到期'||d.rohs==='不合规'||d.conflict==='有风险';});
  if(alerts) alerts.innerHTML=alertItems.length===0?'<div style="text-align:center;padding:16px;color:var(--green);font-size:12px">✅ 所有物料合规</div>':
    alertItems.slice(0,10).map(function(d){
      var reason=d.rohs==='不合规'?'RoHS不合规':d.conflict==='有风险'?'冲突矿物风险':'UL认证即将到期';
      var color=d.rohs==='不合规'?'var(--red)':d.conflict==='有风险'?'var(--orange)':'var(--yellow)';
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid var(--border);border-left:3px solid '+color+';border-radius:var(--radius);margin-bottom:6px;font-size:12px"><b style="color:var(--accent);min-width:80px">'+d.id+'</b><span style="flex:1">'+d.name+'</span><span style="color:'+color+';font-weight:500">'+reason+'</span>'+(d.expiry?'<span style="color:var(--text-muted);font-size:10px">到期: '+d.expiry+'</span>':'')+'</div>';
    }).join('');
}

function exportComplianceReport() {
  buildComplianceData();
  var csv='\uFEFF物料编号,物料名称,RoHS,REACH,冲突矿物,UL认证,认证到期\n';
  complianceData.forEach(function(d){csv+='"'+d.id+'","'+d.name+'","'+d.rohs+'","'+d.reach+'","'+d.conflict+'","'+d.ul+'","'+(d.expiry||'')+'"\n';});
  var blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});var link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='合规报告_'+todayStr()+'.csv';document.body.appendChild(link);link.click();document.body.removeChild(link);
  showToast('合规报告已导出','success');
}

// ========== ENHANCEMENTS ==========

var auditLog = [];
var recentAccess = [];
try { recentAccess = JSON.parse(localStorage.getItem('bom_recent') || '[]'); } catch(e) { recentAccess = []; }

function validateField(id, label) {
  var el = document.getElementById(id);
  var errEl = document.getElementById(id + 'Error');
  if (!el) return true;
  var val = (el.value || '').trim();
  if (!val) {
    el.closest('.form-group')?.classList.add('form-error');
    if (errEl) { errEl.textContent = label + '不能为空'; errEl.classList.add('show'); }
    el.focus();
    return false;
  }
  el.closest('.form-group')?.classList.remove('form-error');
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
  return true;
}

function clearFieldError(id) {
  var el = document.getElementById(id);
  var errEl = document.getElementById(id + 'Error');
  if (el) el.closest('.form-group')?.classList.remove('form-error');
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
}

function btnLoading(btn, text) {
  if (!btn) return;
  btn._origText = btn.textContent;
  btn.textContent = text || '保存中…';
  btn.classList.add('btn-loading');
  btn.disabled = true;
}

function btnReset(btn) {
  if (!btn) return;
  btn.textContent = btn._origText || '保存';
  btn.classList.remove('btn-loading');
  btn.disabled = false;
}

var _origSaveMaterial = saveMaterial;
saveMaterial = function() {
  if (!validateField('matFormId', '物料编号')) return;
  if (!validateField('matFormName', '物料名称')) return;
  var btn = document.querySelector('#materialModal .btn-primary');
  btnLoading(btn);
  setTimeout(function() { btnReset(btn); _origSaveMaterial(); logAction('保存物料', document.getElementById('matFormId').value); }, 300);
};

var _origSaveNode = saveNode;
saveNode = function() {
  if (!validateField('nodeFormId', '物料编号')) return;
  if (!validateField('nodeFormName', '物料名称')) return;
  var btn = document.querySelector('#nodeModal .btn-primary');
  btnLoading(btn);
  setTimeout(function() { btnReset(btn); _origSaveNode(); logAction('保存BOM节点', document.getElementById('nodeFormId').value); }, 300);
};

var _origCreateVersion = createVersion;
createVersion = function() {
  if (!validateField('verFormNum', '版本号')) return;
  if (!validateField('verFormDesc', '变更说明')) return;
  var btn = document.querySelector('#versionModal .btn-primary');
  btnLoading(btn);
  setTimeout(function() { btnReset(btn); _origCreateVersion(); logAction('创建版本', document.getElementById('verFormNum').value); }, 300);
};

var _origDoApprove = doApprove;
doApprove = function() {
  var action = document.getElementById('approveAction').value;
  if (!validateField('approveComment', '审批意见')) return;
  var btn = document.getElementById('approveSubmitBtn');
  btnLoading(btn, action === 'approve' ? '提交中…' : '驳回中…');
  setTimeout(function() {
    btnReset(btn);
    _origDoApprove();
    logAction(action === 'approve' ? '审批通过' : '审批驳回', document.getElementById('approveIdx').value);
  }, 300);
};

var _origShowToast = showToast;
showToast = function(msg, type, undoFn, duration) {
  type = type || 'info';
  duration = duration || (type === 'error' ? 5000 : 3200);
  var container = document.getElementById('toastContainer');
  if (!container) return;
  var t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  if (undoFn) {
    var undoBtn = document.createElement('span');
    undoBtn.className = 'toast-undo';
    undoBtn.textContent = '撤销';
    undoBtn.onclick = function(e) {
      e.stopPropagation();
      undoFn();
      if (t.parentNode) t.parentNode.removeChild(t);
      _origShowToast('已撤销', 'info');
    };
    t.appendChild(undoBtn);
  }
  container.appendChild(t);
  setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, duration);
};

var _origDeleteMaterial = deleteMaterial;
deleteMaterial = function(id) {
  var m = findNode(id);
  if (!m) return;
  showConfirm('确定删除物料 "' + m.name + '" 吗？', function() {
    var parent = findParent(id);
    var idx = -1;
    if (parent && parent.children) {
      idx = parent.children.indexOf(m);
      parent.children = parent.children.filter(function(c) { return c.id !== id; });
    }
    selectedMatIds.delete(id);
    rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar(); updateNavBadges();
    logAction('删除物料', m.name + ' (' + id + ')');
    showToast('物料 "' + m.name + '" 已删除', 'info', function() {
      if (parent && idx >= 0) {
        if (!parent.children) parent.children = [];
        parent.children.splice(idx, 0, m);
        rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar(); updateNavBadges();
      }
    }, 5000);
  });
};

var _origBatchDelete = batchDelete;
batchDelete = function() {
  if (selectedMatIds.size === 0) return;
  var items = [];
  selectedMatIds.forEach(function(id) {
    var m = findNode(id);
    if (m) items.push(m.name + ' (' + id + ')');
  });
  var listText = '确定删除以下 ' + items.length + ' 个物料吗？\n\n' + items.slice(0, 8).join('\n') + (items.length > 8 ? '\n…还有 ' + (items.length - 8) + ' 项' : '');
  showConfirm(listText, function() {
    var backup = [];
    selectedMatIds.forEach(function(id) {
      var parent = findParent(id);
      var node = findNode(id);
      if (parent && parent.children && node) {
        backup.push({parent: parent, node: node, idx: parent.children.indexOf(node)});
        parent.children = parent.children.filter(function(c) { return c.id !== id; });
      }
    });
    var count = selectedMatIds.size;
    selectedMatIds.clear();
    rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
    logAction('批量删除', count + ' 个物料');
    showToast('已删除 ' + count + ' 个物料', 'info', function() {
      backup.forEach(function(b) {
        if (!b.parent.children) b.parent.children = [];
        b.parent.children.splice(b.idx, 0, b.node);
      });
      rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
    }, 5000);
  });
};

function toggleTheme() {
  var html = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? '' : 'dark');
  var btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
  try { localStorage.setItem('bom_theme', isDark ? '' : 'dark'); } catch(e) {}
}

function initTheme() {
  try {
    var saved = localStorage.getItem('bom_theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      var btn = document.getElementById('themeToggle');
      if (btn) btn.textContent = '☀️';
    }
  } catch(e) {}
}

var _origBuildTreeNode = buildTreeNode;
buildTreeNode = function(node, depth) {
  var div = _origBuildTreeNode(node, depth);
  var row = div.querySelector(':scope > .tree-row');
  if (row) row.setAttribute('title', '双击编辑 · 右键更多操作');
  return div;
};

var _origTreeSearch = null;
function enhanceTreeSearch() {
  var searchEl = document.getElementById('treeSearch');
  if (!searchEl) return;
  searchEl.removeEventListener('input', searchEl._handler);
  searchEl._handler = function(e) {
    treeSearchTerm = e.target.value;
    renderTree();
    if (treeSearchTerm) {
      var hl = document.querySelector('.tree-row .highlight');
      if (hl) {
        var row = hl.closest('.tree-row');
        var parent = row;
        while (parent) {
          var children = parent.closest('.tree-children');
          if (children) { children.classList.add('open'); var arrow = children.previousElementSibling?.querySelector('.tree-arrow'); if (arrow) arrow.classList.add('expanded'); }
          parent = children ? children.parentElement : null;
        }
        setTimeout(function() { row.scrollIntoView({behavior:'smooth',block:'center'}); }, 100);
      }
    }
  };
  searchEl.addEventListener('input', searchEl._handler);
}

var _origRenderSearchDropdown = renderSearchDropdown;
renderSearchDropdown = function(query) {
  var dropdown = document.getElementById('searchDropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = 'searchDropdown';
    dropdown.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow-xl);max-height:380px;overflow-y:auto;z-index:300;display:none;margin-top:4px';
    document.querySelector('.global-search').appendChild(dropdown);
  }
  if (!query || query.length < 1) { dropdown.style.display = 'none'; return; }
  var q = query.toLowerCase();
  var results = [];
  materialsFlat.filter(function(m) { return m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q); }).slice(0, 4).forEach(function(m) {
    results.push({icon: '📦', label: m.id, name: m.name, type: '物料', nav: 'materials', action: function() { navigateTo('materials'); document.getElementById('matSearch').value = m.id; matPage = 1; renderMaterials(); }});
  });
  if (typeof projectsData !== 'undefined') projectsData.filter(function(p) { return p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q); }).slice(0, 3).forEach(function(p) {
    results.push({icon: '📁', label: p.id, name: p.name, type: '项目', nav: 'projects', action: function() { navigateTo('projects'); showProjDetail(p.id); }});
  });
  if (typeof changesData !== 'undefined') changesData.filter(function(c) { return c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q); }).slice(0, 3).forEach(function(c) {
    results.push({icon: '🔄', label: c.id, name: c.title, type: '变更', nav: 'changes', action: function() { navigateTo('changes'); showChgDetail(c.id); }});
  });
  if (typeof documentsData !== 'undefined') documentsData.filter(function(d) { return d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q); }).slice(0, 2).forEach(function(d) {
    results.push({icon: '📑', label: d.id, name: d.name, type: '文档', nav: 'documents', action: function() { navigateTo('documents'); showDocDetail(d.id); }});
  });
  if (typeof suppliersData !== 'undefined') suppliersData.filter(function(s) { return s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q); }).slice(0, 2).forEach(function(s) {
    results.push({icon: '🏭', label: s.id, name: s.name, type: '供应商', nav: 'suppliers', action: function() { navigateTo('suppliers'); showSupDetail(s.id); }});
  });
  if (typeof qualityData !== 'undefined') qualityData.filter(function(r) { return r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q); }).slice(0, 2).forEach(function(r) {
    results.push({icon: '🔬', label: r.id, name: r.title, type: '质量', nav: 'quality', action: function() { navigateTo('quality'); showQaDetail(r.id); }});
  });
  if (results.length === 0) {
    dropdown.innerHTML = '<div style="padding:14px 16px;color:var(--text-muted);font-size:12px;text-align:center">未找到匹配结果</div>';
    dropdown.style.display = 'block';
    return;
  }
  dropdown.innerHTML = results.map(function(r, i) {
    return '<div class="search-result-item" data-idx="' + i + '" style="display:flex;align-items:center;gap:10px;padding:10px 16px;cursor:pointer;border-bottom:1px solid var(--border-light);transition:background .1s;font-size:12px"><span>' + r.icon + '</span><span style="color:var(--accent);font-weight:500;width:100px;flex-shrink:0">' + r.label + '</span><span style="flex:1;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + r.name + '</span><span class="badge badge-gray" style="font-size:9px">' + r.type + '</span></div>';
  }).join('');
  dropdown.style.display = 'block';
  dropdown.querySelectorAll('.search-result-item').forEach(function(item) {
    var idx = parseInt(item.dataset.idx);
    item.addEventListener('mouseenter', function() { this.style.background = 'var(--bg-hover)'; });
    item.addEventListener('mouseleave', function() { this.style.background = 'transparent'; });
    item.addEventListener('click', function() {
      hideSearchDropdown();
      document.getElementById('globalSearch').value = '';
      results[idx].action();
    });
  });
};

function hlText(text, query) {
  if (!query) return text;
  var idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text;
  return text.slice(0, idx) + '<span class="search-hl">' + text.slice(idx, idx + query.length) + '</span>' + text.slice(idx + query.length);
}

function applyFilterActiveState() {
  document.querySelectorAll('.filter-select').forEach(function(sel) {
    if (sel.value && sel.value !== 'all') sel.classList.add('filter-active');
    else sel.classList.remove('filter-active');
  });
}

function trackRecentAccess(type, id, name, icon) {
  recentAccess = recentAccess.filter(function(r) { return r.id !== id; });
  recentAccess.unshift({type: type, id: id, name: name, icon: icon || '📄', time: Date.now()});
  if (recentAccess.length > 8) recentAccess = recentAccess.slice(0, 8);
  try { localStorage.setItem('bom_recent', JSON.stringify(recentAccess)); } catch(e) {}
}

function renderRecentAccess() {
  var el = document.getElementById('dashRecent');
  if (!el) return;
  if (recentAccess.length === 0) { el.innerHTML = '<h3 style="font-size:15px;font-weight:600;margin-bottom:14px">🕐 最近访问</h3><div style="text-align:center;padding:16px;color:var(--text-muted);font-size:12px">暂无最近访问记录</div>'; return; }
  el.innerHTML = '<h3 style="font-size:15px;font-weight:600;margin-bottom:14px">🕐 最近访问</h3><div class="recent-pills">' + recentAccess.map(function(r) {
    return '<span class="recent-pill" onclick="navigateTo(\'' + r.type + '\');' + (r.type === 'materials' ? 'showMatDetail(\'' + r.id + '\')' : r.type === 'projects' ? 'showProjDetail(\'' + r.id + '\')' : r.type === 'changes' ? 'showChgDetail(\'' + r.id + '\')' : '') + '">' + r.icon + ' ' + r.name + '</span>';
  }).join('') + '</div>';
}

var _origShowMatDetail = showMatDetail;
showMatDetail = function(id) {
  var m = findNode(id);
  if (m) trackRecentAccess('materials', id, m.name, m.icon || '📦');
  _origShowMatDetail(id);
};

var _origShowProjDetail = typeof showProjDetail === 'function' ? showProjDetail : null;
if (_origShowProjDetail) {
  var _spd = _origShowProjDetail;
  showProjDetail = function(id) {
    var p = projectsData.find(function(x) { return x.id === id; });
    if (p) trackRecentAccess('projects', id, p.name, '📁');
    _spd(id);
  };
}

function logAction(action, target, detail) {
  auditLog.unshift({time: nowStr(), user: currentUser ? currentUser.name : '—', action: action, target: target || '', detail: detail || ''});
  if (auditLog.length > 100) auditLog = auditLog.slice(0, 100);
}

function renderAuditLog() {
  return '<div class="settings-section"><h3>📋 操作日志 <span style="font-size:11px;font-weight:400;color:var(--text-muted)">(' + auditLog.length + ' 条)</span></h3>' +
    (auditLog.length === 0 ? '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px">暂无操作记录</div>' :
    '<div class="audit-log">' + auditLog.slice(0, 50).map(function(a) {
      return '<div class="audit-item"><span class="audit-time">' + a.time + '</span><span class="audit-action"><b>' + a.user + '</b> ' + a.action + (a.target ? ' — ' + a.target : '') + '</span></div>';
    }).join('') + '</div>') + '</div>';
}

var _origRenderSettings = renderSettings;
renderSettings = function() {
  _origRenderSettings();
  var content = document.getElementById('settingsContent');
  if (content) content.innerHTML += renderAuditLog();
};

function canUserDo(action) {
  if (!currentUser) return false;
  var role = currentUser.role;
  var adminRoles = ['技术总监', '研发主管'];
  var engineerRoles = ['高级工程师', '硬件工程师', '射频工程师', '结构工程师', '测试工程师'];
  if (action === 'admin') return adminRoles.includes(role);
  if (action === 'approve') return adminRoles.includes(role) || role === '品质工程师';
  if (action === 'edit') return adminRoles.includes(role) || engineerRoles.includes(role);
  if (action === 'delete') return adminRoles.includes(role);
  return true;
}

function applyPermissions() {
  if (!currentUser) return;
  var settingsNav = document.querySelector('[data-nav="settings"]');
  if (settingsNav && !canUserDo('admin')) settingsNav.style.opacity = '0.5';
}

function renderPieChart(containerId, data, title) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var total = data.reduce(function(s, d) { return s + d.value; }, 0);
  if (total === 0) { el.innerHTML = '<div style="text-align:center;color:var(--text-muted);font-size:12px;padding:16px">无数据</div>'; return; }
  var r = 60, cx = 70, cy = 70, strokeW = 24;
  var circumference = 2 * Math.PI * r;
  var offset = 0;
  var circles = data.map(function(d) {
    var pct = d.value / total;
    var dashLen = pct * circumference;
    var html = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + d.color + '" stroke-width="' + strokeW + '" stroke-dasharray="' + dashLen + ' ' + (circumference - dashLen) + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')" />';
    offset += dashLen;
    return html;
  });
  var svg = '<svg width="140" height="140" viewBox="0 0 140 140">' + circles.join('') + '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" dy="4" fill="var(--text-primary)" font-size="16" font-weight="700">' + total + '</text></svg>';
  var legend = '<div class="pie-legend">' + data.map(function(d) {
    return '<div class="pie-legend-item"><div class="pie-legend-dot" style="background:' + d.color + '"></div><span>' + d.label + '</span><span style="font-weight:600;margin-left:auto">' + d.value + '</span></div>';
  }).join('') + '</div>';
  el.innerHTML = '<h4 style="margin-bottom:12px">' + (title || '') + '</h4><div class="pie-chart-container">' + svg + legend + '</div>';
}

function renderGauge(containerId, score, label) {
  var el = document.getElementById(containerId);
  if (!el) return;
  score = Math.max(0, Math.min(100, Math.round(score)));
  var r = 54, strokeW = 10, cx = 64, cy = 64;
  var circumference = Math.PI * r;
  var dashLen = (score / 100) * circumference;
  var color = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--yellow)' : 'var(--red)';
  el.innerHTML = '<div class="gauge-container"><svg width="128" height="80" viewBox="0 0 128 80"><path d="M 10 70 A 54 54 0 0 1 118 70" fill="none" stroke="var(--border)" stroke-width="' + strokeW + '" stroke-linecap="round" /><path d="M 10 70 A 54 54 0 0 1 118 70" fill="none" stroke="' + color + '" stroke-width="' + strokeW + '" stroke-linecap="round" stroke-dasharray="' + dashLen + ' ' + circumference + '" /></svg><div class="gauge-value" style="color:' + color + ';top:40px">' + score + '</div><div class="gauge-label" style="bottom:2px">' + (label || 'BOM健康度') + '</div></div>';
}

function renderTreemap(containerId, data) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var total = data.reduce(function(s, d) { return s + d.value; }, 0);
  if (total === 0) return;
  var colors = ['#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#db2777', '#4f46e5'];
  el.innerHTML = '<div class="treemap-container" style="height:120px">' + data.sort(function(a, b) { return b.value - a.value; }).slice(0, 10).map(function(d, i) {
    var pct = Math.max(5, (d.value / total) * 100);
    return '<div class="treemap-cell" style="flex:' + pct + ';background:' + colors[i % colors.length] + ';min-width:40px"><div class="treemap-cell-name">' + d.label + '</div><div class="treemap-cell-value">¥' + d.value.toFixed(0) + '</div></div>';
  }).join('') + '</div>';
}

var _origRenderReports = renderReports;
renderReports = function() {
  _origRenderReports();
  var chartGrid = document.getElementById('chartGrid');
  if (!chartGrid) return;
  var pieDiv = document.createElement('div');
  pieDiv.className = 'chart-card';
  pieDiv.id = 'statusPieChart';
  chartGrid.insertBefore(pieDiv, chartGrid.firstChild);
  var active = materialsFlat.filter(function(m) { return m.status === '有效'; }).length;
  var pending = materialsFlat.filter(function(m) { return m.status === '待审'; }).length;
  var stopped = materialsFlat.filter(function(m) { return m.status === '停用'; }).length;
  renderPieChart('statusPieChart', [
    {label: '有效', value: active, color: '#10B981'},
    {label: '待审', value: pending, color: '#F59E0B'},
    {label: '停用', value: stopped, color: '#EF4444'}
  ], '🏷 物料状态分布');

  var gaugeDiv = document.createElement('div');
  gaugeDiv.className = 'chart-card';
  gaugeDiv.id = 'healthGauge';
  chartGrid.insertBefore(gaugeDiv, chartGrid.children[1] || null);
  var healthScore = Math.round((active / Math.max(materialsFlat.length, 1)) * 100 - stopped * 2 - pending);
  healthScore = Math.max(0, Math.min(100, healthScore));
  renderGauge('healthGauge', healthScore, 'BOM健康度');
  gaugeDiv.innerHTML = '<h4 style="margin-bottom:12px">💚 BOM 健康度</h4>' + gaugeDiv.innerHTML;

  var tmDiv = document.createElement('div');
  tmDiv.className = 'chart-card';
  tmDiv.id = 'costTreemap';
  chartGrid.appendChild(tmDiv);
  var groupMap = {};
  materialsFlat.forEach(function(m) { var g = m.id.split('-')[0]; groupMap[g] = (groupMap[g] || 0) + m.price * m.qty; });
  tmDiv.innerHTML = '<h4 style="margin-bottom:12px">🗺 成本结构 Treemap</h4><div id="costTreemapInner"></div>';
  renderTreemap('costTreemapInner', Object.entries(groupMap).map(function(e) { return {label: e[0], value: e[1]}; }));
};

var _origRenderDashboard = renderDashboard;
renderDashboard = function() {
  _origRenderDashboard();
  var dashTodos = document.getElementById('dashTodos');
  if (dashTodos && !document.getElementById('dashRecent')) {
    var recentDiv = document.createElement('div');
    recentDiv.id = 'dashRecent';
    recentDiv.style.cssText = 'margin-top:20px;padding:16px;background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius)';
    dashTodos.parentNode.insertBefore(recentDiv, dashTodos.nextSibling);
  }
  renderRecentAccess();
  applyPermissions();
};

var _origShowModal = showModal;
showModal = function(id) {
  _origShowModal(id);
  var modal = document.getElementById(id);
  if (!modal) return;
  setTimeout(function() {
    var first = modal.querySelector('input:not([type=hidden]):not([readonly]):not([style*="display:none"]),select,textarea');
    if (first) first.focus();
  }, 100);
  var focusable = modal.querySelectorAll('input:not([type=hidden]),select,textarea,button,[tabindex]');
  if (focusable.length < 2) return;
  var firstF = focusable[0], lastF = focusable[focusable.length - 1];
  modal._trapFocus = function(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) { if (document.activeElement === firstF) { e.preventDefault(); lastF.focus(); } }
    else { if (document.activeElement === lastF) { e.preventDefault(); firstF.focus(); } }
  };
  modal.addEventListener('keydown', modal._trapFocus);
};

var _origHideModal = hideModal;
hideModal = function(id) {
  var modal = document.getElementById(id);
  if (modal && modal._trapFocus) { modal.removeEventListener('keydown', modal._trapFocus); modal._trapFocus = null; }
  _origHideModal(id);
};

var _origRenderLoginPills = renderLoginPills;
renderLoginPills = function() {
  var container = document.getElementById('loginAccounts');
  if (!container) return;
  container.innerHTML = demoUsers.map(function(u) {
    return '<span class="login-pill" data-name="' + u.name + '" data-pw="' + u.password + '" style="cursor:pointer;padding:8px 14px;text-align:center"><span style="display:block;font-weight:500">' + u.name + '</span><small style="display:block;font-size:9px;opacity:.6;margin-top:2px">' + u.role + '</small></span>';
  }).join('');
  container.addEventListener('click', function(e) {
    var pill = e.target.closest('.login-pill');
    if (!pill) return;
    document.getElementById('loginUsername').value = pill.dataset.name;
    document.getElementById('loginPassword').value = pill.dataset.pw;
    handleLoginSubmit();
  });
};

function startInlineEdit(td) {
  if (td.querySelector('.inline-edit-input')) return;
  var field = td.dataset.field;
  var matId = td.dataset.id;
  if (!field || !matId) return;
  var node = findNode(matId);
  if (!node) return;
  var origVal = field === 'subtotal' ? (node.price * node.qty).toFixed(2) : node[field];
  var origHtml = td.innerHTML;
  var input = document.createElement('input');
  input.className = 'inline-edit-input';
  input.value = origVal;
  input.type = (field === 'qty' || field === 'price') ? 'number' : 'text';
  if (field === 'price') input.step = '0.01';
  td.innerHTML = '';
  td.appendChild(input);
  input.focus();
  input.select();
  function save() {
    var val = input.value.trim();
    if (field === 'qty') { val = parseInt(val) || node.qty; node.qty = val; }
    else if (field === 'price') { val = parseFloat(val) || node.price; node.price = val; }
    else if (field === 'supplier') { node.supplier = val || node.supplier; }
    rebuildFlat(); renderMaterials(); updateStatusBar();
    logAction('行内编辑', matId + ' ' + field + ' → ' + val);
  }
  function cancel() { td.innerHTML = origHtml; }
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); save(); }
    else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  });
  input.addEventListener('blur', function() { save(); });
}

var _origRenderMaterials = renderMaterials;
renderMaterials = function() {
  _origRenderMaterials();
  applyFilterActiveState();
  var tbody = document.getElementById('matBody');
  if (!tbody) return;
  var rows = tbody.querySelectorAll('tr');
  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="14"><div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">暂无物料数据</div><button class="btn btn-primary btn-sm" onclick="showMaterialModal()">+ 创建第一个物料</button></div></td></tr>';
    return;
  }
  rows.forEach(function(row) {
    var cells = row.querySelectorAll('td');
    if (cells.length < 14) return;
    var idText = cells[3] ? cells[3].textContent.trim() : '';
    [[8,'qty'],[10,'price'],[9,'supplier']].forEach(function(pair) {
      var ci = pair[0];
      var field = pair[1];
      if (cells[ci]) {
        cells[ci].setAttribute('data-field', field);
        cells[ci].setAttribute('data-id', idText);
      }
    });
  });
  tbody.addEventListener('dblclick', function(e) {
    var td = e.target.closest('td[data-field]');
    if (td) { e.stopPropagation(); startInlineEdit(td); }
  });

  var matSearch = (document.getElementById('matSearch')?.value || '').toLowerCase();
  if (matSearch) {
    rows.forEach(function(row) {
      var cells = row.querySelectorAll('td');
      if (cells[3]) cells[3].innerHTML = hlText(cells[3].textContent, matSearch);
      if (cells[4]) cells[4].innerHTML = hlText(cells[4].textContent, matSearch);
    });
  }
};

function saveFilterState(module, key, value) {
  try { sessionStorage.setItem('bom_filter_' + module + '_' + key, value); } catch(e) {}
}

function restoreFilterState(module, key) {
  try { return sessionStorage.getItem('bom_filter_' + module + '_' + key) || ''; } catch(e) { return ''; }
}

function showShortcutHelp() { showModal('shortcutModal'); }

function initEnhancements() {
  enhanceTreeSearch();
  logAction('登录系统', '');

  document.addEventListener('keydown', function(e) {
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.target.matches('input,textarea,select')) {
      e.preventDefault();
      showShortcutHelp();
    }
  });

  var treePanel = document.querySelector('.tree-left');
  if (treePanel) {
    treePanel.addEventListener('keydown', function(e) {
      if (e.target.matches('input,textarea,select')) return;
      var node = findNode(selectedNodeId);
      if (!node) return;
      if (e.key === 'F2') { e.preventDefault(); ctxNode = node; ctxAction('edit'); }
      else if (e.key === 'Insert') { e.preventDefault(); ctxNode = node; ctxAction('addChild'); }
      else if (e.key === 'Delete') { e.preventDefault(); ctxNode = node; ctxAction('delete'); }
      else if (e.key === 'ArrowRight') {
        var el = document.querySelector('.tree-node[data-node-id="' + selectedNodeId + '"] > .tree-children');
        var arrow = document.querySelector('.tree-node[data-node-id="' + selectedNodeId + '"] > .tree-row > .tree-arrow');
        if (el && !el.classList.contains('open')) { el.classList.add('open'); if (arrow) arrow.classList.add('expanded'); }
      } else if (e.key === 'ArrowLeft') {
        var el2 = document.querySelector('.tree-node[data-node-id="' + selectedNodeId + '"] > .tree-children');
        var arrow2 = document.querySelector('.tree-node[data-node-id="' + selectedNodeId + '"] > .tree-row > .tree-arrow');
        if (el2 && el2.classList.contains('open')) { el2.classList.remove('open'); if (arrow2) arrow2.classList.remove('expanded'); }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        var allRows = Array.from(document.querySelectorAll('.tree-row'));
        var curIdx = allRows.findIndex(function(r) { return r.classList.contains('selected'); });
        var nextIdx = e.key === 'ArrowDown' ? Math.min(curIdx + 1, allRows.length - 1) : Math.max(curIdx - 1, 0);
        if (allRows[nextIdx]) allRows[nextIdx].click();
      }
    });
    treePanel.setAttribute('tabindex', '0');
  }

  document.querySelectorAll('.filter-select').forEach(function(sel) {
    sel.addEventListener('change', function() { applyFilterActiveState(); });
  });

  var matSearchEl = document.getElementById('matSearch');
  if (matSearchEl) {
    var saved = restoreFilterState('mat', 'search');
    if (saved) { matSearchEl.value = saved; }
    matSearchEl.addEventListener('input', function() { saveFilterState('mat', 'search', this.value); });
  }
  var matFilterEl = document.getElementById('matFilter');
  if (matFilterEl) {
    var savedF = restoreFilterState('mat', 'status');
  if (savedF) { matFilterEl.value = savedF; }
  matFilterEl.addEventListener('change', function() { saveFilterState('mat', 'status', this.value); });
  }
}

const exposedAPI = {
  addChildToSelected,
  batchDelete,
  changePage,
  changePageSize,
  clearFieldError,
  clearSelection,
  collapseAll,
  createNewBOM,
  createVersion,
  ctxAction,
  doApprove,
  doBatchEdit,
  doImport,
  downloadTemplate,
  editSelectedNode,
  expandAll,
  exportApprovals,
  exportCSV,
  exportComplianceReport,
  exportCurrentBOM,
  exportInventoryReport,
  exportModuleCSV,
  handleDocFileSelect,
  handleFileDrop,
  handleFileSelect,
  hideModal,
  markAllNotifRead,
  modPage,
  modSort,
  navigateTo,
  renderApprovalCenter,
  renderApprovals,
  renderChanges,
  renderCompliance,
  renderCostCompare,
  renderDocuments,
  renderInventory,
  renderLifecycle,
  renderProjects,
  renderQuality,
  renderSuppliers,
  runCompare,
  saveChange,
  saveDocument,
  saveMaterial,
  saveNode,
  saveProject,
  saveQuality,
  saveSupReview,
  saveSupplier,
  saveUserEdit,
  showBatchEditModal,
  showChgModal,
  showMaterialModal,
  showModal,
  showNewBOMModal,
  showNewProcessModal,
  showNewProjectModal,
  showSupReviewModal,
  sortMaterials,
  submitApproval,
  switchAprTab,
  switchBOM,
  switchChgTab,
  toggleFavorite,
  toggleFavoriteFilter,
  togglePinNode,
  toggleSelectAll,
  toggleTheme,
  focusPinnedNode,
  removePinnedNode
};

Object.assign(window, exposedAPI);

// ===== INIT =====
try { var savedBomIdx = parseInt(localStorage.getItem('bom_active_idx')); if (!isNaN(savedBomIdx) && savedBomIdx >= 0 && savedBomIdx < allBOMs.length) { bomData = allBOMs[savedBomIdx]; selectedNodeId = bomData.id; } } catch(e) {}
populateAllEnumSelects();
populateBOMSelector();
rebuildFlat();
renderTree();
buildFilterDropdowns();
renderMaterials();
renderVersions();
renderApprovals();
showDetail(bomData);
renderLoginPills();
initNotifBell();
initNotifActions();
initLoginUI();
initTheme();
initEnhancements();
