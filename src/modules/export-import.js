// 导入/导出功能
import { state, allBOMs, versions, approvals, rebuildFlat } from './state.js';
import { showToast, hideModal } from './navigation.js';
import { renderTree } from './bom-tree.js';
import { renderMaterials } from './materials.js';
import { updateStatusBar } from './auth.js';

// ===== EXPORT / IMPORT =====
function exportCSV() {
  let csv = '\uFEFF物料编号,物料名称,规格型号,单位,用量,供应商,单价,状态\n';
  state.materialsFlat.forEach(m => { csv += `"${m.id}","${m.name}","${m.spec}","${m.unit}",${m.qty},"${m.supplier}",${m.price},"${m.status}"\n`; });
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob); link.download = 'BOM_物料清单_' + todayStr() + '.csv';
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
  showToast('导出完成', 'success');
}
function downloadTemplate(e) {
  e.preventDefault();
  let csv = '\uFEFF物料编号,物料名称,规格型号,单位,用量,供应商,单价,状态\nR-XXXXX,示例物料,规格,个,1,供应商名,0.00,有效\n';
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'BOM导入模板.csv';
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
}
function handleFileSelect(e) { if (e.target.files[0]) parseCSV(e.target.files[0]); }
function handleFileDrop(e) { e.preventDefault(); e.currentTarget.classList.remove('dragover'); if (e.dataTransfer.files[0]) parseCSV(e.dataTransfer.files[0]); }
function parseCSV(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split('\n').filter(l => l.trim());
    if (lines.length < 2) return;
    const headers = lines[0].split(',').map(h => h.replace(/"/g,'').trim());
    state.importedData = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].match(/(".*?"|[^,]+)/g)?.map(v => v.replace(/"/g,'').trim()) || [];
      if (vals.length >= 4) state.importedData.push({ id:vals[0]||'', name:vals[1]||'', spec:vals[2]||'', unit:vals[3]||'个', qty:parseInt(vals[4])||1, supplier:vals[5]||'—', price:parseFloat(vals[6])||0, status:vals[7]||'有效' });
    }
    const preview = document.getElementById('uploadPreview');
    preview.classList.add('show');
    preview.innerHTML = `<div style="font-size:12px;margin-bottom:8px;color:var(--text-secondary)">预览 (${state.importedData.length} 条记录)：</div><table><thead><tr><th>编号</th><th>名称</th><th>规格</th><th>用量</th><th>单价</th></tr></thead><tbody>${state.importedData.slice(0,5).map(m=>`<tr><td>${m.id}</td><td>${m.name}</td><td>${m.spec}</td><td>${m.qty}</td><td>${m.price}</td></tr>`).join('')}${state.importedData.length>5?'<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">...还有 '+(state.importedData.length-5)+' 条</td></tr>':''}</tbody></table>`;
    document.getElementById('importBtn').disabled = false;
  };
  reader.readAsText(file);
}
function doImport() {
  if (!state.importedData || state.importedData.length === 0) return;
  const target = state.bomData.children && state.bomData.children[0];
  if (!target) return;
  if (!target.children) target.children = [];
  state.importedData.forEach(m => { m.level = 2; m.icon = '📄'; target.children.push(m); });
  state.importedData = null;
  document.getElementById('uploadPreview').classList.remove('show');
  document.getElementById('importBtn').disabled = true;
  hideModal('importModal');
  rebuildFlat(); renderTree(); renderMaterials(); updateStatusBar();
}


export { exportCSV, downloadTemplate, handleFileSelect, handleFileDrop, parseCSV, doImport };
