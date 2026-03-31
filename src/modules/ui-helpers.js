// Pure UI helper functions — no mutable state dependencies

export function validateField(id, label) {
  var el = document.getElementById(id);
  var errEl = document.getElementById(id + 'Error');
  if (!el) return true;
  var val = (el.value || '').trim();
  if (!val) {
    el.closest('.form-group')?.classList.add('form-error');
    if (errEl) { errEl.textContent = label + '不能为空'; errEl.classList.add('show'); }
    el.focus();
    return false;
  }
  el.closest('.form-group')?.classList.remove('form-error');
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
  return true;
}

export function clearFieldError(id) {
  var el = document.getElementById(id);
  var errEl = document.getElementById(id + 'Error');
  if (el) el.closest('.form-group')?.classList.remove('form-error');
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
}

export function btnLoading(btn, text) {
  if (!btn) return;
  btn._origText = btn.textContent;
  btn.textContent = text || '保存中…';
  btn.classList.add('btn-loading');
  btn.disabled = true;
}

export function btnReset(btn) {
  if (!btn) return;
  btn.textContent = btn._origText || '保存';
  btn.classList.remove('btn-loading');
  btn.disabled = false;
}

export function toggleTheme() {
  var html = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? '' : 'dark');
  var btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
  try { localStorage.setItem('bom_theme', isDark ? '' : 'dark'); } catch(e) {}
}

export function initTheme() {
  try {
    var saved = localStorage.getItem('bom_theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      var btn = document.getElementById('themeToggle');
      if (btn) btn.textContent = '☀️';
    }
  } catch(e) {}
}

export function hlText(text, query) {
  if (!query) return text;
  var idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text;
  return text.slice(0, idx) + '<span class="search-hl">' + text.slice(idx, idx + query.length) + '</span>' + text.slice(idx + query.length);
}

export function applyFilterActiveState() {
  document.querySelectorAll('.filter-select').forEach(function(sel) {
    if (sel.value && sel.value !== 'all') sel.classList.add('filter-active');
    else sel.classList.remove('filter-active');
  });
}

export function saveFilterState(module, key, value) {
  try { sessionStorage.setItem('bom_filter_' + module + '_' + key, value); } catch(e) {}
}

export function restoreFilterState(module, key) {
  try { return sessionStorage.getItem('bom_filter_' + module + '_' + key) || ''; } catch(e) { return ''; }
}

export function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function genId(prefix, arr) {
  return prefix + '-' + (new Date().getFullYear()) + '-' + String(arr.length + 1).padStart(3, '0');
}

export function detailGrid(pairs) {
  return '<div class="detail-grid">' + pairs.map(p => '<div class="detail-field"><div class="label">' + p[0] + '</div><div class="value">' + p[1] + '</div></div>').join('') + '</div>';
}
