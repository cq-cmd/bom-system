import { escapeHtml } from '../utils/dom.js';
import { getStorage, setStorage } from '../utils/storage.js';
import { showToast } from './ui.js';
import { updateStatusBar } from './utils.js';

let bomData;
let selectedNodeId;
let materialsFlat = [];
let favoriteMaterials = new Set();
let showFavoriteOnly = false;
let pinnedNodeIds = new Set();
let ctxNode = null;
let ctxTreeNodeEl = null;
let treeSearchTerm = '';
let expandedNodeIds = new Set();

export function initBOM(allBOMs, initialIndex = 0) {
  bomData = JSON.parse(JSON.stringify(allBOMs[initialIndex]));
  selectedNodeId = bomData.id;
  loadFavorites();
  loadPinnedNodes();
  rebuildFlat();
  loadTreeState();
  renderBOMTree();
  updateStatusBar();
  return { bomData, selectedNodeId, materialsFlat, favoriteMaterials };
}

export function getBomData() {
  return bomData;
}

export function setBomData(newBomData) {
  bomData = newBomData;
  selectedNodeId = bomData.id;
  rebuildFlat();
  return bomData;
}

export function getSelectedNodeId() {
  return selectedNodeId;
}

export function setSelectedNodeId(id) {
  selectedNodeId = id;
}

export function getMaterialsFlat() {
  return materialsFlat;
}

function loadFavorites() {
  try {
    const rawFavs = JSON.parse(getStorage('bom_mat_favs') || '[]');
    if (Array.isArray(rawFavs)) favoriteMaterials = new Set(rawFavs);
    showFavoriteOnly = getStorage('bom_mat_fav_only') === '1';
  } catch(e) {
    favoriteMaterials = new Set();
    showFavoriteOnly = false;
  }
}

function persistFavorites() {
  try {
    setStorage('bom_mat_favs', JSON.stringify([...favoriteMaterials]));
  } catch(e) {}
}

function persistFavoriteFilter() {
  try {
    setStorage('bom_mat_fav_only', showFavoriteOnly ? '1' : '0');
  } catch(e) {}
}

export function persistFavoritesState() {
  persistFavorites();
  persistFavoriteFilter();
}

function cleanupFavoriteMaterials() {
  if (!favoriteMaterials.size) return;
  const valid = new Set(materialsFlat.map(m => m.id));
  let changed = false;
  favoriteMaterials.forEach(id => {
    if (!valid.has(id)) {
      favoriteMaterials.delete(id);
      changed = true;
    }
  });
  if (changed) persistFavorites();
}

export function rebuildFlat() {
  materialsFlat.length = 0;
  function walk(node) {
    if (node.level >= 2) materialsFlat.push(node);
    if (node.children) node.children.forEach(walk);
  }
  walk(bomData);
  cleanupFavoriteMaterials();
}

export function updateFavToggleButton() {
  const btn = document.getElementById('favToggleBtn');
  if (!btn) return;
  btn.classList.toggle('fav-active', showFavoriteOnly);
  btn.textContent = showFavoriteOnly ? '★ 仅看收藏' : '☆ 收藏筛选';
}

export function toggleFavoriteFilter() {
  showFavoriteOnly = !showFavoriteOnly;
  persistFavoriteFilter();
  updateFavToggleButton();
  return showFavoriteOnly;
}

export function toggleFavorite(id) {
  if (favoriteMaterials.has(id)) {
    favoriteMaterials.delete(id);
    showToast('已从收藏移除 ' + id, 'info');
  } else {
    favoriteMaterials.add(id);
    showToast('已收藏物料 ' + id, 'success');
  }
  persistFavorites();
  return favoriteMaterials;
}

function loadPinnedNodes() {
  try {
    const rawPins = JSON.parse(getStorage('bom_node_pins') || '[]');
    if (Array.isArray(rawPins)) pinnedNodeIds = new Set(rawPins);
  } catch(e) {
    pinnedNodeIds = new Set();
  }
}

export function persistPinnedNodes() {
  try {
    setStorage('bom_node_pins', JSON.stringify([...pinnedNodeIds]));
  } catch(e) {}
}

export function togglePinNode() {
  if (!selectedNodeId) return;
  if (pinnedNodeIds.has(selectedNodeId)) {
    pinnedNodeIds.delete(selectedNodeId);
    showToast('已取消关注节点', 'info');
  } else {
    pinnedNodeIds.add(selectedNodeId);
    showToast('已关注节点', 'success');
  }
  persistPinnedNodes();
  renderPinList();
}

export function isPinned(nodeId) {
  return pinnedNodeIds.has(nodeId);
}

export function getPinnedNodes() {
  return pinnedNodeIds;
}

function findNode(id, root = bomData) {
  if (!root) root = bomData;
  if (root.id === id) return root;
  if (root.children) {
    for (const c of root.children) {
      const r = findNode(id, c);
      if (r) return r;
    }
  }
  return null;
}

export function findParent(id, root = bomData) {
  if (!root) root = bomData;
  if (root.children) {
    for (const c of root.children) {
      if (c.id === id) return root;
      const r = findParent(id, c);
      if (r) return r;
    }
  }
  return null;
}

export function getFavoriteMaterials() {
  return favoriteMaterials;
}

export function getShowFavoriteOnly() {
  return showFavoriteOnly;
}

export function setShowFavoriteOnly(value) {
  showFavoriteOnly = value;
}

// Tree rendering
function escapeId(id) {
  return id.replace(/[^a-zA-Z0-9]/g, '_');
}

function renderNode(node, depth = 0) {
  const isExpanded = expandedNodeIds.has(node.id) || depth < 2;
  const isSelected = node.id === selectedNodeId;
  const isPinned = pinnedNodeIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const prefix = '　'.repeat(depth);
  const icon = isPinned ? '📌 ' : '';
  const toggleIcon = hasChildren ? (isExpanded ? '▼ ' : '▶ ') : '　';

  let searchHighlight = node.name;
  if (treeSearchTerm && treeSearchTerm.trim()) {
    const q = treeSearchTerm.toLowerCase();
    const nameLower = node.name.toLowerCase();
    const idLower = node.id.toLowerCase();
    if (nameLower.includes(q) || idLower.includes(q)) {
      // Matching done at search filtering
    }
  }

  const badge = node.qty ? `<span class="tree-qty">${node.qty}</span>` : '';

  return `
    <div class="tree-node ${isSelected ? 'selected' : ''} ${isPinned ? 'pinned' : ''}"
         data-node-id="${escapeHtml(node.id)}"
         data-depth="${depth}">
      <span class="tree-toggle" onclick="toggleTreeNode('${escapeHtml(node.id)}')">${toggleIcon}</span>
      <span class="tree-label" onclick="selectNode('${escapeHtml(node.id)}')" oncontextmenu="showContextMenu(event, '${escapeHtml(node.id)}')">
        ${icon}${escapeHtml(node.id)} - ${escapeHtml(node.name)} ${badge}
      </span>
    </div>
    ${hasChildren ? `<div class="tree-children ${isExpanded ? 'open' : ''}" data-parent="${escapeHtml(node.id)}">${node.children.map(c => renderNode(c, depth + 1)).join('')}</div>` : ''}
  `;
}

export function renderBOMTree() {
  const container = document.getElementById('bomTree');
  if (!container) return;

  container.innerHTML = renderNode(bomData);

  // Restore expanded state
  expandedNodeIds.forEach(id => {
    const el = container.querySelector(`[data-parent="${escapeId(id).replace(/"/g, '&quot;')}"]`);
    if (el) el.classList.add('open');
  });

  updateTreeStats();
}

function updateTreeStats() {
  const stats = document.getElementById('treeStats');
  if (!stats) return;

  let totalNodes = 0;
  let maxDepth = 0;
  let leafNodes = 0;

  function count(node, depth) {
    totalNodes++;
    if (depth > maxDepth) maxDepth = depth;
    if (!node.children || !node.children.length) leafNodes++;
    if (node.children) node.children.forEach(c => count(c, depth + 1));
  }

  count(bomData, 1);
  stats.textContent = `节点: ${totalNodes} · 层级: ${maxDepth} · 叶子: ${leafNodes}`;
}

export function toggleTreeNode(id) {
  if (expandedNodeIds.has(id)) {
    expandedNodeIds.delete(id);
  } else {
    expandedNodeIds.add(id);
  }
  saveTreeState();

  const childContainer = document.querySelector(`.tree-children[data-parent="${escapeId(id)}"]`);
  if (childContainer) {
    childContainer.classList.toggle('open');
  }

  const toggle = document.querySelector(`.tree-node[data-node-id="${escapeId(id)}"] .tree-toggle`);
  if (toggle) {
    toggle.textContent = expandedNodeIds.has(id) ? '▼ ' : '▶ ';
  }
}

export function expandAll() {
  function collect(node) {
    if (node.children && node.children.length) {
      expandedNodeIds.add(node.id);
      node.children.forEach(collect);
    }
  }
  collect(bomData);
  saveTreeState();
  renderBOMTree();
}

export function collapseAll() {
  expandedNodeIds.clear();
  saveTreeState();
  renderBOMTree();
}

function saveTreeState() {
  try {
    setStorage('bom_tree_expanded', JSON.stringify([...expandedNodeIds]));
  } catch(e) {}
}

function loadTreeState() {
  try {
    const saved = JSON.parse(getStorage('bom_tree_expanded') || '[]');
    if (Array.isArray(saved)) {
      expandedNodeIds = new Set(saved);
    }
  } catch(e) {
    expandedNodeIds = new Set();
  }
}

export function selectNode(id) {
  selectedNodeId = id;
  document.querySelectorAll('.tree-node').forEach(el => {
    el.classList.toggle('selected', el.dataset.nodeId === id);
  });
  renderNodeDetail(findNode(id));
}

export function findNodeById(id) {
  return findNode(id);
}

function renderNodeDetail(node) {
  if (!node) return;

  const title = document.getElementById('detailTitle');
  const grid = document.getElementById('detailGrid');
  if (!title || !grid) return;

  title.textContent = `${node.icon || '📦'} ${node.name}`;

  const items = [
    { label: '物料编号', value: node.id },
    { label: '物料名称', value: node.name },
    { label: '规格型号', value: node.spec || '-' },
    { label: '用量', value: node.qty || 1 },
    { label: '单位', value: node.unit || '-' },
    { label: '单价', value: node.price ? `¥ ${node.price.toFixed(2)}` : '-' },
    { label: '供应商', value: node.supplier || '-' },
    { label: '状态', value: node.status || '有效' },
  ];

  grid.innerHTML = items.map(item => `
    <div class="detail-item">
      <div class="detail-label">${item.label}</div>
      <div class="detail-value">${escapeHtml(String(item.value))}</div>
    </div>
  `).join('');

  calculateCostSummary(node);
  renderHealthCheck(node);
  renderPinList();
  updatePinButton();
}

function calculateCostSummary(node) {
  const grid = document.getElementById('detailCostGrid');
  if (!grid) return;

  let total = 0;
  let selfCost = (node.price || 0) * (node.qty || 1);
  total += selfCost;

  function sumChildren(n) {
    let t = 0;
    if (n.children) {
      n.children.forEach(c => {
        t += (c.price || 0) * (c.qty || 1) + sumChildren(c);
      });
    }
    return t;
  }

  const childrenTotal = sumChildren(node);
  total += childrenTotal;

  const items = [
    { label: '自身成本', value: `¥ ${selfCost.toFixed(2)}` },
    { label: '子项总成本', value: `¥ ${childrenTotal.toFixed(2)}` },
    { label: '汇总', value: `¥ ${total.toFixed(2)}` },
  ];

  grid.innerHTML = items.map(item => `
    <div class="cost-item">
      <span>${item.label}</span>
      <b>${item.value}</b>
    </div>
  `).join('');
}

function renderHealthCheck(node) {
  const container = document.getElementById('healthList');
  if (!container) return;

  const issues = [];

  function checkNode(n) {
    if (n.status === '停用') {
      issues.push({ type: 'warning', title: '停用物料', message: `${n.id} ${n.name} 已停用` });
    }
    if (n.status === '待审') {
      issues.push({ type: 'warning', title: '待审批物料', message: `${n.id} ${n.name} 待审批` });
    }
    if (!n.supplier) {
      issues.push({ type: 'info', title: '缺少供应商', message: `${n.id} ${n.name} 未指定供应商` });
    }
    if (!n.price && n.price !== 0) {
      issues.push({ type: 'info', title: '缺少价格', message: `${n.id} ${n.name} 未设置价格` });
    }
  }

  checkNode(node);
  if (node.children) node.children.forEach(checkNode);

  if (issues.length === 0) {
    container.innerHTML = '<div class="hint-block">未检测到问题，此分支健康状态良好 ✓</div>';
    return;
  }

  container.innerHTML = issues.map(issue => `
    <div class="health-card health-${issue.type}">
      <div class="health-title">${issue.title}</div>
      <div class="health-message">${issue.message}</div>
    </div>
  `).join('');
}

function renderPinList() {
  const container = document.getElementById('pinList');
  if (!container) return;

  if (pinnedNodeIds.size === 0) {
    container.innerHTML = '<div class="hint-block">暂无关注节点，点击关注按钮可关注感兴趣的节点</div>';
    return;
  }

  const html = [...pinnedNodeIds].map(id => {
    const node = findNode(id);
    if (!node) return '';
    return `
      <div class="pin-item" onclick="selectNode('${escapeHtml(id)}')">
        <div class="pin-item-title">📌 ${escapeHtml(node.name)}</div>
        <div class="pin-item-id">${escapeHtml(id)}</div>
      </div>
    `;
  }).filter(Boolean).join('');

  container.innerHTML = html;
}

function updatePinButton() {
  const btn = document.getElementById('pinNodeBtn');
  if (!btn) return;
  const isPinned = pinnedNodeIds.has(selectedNodeId);
  btn.textContent = isPinned ? '✓ 已关注' : '📌 关注节点';
}

export function renderPinList() {
  renderPinList();
}

export function expandNode(id) {
  expandedNodeIds.add(id);
}

export function collapseNode(id) {
  expandedNodeIds.delete(id);
}

export function getExpandedNodeIds() {
  return expandedNodeIds;
}

export function addChildToSelected(parentId, newNode) {
  const parent = findNode(parentId);
  if (!parent) return false;

  if (!parent.children) parent.children = [];
  parent.children.push(newNode);
  rebuildFlat();
  renderBOMTree();
  updateStatusBar();
  return true;
}

export function deleteNode(id) {
  const parent = findParent(id);
  if (!parent || !parent.children) return false;

  const index = parent.children.findIndex(c => c.id === id);
  if (index >= 0) {
    parent.children.splice(index, 1);
    if (id === selectedNodeId) {
      selectedNodeId = bomData.id;
    }
    pinnedNodeIds.delete(id);
    favoriteMaterials.delete(id);
    rebuildFlat();
    renderBOMTree();
    renderNodeDetail(findNode(selectedNodeId));
    updateStatusBar();
    return true;
  }
  return false;
}

export function updateNode(id, updates) {
  const node = findNode(id);
  if (!node) return false;

  Object.assign(node, updates);
  rebuildFlat();
  renderBOMTree();
  renderNodeDetail(findNode(id));
  updateStatusBar();
  return true;
}

export function cloneNode(id) {
  const original = findNode(id);
  if (!original) return null;

  const parent = findParent(id);
  if (!parent) return null;

  const clone = JSON.parse(JSON.stringify(original));
  clone.id = `${original.id}-clone-${Date.now().toString().slice(-6)}`;

  if (!parent.children) parent.children = [];
  parent.children.push(clone);

  rebuildFlat();
  renderBOMTree();
  updateStatusBar();
  return clone;
}

export function setTreeSearchTerm(term) {
  treeSearchTerm = term.trim();
  filterTree();
}

function filterTree() {
  if (!treeSearchTerm) {
    renderBOMTree();
    return;
  }

  // Expand matching branches
  const q = treeSearchTerm.toLowerCase();
  const nodesToExpand = new Set();

  function findMatchingAncestors(node, hasMatchInChild) {
    if (node.id.toLowerCase().includes(q) || node.name.toLowerCase().includes(q)) {
      nodesToExpand.add(node.id);
      return true;
    }
    let found = false;
    if (node.children) {
      for (const child of node.children) {
        if (findMatchingAncestors(child, hasMatchInChild)) {
          nodesToExpand.add(node.id);
          found = true;
        }
      }
    }
    return found;
  }

  findMatchingAncestors(bomData, false);

  // Merge with existing expansion
  nodesToExpand.forEach(id => expandedNodeIds.add(id));
  saveTreeState();
  renderBOMTree();
}

// Context menu
export function showContextMenu(event, nodeId) {
  event.preventDefault();
  ctxNode = findNode(nodeId);
  ctxTreeNodeEl = event.currentTarget.closest('.tree-node');

  const menu = document.getElementById('contextMenu');
  if (!menu) return;

  menu.style.display = 'block';
  menu.style.left = event.pageX + 'px';
  menu.style.top = event.pageY + 'px';

  setTimeout(() => {
    const close = () => {
      menu.style.display = 'none';
      document.removeEventListener('click', close);
    };
    document.addEventListener('click', close);
  }, 0);
}

export function ctxAction(action) {
  if (!ctxNode) return;

  switch(action) {
    case 'addChild':
      // handled by caller
      break;
    case 'edit':
      // handled by caller
      break;
    case 'copy':
      navigator.clipboard?.writeText(ctxNode.id).then(() => {
        showToast('已复制物料编号到剪贴板', 'success');
      });
      break;
    case 'expandChildren':
      if (ctxNode.children) {
        ctxNode.children.forEach(child => expandAll(child.id));
        renderBOMTree();
      }
      break;
    case 'collapseChildren':
      if (ctxNode.children) {
        ctxNode.children.forEach(child => collapseAll(child.id));
        renderBOMTree();
      }
      break;
    case 'clone':
      cloneNode(ctxNode.id);
      showToast('已克隆节点', 'success');
      break;
    case 'delete':
      showConfirmModal('确认删除', `确定要删除节点 ${ctxNode.id} 吗？此操作无法撤销。`, () => {
        if (deleteNode(ctxNode.id)) {
          showToast('已删除节点', 'success');
        }
      });
      break;
  }
}

function expandAll(nodeId) {
  const node = findNode(nodeId);
  if (!node) return;
  expandedNodeIds.add(node.id);
  if (node.children) {
    node.children.forEach(child => expandAll(child.id));
  }
}

function collapseAll(nodeId) {
  const node = findNode(nodeId);
  if (!node) return;
  expandedNodeIds.delete(node.id);
  if (node.children) {
    node.children.forEach(child => collapseAll(child.id));
  }
}

export { ctxNode, ctxTreeNodeEl };
