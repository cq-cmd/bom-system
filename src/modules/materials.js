<<<<<<< HEAD
// 物料表 + 批量操作 + 收藏 + 行内编辑
import { state, allBOMs, enumConfig, rebuildFlat, persistFavorites, persistFavoriteFilter, updateFavToggleButton, substituteMap } from './state.js';
import { escapeHtml } from '../utils/dom.js';
import { validateField, btnLoading, btnReset, hlText, applyFilterActiveState } from './ui-helpers.js';
import { startInlineEdit, trackRecentAccess, logAction } from './enhancements.js';
import { updateSortIndicators, showWhereUsed, editSubstitutes } from './advanced-ops.js';
import { findNode, findParent, populateAllEnumSelects, updateStatusBar } from './auth.js';
import { hideModal, showModal, showToast, showConfirm } from './navigation.js';
import { renderPriceHistory } from './charts.js';
import { renderTree } from './bom-tree.js';
import { updateNavBadges } from './dashboard.js';

// ===== MATERIALS TABLE (Enhanced) =====

const categoryNames = {R:'电阻',C:'电容',IC:'芯片',L:'电感',D:'二极管',LED:'LED',X:'晶振',CN:'连接器',PCB:'PCB',CASE:'机壳',LCD:'显示',BAT:'电池',RF:'射频',PWR:'电源',SEN:'传感器',PKG:'包装'};
function getCategory(id) { const p = id.split('-')[0]; return categoryNames[p] || p; }
function buildFilterDropdowns() {
  const cats = [...new Set(state.materialsFlat.map(m => getCategory(m.id)))].sort();
  const sups = [...new Set(state.materialsFlat.map(m => m.supplier))].sort();
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
  let data = state.materialsFlat.slice();
  if (filter !== 'all') data = data.filter(m => m.status === filter);
  if (cat !== 'all') data = data.filter(m => getCategory(m.id) === cat);
  if (sup !== 'all') data = data.filter(m => m.supplier === sup);
  if (search) data = data.filter(m => m.id.toLowerCase().includes(search) || m.name.toLowerCase().includes(search) || m.supplier.toLowerCase().includes(search));
  if (state.showFavoriteOnly) data = data.filter(m => state.favoriteMaterials.has(m.id));
  if (state.matSortField) {
    data.sort((a,b) => {
      let va, vb;
      if (state.matSortField === 'subtotal') { va = a.price*a.qty; vb = b.price*b.qty; }
      else { va = a[state.matSortField]; vb = b[state.matSortField]; }
      if (typeof va === 'string') return state.matSortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      return state.matSortAsc ? va - vb : vb - va;
    });
  }
  return data;
}
function renderMaterials() {
  const data = getFilteredMaterials();
  updateFavToggleButton();
  const totalCost = data.reduce((s,m) => s + m.price*m.qty, 0);
  const totalPages = Math.max(1, Math.ceil(data.length / state.matPageSize));
  if (state.matPage > totalPages) state.matPage = totalPages;
  const start = (state.matPage - 1) * state.matPageSize;
  const pageData = data.slice(start, start + state.matPageSize);
  const tbody = document.getElementById('matBody');
  tbody.innerHTML = pageData.map((m, i) => {
    const sub = m.price * m.qty;
    const cls = m.status==='有效'?'badge-green':m.status==='停用'?'badge-red':'badge-yellow';
    const checked = state.selectedMatIds.has(m.id) ? 'checked' : '';
    const rowCls = state.selectedMatIds.has(m.id) ? ' class="selected-row"' : '';
    const cat = getCategory(m.id);
    const fav = state.favoriteMaterials.has(m.id);
    const star = '<button class="star-btn'+(fav?' active':'')+'" onclick="event.stopPropagation();toggleFavorite(\''+m.id+'\')" title="'+(fav?'取消收藏':'收藏该物料')+'">'+(fav?'★':'☆')+'</button>';
    return '<tr'+rowCls+' ondblclick="editMaterial(\''+m.id+'\')"><td><input type="checkbox" '+checked+' onchange="toggleMatSelect(\''+m.id+'\',this.checked)" /></td><td class="star-cell">'+star+'</td><td>'+(start+i+1)+'</td><td style="color:var(--accent);font-weight:500;cursor:pointer" onclick="showMatDetail(\''+m.id+'\')">'+m.id+'</td><td style="cursor:pointer" onclick="showMatDetail(\''+m.id+'\')">'+m.name+'</td><td><span class="badge badge-purple">'+cat+'</span></td><td style="color:var(--text-secondary)">'+m.spec+'</td><td>'+m.unit+'</td><td class="text-right">'+m.qty+'</td><td>'+m.supplier+'</td><td class="text-right">'+m.price.toFixed(2)+'</td><td class="text-right" style="font-weight:500">'+sub.toFixed(2)+'</td><td><span class="badge '+cls+'" title="'+m.status+'">'+m.status+'</span></td><td><button class="btn btn-ghost btn-xs" onclick="showMatDetail(\''+m.id+'\')" title="查看详情">👁</button><button class="btn btn-ghost btn-xs" onclick="editMaterial(\''+m.id+'\')" title="编辑">✏️</button><button class="btn btn-ghost btn-xs" onclick="deleteMaterial(\''+m.id+'\')" title="删除">🗑</button></td></tr>';
  }).join('');
  document.getElementById('matSummary').textContent = '共 '+data.length+' 种物料（显示 '+(start+1)+'-'+Math.min(start+state.matPageSize, data.length)+'）';
  document.getElementById('matCost').textContent = '总成本: ¥ '+totalCost.toFixed(2);
  document.getElementById('pageInfo').textContent = '第 '+state.matPage+' / '+totalPages+' 页';
  document.getElementById('prevPage').disabled = state.matPage <= 1;
  document.getElementById('nextPage').disabled = state.matPage >= totalPages;
  updateBatchBar();
  renderMatStats(data, totalCost);
  renderBomHealth();
  // Enhancement: filter state, inline edit, search highlight, empty state
  if (typeof applyFilterActiveState === 'function') applyFilterActiveState();
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
    if (td) { e.stopPropagation(); if (typeof startInlineEdit === 'function') startInlineEdit(td); }
  });
  var matSearch = (document.getElementById('matSearch')?.value || '').toLowerCase();
  if (matSearch && typeof hlText === 'function') {
    rows.forEach(function(row) {
      var cells = row.querySelectorAll('td');
      if (cells[3]) cells[3].innerHTML = hlText(cells[3].textContent, matSearch);
      if (cells[4]) cells[4].innerHTML = hlText(cells[4].textContent, matSearch);
    });
  }
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
  const inactive = state.materialsFlat.filter(m => m.status === '停用');
  const pending = state.materialsFlat.filter(m => m.status === '待审');
  const supplierCount = {};
  state.materialsFlat.forEach(m => {
    if (!m.supplier || m.supplier === '—') return;
    supplierCount[m.supplier] = (supplierCount[m.supplier] || 0) + 1;
  });
  const risk = state.materialsFlat.filter(m => m.status === '有效' && m.supplier && m.supplier !== '—' && supplierCount[m.supplier] === 1).slice(0,3);
  const formatList = list => list.length ? list.map(m => m.name).slice(0,3).join('、') : '暂无';
  el.innerHTML = `
    <div class="health-item"><span>停用物料</span><span><span class="badge badge-red">${inactive.length}</span>${formatList(inactive)}</span></div>
    <div class="health-item"><span>待审物料</span><span><span class="badge badge-yellow">${pending.length}</span>${formatList(pending)}</span></div>
    <div class="health-item"><span>单一供应商风险</span><span><span class="badge badge-purple">${risk.length}</span>${formatList(risk)}</span></div>
  `;
}
function sortMaterials(field) {
  if (state.matSortField === field) state.matSortAsc = !state.matSortAsc;
  else { state.matSortField = field; state.matSortAsc = true; }
  state.matPage = 1;
  renderMaterials();
  updateSortIndicators();
}
function changePage(delta) { state.matPage += delta; renderMaterials(); }
function changePageSize() { state.matPageSize = parseInt(document.getElementById('pageSizeSelect').value); state.matPage = 1; renderMaterials(); }
function showMatDetail(id) {
  const m = findNode(id);
  if (!m) return;
  if (typeof trackRecentAccess === 'function') trackRecentAccess('materials', id, m.name, m.icon || '📦');
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
  document.getElementById('matDetailBody').innerHTML = baseHtml + `<div class="substitute-list"><h4>🔁 替代物料</h4>${subsHtml}</div><div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)"><h4 style="font-size:13px;font-weight:600;margin-bottom:12px">📈 价格趋势 (12个月)</h4><div id="matPriceHistoryChart" style="min-height:120px"></div></div>`;
  // Render price history chart if available
  if (typeof renderPriceHistory === 'function') {
    setTimeout(function() { renderPriceHistory('matPriceHistoryChart', m.id, m.price); }, 50);
  }
  document.getElementById('matDetailEditBtn').onclick = function() { hideModal('matDetailModal'); editMaterial(id); };
  document.getElementById('matDetailWhereUsedBtn').onclick = function() { hideModal('matDetailModal'); showWhereUsed(id); };
  document.getElementById('matDetailSubBtn').onclick = function() { hideModal('matDetailModal'); editSubstitutes(id); };
  showModal('matDetailModal');
}
function toggleMatSelect(id, checked) { if (checked) state.selectedMatIds.add(id); else state.selectedMatIds.delete(id); renderMaterials(); }
function toggleSelectAll() { const all = document.getElementById('selectAll').checked; const data = getFilteredMaterials(); data.forEach(m => { if (all) state.selectedMatIds.add(m.id); else state.selectedMatIds.delete(m.id); }); renderMaterials(); }
function clearSelection() { state.selectedMatIds.clear(); document.getElementById('selectAll').checked = false; renderMaterials(); }
function updateBatchBar() {
  const bar = document.getElementById('batchBar');
  if (state.selectedMatIds.size > 0) { bar.style.display = 'flex'; document.getElementById('batchCount').textContent = '已选 ' + state.selectedMatIds.size + ' 项'; }
  else { bar.style.display = 'none'; }
}
function showMaterialModal(editId) {
  populateAllEnumSelects();
  document.getElementById('materialModalTitle').textContent = editId ? '编辑物料' : '新增物料';
  document.getElementById('matEditId').value = editId || '';
  if (editId) {
    const m = state.materialsFlat.find(x => x.id === editId);
    if (m) { document.getElementById('matFormId').value=m.id; document.getElementById('matFormName').value=m.name; document.getElementById('matFormSpec').value=m.spec; document.getElementById('matFormUnit').value=m.unit; document.getElementById('matFormQty').value=m.qty; document.getElementById('matFormPrice').value=m.price; document.getElementById('matFormSupplier').value=m.supplier; document.getElementById('matFormStatus').value=m.status; document.getElementById('matFormIcon').value=m.icon||''; document.getElementById('matFormGrade').value=m.grade||''; document.getElementById('matFormStorage').value=m.storage||''; }
  } else {
    ['matFormId','matFormName','matFormSpec','matFormSupplier','matFormIcon'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('matFormQty').value = '1'; document.getElementById('matFormPrice').value = ''; document.getElementById('matFormStatus').value = '有效'; document.getElementById('matFormUnit').value = '个'; document.getElementById('matFormGrade').value = ''; document.getElementById('matFormStorage').value = '';
  }
  showModal('materialModal');
}
function editMaterial(id) { showMaterialModal(id); }
function saveMaterial() {
  if (!validateField('matFormId', '物料编号')) return;
  if (!validateField('matFormName', '物料名称')) return;
  var btn = document.querySelector('#materialModal .btn-primary');
  btnLoading(btn);
  setTimeout(function() {
    btnReset(btn);
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
      if (state.bomData.children && state.bomData.children[0]) {
        if (!state.bomData.children[0].children) state.bomData.children[0].children = [];
        state.bomData.children[0].children.push(data);
      }
    }
    hideModal('materialModal');
    rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar(); updateNavBadges();
    showToast('物料保存成功', 'success');
    logAction('保存物料', document.getElementById('matFormId').value);
  }, 300);
}
function deleteMaterial(id) {
  var m = findNode(id);
  if (!m) return;
  showConfirm('确定删除物料 "' + m.name + '" 吗？', function() {
    var parent = findParent(id);
    var idx = -1;
    if (parent && parent.children) {
      idx = parent.children.indexOf(m);
      parent.children = parent.children.filter(function(c) { return c.id !== id; });
    }
    state.selectedMatIds.delete(id);
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
}
function batchDelete() {
  if (state.selectedMatIds.size === 0) return;
  var items = [];
  state.selectedMatIds.forEach(function(id) {
    var m = findNode(id);
    if (m) items.push(m.name + ' (' + id + ')');
  });
  var listText = '确定删除以下 ' + items.length + ' 个物料吗？\n\n' + items.slice(0, 8).join('\n') + (items.length > 8 ? '\n…还有 ' + (items.length - 8) + ' 项' : '');
  showConfirm(listText, function() {
    var backup = [];
    state.selectedMatIds.forEach(function(id) {
      var parent = findParent(id);
      var node = findNode(id);
      if (parent && parent.children && node) {
        backup.push({parent: parent, node: node, idx: parent.children.indexOf(node)});
        parent.children = parent.children.filter(function(c) { return c.id !== id; });
      }
    });
    var count = state.selectedMatIds.size;
    state.selectedMatIds.clear();
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
}
document.getElementById('batchStatus').addEventListener('change', function() {
  if (!this.value || state.selectedMatIds.size === 0) return;
  const count = state.selectedMatIds.size;
  const newStatus = this.value;
  state.selectedMatIds.forEach(id => { const node = findNode(id); if (node) node.status = newStatus; });
  this.value = '';
  rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
  showToast('已更新 ' + count + ' 项物料状态为「' + newStatus + '」', 'success');
});


function toggleFavoriteFilter() {
  state.showFavoriteOnly = !state.showFavoriteOnly;
  persistFavoriteFilter();
  updateFavToggleButton();
  state.matPage = 1;
  renderMaterials();
}
function toggleFavorite(id) {
  if (state.favoriteMaterials.has(id)) {
    state.favoriteMaterials.delete(id);
    showToast('已从收藏移除 ' + id, 'info');
  } else {
    state.favoriteMaterials.add(id);
    showToast('已收藏物料 ' + id, 'success');
  }
  persistFavorites();
  renderMaterials();
}

export { getCategory, buildFilterDropdowns, getFilteredMaterials, renderMaterials, renderMatStats, renderBomHealth, sortMaterials, changePage, changePageSize, showMatDetail, toggleMatSelect, toggleSelectAll, clearSelection, updateBatchBar, showMaterialModal, editMaterial, saveMaterial, deleteMaterial, batchDelete, toggleFavoriteFilter, toggleFavorite };
=======
import { escapeHtml, hlText } from '../utils/dom.js';
import { showToast, showConfirmModal } from './ui.js';
import { getMaterialsFlat, getFavoriteMaterials, getShowFavoriteOnly, toggleFavorite } from './bom.js';

let matPage = 1;
let matPageSize = 20;
let matSort = { field: null, asc: true };
let searchTerm = '';
let filterStatus = 'all';
let filterCategory = 'all';
let filterSupplier = 'all';
let selectedMatIds = new Set();

export function getSelectedMatIds() {
  return selectedMatIds;
}

export function clearSelection() {
  selectedMatIds.clear();
  updateBatchBar();
}

function updateBatchBar() {
  const bar = document.getElementById('batchBar');
  const count = document.getElementById('batchCount');
  if (!bar || !count) return;

  if (selectedMatIds.size > 0) {
    bar.style.display = 'flex';
    count.textContent = `已选 ${selectedMatIds.size} 项`;
  } else {
    bar.style.display = 'none';
  }
}

export function toggleSelectAll() {
  const materials = getFilteredMaterials();
  if (selectedMatIds.size === materials.length) {
    selectedMatIds.clear();
  } else {
    materials.forEach(m => selectedMatIds.add(m.id));
  }
  updateBatchBar();
  renderMaterials();
}

export function toggleMaterialSelection(id) {
  if (selectedMatIds.has(id)) {
    selectedMatIds.delete(id);
  } else {
    selectedMatIds.add(id);
  }
  updateBatchBar();
}

function getFilteredMaterials() {
  let materials = getMaterialsFlat();
  const favorites = getFavoriteMaterials();
  const showOnlyFavs = getShowFavoriteOnly();

  if (showOnlyFavs) {
    materials = materials.filter(m => favorites.has(m.id));
  }

  if (!searchTerm && filterStatus === 'all' && filterCategory === 'all' && filterSupplier === 'all') {
    return materials;
  }

  const q = searchTerm.toLowerCase();
  return materials.filter(mat => {
    if (searchTerm && !(mat.id.toLowerCase().includes(q) || mat.name.toLowerCase().includes(q) || (mat.spec && mat.spec.toLowerCase().includes(q)))) {
      return false;
    }
    if (filterStatus !== 'all' && mat.status !== filterStatus) {
      return false;
    }
    // Category and supplier filters can be added based on data
    return true;
  });
}

function sortMaterials(field) {
  if (matSort.field === field) {
    matSort.asc = !matSort.asc;
  } else {
    matSort.field = field;
    matSort.asc = true;
  }
  matPage = 1;
  renderMaterials();
}

function changePage(delta) {
  matPage += delta;
  renderMaterials();
}

function changePageSize() {
  const select = document.getElementById('pageSizeSelect');
  if (!select) return;
  matPageSize = parseInt(select.value, 10);
  matPage = 1;
  renderMaterials();
}

function calculateTotalCost(materials) {
  return materials.reduce((sum, mat) => sum + (mat.price || 0) * (mat.qty || 1), 0);
}

export function renderMaterials() {
  const tbody = document.getElementById('matBody');
  const summary = document.getElementById('matSummary');
  const pageInfo = document.getElementById('pageInfo');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const costInfo = document.getElementById('matCost');

  if (!tbody) return;

  let materials = getFilteredMaterials();
  const total = materials.length;
  const totalPages = Math.max(1, Math.ceil(total / matPageSize));

  if (matPage > totalPages) matPage = totalPages;

  // Sort
  if (matSort.field) {
    materials = [...materials].sort((a, b) => {
      let aVal = a[matSort.field] || 0;
      let bVal = b[matSort.field] || 0;

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return matSort.asc ? -1 : 1;
      if (aVal > bVal) return matSort.asc ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const start = (matPage - 1) * matPageSize;
  const end = start + matPageSize;
  const pageMaterials = materials.slice(start, end);
  const favorites = getFavoriteMaterials();

  tbody.innerHTML = pageMaterials.map(mat => {
    const isSelected = selectedMatIds.has(mat.id);
    const isFav = favorites.has(mat.id);
    const statusCls = `badge-${(mat.status || '有效').toLowerCase()}`;
    const subtotal = (mat.price || 0) * (mat.qty || 1);

    return `
      <tr class="${isSelected ? 'selected' : ''}">
        <td><input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleMaterialSelection('${escapeHtml(mat.id)}')" /></td>
        <td style="text-align:center">
          <span style="cursor:pointer;color:${isFav ? '#f59e0b' : '#999'}" onclick="toggleMaterialFavorite('${escapeHtml(mat.id)}')">
            ${isFav ? '★' : '☆'}
          </span>
        </td>
        <td>${start + tbody.childElementCount + 1}</td>
        <td>${hlText(mat.id, searchTerm)}</td>
        <td>${hlText(mat.name, searchTerm)}</td>
        <td>${escapeHtml(mat.category || '-')}</td>
        <td>${escapeHtml(mat.spec || '-')}</td>
        <td>${escapeHtml(mat.unit || '-')}</td>
        <td class="text-right">${mat.qty || 1}</td>
        <td>${escapeHtml(mat.supplier || '-')}</td>
        <td class="text-right">${mat.price ? mat.price.toFixed(2) : '-'}</td>
        <td class="text-right">${subtotal ? subtotal.toFixed(2) : '-'}</td>
        <td><span class="badge ${statusCls}">${escapeHtml(mat.status || '有效')}</span></td>
        <td>
          <button class="btn btn-ghost btn-xs" onclick="showMaterialDetail('${escapeHtml(mat.id)}')">详情</button>
          <button class="btn btn-ghost btn-xs" onclick="editMaterial('${escapeHtml(mat.id)}')">编辑</button>
        </td>
      </tr>
    `;
  }).join('');

  if (summary) {
    summary.textContent = `共 ${total} 种物料`;
  }
  if (pageInfo) {
    pageInfo.textContent = `第 ${matPage} / ${totalPages} 页`;
  }
  if (prevBtn) {
    prevBtn.disabled = matPage <= 1;
  }
  if (nextBtn) {
    nextBtn.disabled = matPage >= totalPages;
  }
  if (costInfo) {
    const totalCost = calculateTotalCost(materials);
    costInfo.textContent = `总成本: ¥ ${totalCost.toFixed(2)}`;
  }

  updateBatchBar();
}

export function toggleMaterialFavorite(id) {
  toggleFavorite(id);
  renderMaterials();
}

export function searchMaterials(term) {
  searchTerm = (term || '').trim();
  matPage = 1;
  renderMaterials();
}

export function filterMaterials(status, category, supplier) {
  filterStatus = status || 'all';
  filterCategory = category || 'all';
  filterSupplier = supplier || 'all';
  matPage = 1;
  renderMaterials();
}

export function getMatPage() {
  return matPage;
}

export function setMatPage(page) {
  matPage = page;
}

export function deleteSelectedMaterial(id) {
  const materials = getMaterialsFlat();
  const index = materials.findIndex(m => m.id === id);
  if (index >= 0) {
    materials.splice(index, 1);
    // Remove from parent in BOM as well - this needs BOM tree traversal
    showToast('已删除物料', 'success');
    renderMaterials();
    return true;
  }
  return false;
}

export function batchDelete() {
  if (selectedMatIds.size === 0) {
    showToast('请先选择要删除的物料', 'error');
    return;
  }

  showConfirmModal(
    '确认批量删除',
    `确定要删除选中的 ${selectedMatIds.size} 个物料吗？此操作无法撤销。`,
    () => {
      let deleted = 0;
      selectedMatIds.forEach(id => {
        if (deleteSelectedMaterial(id)) deleted++;
      });
      selectedMatIds.clear();
      updateBatchBar();
      showToast(`已删除 ${deleted} 个物料`, 'success');
    },
    '确认删除'
  );
}

export function initMaterialsFilters() {
  const searchInput = document.getElementById('matSearch');
  const statusFilter = document.getElementById('matFilter');
  const categoryFilter = document.getElementById('matCategoryFilter');
  const supplierFilter = document.getElementById('matSupplierFilter');

  searchInput?.addEventListener('input', e => {
    searchMaterials(e.target.value);
  });
  statusFilter?.addEventListener('change', e => {
    filterMaterials(e.target.value, categoryFilter?.value, supplierFilter?.value);
  });
  categoryFilter?.addEventListener('change', e => {
    filterMaterials(statusFilter?.value, e.target.value, supplierFilter?.value);
  });
  supplierFilter?.addEventListener('change', e => {
    filterMaterials(statusFilter?.value, categoryFilter?.value, e.target.value);
  });
}

export { matPage, matPageSize, matSort, searchTerm, filterStatus, filterCategory, filterSupplier };
>>>>>>> 5c9e725 (refactor: modular code structure optimization)
