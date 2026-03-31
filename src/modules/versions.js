// 版本管理 + 对比
import { state, versions, versionDiffs } from './state.js';
import { todayStr } from '../utils/format.js';
import { validateField, btnLoading, btnReset } from './ui-helpers.js';
import { rollbackVersion } from './advanced-ops.js';
import { hideModal, showModal, showToast } from './navigation.js';
import { logAction } from './enhancements.js';

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
  const matCount = state.materialsFlat.length - (verIdx * 5);
  const compCount = (state.bomData.children ? state.bomData.children.length : 0) - Math.min(verIdx, 4);
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
  if (!validateField('verFormNum', '版本号')) return;
  if (!validateField('verFormDesc', '变更说明')) return;
  var btn = document.querySelector('#versionModal .btn-primary');
  btnLoading(btn);
  setTimeout(function() {
    btnReset(btn);
    const ver = document.getElementById('verFormNum').value.trim();
    const desc = document.getElementById('verFormDesc').value.trim();
    if (!ver) { showToast('请输入版本号', 'error'); return; }
    if (!desc) { showToast('请输入变更说明', 'error'); return; }
    if (versions.find(v => v.ver === ver)) { showToast('版本号 '+ver+' 已存在', 'error'); return; }
    const creator = state.currentUser ? state.currentUser.name : '张工';
    versions.forEach(v => { if (v.status === '当前') { v.status = '历史'; v.statusClass = 'badge-gray'; } });
    versions.unshift({ ver, creator: creator, date: todayStr(), desc: desc, status: '当前', statusClass: 'badge-green' });
    hideModal('versionModal');
    renderVersions();
    showToast('版本 ' + ver + ' 已创建', 'success');
    logAction('创建版本', document.getElementById('verFormNum').value);
  }, 300);
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


export { renderVersions, viewVersion, createVersion, showCompare, runCompare };
