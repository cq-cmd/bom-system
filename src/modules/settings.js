// 系统设置
import { state, settingsUsers, enumConfig } from './state.js';
import { editUser } from './advanced-ops.js';
import { showToast } from './navigation.js';
import { renderAuditLog } from './enhancements.js';
import { populateAllEnumSelects } from './auth.js';
import { buildFilterDropdowns } from './materials.js';

// ===== SETTINGS =====
function renderSettings() {
  const users = settingsUsers;
  const badgeColors = {purple:'badge-purple',green:'badge-green',blue:'badge-blue',yellow:'badge-yellow',red:'badge-red',orange:'badge-yellow',gray:'badge-gray'};
  let enumHtml = '';
  Object.entries(enumConfig).forEach(([key, cfg]) => {
    const bc = badgeColors[cfg.color] || 'badge-gray';
    enumHtml += '<div class="settings-section"><h3>'+cfg.icon+' '+cfg.label+'<span style="font-size:11px;font-weight:400;color:var(--text-muted);margin-left:8px">('+cfg.items.length+' 项)</span></h3><div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">';
    cfg.items.forEach((item, idx) => {
      enumHtml += '<div style="display:inline-flex;align-items:center;gap:4px;background:var(--bg-primary);border:1px solid var(--border);border-radius:16px;padding:4px 6px 4px 12px;font-size:12px"><span class="badge '+bc+'">'+item+'</span><button class="btn btn-ghost btn-xs" style="padding:0 4px;font-size:14px;color:var(--text-muted)" onclick="removeEnumItem(\''+key+'\','+idx+')" title="删除">×</button></div>';
    });
    enumHtml += '</div><div style="display:flex;gap:8px;align-items:center"><input type="text" id="enumAdd_'+key+'" placeholder="新增'+cfg.label+'项…" style="flex:1;max-width:240px;background:var(--bg-primary);border:1px solid var(--border);border-radius:var(--radius-sm);padding:6px 10px;color:var(--text-primary);outline:none;font-size:12px" onkeydown="if(event.key===\'Enter\')addEnumItem(\''+key+'\')" /><button class="btn btn-primary btn-sm" onclick="addEnumItem(\''+key+'\')">＋ 添加</button></div></div>';
  });
  document.getElementById('settingsContent').innerHTML =
    '<div class="settings-section"><h3>👤 用户管理</h3><div class="table-wrap"><table class="user-table"><thead><tr><th>姓名</th><th>角色</th><th>邮箱</th><th>状态</th><th>操作</th></tr></thead><tbody>'+users.map((u, idx) => '<tr><td style="font-weight:500">'+u.name+'</td><td>'+u.role+'</td><td style="color:var(--text-muted)">'+u.email+'</td><td><span class="badge '+(u.status==='在线'?'badge-green':'badge-gray')+'">'+u.status+'</span></td><td><button class="btn btn-ghost btn-xs" onclick="editUser('+idx+')">✏️ 编辑</button></td></tr>').join('')+'</tbody></table></div></div>'+
    '<div class="settings-section"><h3>📋 物料属性配置</h3><p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">管理物料的枚举属性值，修改后自动同步到新增/编辑表单和筛选器。</p></div>'+
    enumHtml+
    '<div class="settings-section"><h3>🔐 权限设置</h3><div class="settings-row"><div><div class="sr-label">BOM 编辑权限</div><div class="sr-desc">允许工程师修改 BOM 结构和物料信息</div></div><button class="toggle on" onclick="this.classList.toggle(\'on\');showToast(\'设置已更新\',\'success\')"></button></div><div class="settings-row"><div><div class="sr-label">审批权限</div><div class="sr-desc">仅主管及以上角色可审批</div></div><button class="toggle on" onclick="this.classList.toggle(\'on\');showToast(\'设置已更新\',\'success\')"></button></div><div class="settings-row"><div><div class="sr-label">导出权限</div><div class="sr-desc">允许所有用户导出物料数据</div></div><button class="toggle on" onclick="this.classList.toggle(\'on\');showToast(\'设置已更新\',\'success\')"></button></div><div class="settings-row"><div><div class="sr-label">物料删除确认</div><div class="sr-desc">删除物料时需要二次确认</div></div><button class="toggle on" onclick="this.classList.toggle(\'on\');showToast(\'设置已更新\',\'success\')"></button></div></div>'+
    '<div class="settings-section"><h3>🔧 系统参数</h3><div class="settings-row"><div><div class="sr-label">默认版本格式</div><div class="sr-desc">新建版本时的默认格式</div></div><select class="filter-select" style="width:120px" onchange="showToast(\'参数已保存\',\'success\')"><option>V{major}.{minor}</option><option>v{major}.{minor}.{patch}</option></select></div><div class="settings-row"><div><div class="sr-label">自动保存间隔</div><div class="sr-desc">自动保存编辑中的BOM数据</div></div><select class="filter-select" style="width:100px" onchange="showToast(\'参数已保存\',\'success\')"><option>30 秒</option><option>1 分钟</option><option>5 分钟</option><option>关闭</option></select></div><div class="settings-row"><div><div class="sr-label">物料编号前缀</div><div class="sr-desc">自动生成物料编号的前缀规则</div></div><input type="text" value="A100-" style="width:100px;background:var(--bg-primary);border:1px solid var(--border);border-radius:var(--radius-sm);padding:4px 8px;color:var(--text-primary);outline:none" onchange="showToast(\'参数已保存\',\'success\')" /></div><div class="settings-row"><div><div class="sr-label">货币单位</div><div class="sr-desc">物料价格显示的货币</div></div><select class="filter-select" style="width:100px" onchange="showToast(\'参数已保存\',\'success\')"><option>¥ CNY</option><option>$ USD</option><option>€ EUR</option></select></div></div>';
  // Append audit log (merged from enhancement)
  if (typeof renderAuditLog === 'function') {
    var content = document.getElementById('settingsContent');
    if (content) content.innerHTML += renderAuditLog();
  }
}
function addEnumItem(key) {
  const input = document.getElementById('enumAdd_' + key);
  const val = input.value.trim();
  if (!val || !enumConfig[key]) return;
  if (enumConfig[key].items.includes(val)) return;
  enumConfig[key].items.push(val);
  input.value = '';
  populateAllEnumSelects(); buildFilterDropdowns(); renderSettings();
}
function removeEnumItem(key, idx) {
  if (!enumConfig[key]) return;
  const item = enumConfig[key].items[idx];
  enumConfig[key].items.splice(idx, 1);
  populateAllEnumSelects(); buildFilterDropdowns(); renderSettings();
}


export { renderSettings, addEnumItem, removeEnumItem };
