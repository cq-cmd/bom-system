import { enumConfig } from '../data/enums.js';
import { getMaterialsFlat } from './bom.js';

export function populateEnumSelect(selectId, enumKey, allowEmpty) {
  const el = document.getElementById(selectId);
  if (!el) return;
  const items = enumConfig[enumKey]?.items || [];
  el.innerHTML = (allowEmpty ? '<option value="">请选择</option>' : '') + items.map(i => '<option value="'+i+'">'+i+'</option>').join('');
}

export function populateAllEnumSelects() {
  populateEnumSelect('matFormUnit','unit');
  populateEnumSelect('matFormStatus','status');
  populateEnumSelect('matFormGrade','materialGrade',true);
  populateEnumSelect('matFormStorage','storage',true);
  populateEnumSelect('nodeFormUnit','unit');
  populateEnumSelect('nodeFormStatus','status');
}

export function findNode(id, bomData) {
  if (!bomData) bomData = getBomData();
  if (bomData.id === id) return bomData;
  if (bomData.children) {
    for (const c of bomData.children) {
      const r = findNode(id, c);
      if (r) return r;
    }
  }
  return null;
}

export function findParent(id, bomData) {
  if (!bomData) bomData = getBomData();
  if (bomData.children) {
    for (const c of bomData.children) {
      if (c.id === id) return bomData;
      const r = findParent(id, c);
      if (r) return r;
    }
  }
  return null;
}

export function updateStatusBar() {
  const materialsFlat = getMaterialsFlat();
  const sbMaterials = document.getElementById('sbMaterials');
  const sbUpdate = document.getElementById('sbUpdate');
  if (sbMaterials) {
    sbMaterials.innerHTML = '物料总计: <b style="color:var(--text-secondary)">'+materialsFlat.length+' 种</b>';
  }
  if (sbUpdate) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    sbUpdate.textContent = '最后更新: ' + dateStr;
  }
}

export function exportCSV(filename, headers, rows) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      const str = String(cell ?? '').replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function calculateTotalBOMCost(bomData) {
  let total = 0;
  function walk(node) {
    total += (node.price || 0) * (node.qty || 1);
    if (node.children) node.children.forEach(walk);
  }
  walk(bomData);
  return total;
}

export function countNodesByStatus(bomData, status) {
  let count = 0;
  function walk(node) {
    if (node.status === status) count++;
    if (node.children) node.children.forEach(walk);
  }
  walk(bomData);
  return count;
}
