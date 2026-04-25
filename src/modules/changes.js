// 变更管理模块 - ECR/ECO/ECN 变更流程
import { escapeHtml } from '../utils/dom.js';
import { showToast, showModal, hideModal, showConfirmModal } from './ui.js';
import { exportCSV } from './utils.js';
import { nowStr } from '../utils/format.js';

import { changesData as _changesData } from '../data/changes.js';

let changesData = JSON.parse(JSON.stringify(_changesData));
let chgPage = 1;
let chgPageSize = 10;
let chgSort = { field: null, asc: false };
let chgSearchTerm = '';
let chgTypeFilter = 'all';
let chgStatusFilter = 'all';
let chgPriorityFilter = 'all';
let activeTab = 'all'; // all | mine | review

export function getChangesData() {
  return changesData;
}

function getFilteredChanges() {
  let data = [...changesData];

  // Tab filter
  if (activeTab === 'mine') {
    // Filter by current user (implemented in app-optimized)
    // Handled outside
  } else if (activeTab === 'review') {
    // Filter where current user is reviewer
    // Handled outside
  }

  if (chgSearchTerm) {
    const q = chgSearchTerm.toLowerCase();
    data = data.filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.initiator.toLowerCase().includes(q)
    );
  }

  if (chgTypeFilter !== 'all') {
    data = data.filter(c => c.type === chgTypeFilter);
  }

  if (chgStatusFilter !== 'all') {
    data = data.filter(c => c.status === chgStatusFilter);
  }

  if (chgPriorityFilter !== 'all') {
    data = data.filter(c => c.urgency === chgPriorityFilter);
  }

  // Sort by date descending by default
  if (!chgSort.field) {
    chgSort.field = 'date';
    chgSort.asc = false;
  }

  if (chgSort.field) {
    data = data.sort((a, b) => {
      let aVal = a[chgSort.field];
      let bVal = b[chgSort.field];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return chgSort.asc ? -1 : 1;
      if (aVal > bVal) return chgSort.asc ? 1 : -1;
      return 0;
    });
  }

  return data;
}

export function modSort(field) {
  if (chgSort.field === field) {
    chgSort.asc = !chgSort.asc;
  } else {
    chgSort.field = field;
    chgSort.asc = true;
  }
  chgPage = 1;
  renderChanges();
}

export function switchChgTab(tab) {
  activeTab = tab;
  // Update button styles
  document.querySelectorAll('[id^="chgTab"]').forEach(btn => {
    btn.className = btn.id === `chgTab${tab.charAt(0).toUpperCase() + tab.slice(1)}`
      ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
  });
  chgPage = 1;
  renderChanges();
}

export function modPage(delta) {
  chgPage += delta;
  renderChanges();
}

const typeBadgeMap = {
  'ECR': 'badge-blue', 'ECO': 'badge-purple', 'ECN': 'badge-orange'
};
const urgencyBadgeMap = {
  '普通': 'badge-gray', '紧急': 'badge-yellow', '特急': 'badge-red'
};
const statusBadgeMap = {
  '草稿': 'badge-gray', '待审批': 'badge-yellow', '审批中': 'badge-blue',
  '执行中': 'badge-blue', '已关闭': 'badge-green', '已驳回': 'badge-red'
};

export function renderChanges() {
  const tbody = document.getElementById('chgBody');
  const summary = document.getElementById('chgSummary');
  const pageInfo = document.getElementById('chgPageInfo');
  const prevBtn = document.getElementById('chgPrev');
  const nextBtn = document.getElementById('chgNext');

  if (!tbody) return;

  const data = getFilteredChanges();
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / chgPageSize));

  if (chgPage > totalPages) chgPage = totalPages;

  const start = (chgPage - 1) * chgPageSize;
  const pageData = data.slice(start, start + chgPageSize);

  tbody.innerHTML = pageData.map((c, idx) => {
    const typeBadge = typeBadgeMap[c.type] || 'badge-gray';
    const urgencyBadge = urgencyBadgeMap[c.urgency] || 'badge-gray';
    const statusBadge = statusBadgeMap[c.status] || 'badge-gray';

    return `
      <tr>
        <td>${start + idx + 1}</td>
        <td style="cursor:pointer" onclick="modSort('chg','id')">${escapeHtml(c.id)}</td>
        <td style="cursor:pointer" onclick="modSort('chg','title')">${escapeHtml(c.title)}</td>
        <td><span class="badge ${typeBadge}">${escapeHtml(c.type)}</span></td>
        <td>${escapeHtml(c.scope || '-')}</td>
        <td>${escapeHtml(c.initiator)}</td>
        <td>${escapeHtml(c.reviewer || '-')}</td>
        <td style="cursor:pointer" onclick="modSort('chg','date')">${escapeHtml(c.date)}</td>
        <td><span class="badge ${urgencyBadge}">${escapeHtml(c.urgency)}</span></td>
        <td><span class="badge ${statusBadge}">${escapeHtml(c.status)}</span></td>
        <td>
          <button class="btn btn-ghost btn-xs" onclick="showChangeDetail('${escapeHtml(c.id)}')">详情</button>
          <button class="btn btn-ghost btn-xs" onclick="editChange('${escapeHtml(c.id)}')">编辑</button>
          <button class="btn btn-ghost btn-xs" onclick="deleteChange('${escapeHtml(c.id)}')">删除</button>
        </td>
      </tr>
    `;
  }).join('');

  if (summary) {
    summary.textContent = `共 ${total} 条`;
  }
  if (pageInfo) {
    pageInfo.textContent = `第 ${chgPage} / ${totalPages} 页`;
  }
  if (prevBtn) {
    prevBtn.disabled = chgPage <= 1;
  }
  if (nextBtn) {
    nextBtn.disabled = chgPage >= totalPages;
  }

  renderChangeStats();
}

function renderChangeStats() {
  const container = document.getElementById('chgStatCards');
  if (!container) return;

  const total = changesData.length;
  const pending = changesData.filter(c => c.status === '待审批' || c.status === '审批中').length;
  const closed = changesData.filter(c => c.status === '已关闭').length;
  const urgent = changesData.filter(c => c.urgency === '紧急' || c.urgency === '特急').length;

  container.innerHTML = `
    <div class="stat-card">
      <div class="stat-num" style="color:var(--accent)">${total}</div>
      <div class="stat-label">总变更</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--yellow)">${pending}</div>
      <div class="stat-label">待审批</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--green)">${closed}</div>
      <div class="stat-label">已关闭</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--red)">${urgent}</div>
      <div class="stat-label">紧急/特急</div>
    </div>
  `;
}

export function showChgModal() {
  showModal('chgModal');
  // Clear form
  setTimeout(() => {
    document.getElementById('chgEditId').value = '';
    document.getElementById('chgFormType').value = 'ECR';
    document.getElementById('chgFormPriority').value = '普通';
    document.getElementById('chgFormTitle').value = '';
    document.getElementById('chgFormScope').value = '';
    document.getElementById('chgFormMaterials').value = '';
    document.getElementById('chgFormInit').value = getCurrentUserName() || '';
    document.getElementById('chgFormReviewer').value = '王主管';
    document.getElementById('chgFormReason').value = '';
  }, 100);
}

export function editChange(id) {
  const change = changesData.find(c => c.id === id);
  if (!change) return;

  showModal('chgModal');

  setTimeout(() => {
    document.getElementById('chgEditId').value = id;
    document.getElementById('chgFormType').value = change.type || 'ECR';
    document.getElementById('chgFormPriority').value = change.urgency || '普通';
    document.getElementById('chgFormTitle').value = change.title || '';
    document.getElementById('chgFormScope').value = change.scope || '';
    document.getElementById('chgFormMaterials').value = change.materials || '';
    document.getElementById('chgFormInit').value = change.initiator || getCurrentUserName() || '';
    document.getElementById('chgFormReviewer').value = change.reviewer || '';
    document.getElementById('chgFormReason').value = change.reason || '';
  }, 100);
}

function getCurrentUserName() {
  // This will be set from app-optimized
  const user = window.currentUser;
  return user ? user.name : '';
}

export function saveChange() {
  const editId = document.getElementById('chgEditId').value;
  const type = document.getElementById('chgFormType').value;
  const urgency = document.getElementById('chgFormPriority').value;
  const title = document.getElementById('chgFormTitle').value.trim();
  const scope = document.getElementById('chgFormScope').value.trim();
  const materials = document.getElementById('chgFormMaterials').value.trim();
  const initiator = document.getElementById('chgFormInit').value.trim();
  const reviewer = document.getElementById('chgFormReviewer').value.trim();
  const reason = document.getElementById('chgFormReason').value.trim();

  if (!title) {
    showToast('请输入变更标题', 'error');
    return;
  }

  if (editId) {
    // Update existing
    const index = changesData.findIndex(c => c.id === editId);
    if (index >= 0) {
      changesData[index] = {
        ...changesData[index],
        type, urgency, title, scope, materials, initiator, reviewer, reason
      };
      renderChanges();
      hideModal('chgModal');
      showToast('变更已更新', 'success');
    }
  } else {
    // Create new
    const nextNum = (changesData.length + 1).toString().padStart(3, '0');
    const id = `ECN-${nowStr().split(' ')[0].replace(/-/g, '')}-${nextNum}`;
    const today = nowStr().split(' ')[0];

    changesData.push({
      id, type, urgency, title, scope, materials,
      initiator, reviewer, reason, date: today, status: '草稿'
    });
    renderChanges();
    hideModal('chgModal');
    showToast('变更已创建', 'success');
  }
}

export function deleteChange(id) {
  const change = changesData.find(c => c.id === id);
  if (!change) return;

  showConfirmModal('确认删除', `确定要删除变更 "${change.title}" 吗？`, () => {
    const index = changesData.findIndex(c => c.id === id);
    if (index >= 0) {
      changesData.splice(index, 1);
      renderChanges();
      showToast('变更已删除', 'success');
    }
  });
}

export function showChangeDetail(id) {
  const change = changesData.find(c => c.id === id);
  if (!change) return;

  const content = `
    <div class="detail-grid">
      <div class="detail-item"><div class="detail-label">变更单号</div><div class="detail-value">${escapeHtml(change.id)}</div></div>
      <div class="detail-item"><div class="detail-label">变更类型</div><div class="detail-value"><span class="badge ${typeBadgeMap[change.type]}">${escapeHtml(change.type)}</span></div></div>
      <div class="detail-item"><div class="detail-label">紧急程度</div><div class="detail-value"><span class="badge ${urgencyBadgeMap[change.urgency]}">${escapeHtml(change.urgency)}</span></div></div>
      <div class="detail-item"><div class="detail-label">变更标题</div><div class="detail-value">${escapeHtml(change.title)}</div></div>
      <div class="detail-item"><div class="detail-label">影响范围</div><div class="detail-value">${escapeHtml(change.scope || '-')}</div></div>
      <div class="detail-item"><div class="detail-label">涉及物料</div><div class="detail-value">${escapeHtml(change.materials || '-')}</div></div>
      <div class="detail-item"><div class="detail-label">发起人</div><div class="detail-value">${escapeHtml(change.initiator)}</div></div>
      <div class="detail-item"><div class="detail-label">审批人</div><div class="detail-value">${escapeHtml(change.reviewer || '-')}</div></div>
      <div class="detail-item"><div class="detail-label">发起日期</div><div class="detail-value">${escapeHtml(change.date)}</div></div>
      <div class="detail-item"><div class="detail-label">状态</div><div class="detail-value"><span class="badge ${statusBadgeMap[change.status]}">${escapeHtml(change.status)}</span></div></div>
    </div>
    ${change.reason ? `<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)"><div style="font-weight:600;margin-bottom:8px">变更原因</div><div>${escapeHtml(change.reason)}</div></div>` : ''}
  `;

  document.getElementById('genericDetailTitle').textContent = '变更详情';
  document.getElementById('genericDetailBody').innerHTML = content;
  document.getElementById('genericDetailActions').innerHTML = `
    <button class="btn btn-primary" onclick="editChange('${change.id}');hideModal('genericDetailModal')">编辑</button>
  `;
  showModal('genericDetailModal');
}

export function exportChangesCSV() {
  const data = getFilteredChanges();
  const headers = ['变更编号', '变更类型', '变更标题', '影响范围', '发起人', '审批人', '紧急程度', '状态', '发起日期'];
  const rows = data.map(c => [
    c.id, c.type, c.title, c.scope || '', c.initiator, c.reviewer || '', c.urgency, c.status, c.date
  ]);
  exportCSV('bom-changes-export.csv', headers, rows);
  showToast('变更列表导出成功', 'success');
}

export function initChanges() {
  const searchInput = document.getElementById('chgSearch');
  const typeFilter = document.getElementById('chgTypeFilter');
  const statusFilter = document.getElementById('chgStatusFilter');
  const priorityFilter = document.getElementById('chgPriorityFilter');

  searchInput?.addEventListener('input', e => {
    chgSearchTerm = e.target.value.trim();
    chgPage = 1;
    renderChanges();
  });

  typeFilter?.addEventListener('change', e => {
    chgTypeFilter = e.target.value;
    chgPage = 1;
    renderChanges();
  });

  statusFilter?.addEventListener('change', e => {
    chgStatusFilter = e.target.value;
    chgPage = 1;
    renderChanges();
  });

  priorityFilter?.addEventListener('change', e => {
    chgPriorityFilter = e.target.value;
    chgPage = 1;
    renderChanges();
  });

  // Initialize tab click handlers
  document.getElementById('chgTabAll')?.addEventListener('click', () => switchChgTab('all'));
  document.getElementById('chgTabMine')?.addEventListener('click', () => switchChgTab('mine'));
  document.getElementById('chgTabReview')?.addEventListener('click', () => switchChgTab('review'));

  renderChanges();
}

export { activeTab, chgPage, chgPageSize };
