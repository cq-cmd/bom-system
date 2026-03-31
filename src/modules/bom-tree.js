// BOM 树 + 详情 + 成本 + 右键菜单
import { state, allBOMs, versions, substituteMap, enumConfig, rebuildFlat } from './state.js';
import { escapeHtml } from '../utils/dom.js';
import { todayStr } from '../utils/format.js';
import { findNode, populateAllEnumSelects, findParent, updateStatusBar } from './auth.js';
import { showToast, navigateTo, showModal, showConfirm, hideModal } from './navigation.js';
import { renderMaterials } from './materials.js';
import { cloneNode } from './advanced-ops.js';
import { logAction } from './enhancements.js';
import { validateField, btnLoading, btnReset, detailGrid } from './ui-helpers.js';

// ===== BOM TREE =====


function saveTreeState() {
  state.expandedNodeIds.clear();
  document.querySelectorAll('.tree-children.open').forEach(function(el) {
    var parent = el.closest('.tree-node');
    if (parent && parent.dataset.nodeId) state.expandedNodeIds.add(parent.dataset.nodeId);
  });
}
function restoreTreeState() {
  state.expandedNodeIds.forEach(function(id) {
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
  container.appendChild(buildTreeNode(state.bomData, 0));
  restoreTreeState();
  updateTreeStats();
  renderPinBoard();
}
function buildTreeNode(node, depth) {
  const div = document.createElement('div');
  div.className = 'tree-node';
  div.dataset.nodeId = node.id;
  const hasChildren = node.children && node.children.length > 0;
  const shouldOpen = state.treeSearchTerm ? nodeMatchesSearch(node) : depth < 1;
  const row = document.createElement('div');
  row.className = 'tree-row' + (node.id === state.selectedNodeId ? ' selected' : '');
  row.style.paddingLeft = (12 + depth * 20) + 'px';
  const arrow = document.createElement('span');
  arrow.className = 'tree-arrow' + (hasChildren ? (shouldOpen ? ' expanded' : '') : ' empty');
  arrow.textContent = '▶';
  const icon = document.createElement('span');
  icon.className = 'tree-icon';
  icon.textContent = node.icon || '📄';
  const label = document.createElement('span');
  label.className = 'tree-label';
  if (state.treeSearchTerm && node.name.toLowerCase().includes(state.treeSearchTerm.toLowerCase())) {
    const idx = node.name.toLowerCase().indexOf(state.treeSearchTerm.toLowerCase());
    label.innerHTML = node.name.slice(0,idx)+'<span class="highlight">'+node.name.slice(idx,idx+state.treeSearchTerm.length)+'</span>'+node.name.slice(idx+state.treeSearchTerm.length);
  } else { label.textContent = node.name; }
  const qty = document.createElement('span');
  qty.className = 'tree-qty';
  qty.textContent = node.qty > 1 ? '×' + node.qty : '';
  row.appendChild(arrow);row.appendChild(icon);row.appendChild(label);row.appendChild(qty);
  row.setAttribute('title', '双击编辑 · 右键更多操作');
  div.appendChild(row);
  if (hasChildren) {
    const childContainer = document.createElement('div');
    childContainer.className = 'tree-children' + (shouldOpen ? ' open' : '');
    node.children.forEach(c => childContainer.appendChild(buildTreeNode(c, depth + 1)));
    div.appendChild(childContainer);
    arrow.addEventListener('click', e => { e.stopPropagation(); childContainer.classList.toggle('open'); arrow.classList.toggle('expanded'); });
  }
  row.addEventListener('click', () => {
    state.selectedNodeId = node.id;
    document.querySelectorAll('.tree-row').forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
    showDetail(node);
  });
  row.addEventListener('dblclick', () => {
    state.ctxNode = node; ctxAction('edit');
  });
  row.addEventListener('contextmenu', e => { e.preventDefault(); state.ctxNode = node; state.ctxTreeNodeEl = div; showContextMenu(e.clientX, e.clientY); });
  return div;
}
function nodeMatchesSearch(node) {
  if (!state.treeSearchTerm) return false;
  const s = state.treeSearchTerm.toLowerCase();
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
function editSelectedNode() { const node = findNode(state.selectedNodeId); if (node) { state.ctxNode = node; ctxAction('edit'); } }
function addChildToSelected() { const node = findNode(state.selectedNodeId); if (node) { state.ctxNode = node; ctxAction('addChild'); } }

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
  const pinned = state.pinnedNodeIds.has(node.id);
  btn.textContent = pinned ? '📍 已关注' : '📌 关注节点';
  btn.classList.toggle('fav-active', pinned);
}
function togglePinNode() {
  const node = findNode(state.selectedNodeId);
  if (!node) return;
  const pinned = state.pinnedNodeIds.has(node.id);
  if (pinned) {
    state.pinnedNodeIds.delete(node.id);
    showToast('已取消关注 ' + node.name, 'info');
  } else {
    state.pinnedNodeIds.add(node.id);
    showToast('已关注节点 ' + node.name, 'success');
  }
  persistPinnedNodes();
  updatePinButton(node);
  renderPinBoard();
}
function removePinnedNode(id) {
  if (!state.pinnedNodeIds.has(id)) return;
  state.pinnedNodeIds.delete(id);
  persistPinnedNodes();
  renderPinBoard();
  if (state.selectedNodeId === id) updatePinButton(findNode(id) || state.bomData);
}
function focusPinnedNode(id) {
  const node = findNode(id);
  if (!node) {
    removePinnedNode(id);
    return;
  }
  navigateTo('bom');
  state.selectedNodeId = id;
  renderTree();
  showDetail(node);
}
function renderPinBoard() {
  const list = document.getElementById('pinList');
  if (!list) return;
  if (!state.pinnedNodeIds.size) {
    list.innerHTML = '<div class="pin-empty"><span class="pin-empty-icon">📌</span><div>暂无关注节点，选中节点后点击“关注”即可快速跳转。</div></div>';
    return;
  }
  let mutated = false;
  const html = Array.from(state.pinnedNodeIds).map(id => {
    const node = findNode(id);
    if (!node) {
      state.pinnedNodeIds.delete(id);
      mutated = true;
      return '';
    }
    return '<div class="pin-item" onclick="focusPinnedNode(\''+id+'\')"><div class="pin-meta"><span class="pin-icon">'+(node.icon||'📄')+'</span><span>'+node.name+'</span></div><button class="pin-remove" onclick="event.stopPropagation();removePinnedNode(\''+id+'\')">✕</button></div>';
  }).join('');
  if (mutated) persistPinnedNodes();
  list.innerHTML = html || '<div class="pin-empty"><span class="pin-empty-icon">📌</span><div>暂无关注节点</div></div>';
}


function exportCurrentBOM() {
  const node = findNode(state.selectedNodeId);
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
  })(state.bomData);
  statsEl.innerHTML = `<span>节点数 <b>${stats.nodes}</b></span><span>层级 <b>${stats.maxLevel + 1}</b></span><span>叶子 <b>${stats.leaves}</b></span>`;
}

// Tree search
document.getElementById('treeSearch').addEventListener('input', e => { state.treeSearchTerm = e.target.value; renderTree(); });

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
  if (!state.ctxNode) return;
  if (action === 'addChild') {
    populateAllEnumSelects();
    document.getElementById('nodeModalTitle').textContent = '新增子项 - ' + state.ctxNode.name;
    document.getElementById('nodeEditMode').value = 'add';
    ['nodeFormId','nodeFormName','nodeFormSpec','nodeFormSupplier','nodeFormIcon'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('nodeFormQty').value = '1';
    document.getElementById('nodeFormPrice').value = '';
    document.getElementById('nodeFormUnit').value = '个';
    document.getElementById('nodeFormStatus').value = '有效';
    showModal('nodeModal');
  } else if (action === 'edit') {
    populateAllEnumSelects();
    document.getElementById('nodeModalTitle').textContent = '编辑 - ' + state.ctxNode.name;
    document.getElementById('nodeEditMode').value = 'edit';
    document.getElementById('nodeFormId').value = state.ctxNode.id;
    document.getElementById('nodeFormName').value = state.ctxNode.name;
    document.getElementById('nodeFormSpec').value = state.ctxNode.spec;
    document.getElementById('nodeFormUnit').value = state.ctxNode.unit;
    document.getElementById('nodeFormQty').value = state.ctxNode.qty;
    document.getElementById('nodeFormPrice').value = state.ctxNode.price;
    document.getElementById('nodeFormSupplier').value = state.ctxNode.supplier;
    document.getElementById('nodeFormStatus').value = state.ctxNode.status;
    document.getElementById('nodeFormIcon').value = state.ctxNode.icon || '';
    showModal('nodeModal');
  } else if (action === 'delete') {
    if (state.ctxNode.id === state.bomData.id) return;
    showConfirm('确定删除物料 "' + state.ctxNode.name + '" 吗？其所有子项也将被删除。', () => {
      const parent = findParent(state.ctxNode.id);
      if (parent && parent.children) { parent.children = parent.children.filter(c => c.id !== state.ctxNode.id); }
      rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
      if (state.selectedNodeId === state.ctxNode.id) { state.selectedNodeId = state.bomData.id; showDetail(state.bomData); }
    });
  } else if (action === 'copy') {
    navigator.clipboard.writeText(state.ctxNode.id).then(function() {
      showToast('已复制物料编号: ' + state.ctxNode.id, 'success');
    }).catch(function() {
      showToast('复制失败，请手动复制: ' + state.ctxNode.id, 'error');
    });
  } else if (action === 'expandChildren') {
    if (state.ctxTreeNodeEl) state.ctxTreeNodeEl.querySelectorAll('.tree-children').forEach(c => c.classList.add('open'));
    if (state.ctxTreeNodeEl) state.ctxTreeNodeEl.querySelectorAll('.tree-arrow:not(.empty)').forEach(a => a.classList.add('expanded'));
  } else if (action === 'collapseChildren') {
    if (state.ctxTreeNodeEl) state.ctxTreeNodeEl.querySelectorAll('.tree-children').forEach(c => c.classList.remove('open'));
    if (state.ctxTreeNodeEl) state.ctxTreeNodeEl.querySelectorAll('.tree-arrow').forEach(a => a.classList.remove('expanded'));
  } else if (action === 'clone') {
    if (state.ctxNode) cloneNode(state.ctxNode.id);
  }
}
function saveNode() {
  if (!validateField('nodeFormId', '物料编号')) return;
  if (!validateField('nodeFormName', '物料名称')) return;
  var btn = document.querySelector('#nodeModal .btn-primary');
  btnLoading(btn);
  setTimeout(function() {
    btnReset(btn);
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
      data.level = (state.ctxNode.level || 0) + 1;
      if (!state.ctxNode.children) state.ctxNode.children = [];
      state.ctxNode.children.push(data);
      state.expandedNodeIds.add(state.ctxNode.id);
    } else {
      Object.assign(state.ctxNode, data);
    }
    hideModal('nodeModal');
    rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
    showDetail(findNode(state.selectedNodeId) || state.bomData);
    showToast(mode === 'add' ? '子项 "'+data.name+'" 已添加' : '"'+data.name+'" 已更新', 'success');
    logAction('保存BOM节点', document.getElementById('nodeFormId').value);
  }, 300);
}


export { saveTreeState, restoreTreeState, renderTree, buildTreeNode, nodeMatchesSearch, showDetail, expandAll, collapseAll, editSelectedNode, addChildToSelected, computeNodeCost, formatCurrency, updateCostSummary, calcSubtreeStats, renderNodeInsights, persistPinnedNodes, updatePinButton, togglePinNode, removePinnedNode, focusPinnedNode, renderPinBoard, exportCurrentBOM, updateTreeStats, showContextMenu, hideContextMenu, ctxAction, saveNode };
