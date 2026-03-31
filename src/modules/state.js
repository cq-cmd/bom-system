// Shared mutable state — single source of truth for all global variables
// All modules should import from here instead of using module-level let/var

import { bomDataA100 } from '../data/bom-a100.js';
import { bomDataB200 } from '../data/bom-b200.js';
import { bomDataC300 } from '../data/bom-c300.js';
import { bomDataP12A } from '../data/bom-p12a.js';
import { bomDataD400 } from '../data/bom-d400.js';
import { bomDataW100 } from '../data/bom-w100.js';
import { bomDataM500 } from '../data/bom-m500.js';
import { bomDataF100 } from '../data/bom-f100.js';
import { bomDataR900 } from '../data/bom-r900.js';
import { bomDataT800 } from '../data/bom-t800.js';
import { bomDataH200 } from '../data/bom-h200.js';
import { versions as _versions } from '../data/versions.js';
import { approvals as _approvals } from '../data/approvals.js';
import { demoUsers } from '../data/users.js';
import { substituteMap as _substituteMap } from '../data/substitutes.js';
import { versionDiffs } from '../data/diffs.js';
import { enumConfig } from '../data/enums.js';
import { projectsData as _projectsData } from '../data/projects.js';
import { changesData as _changesData } from '../data/changes.js';

// Deep-clone mutable data
export const versions = JSON.parse(JSON.stringify(_versions));
export const approvals = JSON.parse(JSON.stringify(_approvals));
export const substituteMap = JSON.parse(JSON.stringify(_substituteMap));
export const projectsData = JSON.parse(JSON.stringify(_projectsData));
export const changesData = JSON.parse(JSON.stringify(_changesData));

export const allBOMs = [
  bomDataA100, bomDataB200, bomDataC300, bomDataP12A, bomDataD400,
  bomDataW100, bomDataM500, bomDataF100, bomDataR900, bomDataT800, bomDataH200
];

export { demoUsers, versionDiffs, enumConfig };

// Settings users (was inline in app.js)
export const settingsUsers = [
  { name: '张工', role: '高级工程师', email: 'zhang@example.com', status: '在线' },
  { name: '王主管', role: '研发主管', email: 'wang@example.com', status: '在线' },
  { name: '赵品质', role: '品质工程师', email: 'zhao@example.com', status: '离线' },
  { name: '陈总监', role: '技术总监', email: 'chen@example.com', status: '在线' },
  { name: '李工', role: '硬件工程师', email: 'li@example.com', status: '离线' },
  { name: '刘采购', role: '采购专员', email: 'liu@example.com', status: '在线' },
  { name: '孙测试', role: '测试工程师', email: 'sun@example.com', status: '在线' },
  { name: '周结构', role: '结构工程师', email: 'zhou@example.com', status: '离线' },
  { name: '吴射频', role: '射频工程师', email: 'wu@example.com', status: '在线' },
  { name: '郑产品', role: '产品经理', email: 'zheng@example.com', status: '在线' }
];

// Approval center data (was inline in app.js)
export const aprCenterData = [
  { id: 'APR-0042', title: '主板电源模块IC替换审批', type: '变更审批', applicant: '张工', time: '2025-06-10 14:30', urgency: '紧急', status: '待审批', target: 'mine' },
  { id: 'APR-0041', title: 'V3.0 BOM版本发布审批', type: 'BOM审批', applicant: '张工', time: '2025-06-09 09:00', urgency: '普通', status: '待审批', target: 'mine' },
  { id: 'APR-0040', title: '新物料 RF-20047 入库审批', type: '物料审批', applicant: '李工', time: '2025-06-08 16:20', urgency: '普通', status: '待审批', target: 'mine' },
  { id: 'APR-0039', title: 'T800 产品规格书发布', type: '文档审批', applicant: '王主管', time: '2025-06-07 11:00', urgency: '普通', status: '待审批', target: 'mine' },
  { id: 'APR-0038', title: 'USB接口升级变更单', type: '变更审批', applicant: '张工', time: '2025-06-05 10:15', urgency: '特急', status: '待审批', target: 'mine' },
  { id: 'APR-0037', title: '电容供应商切换ECR', type: '变更审批', applicant: '张工', time: '2025-06-12 08:30', urgency: '普通', status: '审批中', target: 'initiated' },
  { id: 'APR-0036', title: 'D400 手环BOM V2.0发布', type: 'BOM审批', applicant: '张工', time: '2025-06-01 14:00', urgency: '普通', status: '已通过', target: 'initiated' },
];

// Documents data (was inline in app.js around line 2230)
export const documentsData = [
  { id: 'DOC-2025-0081', name: 'P12A 手机整机结构设计图', type: '设计图纸', ver: 'V2.3', project: 'P12A 旗舰手机', uploader: '张工', date: '2025-06-14', status: '已发布' },
  { id: 'DOC-2025-0080', name: 'A100 主板PCBA Layout', type: '设计图纸', ver: 'V3.0', project: 'A100 整机', uploader: '李工', date: '2025-06-12', status: '审核中' },
  { id: 'DOC-2025-0079', name: 'D400 手环EVT测试报告', type: '测试报告', ver: 'V1.0', project: 'D400 智能手环', uploader: '赵品质', date: '2025-06-10', status: '已发布' },
  { id: 'DOC-2025-0078', name: 'T800 平板产品规格书', type: '规格书', ver: 'V0.8', project: 'T800 平板电脑', uploader: '王主管', date: '2025-06-08', status: '草稿' },
  { id: 'DOC-2025-0077', name: 'A100 SMT工艺指导书', type: '工艺文件', ver: 'V2.1', project: 'A100 整机', uploader: '张工', date: '2025-06-05', status: '已发布' },
  { id: 'DOC-2025-0076', name: 'P12A DVT阶段评审纪要', type: '会议纪要', ver: 'V1.0', project: 'P12A 旗舰手机', uploader: '陈总监', date: '2025-06-03', status: '已归档' },
  { id: 'DOC-2025-0075', name: 'W100 手表整机爆炸图', type: '设计图纸', ver: 'V1.2', project: 'W100 智能手表', uploader: '李工', date: '2025-05-30', status: '已发布' },
  { id: 'DOC-2025-0074', name: 'R900 路由器可靠性测试', type: '测试报告', ver: 'V1.1', project: 'R900 路由器', uploader: '赵品质', date: '2025-05-28', status: '已发布' },
  { id: 'DOC-2025-0073', name: '全产品线ESD规范', type: '规格书', ver: 'V3.0', project: '全产品线', uploader: '陈总监', date: '2025-05-25', status: '已发布' },
  { id: 'DOC-2025-0072', name: 'C300 车载终端散热分析', type: '测试报告', ver: 'V0.5', project: 'C300 车载终端', uploader: '张工', date: '2025-05-22', status: '审核中' },
  { id: 'DOC-2025-0071', name: 'M500 耳机注塑工艺文件', type: '工艺文件', ver: 'V2.0', project: 'M500 TWS耳机', uploader: '李工', date: '2025-05-20', status: '已归档' },
  { id: 'DOC-2025-0070', name: 'F100 折叠屏概念评审纪要', type: '会议纪要', ver: 'V1.0', project: 'F100 折叠屏手机', uploader: '陈总监', date: '2025-05-18', status: '已归档' },
  { id: 'DOC-2025-0069', name: 'H200 网关硬件规格书', type: '规格书', ver: 'V1.0', project: 'H200 智能家居网关', uploader: '王主管', date: '2025-05-15', status: '草稿' }
];

// Suppliers data (was inline in app.js around line 2265)
export const suppliersData = [
  { id: 'SUP-001', name: '国巨电子', type: '电子元器件', grade: 'A', contact: '林经理', matCount: 28, status: '合格', score: 95 },
  { id: 'SUP-002', name: '三星电机', type: '电子元器件', grade: 'A', contact: 'Kim Manager', matCount: 15, status: '合格', score: 92 },
  { id: 'SUP-003', name: '意法半导体', type: '电子元器件', grade: 'A', contact: 'Pierre', matCount: 8, status: '合格', score: 94 },
  { id: 'SUP-004', name: '德州仪器', type: '电子元器件', grade: 'A', contact: 'John', matCount: 12, status: '合格', score: 96 },
  { id: 'SUP-005', name: '华邦电子', type: '电子元器件', grade: 'B', contact: '陈主管', matCount: 5, status: '合格', score: 85 },
  { id: 'SUP-006', name: '顺络电子', type: '电子元器件', grade: 'B', contact: '黄经理', matCount: 6, status: '待评审', score: 78 },
  { id: 'SUP-007', name: '中航光电', type: '结构件', grade: 'A', contact: '刘总', matCount: 10, status: '合格', score: 91 },
  { id: 'SUP-008', name: '立讯精密', type: '结构件', grade: 'A', contact: '王经理', matCount: 14, status: '合格', score: 93 },
  { id: 'SUP-009', name: '风华高科', type: '电子元器件', grade: 'B', contact: '赵经理', matCount: 9, status: '合格', score: 82 },
  { id: 'SUP-010', name: '长电科技', type: '电子元器件', grade: 'B', contact: '孙总监', matCount: 7, status: '合格', score: 86 },
  { id: 'SUP-011', name: '深圳兴旺包装', type: '包材', grade: 'C', contact: '吴经理', matCount: 4, status: '待评审', score: 68 },
  { id: 'SUP-012', name: '东莞精密模具', type: '结构件', grade: 'C', contact: '周总', matCount: 3, status: '暂停', score: 55 },
  { id: 'SUP-013', name: '京东方', type: '显示模组', grade: 'A', contact: '李副总', matCount: 6, status: '合格', score: 90 },
  { id: 'SUP-014', name: '汇顶科技', type: '电子元器件', grade: 'B', contact: '张经理', matCount: 4, status: '合格', score: 84 }
];

// Quality data (was inline in app.js around line 2302)
export const qualityData = [
  { id: 'QA-2025-0031', title: '贴片电阻批次阻值偏移', type: '来料不良', severity: '严重', material: 'R-20001', owner: '赵品质', date: '2025-06-14', status: '分析中' },
  { id: 'QA-2025-0030', title: '主控芯片焊接虚焊', type: '制程不良', severity: '致命', material: 'IC-20003', owner: '张工', date: '2025-06-12', status: '待处理' },
  { id: 'QA-2025-0029', title: 'USB接口插拔寿命不足', type: '客诉', severity: '严重', material: 'CN-20028', owner: '李工', date: '2025-06-10', status: '整改中' },
  { id: 'QA-2025-0028', title: '电容容值偏差超标', type: '来料不良', severity: '一般', material: 'C-20002', owner: '赵品质', date: '2025-06-08', status: '待验证' },
  { id: 'QA-2025-0027', title: 'PCB板边毛刺', type: '制程不良', severity: '轻微', material: 'PCB-10001', owner: '王主管', date: '2025-06-05', status: '已关闭' },
  { id: 'QA-2025-0026', title: 'LED亮度一致性差', type: '来料不良', severity: '一般', material: 'LED-20024', owner: '赵品质', date: '2025-06-03', status: '已关闭' },
  { id: 'QA-2025-0025', title: '天线座接触不良', type: '客诉', severity: '严重', material: 'CN-20029', owner: '李工', date: '2025-05-30', status: '整改中' },
  { id: 'QA-2025-0024', title: '电感啸叫异音', type: '内部发现', severity: '一般', material: 'L-20005', owner: '张工', date: '2025-05-28', status: '已关闭' },
  { id: 'QA-2025-0023', title: 'Flash芯片读写速率下降', type: '来料不良', severity: '严重', material: 'IC-20021', owner: '赵品质', date: '2025-05-25', status: '待验证' },
  { id: 'QA-2025-0022', title: '二极管反向漏电流偏高', type: '内部发现', severity: '轻微', material: 'D-20023', owner: '张工', date: '2025-05-22', status: '已关闭' },
  { id: 'QA-2025-0021', title: '晶振频率偏移', type: '来料不良', severity: '一般', material: 'X-20026', owner: '李工', date: '2025-05-20', status: '已关闭' }
];

// Mutable global state
export const state = {
  bomData: allBOMs[0],
  materialsFlat: [],
  selectedNodeId: allBOMs[0].id,
  ctxNode: null,
  ctxTreeNodeEl: null,
  selectedMatIds: new Set(),
  importedData: null,
  currentUser: null,
  favoriteMaterials: new Set(),
  showFavoriteOnly: false,
  pinnedNodeIds: new Set(),
  selectedQuickUser: null,
  treeSearchTerm: '',
  expandedNodeIds: new Set(),
  matSortField: null,
  matSortAsc: true,
  matPage: 1,
  matPageSize: 20,
  chgTab: 'all',
  aprCenterTab: 'mine',
  confirmCallback: null,
  loginOverlayMode: 'auth',
};

// Restore persisted state
try {
  const rawFavs = JSON.parse(localStorage.getItem('bom_mat_favs') || '[]');
  if (Array.isArray(rawFavs)) state.favoriteMaterials = new Set(rawFavs);
} catch (e) { /* ignore */ }

try {
  state.showFavoriteOnly = localStorage.getItem('bom_mat_fav_only') === '1';
} catch (e) { /* ignore */ }

try {
  const rawPins = JSON.parse(localStorage.getItem('bom_node_pins') || '[]');
  if (Array.isArray(rawPins)) state.pinnedNodeIds = new Set(rawPins);
} catch (e) { /* ignore */ }

// Module sort/paginate state
export const modSortState = {
  proj: { field: null, asc: true },
  chg: { field: null, asc: true },
  doc: { field: null, asc: true },
  sup: { field: null, asc: true },
  qa: { field: null, asc: true }
};

export const modPageState = {
  proj: { page: 1, size: 10 },
  chg: { page: 1, size: 10 },
  doc: { page: 1, size: 10 },
  sup: { page: 1, size: 10 },
  qa: { page: 1, size: 10 }
};

// ===== 物料扁平化 & 收藏操作 =====
// 这些函数只操作 state 对象，放在 state.js 避免循环依赖

function rebuildFlat() {
  state.materialsFlat.length = 0;
  function walk(node) { if (node.level >= 2) state.materialsFlat.push(node); if (node.children) node.children.forEach(walk); }
  walk(state.bomData);
  cleanupFavoriteMaterials();
}

function cleanupFavoriteMaterials() {
  if (!state.favoriteMaterials.size) return;
  const valid = new Set(state.materialsFlat.map(m => m.id));
  let changed = false;
  state.favoriteMaterials.forEach(id => {
    if (!valid.has(id)) { state.favoriteMaterials.delete(id); changed = true; }
  });
  if (changed) persistFavorites();
}

function persistFavorites() {
  try { localStorage.setItem('bom_mat_favs', JSON.stringify([...state.favoriteMaterials])); } catch(e) {}
}
function persistFavoriteFilter() {
  try { localStorage.setItem('bom_mat_fav_only', state.showFavoriteOnly ? '1' : '0'); } catch(e) {}
}
function updateFavToggleButton() {
  const btn = document.getElementById('favToggleBtn');
  if (!btn) return;
  btn.classList.toggle('fav-active', state.showFavoriteOnly);
  btn.textContent = (state.showFavoriteOnly ? '★ 仅看收藏' : '☆ 收藏筛选');
}

export { rebuildFlat, cleanupFavoriteMaterials, persistFavorites, persistFavoriteFilter, updateFavToggleButton };
