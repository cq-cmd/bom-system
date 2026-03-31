// 增强功能 (最近访问/审计日志/权限/行内编辑/搜索增强等)
import { state, projectsData, changesData, rebuildFlat } from './state.js';
import { nowStr } from '../utils/format.js';
import { hlText, applyFilterActiveState, saveFilterState, restoreFilterState } from './ui-helpers.js';
import { renderTree, ctxAction } from './bom-tree.js';
import { navigateTo, showModal } from './navigation.js';
import { showMatDetail, renderMaterials } from './materials.js';
import { showProjDetail, showChgDetail } from './page-modules.js';
import { findNode, updateStatusBar } from './auth.js';

// ========== ENHANCEMENTS ==========

var auditLog = [];
var recentAccess = [];
try { recentAccess = JSON.parse(localStorage.getItem('bom_recent') || '[]'); } catch(e) { recentAccess = []; }

// validateField, clearFieldError, btnLoading, btnReset — imported from ./modules/ui-helpers.js

// _orig wrappers removed — enhancements merged into base functions

// toggleTheme, initTheme — imported from ./modules/ui-helpers.js

var _origTreeSearch = null;
function enhanceTreeSearch() {
  var searchEl = document.getElementById('treeSearch');
  if (!searchEl) return;
  searchEl.removeEventListener('input', searchEl._handler);
  searchEl._handler = function(e) {
    state.treeSearchTerm = e.target.value;
    renderTree();
    if (state.treeSearchTerm) {
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

// hlText, applyFilterActiveState — imported from ./modules/ui-helpers.js

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

function logAction(action, target, detail) {
  auditLog.unshift({time: nowStr(), user: state.currentUser ? state.currentUser.name : '—', action: action, target: target || '', detail: detail || ''});
  if (auditLog.length > 100) auditLog = auditLog.slice(0, 100);
}

function renderAuditLog() {
  return '<div class="settings-section"><h3>📋 操作日志 <span style="font-size:11px;font-weight:400;color:var(--text-muted)">(' + auditLog.length + ' 条)</span></h3>' +
    (auditLog.length === 0 ? '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px">暂无操作记录</div>' :
    '<div class="audit-log">' + auditLog.slice(0, 50).map(function(a) {
      return '<div class="audit-item"><span class="audit-time">' + a.time + '</span><span class="audit-action"><b>' + a.user + '</b> ' + a.action + (a.target ? ' — ' + a.target : '') + '</span></div>';
    }).join('') + '</div>') + '</div>';
}

function canUserDo(action) {
  if (!state.currentUser) return false;
  var role = state.currentUser.role;
  var adminRoles = ['技术总监', '研发主管'];
  var engineerRoles = ['高级工程师', '硬件工程师', '射频工程师', '结构工程师', '测试工程师'];
  if (action === 'admin') return adminRoles.includes(role);
  if (action === 'approve') return adminRoles.includes(role) || role === '品质工程师';
  if (action === 'edit') return adminRoles.includes(role) || engineerRoles.includes(role);
  if (action === 'delete') return adminRoles.includes(role);
  return true;
}

function applyPermissions() {
  if (!state.currentUser) return;
  var settingsNav = document.querySelector('[data-nav="settings"]');
  if (settingsNav && !canUserDo('admin')) settingsNav.style.opacity = '0.5';
}

// renderPieChart, renderGauge, renderTreemap — imported from ./modules/charts.js

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

// saveFilterState, restoreFilterState — imported from ./modules/ui-helpers.js

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
      var node = findNode(state.selectedNodeId);
      if (!node) return;
      if (e.key === 'F2') { e.preventDefault(); state.ctxNode = node; ctxAction('edit'); }
      else if (e.key === 'Insert') { e.preventDefault(); state.ctxNode = node; ctxAction('addChild'); }
      else if (e.key === 'Delete') { e.preventDefault(); state.ctxNode = node; ctxAction('delete'); }
      else if (e.key === 'ArrowRight') {
        var el = document.querySelector('.tree-node[data-node-id="' + state.selectedNodeId + '"] > .tree-children');
        var arrow = document.querySelector('.tree-node[data-node-id="' + state.selectedNodeId + '"] > .tree-row > .tree-arrow');
        if (el && !el.classList.contains('open')) { el.classList.add('open'); if (arrow) arrow.classList.add('expanded'); }
      } else if (e.key === 'ArrowLeft') {
        var el2 = document.querySelector('.tree-node[data-node-id="' + state.selectedNodeId + '"] > .tree-children');
        var arrow2 = document.querySelector('.tree-node[data-node-id="' + state.selectedNodeId + '"] > .tree-row > .tree-arrow');
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
  removePinnedNode,
  quickLogin,
  quickLoginFromDataset,
  handleQuickLogin
};

Object.assign(window, exposedAPI);


export { enhanceTreeSearch, trackRecentAccess, renderRecentAccess, logAction, renderAuditLog, canUserDo, applyPermissions, startInlineEdit, showShortcutHelp, initEnhancements };
