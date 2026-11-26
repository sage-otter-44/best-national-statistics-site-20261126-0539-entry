// Router and controls. Hash routes: #/ (home), #/population, #/economy,
// #/employment, #/prices, #/regions, #/about. State kept here: the
// selected year, the economy chart kind and the regions metric.

var state = { year: 2025, chartKind: 'line', metric: 'gdpPerCapita' };

var ROUTES = {
  '/': { title: 'Aldermere in figures', render: function () { return renderOverview(state.year); } },
  '/population': { title: 'Population', render: function () { return renderPopulation(state.year); } },
  '/economy': { title: 'Economy', render: function () { return renderEconomy(state.year, state.chartKind); } },
  '/employment': { title: 'Employment', render: function () { return renderEmployment(state.year); } },
  '/prices': { title: 'Prices', render: function () { return renderPrices(state.year); } },
  '/regions': { title: 'Regions', render: function () { return renderRegions(state.year, state.metric); } },
  '/about': { title: 'About the figures', render: renderAbout },
};

function currentRoute() {
  var hash = window.location.hash || '#/';
  var path = hash.slice(1) || '/';
  return ROUTES[path] ? path : '/';
}

function render() {
  var path = currentRoute();
  var page = ROUTES[path];
  document.getElementById('page').innerHTML = page.render();
  document.title = page.title + ' — Aldermere National Statistics';
  var links = document.querySelectorAll('.nav a');
  links.forEach(function (a) {
    if (a.getAttribute('href') === '#' + path) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  bindControls();
  window.scrollTo(0, 0);
}

function bindControls() {
  var ys = document.getElementById('yearSelect');
  if (ys) ys.addEventListener('change', function () {
    state.year = parseInt(ys.value, 10);
    render();
  });
  var ms = document.getElementById('metricSelect');
  if (ms) ms.addEventListener('change', function () {
    state.metric = ms.value;
    render();
  });
  document.querySelectorAll('[data-chart]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.chartKind = btn.getAttribute('data-chart');
      render();
    });
  });
  // Sortable tables: click a heading to sort that column.
  document.querySelectorAll('table.sortable th[data-sort]').forEach(function (th) {
    th.addEventListener('click', function () { sortTable(th); });
    th.setAttribute('tabindex', '0');
    th.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sortTable(th); }
    });
  });
}

function sortTable(th) {
  var table = th.closest('table');
  var key = th.getAttribute('data-sort');
  var body = table.querySelector('tbody');
  var rows = Array.prototype.slice.call(body.querySelectorAll('tr'));
  var dir = th.getAttribute('data-dir') === 'asc' ? -1 : 1;
  table.querySelectorAll('th').forEach(function (h) { h.removeAttribute('data-dir'); });
  th.setAttribute('data-dir', dir === 1 ? 'asc' : 'desc');
  var keyFor = function (row) { return rowData(row, key); };
  rows.sort(function (a, b) {
    var va = keyFor(a), vb = keyFor(b);
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
    return String(va).localeCompare(String(vb)) * dir;
  });
  rows.forEach(function (r) { body.appendChild(r); });
}

function rowData(row, key) {
  return rowValue(row, key);
}

function cellIndex(row, key) {
  var table = row.closest('table');
  var heads = table.querySelectorAll('thead th');
  for (var i = 0; i < heads.length; i++) {
    if (heads[i].getAttribute('data-sort') === key) return i;
  }
  return 0;
}

function rowValue(row, key) {
  var i = cellIndex(row, key);
  var cell = row.cells[i];
  if (!cell) return 0;
  if (key === 'name' || key === 'partner' || key === 'label') return cell.textContent.trim();
  if (key === 'balance') {
    var cells = row.cells;
    var ex = parseCell(cells[1]), im = parseCell(cells[2]);
    return ex - im;
  }
  return parseCell(cell);
}

function parseCell(cell) {
  var t = cell.textContent.replace(/[$,%\s]/g, '').replace(/,/g, '');
  var n = parseFloat(t);
  return isNaN(n) ? 0 : n;
}

window.addEventListener('hashchange', render);
document.addEventListener('DOMContentLoaded', render);
