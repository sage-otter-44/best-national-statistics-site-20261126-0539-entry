// Page renderers. Each render function returns an HTML string for one
// hash route. All figures come from data.js; every figure carries its
// source and year in a note under the chart or table that shows it.

function sourceNote(source) {
  return '<p class="source">Source: ' + esc(source) + '</p>';
}

function yearSelect(currentYear) {
  let opts = '';
  YEARS.forEach((y) => {
    opts += '<option value="' + y + '"' + (y === currentYear ? ' selected' : '') + '>' + y + '</option>';
  });
  return '<label class="ctl">Year <select id="yearSelect">' + opts + '</select></label>';
}

function kpiCard(label, value, unit, changeText, changeGood) {
  const cls = changeText ? (changeGood ? 'up-good' : 'up-bad') : '';
  return '<div class="kpi"><div class="kpi-label">' + esc(label) + '</div>' +
    '<div class="kpi-value">' + esc(value) + ' <span class="kpi-unit">' + esc(unit) + '</span></div>' +
    (changeText ? '<div class="kpi-change ' + cls + '">' + esc(changeText) + '</div>' : '') + '</div>';
}

function chartCard(title, subtitle, chartHtml, source) {
  return '<section class="card"><h2>' + esc(title) + '</h2>' +
    (subtitle ? '<p class="card-sub">' + esc(subtitle) + '</p>' : '') +
    chartHtml + sourceNote(source) + '</section>';
}

function renderOverview(year) {
  const pop = seriesValue(DATA.population, year);
  const gdp = seriesValue(DATA.gdpNominal, year);
  const unemp = seriesValue(DATA.unemployment, year);
  const cpi = seriesValue(DATA.cpi, year);
  const income = seriesValue(DATA.medianIncome, year);
  const life = seriesValue(DATA.lifeExpectancy, year);
  const gdpChg = yoyChange(DATA.gdpNominal, year);
  const popChg = yoyChange(DATA.population, year);
  // 2019 is the first year of the series: there is no previous year, so
  // the change lines are left off rather than showing a meaningless value.
  const hasPrev = year > YEARS[0];
  const unempDelta = hasPrev ? seriesValue(DATA.unemployment, year) - seriesValue(DATA.unemployment, year - 1) : null;
  const incomeChg = yoyChange(DATA.medianIncome, year);

  let kpis = '<div class="kpi-grid">';
  kpis += kpiCard('Resident population', fmt(pop, 2), 'million', hasPrev ? fmtSigned(popChg, 2) + '% on ' + (year - 1) : null, true);
  kpis += kpiCard('Gross domestic product', '$' + fmt(gdp, 1), 'billion', hasPrev ? fmtSigned(gdpChg, 1) + '% on ' + (year - 1) : null, gdpChg >= 0);
  kpis += kpiCard('Unemployment rate', fmt(unemp, 1), '%', hasPrev ? fmtSigned(unempDelta, 1) + ' pts on ' + (year - 1) : null, hasPrev && unempDelta < 0);
  kpis += kpiCard('Consumer price inflation', fmt(cpi, 1), '%', 'year to December ' + year, cpi <= 3);
  kpis += kpiCard('Median household income', '$' + fmt(income), 'per year', hasPrev ? fmtSigned(incomeChg, 1) + '% on ' + (year - 1) : null, true);
  kpis += kpiCard('Life expectancy', fmt(life, 1), 'years', 'at birth, ' + year, true);
  kpis += '</div>';

  const gdpChart = lineChart(YEARS.map(String), DATA.gdpNominal.values, { decimals: 0, colour: '#2e7d6b' });
  const unempChart = lineChart(YEARS.map(String), DATA.unemployment.values, { decimals: 1, colour: '#c25e3a' });

  let news = '<section class="card"><h2>Latest releases</h2><ul class="news">';
  DATA.news.forEach((n) => {
    news += '<li><span class="news-date">' + esc(n.date) + '</span><strong>' + esc(n.title) + '</strong><p>' + esc(n.text) + '</p></li>';
  });
  news += '</ul></section>';

  let releases = '<section class="card"><h2>Release calendar</h2><table class="tbl"><thead><tr><th>Date</th><th>Release</th></tr></thead><tbody>';
  DATA.releases.forEach((r) => {
    releases += '<tr><td>' + esc(r.date) + '</td><td>' + esc(r.title) + '</td></tr>';
  });
  releases += '</tbody></table><p class="source">All releases at 09:30, Kingsford time.</p></section>';

  return '<h1>Aldermere in ' + year + '</h1>' +
    '<p class="lede">The Republic of Aldermere at a glance — population, economy, jobs and prices, published by the Aldermere National Statistics Office. Use the year selector to see any year from 2019 to 2025.</p>' +
    '<div class="toolbar">' + yearSelect(year) + '<a class="btn" href="#/about">About the figures</a></div>' +
    kpis +
    '<div class="grid-2">' +
    chartCard('Gross domestic product, 2019–' + year, 'Nominal GDP, $ billion', gdpChart, DATA.gdpNominal.source) +
    chartCard('Unemployment rate, 2019–' + year, '% of the labour force', unempChart, DATA.unemployment.source) +
    '</div>' + news + releases;
}

function renderPopulation(year) {
  const pop = seriesValue(DATA.population, year);
  const births = DATA.vital[0].value, deaths = DATA.vital[1].value;
  const popChart = lineChart(YEARS.map(String), DATA.population.values, { decimals: 2, colour: '#2e7d6b' });
  const donut = donutChart(DATA.ageGroups, { centre: '8.42m', centreLabel: 'Population 2025' });

  let vitalRows = '';
  DATA.vital.forEach((v) => {
    vitalRows += '<tr><td>' + esc(v.label) + '</td><td class="num">' + fmt(v.value) + '</td><td>' + esc(v.note) + '</td></tr>';
  });

  let regionRows = '';
  const sorted = DATA.regions.slice().sort((a, b) => b.population - a.population);
  sorted.forEach((r) => {
    regionRows += '<tr><td><a href="#/regions">' + esc(r.name) + '</a></td><td class="num">' + fmt(r.population, 2) + '</td><td class="num">' + fmt(r.gdpPerCapita) + '</td><td class="num">' + fmt(r.unemployment, 1) + '%</td></tr>';
  });

  return '<h1>Population</h1>' +
    '<p class="lede">Aldermere had ' + fmt(pop, 2) + ' million residents in ' + year + '. The population has grown every year since 2019, by births and by net migration.</p>' +
    '<div class="toolbar">' + yearSelect(year) + '</div>' +
    '<div class="grid-2">' +
    chartCard('Resident population, 2019–2025', 'Million people, 30 June each year', popChart, DATA.population.source) +
    chartCard('Age structure, 2025', 'Share of the resident population', donut, SRC.census) +
    '</div>' +
    '<section class="card"><h2>Vital events, 2025</h2><table class="tbl"><thead><tr><th>Event</th><th class="num">Number</th><th>Note</th></tr></thead><tbody>' + vitalRows + '</tbody></table>' + sourceNote(SRC.pop) + '</section>' +
    '<section class="card"><h2>Population by region, 2025</h2><table class="tbl sortable" data-table="pop-regions"><thead><tr><th data-sort="name">Region</th><th class="num" data-sort="population">Population (m)</th><th class="num" data-sort="gdpPerCapita">GDP per head ($)</th><th class="num" data-sort="unemployment">Unemployment</th></tr></thead><tbody>' + regionRows + '</tbody></table>' + sourceNote(SRC.regions) + '<p class="card-sub">Click a column heading to sort. See the <a href="#/regions">regions page</a> for the full comparison.</p></section>';
}

function renderEconomy(year, chartKind) {
  chartKind = chartKind || 'line';
  const gdp = seriesValue(DATA.gdpNominal, year);
  const growth = seriesValue(DATA.gdpGrowth, year);
  const chart = chartKind === 'bar'
    ? barChart(YEARS.map((y) => ({ label: String(y), value: seriesValue(DATA.gdpNominal, y) })), { decimals: 0, colour: '#2e7d6b' })
    : lineChart(YEARS.map(String), DATA.gdpNominal.values, { decimals: 0, colour: '#2e7d6b' });
  const growthChart = barChart(YEARS.map((y) => ({ label: String(y), value: seriesValue(DATA.gdpGrowth, y) })), { decimals: 1, colour: '#d98a1f' });
  const sectorChart = hbarChart(DATA.gdpBySector.map((d) => ({ label: d.label, value: d.value })), { decimals: 1, suffix: '%' });

  let tradeRows = '';
  DATA.trade.partners.forEach((p) => {
    tradeRows += '<tr><td>' + esc(p.partner) + '</td><td class="num">$' + fmt(p.exports, 1) + 'bn</td><td class="num">$' + fmt(p.imports, 1) + 'bn</td><td class="num">$' + fmt(p.exports - p.imports, 1) + 'bn</td></tr>';
  });
  let exportRows = '';
  DATA.trade.topExports.forEach((e) => {
    exportRows += '<tr><td>' + esc(e.item) + '</td><td class="num">$' + fmt(e.value, 1) + 'bn</td></tr>';
  });

  return '<h1>Economy</h1>' +
    '<p class="lede">GDP was $' + fmt(gdp, 1) + ' billion in ' + year + ', growing ' + fmt(growth, 1) + '% in real terms. Services produce 68.9% of value added; exports exceeded imports by $' + fmt(DATA.trade.exports - DATA.trade.imports, 1) + ' billion.</p>' +
    '<div class="toolbar">' + yearSelect(year) +
    '<span class="ctl">Chart <span class="seg" role="group" aria-label="Chart type"><button data-chart="line"' + (chartKind === 'line' ? ' class="on" aria-pressed="true"' : '') + '>Line</button><button data-chart="bar"' + (chartKind === 'bar' ? ' class="on" aria-pressed="true"' : '') + '>Bars</button></span></span></div>' +
    '<div class="grid-2">' +
    chartCard('Gross domestic product, 2019–2025', 'Nominal GDP, $ billion — switch between line and bars above', chart, DATA.gdpNominal.source) +
    chartCard('Real GDP growth, 2019–2025', '% change on the previous year', growthChart, SRC.accounts) +
    '</div>' +
    '<div class="grid-2">' +
    chartCard('GDP by sector, 2025', 'Share of gross value added', sectorChart, SRC.accounts) +
    '<section class="card"><h2>Top exports, 2025</h2><table class="tbl"><thead><tr><th>Product</th><th class="num">Value</th></tr></thead><tbody>' + exportRows + '</tbody></table>' + sourceNote(SRC.trade) + '</section>' +
    '</div>' +
    '<section class="card"><h2>Trade by partner, 2025</h2><table class="tbl sortable" data-table="trade"><thead><tr><th data-sort="partner">Partner</th><th class="num" data-sort="exports">Exports</th><th class="num" data-sort="imports">Imports</th><th class="num" data-sort="balance">Balance</th></tr></thead><tbody>' + tradeRows + '</tbody></table>' + sourceNote(SRC.trade) + '<p class="card-sub">Click a column heading to sort.</p></section>';
}

function renderEmployment(year) {
  const unemp = seriesValue(DATA.unemployment, year);
  const chart = lineChart(YEARS.map(String), DATA.unemployment.values, { decimals: 1, colour: '#c25e3a' });
  const sectorChart = hbarChart(DATA.employmentBySector.map((d) => ({ label: d.label, value: d.value })), { decimals: 1, suffix: '%' });
  const L = DATA.labour;

  let regionRows = '';
  DATA.regions.slice().sort((a, b) => a.unemployment - b.unemployment).forEach((r) => {
    regionRows += '<tr><td><a href="#/regions">' + esc(r.name) + '</a></td><td class="num">' + fmt(r.unemployment, 1) + '%</td><td class="num">$' + fmt(r.income) + '</td></tr>';
  });

  return '<h1>Employment</h1>' +
    '<p class="lede">Unemployment was ' + fmt(unemp, 1) + '% in ' + year + '. The labour force is ' + fmt(L.labourForce, 2) + ' million people; ' + fmt(L.employed, 2) + ' million are in work and ' + fmt(L.vacancies) + ' jobs stand vacant.</p>' +
    '<div class="toolbar">' + yearSelect(year) + '</div>' +
    '<div class="kpi-grid">' +
    kpiCard('Labour force', fmt(L.labourForce, 2), 'million', 'participation ' + fmt(L.participation, 1) + '%', true) +
    kpiCard('People in work', fmt(L.employed, 2), 'million', 'of ' + fmt(L.labourForce, 2) + 'm labour force', true) +
    kpiCard('Youth unemployment', fmt(L.youthUnemployment, 1), '%', 'aged 15–24', L.youthUnemployment < 12) +
    kpiCard('Average weekly earnings', '$' + fmt(L.averageWeeklyEarnings), '', fmt(L.averageWeeklyHours, 1) + ' hours a week', true) +
    '</div>' +
    '<div class="grid-2">' +
    chartCard('Unemployment rate, 2019–2025', '% of the labour force', chart, SRC.labour) +
    chartCard('Employment by sector, 2025', 'Share of employed persons', sectorChart, SRC.labour) +
    '</div>' +
    '<section class="card"><h2>Unemployment by region, 2025</h2><table class="tbl sortable" data-table="emp-regions"><thead><tr><th data-sort="name">Region</th><th class="num" data-sort="unemployment">Unemployment</th><th class="num" data-sort="income">Median income</th></tr></thead><tbody>' + regionRows + '</tbody></table>' + sourceNote(SRC.regions) + '<p class="card-sub">Click a column heading to sort.</p></section>';
}

function renderPrices(year) {
  const cpi = seriesValue(DATA.cpi, year);
  const chart = lineChart(YEARS.map(String), DATA.cpi.values, { decimals: 1, colour: '#7a4a6e' });
  const basketChart = hbarChart(DATA.basket.map((b) => ({ label: b.label, value: b.change, colour: b.change < 0 ? '#2e7d6b' : '#c25e3a' })), { decimals: 1, suffix: '%' });

  let rows = '';
  DATA.basket.slice().sort((a, b) => b.change - a.change).forEach((b) => {
    rows += '<tr><td>' + esc(b.label) + '</td><td class="num">' + fmt(b.weight, 1) + '%</td><td class="num">' + fmtSigned(b.change, 1) + '%</td></tr>';
  });

  return '<h1>Prices</h1>' +
    '<p class="lede">Consumer prices rose ' + fmt(cpi, 1) + '% in the year to December ' + year + '. Housing carries the largest weight in the basket at 24.6%; energy prices fell 0.8% over the year.</p>' +
    '<div class="toolbar">' + yearSelect(year) + '</div>' +
    '<div class="grid-2">' +
    chartCard('Consumer price inflation, 2019–2025', '% change on a year earlier', chart, SRC.prices) +
    chartCard('Price changes by basket group, 2025', '% change in the year to December 2025', basketChart, SRC.prices) +
    '</div>' +
    '<section class="card"><h2>The CPI basket, December 2025</h2><table class="tbl sortable" data-table="basket"><thead><tr><th data-sort="label">Group</th><th class="num" data-sort="weight">Weight</th><th class="num" data-sort="change">Annual change</th></tr></thead><tbody>' + rows + '</tbody></table>' + sourceNote(SRC.prices) + '<p class="card-sub">Weights are shares of household spending. Click a column heading to sort.</p></section>';
}

function renderRegions(year, metric) {
  metric = metric || 'gdpPerCapita';
  const metrics = {
    gdpPerCapita: { label: 'GDP per head ($)', decimals: 0, suffix: '' },
    population: { label: 'Population (million)', decimals: 2, suffix: '' },
    unemployment: { label: 'Unemployment (%)', decimals: 1, suffix: '%' },
    income: { label: 'Median income ($)', decimals: 0, suffix: '' },
    growth: { label: 'GDP growth (%)', decimals: 1, suffix: '%' },
  };
  const m = metrics[metric];
  let opts = '';
  Object.keys(metrics).forEach((k) => {
    opts += '<option value="' + k + '"' + (k === metric ? ' selected' : '') + '>' + metrics[k].label + '</option>';
  });
  const chartData = DATA.regions.slice().sort((a, b) => b[metric] - a[metric]).map((r) => ({ label: r.name, value: r[metric] }));
  const chart = hbarChart(chartData, { decimals: m.decimals, suffix: m.suffix });

  let rows = '';
  DATA.regions.slice().sort((a, b) => b[metric] - a[metric]).forEach((r) => {
    rows += '<tr><td><strong>' + esc(r.name) + '</strong><br><span class="muted">Capital: ' + esc(r.capital) + '</span></td>' +
      '<td class="num">' + fmt(r.population, 2) + '</td>' +
      '<td class="num">$' + fmt(r.gdpPerCapita) + '</td>' +
      '<td class="num">' + fmt(r.unemployment, 1) + '%</td>' +
      '<td class="num">$' + fmt(r.income) + '</td>' +
      '<td class="num">' + fmtSigned(r.growth, 1) + '%</td></tr>';
  });

  return '<h1>Regions</h1>' +
    '<p class="lede">Aldermere has six regions. Centralia, home to the capital Kingsford, has the highest GDP per head at $61,200; the Highlands, the smallest region, has the highest unemployment at 5.2%.</p>' +
    '<div class="toolbar"><label class="ctl">Compare by <select id="metricSelect">' + opts + '</select></label></div>' +
    '<div class="grid-2">' +
    chartCard('Regions compared — ' + m.label, '2025, sorted highest first', chart, SRC.regions) +
    '<section class="card"><h2>How to read this page</h2><p>Pick a measure in the selector above and the chart and the table reorder themselves. GDP per head is nominal GDP divided by the resident population. Median income is the median annual household income. All figures are for 2025 unless the table says otherwise.</p><p>Centralia holds 28.6% of the population and 36.5% of GDP. The Highlands hold 6.2% of the population on 31% of the land.</p>' + sourceNote(SRC.regions) + '</section>' +
    '</div>' +
    '<section class="card"><h2>All regions, 2025</h2><table class="tbl sortable" data-table="regions"><thead><tr><th data-sort="name">Region</th><th class="num" data-sort="population">Population (m)</th><th class="num" data-sort="gdpPerCapita">GDP per head</th><th class="num" data-sort="unemployment">Unemployment</th><th class="num" data-sort="income">Median income</th><th class="num" data-sort="growth">GDP growth</th></tr></thead><tbody>' + rows + '</tbody></table>' + sourceNote(SRC.regions) + '<p class="card-sub">Click a column heading to sort.</p></section>';
}

function renderAbout() {
  return '<h1>About the figures</h1>' +
    '<p class="lede">This site publishes the official statistics of the Republic of Aldermere. The Aldermere National Statistics Office is independent of government and publishes every figure free of charge, with its source and reference year printed beside it.</p>' +
    '<section class="card"><h2>Sources</h2><table class="tbl"><thead><tr><th>Publication</th><th>Latest edition</th></tr></thead><tbody>' +
    '<tr><td>National Statistical Yearbook</td><td>2025</td></tr>' +
    '<tr><td>Population Estimates</td><td>2025</td></tr>' +
    '<tr><td>National Accounts</td><td>2025</td></tr>' +
    '<tr><td>Labour Force Survey</td><td>Q4 2025</td></tr>' +
    '<tr><td>Consumer Price Index</td><td>December 2025</td></tr>' +
    '<tr><td>Regional Statistics</td><td>2025</td></tr>' +
    '<tr><td>External Trade Statistics</td><td>2025</td></tr>' +
    '<tr><td>Census — First Results</td><td>2024</td></tr>' +
    '</tbody></table><p class="source">Every chart and table on this site names its source publication and year.</p></section>' +
    '<section class="card"><h2>Methods in brief</h2>' +
    '<p>Population is the resident population at 30 June. GDP is nominal unless a chart says “real”. The unemployment rate is the share of the labour force without work but available for and seeking work, measured by the Labour Force Survey. The CPI tracks the prices of a fixed basket of goods and services bought by households; weights are revised each January. Regional GDP per head divides a region’s nominal GDP by its resident population.</p>' +
    '<p>Figures are revised as better data arrive. Revisions are shown in the next edition of the publication that carries them, and the release calendar on the <a href="#/">home page</a> lists what is coming next.</p></section>' +
    '<section class="card"><h2>Contact</h2><p>Aldermere National Statistics Office, 14 Ledger Square, Kingsford AL1 2ST. Enquiries desk, weekdays 09:00–17:00. This is a demonstration site: Aldermere is a fictional country and every figure here is invented for illustration.</p></section>';
}
