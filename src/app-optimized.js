/**
 * BOM Management System - Optimized modular version
 * Original: Single monolithic file
 * Optimized: Split by feature modules for better maintainability
 */

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
import { nowStr, todayStr } from './utils/format.js';

// Import modules
import * as auth from './modules/auth.js';
import * as ui from './modules/ui.js';
import * as navigation from './modules/navigation.js';
import * as bom from './modules/bom.js';
import * as materials from './modules/materials.js';
import * as dashboard from './modules/dashboard.js';
import { populateAllEnumSelects, populateEnumSelect, exportCSV } from './modules/utils.js';

// Deep clone initial data
const versions = JSON.parse(JSON.stringify(_versions));
const approvals = JSON.parse(JSON.stringify(_approvals));
const substituteMap = JSON.parse(JSON.stringify(_substituteMap));
const projectsData = JSON.parse(JSON.stringify(_projectsData));
const changesData = JSON.parse(JSON.stringify(_changesData));
const allBOMs = [
  bomDataA100, bomDataB200, bomDataC300, bomDataP12A, bomDataD400,
  bomDataW100, bomDataM500, bomDataF100, bomDataR900, bomDataT800, bomDataH200
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
];

// Expose global functions for inline HTML onclick handlers
window.getCurrentUser = auth.getCurrentUser;
window.quickLoginFromDataset = (el) => auth.quickLoginFromDataset(el, demoUsers);
window.handleQuickLogin = () => ui.showToast('Please login');
window.showLoginOverlay = auth.showLoginOverlay;
window.hideLoginOverlay = auth.hideLoginOverlay;
window.openSwitchAccount = auth.openSwitchAccount;
window.handleLoginClose = auth.hideLoginOverlay;
window.toggleTheme = ui.toggleTheme;
window.markAllNotifRead = ui.markAllNotifRead;
window.navigateTo = navigation.navigateTo;
window.toggleTreeNode = bom.toggleTreeNode;
window.expandAll = bom.expandAll;
window.collapseAll = bom.collapseAll;
window.selectNode = bom.selectNode;
window.showContextMenu = bom.showContextMenu;
window.ctxAction = bom.ctxAction;
window.toggleFavoriteFilter = () => {
  bom.toggleFavoriteFilter();
  materials.renderMaterials();
};
window.toggleMaterialFavorite = (id) => {
  materials.toggleMaterialFavorite(id);
};
window.toggleMaterialSelection = materials.toggleMaterialSelection;
window.toggleSelectAll = materials.toggleSelectAll;
window.clearSelection = materials.clearSelection;
window.changePage = (delta) => {
  materials.setMatPage(materials.getMatPage() + delta);
  materials.renderMaterials();
};
window.changePageSize = () => {
  materials.changePageSize();
  materials.renderMaterials();
};
window.batchDelete = materials.batchDelete;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core
  ui.initTheme();
  ui.initKeyboardShortcuts();
  ui.initModalBackdropClicks();
  navigation.initNavigation();
  populateAllEnumSelects();

  // Initialize BOM
  bom.initBOM(allBOMs, 0);

  // Initialize Auth/Login
  const accountsContainer = document.getElementById('loginAccounts');
  if (accountsContainer) {
    accountsContainer.innerHTML = demoUsers.map(user => auth.buildLoginPill(user)).join('');
  }
  auth.restoreQuickLoginSelection(demoUsers);
  auth.initLogin(demoUsers);

  // Initialize materials
  materials.initMaterialsFilters();
  materials.renderMaterials();

  // Initialize dashboard
  dashboard.renderDashboard();
  dashboard.updateNavBadges();

  // Render initial BOM tree
  bom.renderBOMTree();

  // Expose additional globals that are needed
  window.showMaterialModal = showMaterialModal;
  window.editMaterial = editMaterial;
  window.saveMaterial = saveMaterial;
  window.showNewBOMModal = showNewBOMModal;
  window.createNewBOM = createNewBOM;
  window.switchBOM = switchBOM;
  window.exportCurrentBOM = exportCurrentBOM;
  window.exportCSV = exportCSV;

  console.log('[BOM System] Initialized successfully (optimized modular version)');
});

// Modal functions that need global access
function showMaterialModal(editId) {
  populateAllEnumSelects();
  document.getElementById('materialModalTitle').textContent = editId ? '编辑物料' : '新增物料';
  document.getElementById('matEditId').value = editId || '';

  if (editId) {
    const materialsFlat = bom.getMaterialsFlat();
    const m = materialsFlat.find(x => x.id === editId);
    if (m) {
      document.getElementById('matFormId').value = m.id;
      document.getElementById('matFormName').value = m.name;
      document.getElementById('matFormSpec').value = m.spec || '';
      document.getElementById('matFormUnit').value = m.unit || '';
      document.getElementById('matFormQty').value = m.qty || 1;
      document.getElementById('matFormPrice').value = m.price || '';
      document.getElementById('matFormSupplier').value = m.supplier || '';
      document.getElementById('matFormStatus').value = m.status || '有效';
      document.getElementById('matFormIcon').value = m.icon || '';
      document.getElementById('matFormGrade').value = m.grade || '';
      document.getElementById('matFormStorage').value = m.storage || '';
    }
  } else {
    ['matFormId','matFormName','matFormSpec','matFormSupplier','matFormIcon'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('matFormQty').value = '1';
    document.getElementById('matFormPrice').value = '';
    document.getElementById('matFormStatus').value = '有效';
    document.getElementById('matFormUnit').value = '个';
  }
  ui.showModal('materialModal');
}

function editMaterial(id) {
  showMaterialModal(id);
}

function saveMaterial() {
  const editId = document.getElementById('matEditId').value;
  const data = {
    id: document.getElementById('matFormId').value.trim(),
    name: document.getElementById('matFormName').value.trim(),
    spec: document.getElementById('matFormSpec').value.trim(),
    unit: document.getElementById('matFormUnit').value.trim(),
    qty: parseInt(document.getElementById('matFormQty').value) || 1,
    price: parseFloat(document.getElementById('matFormPrice').value) || 0,
    supplier: document.getElementById('matFormSupplier').value.trim() || '—',
    status: document.getElementById('matFormStatus').value,
    icon: document.getElementById('matFormIcon').value.trim() || '📄',
    grade: document.getElementById('matFormGrade').value,
    storage: document.getElementById('matFormStorage').value,
    level: 2
  };

  if (!data.id || !data.name) {
    ui.showToast('请填写必填项', 'error');
    return;
  }

  const bomData = bom.getBomData();
  if (editId) {
    const node = bom.findNodeById(editId);
    if (node) {
      Object.assign(node, data);
      bom.rebuildFlat();
      bom.renderBOMTree();
      materials.renderMaterials();
      dashboard.updateNavBadges();
      ui.hideModal('materialModal');
      ui.showToast('物料保存成功', 'success');
    }
  } else {
    if (bomData.children && bomData.children[0]) {
      if (!bomData.children[0].children) bomData.children[0].children = [];
      bomData.children[0].children.push(data);
      bom.rebuildFlat();
      bom.renderBOMTree();
      materials.renderMaterials();
      dashboard.updateNavBadges();
      ui.hideModal('materialModal');
      ui.showToast('物料新增成功', 'success');
    }
  }
}

function showNewBOMModal() {
  ui.showModal('newBOMModal');
}

function createNewBOM() {
  const id = document.getElementById('newBomId').value.trim();
  const name = document.getElementById('newBomName').value.trim();
  const spec = document.getElementById('newBomSpec').value.trim();
  const unit = document.getElementById('newBomUnit').value.trim() || '台';
  const icon = document.getElementById('newBomIcon').value.trim() || '📦';

  if (!id || !name) {
    ui.showToast('请填写产品编号和名称', 'error');
    return;
  }

  const newBom = {
    id, name, spec, unit, icon, level: 1,
    children: [{
      id: `${id}-001`,
      name: `${name} 主板`,
      spec: '主电路板',
      unit: '块',
      qty: 1,
      level: 2,
      children: []
    }]
  };

  const newData = bom.setBomData(newBom);
  bom.setSelectedNodeId(newData.id);
  bom.rebuildFlat();
  bom.renderBOMTree();
  materials.renderMaterials();
  dashboard.updateNavBadges();
  ui.hideModal('newBOMModal');
  ui.showToast('新建 BOM 成功', 'success');

  // Update breadcrumb
  const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb) {
    breadcrumb.lastElementChild.textContent = name;
  }
}

function switchBOM(index) {
  const newBom = JSON.parse(JSON.stringify(allBOMs[index]));
  bom.setBomData(newBom);
  bom.setSelectedNodeId(newBom.id);
  bom.rebuildFlat();
  bom.renderBOMTree();
  materials.renderMaterials();
  dashboard.updateNavBadges();

  const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb) {
    breadcrumb.lastElementChild.textContent = newBom.name;
  }

  ui.showToast(`切换到 ${newBom.name}`, 'success');
}

function exportCurrentBOM() {
  const materialsFlat = bom.getMaterialsFlat();
  const headers = ['物料编号', '物料名称', '规格型号', '单位', '用量', '单价', '小计', '供应商', '状态'];
  const rows = materialsFlat.map(mat => [
    mat.id, mat.name, mat.spec || '', mat.unit || '-', mat.qty || 1,
    mat.price || 0, ((mat.price || 0) * (mat.qty || 1)).toFixed(2),
    mat.supplier || '-', mat.status || '有效'
  ]);

  const bomData = bom.getBomData();
  exportCSV(`${bomData.name}_BOM_export.csv`, headers, rows);
  ui.showToast('BOM 导出成功', 'success');
}

// Initialize pinned nodes rendering
window.togglePinNode = bom.togglePinNode;
window.showModal = ui.showModal;
window.hideModal = ui.hideModal;
window.showConfirmModal = ui.showConfirmModal;
window.clearFieldError = ui.clearFieldError;
window.setFieldError = ui.setFieldError;
