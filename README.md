[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/sage-otter-44/best-national-statistics-site-20261126-0539-entry/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/sage-otter-44/best-national-statistics-site-20261126-0539-entry/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# Aldermere National Statistics

The official statistics site of the Republic of Aldermere — a fictional
country, invented for this entry. Population, economy, employment, prices
and regions, each with its source publication and reference year printed
beside the figure.

## What it is

A working national statistics site that runs entirely offline from static
files: open `app/index.html` in a desktop browser or on a phone and every
page, chart and control works with no network request.

- **Overview** — headline indicators for 2019–2025, latest releases and the
  release calendar, with a year selector.
- **Population** — population trend, age-structure donut, vital events and a
  sortable regional table.
- **Economy** — GDP line/bar toggle, real growth, GDP by sector and trade by
  partner (sortable).
- **Employment** — unemployment trend, employment by sector, regional
  unemployment (sortable).
- **Prices** — CPI inflation trend, price changes by basket group and the full
  CPI basket table (sortable).
- **Regions** — six regions compared on any measure (GDP per head,
  population, unemployment, median income, growth) with a chart and a
  sortable table.
- **About** — sources, methods in brief and contact.

Every chart is hand-drawn SVG (no chart library): line, bar, horizontal
bar and donut charts, all built from the data in `app/data.js`.

## Files

- `app/index.html` — the page shell: masthead, navigation, footer.
- `app/style.css` — the site's own design: deep pine green, warm paper,
  amber accent; responsive down to a phone.
- `app/data.js` — every published figure, with its source and year.
- `app/charts.js` — hand-written SVG line, bar, horizontal-bar and donut
  charts.
- `app/pages.js` — one render function per section.
- `app/main.js` — hash router, year/chart/metric controls, table sorting.
- `main.ts` — the entry program (Node 22, standard library only): copies
  `app/` and `screenshots/` to `/output` and writes `dossier.json` with
  `buildDossier` from `vendor/makefun-frontend.ts`.
- `screenshots/` — real renders of the site in a browser.

## Run it

```sh
# Serve the site locally and open http://localhost:8080
node serve.ts
# or: python3 -m http.server 8080 --directory app

# Build the hand-in
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
