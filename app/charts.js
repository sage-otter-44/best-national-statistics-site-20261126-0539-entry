// Hand-drawn SVG charts. No chart library is used: every chart is built
// from the data in data.js with plain string templates and SVG elements.

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const step = Math.pow(10, Math.floor(Math.log10(span / count)));
  const norm = span / count / step;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  const stepN = step * nice;
  const lo = Math.floor(min / stepN) * stepN;
  const ticks = [];
  for (let v = lo; v <= max + stepN * 0.001; v += stepN) ticks.push(v);
  return { ticks, step: stepN };
}

function axisLabel(v, decimals) {
  if (Math.abs(v) >= 1000) return fmt(v, 0);
  return v.toFixed(decimals == null ? 1 : decimals);
}

// Line chart. labels: year labels, values: numbers, opts: {unit, decimals, colour, height}.
function lineChart(labels, values, opts) {
  opts = opts || {};
  const W = 640, H = opts.height || 260, PL = 56, PR = 16, PT = 14, PB = 30;
  const iw = W - PL - PR, ih = H - PT - PB;
  let min = Math.min.apply(null, values), max = Math.max.apply(null, values);
  const pad = (max - min) * 0.12 || 1;
  min -= pad; max += pad;
  const t = niceTicks(min, max, 4);
  const x = (i) => PL + (iw * i) / (labels.length - 1);
  const y = (v) => PT + ih - ((v - min) / (max - min)) * ih;
  let g = '';
  t.ticks.forEach((tv) => {
    g += '<line x1="' + PL + '" y1="' + y(tv).toFixed(1) + '" x2="' + (W - PR) + '" y2="' + y(tv).toFixed(1) + '" stroke="#e3ddd0" stroke-width="1"/>';
    g += '<text x="' + (PL - 8) + '" y="' + (y(tv) + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#6b6558">' + esc(axisLabel(tv, opts.decimals)) + '</text>';
  });
  let path = '';
  values.forEach((v, i) => { path += (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ',' + y(v).toFixed(1) + ' '; });
  let area = path + 'L' + x(values.length - 1).toFixed(1) + ',' + (PT + ih) + ' L' + x(0).toFixed(1) + ',' + (PT + ih) + ' Z';
  g += '<path d="' + area + '" fill="' + (opts.colour || '#2e7d6b') + '" fill-opacity="0.10"/>';
  g += '<path d="' + path + '" fill="none" stroke="' + (opts.colour || '#2e7d6b') + '" stroke-width="2.5" stroke-linejoin="round"/>';
  values.forEach((v, i) => {
    g += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="4" fill="#fff" stroke="' + (opts.colour || '#2e7d6b') + '" stroke-width="2.5"/>';
    // Edge labels anchor inward so they are never clipped by the chart edge.
    const anchor = i === 0 ? 'start' : (i === values.length - 1 ? 'end' : 'middle');
    const lx = i === 0 ? x(i) + 6 : (i === values.length - 1 ? x(i) - 6 : x(i));
    g += '<text x="' + lx.toFixed(1) + '" y="' + (y(v) - 10).toFixed(1) + '" text-anchor="' + anchor + '" font-size="11" font-weight="600" fill="#1c2420">' + esc(axisLabel(v, opts.decimals)) + '</text>';
    g += '<text x="' + x(i).toFixed(1) + '" y="' + (PT + ih + 20) + '" text-anchor="middle" font-size="11" fill="#6b6558">' + esc(labels[i]) + '</text>';
  });
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Line chart" class="chart">' + g + '</svg>';
}

// Vertical bar chart. items: [{label, value}], opts: {unit, decimals, colour}.
function barChart(items, opts) {
  opts = opts || {};
  const W = 640, H = opts.height || 260, PL = 56, PR = 16, PT = 26, PB = 30;
  const iw = W - PL - PR, ih = H - PT - PB;
  const values = items.map((d) => d.value);
  let min = Math.min(0, Math.min.apply(null, values)), max = Math.max.apply(null, values);
  const pad = (max - min) * 0.08 || 1;
  max += pad; min -= pad * 0.2;
  const t = niceTicks(min, max, 4);
  const slot = iw / items.length;
  const bw = Math.min(52, slot * 0.6);
  const y = (v) => PT + ih - ((v - min) / (max - min)) * ih;
  let g = '';
  t.ticks.forEach((tv) => {
    g += '<line x1="' + PL + '" y1="' + y(tv).toFixed(1) + '" x2="' + (W - PR) + '" y2="' + y(tv).toFixed(1) + '" stroke="#e3ddd0" stroke-width="1"/>';
    g += '<text x="' + (PL - 8) + '" y="' + (y(tv) + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#6b6558">' + esc(axisLabel(tv, opts.decimals)) + '</text>';
  });
  g += '<line x1="' + PL + '" y1="' + y(0).toFixed(1) + '" x2="' + (W - PR) + '" y2="' + y(0).toFixed(1) + '" stroke="#b9b2a2" stroke-width="1.5"/>';
  items.forEach((d, i) => {
    const cx = PL + slot * i + slot / 2;
    const top = y(Math.max(0, d.value)), bot = y(Math.min(0, d.value));
    const col = d.colour || (d.value < 0 ? '#c25e3a' : (opts.colour || '#2e7d6b'));
    g += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw + '" height="' + Math.max(1, bot - top).toFixed(1) + '" rx="3" fill="' + col + '"/>';
    g += '<text x="' + cx.toFixed(1) + '" y="' + (top - 7).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="600" fill="#1c2420">' + esc(axisLabel(d.value, opts.decimals)) + '</text>';
    g += '<text x="' + cx.toFixed(1) + '" y="' + (PT + ih + 20) + '" text-anchor="middle" font-size="11" fill="#6b6558">' + esc(d.label) + '</text>';
  });
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Bar chart" class="chart">' + g + '</svg>';
}

// Horizontal bar chart, good for long labels (regions, sectors).
function hbarChart(items, opts) {
  opts = opts || {};
  const W = 640, rowH = 34, PT = 8, PB = 8, PL = 170, PR = 64;
  const H = PT + PB + items.length * rowH;
  const max = Math.max.apply(null, items.map((d) => d.value)) * 1.08;
  let g = '';
  items.forEach((d, i) => {
    const y = PT + i * rowH + 8;
    const bw = ((W - PL - PR) * d.value) / max;
    g += '<text x="' + (PL - 10) + '" y="' + (y + 12) + '" text-anchor="end" font-size="12" fill="#1c2420">' + esc(d.label) + '</text>';
    g += '<rect x="' + PL + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="20" rx="3" fill="' + (d.colour || opts.colour || '#2e7d6b') + '"/>';
    g += '<text x="' + (PL + bw + 8).toFixed(1) + '" y="' + (y + 15) + '" font-size="12" font-weight="600" fill="#1c2420">' + esc(axisLabel(d.value, opts.decimals)) + (opts.suffix || '') + '</text>';
  });
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Horizontal bar chart" class="chart">' + g + '</svg>';
}

// Donut chart with a legend.
function donutChart(items, opts) {
  opts = opts || {};
  const size = 240, cx = size / 2, cy = size / 2, r = 88, inner = 58;
  const total = items.reduce((s, d) => s + d.value, 0);
  let a0 = -Math.PI / 2, paths = '';
  items.forEach((d) => {
    const frac = d.value / total;
    const a1 = a0 + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    paths += '<path d="M' + x0.toFixed(1) + ',' + y0.toFixed(1) + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' L' + xi1.toFixed(1) + ',' + yi1.toFixed(1) + ' A' + inner + ',' + inner + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ',' + yi0.toFixed(1) + ' Z" fill="' + (d.colour || '#2e7d6b') + '" stroke="#faf7f0" stroke-width="2"/>';
    a0 = a1;
  });
  const centre = opts.centre || '';
  let legend = '<ul class="legend">';
  items.forEach((d) => {
    legend += '<li><span class="swatch" style="background:' + (d.colour || '#2e7d6b') + '"></span>' + esc(d.label) + ' <strong>' + d.value.toFixed(1) + '%</strong></li>';
  });
  legend += '</ul>';
  return '<div class="donut-wrap"><svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Donut chart" class="donut">' + paths +
    '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" font-size="13" fill="#6b6558">' + esc(opts.centreLabel || '') + '</text>' +
    '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="17" font-weight="700" fill="#1c2420">' + esc(centre) + '</text></svg>' + legend + '</div>';
}
