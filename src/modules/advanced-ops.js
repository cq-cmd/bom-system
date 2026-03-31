// 批量编辑/替代/克隆/回滚/WhereUsed/多BOM/快捷键等高级操作
import { state, allBOMs, versions, substituteMap, enumConfig, rebuildFlat, projectsData, changesData, settingsUsers, documentsData, suppliersData, qualityData } from './state.js';
import { escapeHtml } from '../utils/dom.js';
import { nowStr, todayStr } from '../utils/format.js';
import { validateField, btnLoading, btnReset, todayISO, genId, detailGrid } from './ui-helpers.js';
import { showToast, showModal, hideModal, navigateTo, showConfirm } from './navigation.js';
import { findNode, updateStatusBar, findParent } from './auth.js';
import { renderTree, showDetail, hideContextMenu } from './bom-tree.js';
import { renderMaterials, buildFilterDropdowns } from './materials.js';
import { renderVersions } from './versions.js';
import { updateNavBadges } from './dashboard.js';
import { renderSettings } from './settings.js';
import { showProjDetail, showChgDetail, showDocDetail, showSupDetail, showQaDetail } from './page-modules.js';

// ===== BATCH EDIT =====
function showBatchEditModal() {
  if (state.selectedMatIds.size === 0) { showToast('请先选择物料', 'error'); return; }
  document.getElementById('batchEditCount').textContent = state.selectedMatIds.size;
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
  state.selectedMatIds.forEach(function(id) {
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
  var mat = state.materialsFlat.find(function(m) { return m.id === matId; });
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
  searchParents(state.bomData, state.bomData.name);
  document.getElementById('whereUsedTitle').textContent = '物料引用 — ' + mat.name;
  var html = '<div style="margin-bottom:12px;font-size:12px;color:var(--text-secondary)">物料 <b style="color:var(--accent)">'+mat.id+'</b> 被以下节点引用：</div>';
  if (parents.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:var(--text-muted)">未找到引用</div>';
  } else {
    parents.forEach(function(p) {
      html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:6px;font-size:12px;cursor:pointer;transition:background .15s" onmouseover="this.style.background=\'var(--bg-hover)\'" onmouseout="this.style.background=\'transparent\'" onclick="hideModal(\'whereUsedModal\');navigateTo(\'bom\');state.selectedNodeId=\''+p.node.id+'\';renderTree();showDetail(findNode(\''+p.node.id+'\'))">'
        + '<span style="font-size:14px">'+p.node.icon+'</span>'
        + '<div><div style="font-weight:500">'+p.node.name+'</div><div style="color:var(--text-muted);font-size:11px">'+p.path+'</div></div></div>';
    });
  }
  document.getElementById('whereUsedBody').innerHTML = html;
  showModal('whereUsedModal');
}

// ===== SUBSTITUTE EDIT =====
function editSubstitutes(matId) {
  var mat = state.materialsFlat.find(function(m) { return m.id === matId; });
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
  var subMat = state.materialsFlat.find(function(m) { return m.id === subId; });
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
  var maxCost = state.materialsFlat.reduce(function(s,m){return s+m.price*m.qty;},0);
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
  state.materialsFlat.forEach(function(m) {
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
  state.materialsFlat.forEach(function(m) {
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
  var currentIdx = allBOMs.indexOf(state.bomData);
  sel.innerHTML = allBOMs.map(function(b, i) {
    return '<option value="'+i+'"'+(i===currentIdx?' selected':'')+'>'+b.icon+' '+b.name+' ('+b.id+')</option>';
  }).join('');
}

function switchBOM(idx) {
  if (idx < 0 || idx >= allBOMs.length) return;
  state.bomData = allBOMs[idx];
  state.selectedNodeId = state.bomData.id;
  rebuildFlat();
  renderTree();
  buildFilterDropdowns();
  renderMaterials();
  showDetail(state.bomData);
  updateStatusBar();
  updateNavBadges();
  var bc = document.getElementById('breadcrumb');
  if (bc) bc.innerHTML = '<span onclick="navigateTo(\'dashboard\')" style="cursor:pointer">工作区</span><span class="sep">/</span><span>BOM管理</span><span class="sep">/</span><span style="color:var(--text-primary)">'+state.bomData.name+'</span>';
  try { localStorage.setItem('bom_active_idx', idx); } catch(e) {}
  showToast('已切换到 '+state.bomData.name, 'info');
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
    if (state.bomData === b) switchBOM(0);
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
  state.materialsFlat.filter(function(m) { return m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q); }).slice(0, 4).forEach(function(m) {
    results.push({icon: '📦', label: m.id, name: m.name, type: '物料', nav: 'materials', action: function() { navigateTo('materials'); document.getElementById('matSearch').value = m.id; state.matPage = 1; renderMaterials(); }});
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
    if (field === state.matSortField) {
      th.textContent = baseText + (state.matSortAsc ? ' ▲' : ' ▼');
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
    state.matPage = 1;
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


export { showBatchEditModal, doBatchEdit, showWhereUsed, editSubstitutes, addSubstitute, removeSubstitute, cloneNode, rollbackVersion, renderCostTrend, renderDuplicateCheck, renderSingleSourceRisk, populateBOMSelector, switchBOM, showNewBOMModal, createNewBOM, deleteBOM, editUser, saveUserEdit, renderSearchDropdown, hideSearchDropdown, updateSortIndicators, initNotifActions, markAllNotifRead };
