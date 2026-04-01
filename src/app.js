import {
  state, allBOMs, versions, approvals, substituteMap, projectsData, changesData,
  demoUsers, versionDiffs, enumConfig, settingsUsers, aprCenterData,
  documentsData, suppliersData, qualityData, modSortState, modPageState,
  rebuildFlat
} from './modules/state.js';
import { escapeHtml } from './utils/dom.js';
import { nowStr, todayStr } from './utils/format.js';
import { getStorage, setStorage, getSessionStorage, setSessionStorage } from './utils/storage.js';
import { validateField, clearFieldError, btnLoading, btnReset, toggleTheme, initTheme, hlText, applyFilterActiveState, saveFilterState, restoreFilterState, todayISO, genId, detailGrid } from './modules/ui-helpers.js';
import { renderPieChart, renderGauge, renderTreemap } from './modules/charts.js';
import { findUserByIdentifier, setCurrentUser, handleLoginSubmit, initLoginUI, quickLogin, quickLoginFromDataset, handleQuickLogin, showLoginOverlay, hideLoginOverlay, openSwitchAccount, handleLoginClose, getDemoUserByName, persistQuickUser, getSavedQuickUser, highlightQuickUser, renderLoginPreview, selectQuickUser, restoreQuickLoginSelection, getAvatarColor, buildLoginPill, populateEnumSelect, populateAllEnumSelects, findNode, findParent, updateStatusBar } from './modules/auth.js';
import { saveTreeState, restoreTreeState, renderTree, buildTreeNode, nodeMatchesSearch, showDetail, expandAll, collapseAll, editSelectedNode, addChildToSelected, computeNodeCost, formatCurrency, updateCostSummary, calcSubtreeStats, renderNodeInsights, persistPinnedNodes, updatePinButton, togglePinNode, removePinnedNode, focusPinnedNode, renderPinBoard, exportCurrentBOM, updateTreeStats, showContextMenu, hideContextMenu, ctxAction, saveNode } from './modules/bom-tree.js';
import { getCategory, buildFilterDropdowns, getFilteredMaterials, renderMaterials, renderMatStats, renderBomHealth, sortMaterials, changePage, changePageSize, showMatDetail, toggleMatSelect, toggleSelectAll, clearSelection, updateBatchBar, showMaterialModal, editMaterial, saveMaterial, deleteMaterial, batchDelete, toggleFavoriteFilter, toggleFavorite } from './modules/materials.js';
import { renderVersions, viewVersion, createVersion, showCompare, runCompare } from './modules/versions.js';
import { getFilteredApprovals, renderApprovalStats, canCurrentUserApprove, isApplicant, renderApprovals, toggleApproval, submitApproval, showApproveModal, doApprove, withdrawApproval, resubmitApproval, remindApproval, exportApprovals } from './modules/approvals.js';
import { exportCSV, downloadTemplate, handleFileSelect, handleFileDrop, parseCSV, doImport } from './modules/export-import.js';
import { renderReports } from './modules/reports.js';
import { renderSettings, addEnumItem, removeEnumItem } from './modules/settings.js';
import { showModal, hideModal, showConfirm, showToast, navigateTo } from './modules/navigation.js';
import { renderDashboard, updateNavBadges, initNotifBell, renderLoginPills, renderDashTodos } from './modules/dashboard.js';
import { showBatchEditModal, doBatchEdit, showWhereUsed, editSubstitutes, addSubstitute, removeSubstitute, cloneNode, rollbackVersion, renderCostTrend, renderDuplicateCheck, renderSingleSourceRisk, populateBOMSelector, switchBOM, showNewBOMModal, createNewBOM, deleteBOM, editUser, saveUserEdit, renderSearchDropdown, hideSearchDropdown, updateSortIndicators, initNotifActions, markAllNotifRead } from './modules/advanced-ops.js';
import { renderProjects, switchChgTab, renderChanges, switchAprTab, renderApprovalCenter, renderDocuments, renderSuppliers, renderQuality, modSort, modPage, modSortData, modPaginate, handleDocFileSelect, showNewProjectModal, editProject, saveProject, deleteProject, projAction, showProjDetail, showChgModal, saveChange, editChange, deleteChange, chgAction, showChgDetail, saveDocument, deleteDoc, docAction, showDocDetail, saveSupplier, editSupplier, supAction, showSupReviewModal, saveSupReview, showSupDetail, saveQuality, deleteQa, qaAction, showQaDetail, doAprCenterAction, exportModuleCSV, analyzeChangeImpact } from './modules/page-modules.js';
import { buildLifecycleData, renderLifecycle, renderCostAnalysis, renderCostCompare, buildInventoryData, renderInventory, exportInventoryReport, renderProcessRoutes, showNewProcessModal, renderProductConfig, buildComplianceData, renderCompliance, exportComplianceReport, updateWhatIf, resetWhatIf } from './modules/pdm-modules.js';
import { enhanceTreeSearch, trackRecentAccess, renderRecentAccess, logAction, renderAuditLog, canUserDo, applyPermissions, startInlineEdit, showShortcutHelp, initEnhancements } from './modules/enhancements.js';

// ===== Expose all functions to window for onclick handlers in dynamic HTML =====
const exposedAPI = {
  addChildToSelected, batchDelete, changePage, changePageSize, clearFieldError,
  clearSelection, collapseAll, createNewBOM, createVersion, ctxAction,
  doApprove, doBatchEdit, doImport, downloadTemplate, editSelectedNode,
  expandAll, exportApprovals, exportCSV, exportComplianceReport, exportCurrentBOM,
  exportInventoryReport, exportModuleCSV, handleDocFileSelect, handleFileDrop,
  handleFileSelect, hideModal, markAllNotifRead, modPage, modSort, navigateTo,
  renderApprovalCenter, renderApprovals, renderChanges, renderCompliance,
  renderCostCompare, renderDocuments, renderInventory, renderLifecycle,
  renderProjects, renderQuality, renderSuppliers, runCompare, saveChange,
  saveDocument, saveMaterial, saveNode, saveProject, saveQuality, saveSupReview,
  saveSupplier, saveUserEdit, showBatchEditModal, showChgModal, showMaterialModal,
  showModal, showNewBOMModal, showNewProcessModal, showNewProjectModal,
  showSupReviewModal, sortMaterials, submitApproval, switchAprTab, switchBOM,
  switchChgTab, toggleFavorite, toggleFavoriteFilter, togglePinNode,
  toggleSelectAll, toggleTheme, focusPinnedNode, removePinnedNode,
  quickLogin, quickLoginFromDataset, handleQuickLogin,
  updateWhatIf, resetWhatIf,
  analyzeChangeImpact
};
Object.assign(window, exposedAPI);

// ===== INIT =====
try { var savedBomIdx = parseInt(localStorage.getItem('bom_active_idx')); if (!isNaN(savedBomIdx) && savedBomIdx >= 0 && savedBomIdx < allBOMs.length) { state.bomData = allBOMs[savedBomIdx]; state.selectedNodeId = state.bomData.id; } } catch(e) {}
populateAllEnumSelects();
populateBOMSelector();
rebuildFlat();
renderTree();
buildFilterDropdowns();
renderMaterials();
renderVersions();
renderApprovals();
showDetail(state.bomData);
renderLoginPills();
initNotifBell();
initNotifActions();
initLoginUI();
initTheme();
initEnhancements();
