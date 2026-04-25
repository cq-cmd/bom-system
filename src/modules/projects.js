// 项目管理模块 - 项目列表、搜索筛选、新增编辑
import { escapeHtml } from '../utils/dom.js';
import { showToast, showModal, hideModal, showConfirmModal } from './ui.js';
import { exportCSV } from './utils.js';
import { nowStr } from '../utils/format.js';

import { projectsData as _projectsData } from '../data/projects.js';

let projectsData = JSON.parse(JSON.stringify(_projectsData));
let projPage = 1;
let projPageSize = 10;
let projSort = { field: null, asc: true };
let projSearchTerm = '';
let projPhaseFilter = 'all';
let projStatusFilter = 'all';

export function getProjectsData() {
  return projectsData;
}

export function setProjectsData(data) {
  projectsData = data;
}

function getFilteredProjects() {
  let data = [...projectsData];

  if (projSearchTerm) {
    const q = projSearchTerm.toLowerCase();
    data = data.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.owner.toLowerCase().includes(q)
    );
  }

  if (projPhaseFilter !== 'all') {
    data = data.filter(p => p.phase === projPhaseFilter);
  }

  if (projStatusFilter !== 'all') {
    data = data.filter(p => p.status === projStatusFilter);
  }

  // Sort
  if (projSort.field) {
    data = data.sort((a, b) => {
      let aVal = a[projSort.field];
      let bVal = b[projSort.field];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return projSort.asc ? -1 : 1;
      if (aVal > bVal) return projSort.asc ? 1 : -1;
      return 0;
    });
  }

  return data;
}

export function modSort(field) {
  if (projSort.field === field) {
    projSort.asc = !projSort.asc;
  } else {
    projSort.field = field;
    projSort.asc = true;
  }
  projPage = 1;
  renderProjects();
}

export function modPage(delta) {
  projPage += delta;
  renderProjects();
}

export function renderProjects() {
  const tbody = document.getElementById('projBody');
  const summary = document.getElementById('projSummary');
  const pageInfo = document.getElementById('projPageInfo');
  const prevBtn = document.getElementById('projPrev');
  const nextBtn = document.getElementById('projNext');

  if (!tbody) return;

  const data = getFilteredProjects();
  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / projPageSize));

  if (projPage > totalPages) projPage = totalPages;

  const start = (projPage - 1) * projPageSize;
  const end = start + projPageSize;
  const pageData = data.slice(start, end);

  const phaseBadgeMap = {
    'P0': 'badge-gray', 'P1': 'badge-blue', 'P2': 'badge-purple',
    'EVT': 'badge-yellow', 'DVT': 'badge-orange', 'PVT': 'badge-blue', 'MP': 'badge-green'
  };

  const statusBadgeMap = {
    '进行中': 'badge-blue', '已完成': 'badge-green', '暂停': 'badge-yellow',
    '延期': 'badge-red', '已取消': 'badge-gray'
  };

  tbody.innerHTML = pageData.map((p, idx) => {
    const phaseBadge = phaseBadgeMap[p.phase] || 'badge-gray';
    const statusBadge = statusBadgeMap[p.status] || 'badge-gray';
    return `
      <tr>
        <td>${start + idx + 1}</td>
        <td style="cursor:pointer" onclick="modSort('proj','id')">${escapeHtml(p.id)}</td>
        <td style="cursor:pointer" onclick="modSort('proj','name')">${escapeHtml(p.name)}</td>
        <td><span class="badge ${phaseBadge}">${escapeHtml(p.phase)}</span></td>
        <td>${escapeHtml(p.owner)}</td>
        <td style="cursor:pointer" onclick="modSort('proj','start')">${escapeHtml(p.start)}</td>
        <td style="cursor:pointer" onclick="modSort('proj','end')">${escapeHtml(p.end)}</td>
        <td><span class="badge ${statusBadge}">${escapeHtml(p.status)}</span></td>
        <td style="cursor:pointer;text-align:right" onclick="modSort('proj','progress')">${p.progress}%</td>
        <td>
          <button class="btn btn-ghost btn-xs" onclick="showProjectDetail('${escapeHtml(p.id)}')">详情</button>
          <button class="btn btn-ghost btn-xs" onclick="editProject('${escapeHtml(p.id)}')">编辑</button>
          <button class="btn btn-ghost btn-xs" onclick="deleteProject('${escapeHtml(p.id)}')">删除</button>
        </td>
      </tr>
    `;
  }).join('');

  if (summary) {
    summary.textContent = `共 ${total} 条`;
  }
  if (pageInfo) {
    pageInfo.textContent = `第 ${projPage} / ${totalPages} 页`;
  }
  if (prevBtn) {
    prevBtn.disabled = projPage <= 1;
  }
  if (nextBtn) {
    nextBtn.disabled = projPage >= totalPages;
  }

  renderProjectStats();
}

function renderProjectStats() {
  const container = document.getElementById('projStatCards');
  if (!container) return;

  const total = projectsData.length;
  const active = projectsData.filter(p => p.status === '进行中').length;
  const completed = projectsData.filter(p => p.status === '已完成').length;
  const suspended = projectsData.filter(p => p.status === '暂停' || p.status === '延期').length;

  container.innerHTML = `
    <div class="stat-card">
      <div class="stat-num" style="color:var(--accent)">${total}</div>
      <div class="stat-label">总项目</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--blue)">${active}</div>
      <div class="stat-label">进行中</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--green)">${completed}</div>
      <div class="stat-label">已完成</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--red)">${suspended}</div>
      <div class="stat-label">暂停/延期</div>
    </div>
  `;
}

export function showNewProjectModal() {
  showModal('projModal');
  // Clear form
  setTimeout(() => {
    document.getElementById('projFormId').value = '';
    document.getElementById('projFormName').value = '';
    document.getElementById('projFormPhase').value = 'P0';
    document.getElementById('projFormOwner').value = '张工';
    document.getElementById('projFormStart').value = '';
    document.getElementById('projFormEnd').value = '';
    document.getElementById('projFormStatus').value = '进行中';
    document.getElementById('projFormProgress').value = '0';
  }, 100);
}

export function editProject(id) {
  const project = projectsData.find(p => p.id === id);
  if (!project) return;

  showModal('projModal');

  setTimeout(() => {
    document.getElementById('projFormId').value = project.id;
    document.getElementById('projFormName').value = project.name;
    document.getElementById('projFormPhase').value = project.phase;
    document.getElementById('projFormOwner').value = project.owner;
    document.getElementById('projFormStart').value = project.start;
    document.getElementById('projFormEnd').value = project.end;
    document.getElementById('projFormStatus').value = project.status;
    document.getElementById('projFormProgress').value = project.progress;
  }, 100);
}

export function saveProject() {
  const id = document.getElementById('projFormId').value.trim();
  const name = document.getElementById('projFormName').value.trim();
  const phase = document.getElementById('projFormPhase').value;
  const owner = document.getElementById('projFormOwner').value;
  const start = document.getElementById('projFormStart').value;
  const end = document.getElementById('projFormEnd').value;
  const status = document.getElementById('projFormStatus').value;
  const progress = parseInt(document.getElementById('projFormProgress').value) || 0;

  if (!id || !name) {
    showToast('请填写项目编号和名称', 'error');
    return;
  }

  const existingIndex = projectsData.findIndex(p => p.id === id);
  if (existingIndex >= 0) {
    // Update existing
    projectsData[existingIndex] = { id, name, phase, owner, start, end, status, progress };
    renderProjects();
    hideModal('projModal');
    showToast('项目更新成功', 'success');
  } else {
    // Create new
    projectsData.push({ id, name, phase, owner, start, end, status, progress });
    renderProjects();
    hideModal('projModal');
    showToast('新项目创建成功', 'success');
  }
}

export function deleteProject(id) {
  const project = projectsData.find(p => p.id === id);
  if (!project) return;

  showConfirmModal('确认删除', `确定要删除项目 "${project.name}" 吗？`, () => {
    const index = projectsData.findIndex(p => p.id === id);
    if (index >= 0) {
      projectsData.splice(index, 1);
      renderProjects();
      showToast('项目已删除', 'success');
    }
  });
}

export function showProjectDetail(id) {
  const project = projectsData.find(p => p.id === id);
  if (!project) return;

  const phaseBadgeMap = {
    'P0': 'badge-gray', 'P1': 'badge-blue', 'P2': 'badge-purple',
    'EVT': 'badge-yellow', 'DVT': 'badge-orange', 'PVT': 'badge-blue', 'MP': 'badge-green'
  };
  const statusBadgeMap = {
    '进行中': 'badge-blue', '已完成': 'badge-green', '暂停': 'badge-yellow',
    '延期': 'badge-red', '已取消': 'badge-gray'
  };

  const content = `
    <div class="detail-grid">
      <div class="detail-item"><div class="detail-label">项目编号</div><div class="detail-value">${escapeHtml(project.id)}</div></div>
      <div class="detail-item"><div class="detail-label">项目名称</div><div class="detail-value">${escapeHtml(project.name)}</div></div>
      <div class="detail-item"><div class="detail-label">阶段</div><div class="detail-value"><span class="badge ${phaseBadgeMap[project.phase]}">${escapeHtml(project.phase)}</span></div></div>
      <div class="detail-item"><div class="detail-label">负责人</div><div class="detail-value">${escapeHtml(project.owner)}</div></div>
      <div class="detail-item"><div class="detail-label">开始日期</div><div class="detail-value">${escapeHtml(project.start)}</div></div>
      <div class="detail-item"><div class="detail-label">计划完成</div><div class="detail-value">${escapeHtml(project.end)}</div></div>
      <div class="detail-item"><div class="detail-label">状态</div><div class="detail-value"><span class="badge ${statusBadgeMap[project.status]}">${escapeHtml(project.status)}</span></div></div>
      <div class="detail-item"><div class="detail-label">进度</div><div class="detail-value">
        <div style="width:200px;background:var(--border);height:8px;border-radius:4px;overflow:hidden">
          <div style="width:${project.progress}%;background:var(--accent);height:100%"></div>
        </div>
        ${project.progress}%
      </div></div>
    </div>
  `;

  document.getElementById('genericDetailTitle').textContent = '项目详情';
  document.getElementById('genericDetailBody').innerHTML = content;
  document.getElementById('genericDetailActions').innerHTML = `
    <button class="btn btn-primary" onclick="editProject('${project.id}');document.getElementById('genericDetailCloseBtn').click()">编辑</button>
  `;
  showModal('genericDetailModal');
}

export function exportProjectsCSV() {
  const data = getFilteredProjects();
  const headers = ['项目编号', '项目名称', '阶段', '负责人', '开始日期', '计划完成', '状态', '进度'];
  const rows = data.map(p => [
    p.id, p.name, p.phase, p.owner, p.start, p.end, p.status, p.progress
  ]);
  exportCSV('bom-projects-export.csv', headers, rows);
  showToast('项目列表导出成功', 'success');
}

export function initProjects() {
  const searchInput = document.getElementById('projSearch');
  const phaseFilter = document.getElementById('projPhaseFilter');
  const statusFilter = document.getElementById('projStatusFilter');

  searchInput?.addEventListener('input', e => {
    projSearchTerm = e.target.value.trim();
    projPage = 1;
    renderProjects();
  });

  phaseFilter?.addEventListener('change', e => {
    projPhaseFilter = e.target.value;
    projPage = 1;
    renderProjects();
  });

  statusFilter?.addEventListener('change', e => {
    projStatusFilter = e.target.value;
    projPage = 1;
    renderProjects();
  });

  renderProjects();
}

export { projPage, projPageSize, projSearchTerm, projPhaseFilter, projStatusFilter };
