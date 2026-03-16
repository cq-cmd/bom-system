export function escapeHtml(str) {
  if (str == null) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

export function hlText(text, query) {
  if (!query || !text) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const q = escapeHtml(query);
  const idx = escaped.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return escaped;
  return escaped.slice(0, idx) + '<span class="search-hl">' + escaped.slice(idx, idx + q.length) + '</span>' + escaped.slice(idx + q.length);
}
