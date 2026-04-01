// Chart rendering utilities — pure SVG, no state dependencies

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
  var colors = ['#4F6D7A', '#5B8FA8', '#4D9BA5', '#5D9B74', '#C49B3C', '#C06058', '#B06B8A', '#C47F42'];
  el.innerHTML = '<div class="treemap-container" style="height:120px">' + data.sort(function(a, b) { return b.value - a.value; }).slice(0, 10).map(function(d, i) {
    var pct = Math.max(5, (d.value / total) * 100);
    return '<div class="treemap-cell" style="flex:' + pct + ';background:' + colors[i % colors.length] + ';min-width:40px"><div class="treemap-cell-name">' + d.label + '</div><div class="treemap-cell-value">¥' + d.value.toFixed(0) + '</div></div>';
  }).join('') + '</div>';
}

// ===== LINE CHART (SVG) =====
export function renderLineChart(containerId, data, title) {
  var el = document.getElementById(containerId);
  if (!el) return;
  if (!data || data.length === 0) return;
  var w = 320, h = 160, padL = 50, padR = 16, padT = 10, padB = 30;
  var chartW = w - padL - padR, chartH = h - padT - padB;
  var vals = data.map(function(d) { return d.value; });
  var minV = Math.min.apply(null, vals) * 0.9;
  var maxV = Math.max.apply(null, vals) * 1.05;
  var range = maxV - minV || 1;
  var points = data.map(function(d, i) {
    var x = padL + (i / (data.length - 1)) * chartW;
    var y = padT + chartH - ((d.value - minV) / range) * chartH;
    return { x: x, y: y, label: d.label, value: d.value };
  });
  var pathD = points.map(function(p, i) { return (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ');
  var areaD = pathD + ' L' + points[points.length - 1].x.toFixed(1) + ',' + (padT + chartH) + ' L' + points[0].x.toFixed(1) + ',' + (padT + chartH) + ' Z';
  // Grid lines
  var gridLines = '';
  for (var gi = 0; gi <= 4; gi++) {
    var gy = padT + (gi / 4) * chartH;
    var gVal = maxV - (gi / 4) * range;
    gridLines += '<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + gy.toFixed(1) + '" stroke="var(--border)" stroke-width="0.5" />';
    gridLines += '<text x="' + (padL - 6) + '" y="' + (gy + 3).toFixed(1) + '" text-anchor="end" fill="var(--text-muted)" font-size="9">¥' + gVal.toFixed(0) + '</text>';
  }
  // X labels
  var xLabels = '';
  var step = Math.max(1, Math.floor(data.length / 6));
  for (var xi = 0; xi < data.length; xi += step) {
    xLabels += '<text x="' + points[xi].x.toFixed(1) + '" y="' + (h - 4) + '" text-anchor="middle" fill="var(--text-muted)" font-size="9">' + data[xi].label + '</text>';
  }
  // Dots
  var dots = points.map(function(p) {
    return '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="3" fill="#4F6D7A" stroke="var(--bg-secondary)" stroke-width="1.5" />';
  }).join('');
  var svg = '<svg width="100%" viewBox="0 0 ' + w + ' ' + h + '" style="max-width:' + w + 'px">'
    + '<defs><linearGradient id="lcFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4F6D7A" stop-opacity="0.15"/><stop offset="100%" stop-color="#4F6D7A" stop-opacity="0.01"/></linearGradient></defs>'
    + gridLines + xLabels
    + '<path d="' + areaD + '" fill="url(#lcFill)" />'
    + '<path d="' + pathD + '" fill="none" stroke="#4F6D7A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />'
    + dots + '</svg>';
  el.innerHTML = '<h4 style="margin-bottom:12px">' + (title || '') + '</h4>' + svg;
}

// ===== RADAR CHART (SVG) =====
export function renderRadarChart(containerId, datasets, dimensions, title) {
  var el = document.getElementById(containerId);
  if (!el) return;
  if (!datasets || !dimensions || dimensions.length < 3) return;
  var w = 260, h = 240, cx = w / 2, cy = 110, radius = 80;
  var n = dimensions.length;
  var angleStep = (2 * Math.PI) / n;
  function polarToCart(angle, r) {
    return { x: cx + r * Math.sin(angle), y: cy - r * Math.cos(angle) };
  }
  // Grid
  var grid = '';
  for (var level = 1; level <= 5; level++) {
    var r = (level / 5) * radius;
    var pts = [];
    for (var i = 0; i < n; i++) {
      var p = polarToCart(i * angleStep, r);
      pts.push(p.x.toFixed(1) + ',' + p.y.toFixed(1));
    }
    grid += '<polygon points="' + pts.join(' ') + '" fill="none" stroke="var(--border)" stroke-width="0.5" />';
  }
  // Axes + labels
  var axes = '';
  for (var ai = 0; ai < n; ai++) {
    var ep = polarToCart(ai * angleStep, radius);
    axes += '<line x1="' + cx + '" y1="' + cy + '" x2="' + ep.x.toFixed(1) + '" y2="' + ep.y.toFixed(1) + '" stroke="var(--border)" stroke-width="0.5" />';
    var lp = polarToCart(ai * angleStep, radius + 16);
    axes += '<text x="' + lp.x.toFixed(1) + '" y="' + (lp.y + 3).toFixed(1) + '" text-anchor="middle" fill="var(--text-secondary)" font-size="10">' + dimensions[ai] + '</text>';
  }
  // Data polygons
  var dsColors = ['#4F6D7A', '#5B8FA8', '#5D9B74', '#C49B3C', '#C06058'];
  var polys = datasets.map(function(ds, di) {
    var pts = ds.values.map(function(v, vi) {
      var p = polarToCart(vi * angleStep, (v / 100) * radius);
      return p.x.toFixed(1) + ',' + p.y.toFixed(1);
    });
    var c = dsColors[di % dsColors.length];
    return '<polygon points="' + pts.join(' ') + '" fill="' + c + '" fill-opacity="0.15" stroke="' + c + '" stroke-width="1.5" />';
  }).join('');
  // Legend
  var legend = datasets.length > 1 ? '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;justify-content:center">' + datasets.map(function(ds, di) {
    return '<div style="display:flex;align-items:center;gap:4px;font-size:11px"><div style="width:10px;height:10px;border-radius:50%;background:' + dsColors[di % dsColors.length] + '"></div>' + ds.label + '</div>';
  }).join('') + '</div>' : '';
  var svg = '<svg width="100%" viewBox="0 0 ' + w + ' ' + h + '" style="max-width:' + w + 'px">' + grid + axes + polys + '</svg>';
  el.innerHTML = '<h4 style="margin-bottom:8px">' + (title || '') + '</h4>' + svg + legend;
}

// ===== BAR CHART (SVG horizontal) =====
export function renderBarChart(containerId, data, title) {
  var el = document.getElementById(containerId);
  if (!el) return;
  if (!data || data.length === 0) return;
  var maxVal = Math.max.apply(null, data.map(function(d) { return d.value; }));
  if (maxVal === 0) maxVal = 1;
  var barH = 22, gap = 6, labelW = 70, valueW = 60;
  var totalH = data.length * (barH + gap) + 10;
  var w = 320, barArea = w - labelW - valueW - 10;
  var bars = data.map(function(d, i) {
    var y = i * (barH + gap);
    var barW = (d.value / maxVal) * barArea;
    var color = d.color || '#4F6D7A';
    return '<text x="' + (labelW - 4) + '" y="' + (y + barH / 2 + 4) + '" text-anchor="end" fill="var(--text-secondary)" font-size="11">' + d.label + '</text>'
      + '<rect x="' + labelW + '" y="' + y + '" width="' + barW.toFixed(1) + '" height="' + barH + '" rx="3" fill="' + color + '" fill-opacity="0.8" />'
      + '<text x="' + (labelW + barW + 6).toFixed(1) + '" y="' + (y + barH / 2 + 4) + '" fill="var(--text-primary)" font-size="11" font-weight="600">' + (d.format === 'currency' ? '¥' + d.value.toFixed(0) : d.value) + '</text>';
  }).join('');
  var svg = '<svg width="100%" viewBox="0 0 ' + w + ' ' + totalH + '" style="max-width:' + w + 'px">' + bars + '</svg>';
  el.innerHTML = '<h4 style="margin-bottom:10px">' + (title || '') + '</h4>' + svg;
}

// ===== PRICE HISTORY SPARKLINE (SVG) =====
export function renderPriceHistory(containerId, materialId, basePrice) {
  var el = document.getElementById(containerId);
  if (!el) return;
  if (!basePrice || basePrice <= 0) { el.innerHTML = ''; return; }
  // Seeded random from materialId
  var seed = 0;
  for (var si = 0; si < materialId.length; si++) seed = ((seed << 5) - seed + materialId.charCodeAt(si)) | 0;
  function seededRandom() { seed = (seed * 16807 + 0) % 2147483647; return (seed & 0x7fffffff) / 2147483647; }
  // Generate 12 months
  var months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  var prices = [];
  var p = basePrice * (0.85 + seededRandom() * 0.15);
  for (var mi = 0; mi < 12; mi++) {
    var change = (seededRandom() - 0.45) * basePrice * 0.08;
    p = Math.max(basePrice * 0.6, Math.min(basePrice * 1.4, p + change));
    prices.push({ label: months[mi], value: Math.round(p * 100) / 100 });
  }
  var w = 280, h = 80, padL = 6, padR = 6, padT = 8, padB = 4;
  var chartW = w - padL - padR, chartH = h - padT - padB;
  var vals = prices.map(function(d) { return d.value; });
  var minV = Math.min.apply(null, vals) * 0.95;
  var maxV = Math.max.apply(null, vals) * 1.05;
  var range = maxV - minV || 1;
  var points = prices.map(function(d, i) {
    return {
      x: padL + (i / 11) * chartW,
      y: padT + chartH - ((d.value - minV) / range) * chartH
    };
  });
  var pathD = points.map(function(pt, i) { return (i === 0 ? 'M' : 'L') + pt.x.toFixed(1) + ',' + pt.y.toFixed(1); }).join(' ');
  var areaD = pathD + ' L' + points[11].x.toFixed(1) + ',' + (padT + chartH) + ' L' + padL + ',' + (padT + chartH) + ' Z';
  var trend = prices[11].value >= prices[0].value;
  var color = trend ? '#C06058' : '#5D9B74';
  var delta = ((prices[11].value - prices[0].value) / prices[0].value * 100).toFixed(1);
  var svg = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">'
    + '<defs><linearGradient id="phFill_' + materialId.replace(/[^a-zA-Z0-9]/g, '') + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + color + '" stop-opacity="0.12"/><stop offset="100%" stop-color="' + color + '" stop-opacity="0.01"/></linearGradient></defs>'
    + '<path d="' + areaD + '" fill="url(#phFill_' + materialId.replace(/[^a-zA-Z0-9]/g, '') + ')" />'
    + '<path d="' + pathD + '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />'
    + '<circle cx="' + points[11].x.toFixed(1) + '" cy="' + points[11].y.toFixed(1) + '" r="2.5" fill="' + color + '" />'
    + '</svg>';
  el.innerHTML = '<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">📉 近12月价格趋势 <span style="color:' + color + ';font-weight:600">' + (trend ? '↑' : '↓') + delta + '%</span></div>' + svg;
}
