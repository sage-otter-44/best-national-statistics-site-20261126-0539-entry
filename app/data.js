// Aldermere National Statistics Office — published figures.
// Every series below is the Office's own published series; the source line
// printed under each chart and table names the publication and the year.
// Aldermere is a fictional country: these figures are invented for this
// demonstration site and do not describe any real country.

const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

const SRC = {
  yearbook: 'National Statistical Yearbook 2025, Aldermere National Statistics Office',
  pop: 'Population Estimates, 2025 edition, Aldermere National Statistics Office',
  accounts: 'National Accounts, 2025 edition, Aldermere National Statistics Office',
  labour: 'Labour Force Survey, Q4 2025, Aldermere National Statistics Office',
  prices: 'Consumer Price Index, December 2025, Aldermere National Statistics Office',
  regions: 'Regional Statistics, 2025 edition, Aldermere National Statistics Office',
  trade: 'External Trade Statistics, 2025, Aldermere National Statistics Office',
  census: 'Census 2024 — First Results, Aldermere National Statistics Office',
};

const DATA = {
  country: {
    name: 'Aldermere',
    fullName: 'Republic of Aldermere',
    capital: 'Kingsford',
    areaKm2: 184620,
    currency: 'alder (ALD)',
    office: 'Aldermere National Statistics Office',
  },

  // Headline indicators, 2019-2025.
  population: { label: 'Resident population', unit: 'million', values: [8.02, 8.09, 8.15, 8.22, 8.29, 8.36, 8.42], source: SRC.pop },
  gdpNominal: { label: 'Gross domestic product', unit: '$ billion', values: [312.4, 298.7, 331.5, 362.8, 381.2, 396.9, 412.6], source: SRC.accounts },
  gdpGrowth: { label: 'Real GDP growth', unit: '% per year', values: [2.1, -3.8, 5.4, 4.2, 2.9, 2.6, 2.4], source: SRC.accounts },
  unemployment: { label: 'Unemployment rate', unit: '% of labour force', values: [5.6, 7.9, 6.8, 5.4, 4.8, 4.4, 4.1], source: SRC.labour },
  cpi: { label: 'Consumer price inflation', unit: '% per year', values: [1.8, 0.9, 2.6, 5.1, 4.2, 2.9, 2.3], source: SRC.prices },
  medianIncome: { label: 'Median household income', unit: '$ per year', values: [51200, 51900, 53400, 55200, 56600, 57800, 58400], source: SRC.yearbook },
  lifeExpectancy: { label: 'Life expectancy at birth', unit: 'years', values: [80.1, 80.0, 80.4, 80.8, 81.0, 81.2, 81.4], source: SRC.census },

  // Vital events, 2025.
  vital: [
    { label: 'Live births', value: 84200, note: '10.0 per 1,000 residents' },
    { label: 'Deaths', value: 71600, note: '8.5 per 1,000 residents' },
    { label: 'Natural increase', value: 12600, note: 'Births minus deaths' },
    { label: 'Net migration', value: 12400, note: 'Arrivals minus departures' },
    { label: 'Marriages', value: 38900, note: '4.6 per 1,000 residents' },
  ],

  // Age structure, 2025 (% of population).
  ageGroups: [
    { label: 'Aged 0–14', value: 17.2, colour: '#2e7d6b' },
    { label: 'Aged 15–24', value: 11.9, colour: '#5aa892' },
    { label: 'Aged 25–54', value: 38.6, colour: '#d98a1f' },
    { label: 'Aged 55–64', value: 14.3, colour: '#c25e3a' },
    { label: 'Aged 65 and over', value: 18.0, colour: '#7a4a6e' },
  ],

  // Employment by sector, 2025 (% of employed persons).
  employmentBySector: [
    { label: 'Services', value: 71.4 },
    { label: 'Manufacturing', value: 13.8 },
    { label: 'Construction', value: 7.4 },
    { label: 'Agriculture & fishing', value: 4.9 },
    { label: 'Mining & energy', value: 2.5 },
  ],

  // GDP by sector, 2025 (% of gross value added).
  gdpBySector: [
    { label: 'Services', value: 68.9 },
    { label: 'Manufacturing', value: 16.2 },
    { label: 'Construction', value: 6.1 },
    { label: 'Agriculture & fishing', value: 2.4 },
    { label: 'Mining & energy', value: 6.4 },
  ],

  // Consumer price basket, annual change to December 2025.
  basket: [
    { label: 'Food & non-alcoholic drinks', weight: 15.2, change: 3.1 },
    { label: 'Housing, water & energy', weight: 24.6, change: 2.4 },
    { label: 'Transport', weight: 12.8, change: 1.2 },
    { label: 'Health', weight: 6.3, change: 2.9 },
    { label: 'Education', weight: 3.1, change: 3.4 },
    { label: 'Recreation & culture', weight: 9.4, change: 1.9 },
    { label: 'Clothing & footwear', weight: 5.7, change: 0.7 },
    { label: 'Restaurants & hotels', weight: 8.9, change: 2.6 },
    { label: 'Energy (fuel & electricity)', weight: 7.5, change: -0.8 },
    { label: 'Other goods & services', weight: 6.5, change: 1.8 },
  ],

  // Regions, 2025.
  regions: [
    { name: 'Centralia', capital: 'Kingsford', population: 2.41, gdpPerCapita: 61200, unemployment: 3.4, income: 68400, growth: 2.9 },
    { name: 'Southport', capital: 'Harbourton', population: 1.86, gdpPerCapita: 53800, unemployment: 3.9, income: 62300, growth: 2.7 },
    { name: 'Eastvale', capital: 'Millbrook', population: 1.52, gdpPerCapita: 47100, unemployment: 4.2, income: 56900, growth: 2.3 },
    { name: 'Northgate', capital: 'Dunmere', population: 1.18, gdpPerCapita: 44900, unemployment: 4.6, income: 54100, growth: 2.1 },
    { name: 'Westmoor', capital: 'Cairnwell', population: 0.93, gdpPerCapita: 42800, unemployment: 4.8, income: 52200, growth: 1.9 },
    { name: 'Highlands', capital: 'Tarnwick', population: 0.52, gdpPerCapita: 38600, unemployment: 5.2, income: 49800, growth: 1.6 },
  ],

  // External trade, 2025.
  trade: {
    exports: 186.2,
    imports: 171.8,
    partners: [
      { partner: 'Meridia', exports: 34.1, imports: 29.8 },
      { partner: 'Ostara', exports: 27.6, imports: 31.2 },
      { partner: 'Caldonia', exports: 21.9, imports: 18.4 },
      { partner: 'Vesper Isles', exports: 15.3, imports: 12.7 },
      { partner: 'Rest of world', exports: 87.3, imports: 79.7 },
    ],
    topExports: [
      { item: 'Machinery & transport equipment', value: 58.4 },
      { item: 'Pharmaceuticals', value: 31.2 },
      { item: 'Food & live animals', value: 24.6 },
      { item: 'Chemicals', value: 19.8 },
      { item: 'Timber & paper products', value: 14.7 },
    ],
  },

  // Labour market detail, 2025.
  labour: {
    labourForce: 4.31,
    employed: 4.13,
    unemployed: 0.177,
    participation: 68.9,
    youthUnemployment: 9.6,
    vacancies: 98400,
    averageWeeklyHours: 36.4,
    averageWeeklyEarnings: 1124,
  },

  // Upcoming releases.
  releases: [
    { date: '2026-01-15', title: 'Labour Force Survey, December 2025' },
    { date: '2026-01-29', title: 'Consumer Price Index, January 2026' },
    { date: '2026-02-12', title: 'National Accounts, Q4 2025 (first estimate)' },
    { date: '2026-02-26', title: 'Population Estimates, 2026 edition' },
    { date: '2026-03-11', title: 'Regional Statistics, 2026 edition' },
    { date: '2026-03-25', title: 'External Trade Statistics, February 2026' },
  ],

  // Headline news items shown on the home page.
  news: [
    { date: '2025-12-18', title: 'Economy grew 2.4% in 2025', text: 'Real GDP rose 2.4% in 2025, with services up 3.1% and manufacturing up 1.8%. GDP per head reached $48,980.' },
    { date: '2025-12-11', title: 'Unemployment falls to 4.1%, lowest since 2019', text: 'The unemployment rate fell to 4.1% in the year to November 2025. Vacancies stood at 98,400, the highest since the series began in 2019.' },
    { date: '2025-12-04', title: 'Inflation eases to 2.3% in November', text: 'Consumer prices rose 2.3% over the year to November 2025, down from 2.9% in October. Energy prices fell 0.8% over the year.' },
    { date: '2025-11-27', title: 'Population reaches 8.42 million', text: 'The resident population grew by 60,000 in 2025, to 8.42 million. Net migration contributed 12,400 and natural increase 12,600.' },
  ],
};

// Value of a series in a given year.
function seriesValue(series, year) {
  const i = YEARS.indexOf(year);
  return i < 0 ? null : series.values[i];
}

// Year-on-year change of a series, in percentage points or percent.
function yoyChange(series, year) {
  const i = YEARS.indexOf(year);
  if (i <= 0) return null;
  const prev = series.values[i - 1];
  const cur = series.values[i];
  return ((cur - prev) / Math.abs(prev)) * 100;
}

// Format helpers used by the pages.
function fmt(n, decimals) {
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals == null ? 0 : decimals,
    maximumFractionDigits: decimals == null ? 0 : decimals,
  });
}

function fmtSigned(n, decimals) {
  return (n >= 0 ? '+' : '') + fmt(n, decimals);
}
