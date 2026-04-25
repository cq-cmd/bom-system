<<<<<<< HEAD
// 导航/标签/搜索/模态框/Toast
import { state, versions } from './state.js';
import { renderMaterials, buildFilterDropdowns } from './materials.js';
import { renderSearchDropdown, hideSearchDropdown } from './advanced-ops.js';
import { renderDashboard } from './dashboard.js';
import { renderReports } from './reports.js';
import { renderSettings } from './settings.js';
import { renderProjects, renderChanges, renderApprovalCenter, renderDocuments, renderSuppliers, renderQuality } from './page-modules.js';
import { renderLifecycle, renderCostAnalysis, renderInventory, renderProcessRoutes, renderProductConfig, renderCompliance } from './pdm-modules.js';

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
document.getElementById('matSearch').addEventListener('input', () => { state.matPage = 1; renderMaterials(); });
document.getElementById('matFilter').addEventListener('change', () => { state.matPage = 1; renderMaterials(); });
document.getElementById('matCategoryFilter').addEventListener('change', () => { state.matPage = 1; renderMaterials(); });
document.getElementById('matSupplierFilter').addEventListener('change', () => { state.matPage = 1; renderMaterials(); });

// ===== MODALS =====
function showModal(id) {
  document.getElementById(id).classList.add('show');
  if (id === 'newApprovalModal') {
    const sel = document.getElementById('aprFormVer');
    sel.innerHTML = versions.map(v => `<option value="${v.ver}">${v.ver}${v.status==='当前'?' (当前)':''}</option>`).join('');
    const aprApplicant = document.getElementById('aprFormApplicant');
    if (aprApplicant) aprApplicant.value = state.currentUser ? state.currentUser.name : '未登录';
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
  // Auto-focus first input + focus trap
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
}
function hideModal(id) {
  var modal = document.getElementById(id);
  if (modal && modal._trapFocus) { modal.removeEventListener('keydown', modal._trapFocus); modal._trapFocus = null; }
  if (modal) modal.classList.remove('show');
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('show'); });
});

// ===== CONFIRM =====

function showConfirm(msg, callback) {
  document.getElementById('confirmMsg').textContent = msg;
  state.confirmCallback = callback;
  document.getElementById('confirmBtn').onclick = () => { hideModal('confirmModal'); if (state.confirmCallback) state.confirmCallback(); state.confirmCallback = null; };
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
    const match = state.materialsFlat.find(m => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q));
    if (match) {
      navigateTo('materials');
      document.getElementById('matSearch').value = q;
      state.matPage = 1; buildFilterDropdowns(); renderMaterials();
    }
  }
});
document.addEventListener('click', function(e) {
  if (!e.target.closest('.global-search')) hideSearchDropdown();
});

// ===== TOAST =====
function showToast(msg, type, undoFn, duration) {
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
      showToast('已撤销', 'info');
    };
    t.appendChild(undoBtn);
  }
  container.appendChild(t);
  setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, duration);
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


export { showModal, hideModal, showConfirm, showToast, navigateTo };
=======
import { setStorage, getStorage } from '../utils/storage.js';

export let currentPage = 'dashboard';

export function navigateTo(pageId) {
  // Update sidebar navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.nav === pageId);
  });

  // Update page panels
  document.querySelectorAll('.page-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'page-' + pageId);
  });

  currentPage = pageId;
  try {
    setStorage('bom_page', pageId);
  } catch(e) {}

  updateBreadcrumb(pageId);

  // Trigger page-specific refresh if needed
  switch(pageId) {
    case 'materials':
      // Already rendered on init
      break;
    case 'dashboard':
      // Refresh dashboard
      break;
  }
}

function updateBreadcrumb(pageId) {
  const labels = {
    dashboard: '仪表盘',
    bom: 'BOM 管理',
    materials: '物料库',
    projects: '项目管理',
    changes: '变更管理',
    approvals: '审批中心',
    lifecycle: '生命周期',
    cost: '成本分析',
    suppliers: '供应商管理',
    inventory: '库存/采购',
    compliance: '合规认证',
    documents: '文档中心',
    process: '工艺路线',
    quality: '质量管理',
    config: '产品配置',
    reports: '报表中心',
    settings: '系统设置'
  };

  const breadcrumb = document.querySelector('.breadcrumb');
  if (!breadcrumb) return;

  const label = labels[pageId] || pageId;
  breadcrumb.lastElementChild.textContent = label;
}

export function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.nav;
      if (page) navigateTo(page);
    });
  });

  // Restore last page
  try {
    const saved = getStorage('bom_page');
    if (saved && document.getElementById('page-' + saved)) {
      navigateTo(saved);
    }
  } catch(e) {}
}

export { currentPage };
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
