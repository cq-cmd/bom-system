// Chart rendering utilities — pure DOM, no state dependencies

export function renderPieChart(containerId, data, title) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var total = data.reduce(function(s, d) { return s + d.value; }, 0);
  if (total === 0) { el.innerHTML = '<div style="text-align:center;color:var(--text-muted);font-size:12px;padding:16px">无数据</div>'; return; }
  var r = 60, cx = 70, cy = 70, strokeW = 24;
  var circumference = 2 * Math.PI * r;
  var offset = 0;
  var circles = data.map(function(d) {
    var pct = d.value / total;
    var dashLen = pct * circumference;
    var html = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + d.color + '" stroke-width="' + strokeW + '" stroke-dasharray="' + dashLen + ' ' + (circumference - dashLen) + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')" />';
    offset += dashLen;
    return html;
  });
  var svg = '<svg width="140" height="140" viewBox="0 0 140 140">' + circles.join('') + '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" dy="4" fill="var(--text-primary)" font-size="16" font-weight="700">' + total + '</text></svg>';
  var legend = '<div class="pie-legend">' + data.map(function(d) {
    return '<div class="pie-legend-item"><div class="pie-legend-dot" style="background:' + d.color + '"></div><span>' + d.label + '</span><span style="font-weight:600;margin-left:auto">' + d.value + '</span></div>';
  }).join('') + '</div>';
  el.innerHTML = '<h4 style="margin-bottom:12px">' + (title || '') + '</h4><div class="pie-chart-container">' + svg + legend + '</div>';
}

export function renderGauge(containerId, score, label) {
  var el = document.getElementById(containerId);
  if (!el) return;
  score = Math.max(0, Math.min(100, Math.round(score)));
  var r = 54, strokeW = 10, cx = 64, cy = 64;
  var circumference = Math.PI * r;
  var dashLen = (score / 100) * circumference;
  var color = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--yellow)' : 'var(--red)';
  el.innerHTML = '<div class="gauge-container"><svg width="128" height="80" viewBox="0 0 128 80"><path d="M 10 70 A 54 54 0 0 1 118 70" fill="none" stroke="var(--border)" stroke-width="' + strokeW + '" stroke-linecap="round" /><path d="M 10 70 A 54 54 0 0 1 118 70" fill="none" stroke="' + color + '" stroke-width="' + strokeW + '" stroke-linecap="round" stroke-dasharray="' + dashLen + ' ' + circumference + '" /></svg><div class="gauge-value" style="color:' + color + ';top:40px">' + score + '</div><div class="gauge-label" style="bottom:2px">' + (label || 'BOM健康度') + '</div></div>';
}

export function renderTreemap(containerId, data) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var total = data.reduce(function(s, d) { return s + d.value; }, 0);
  if (total === 0) return;
  var colors = ['#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#db2777', '#4f46e5'];
  el.innerHTML = '<div class="treemap-container" style="height:120px">' + data.sort(function(a, b) { return b.value - a.value; }).slice(0, 10).map(function(d, i) {
    var pct = Math.max(5, (d.value / total) * 100);
    return '<div class="treemap-cell" style="flex:' + pct + ';background:' + colors[i % colors.length] + ';min-width:40px"><div class="treemap-cell-name">' + d.label + '</div><div class="treemap-cell-value">¥' + d.value.toFixed(0) + '</div></div>';
  }).join('') + '</div>';
}
