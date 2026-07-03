# DATA.md — Swiss Post dataset

## What's in the demo dataset

| Table | Rows | Notes |
| --- | --- | --- |
| `service_points` | 8 | Real Swiss Post locations by name (Sihlpost, Schanzenpost, Rive, St-François, Aeschenplatz, Lugano Stazione, plus one My Post 24 at Flughafen Zürich). Coordinates approximate. Opening hours representative but not authoritative. |
| `customers` | 8 | Names refer to real Swiss businesses (Digitec Galaxus, Zalando CH, Migros, Coop, Nestlé Suisse, ABB Schweiz, PostFinance, BRACK.CH). Volumes, revenue and churn scores are **synthetic** for demo. |
| `tariffs` | 10 | Service names correspond to real Swiss Post products (A-Post, B-Post, PostPac Priority/Economy, Assured). Prices are illustrative — do not quote as authoritative. |
| `shipments` | ~30 | Fully synthesized. Tracking IDs follow the `PP-2026-######` shape. Mix of statuses to make the operational queries interesting. |
| `service_disruptions` | 5 | Fully synthesized. Cover weather, strike, road closure, IT incident and branch closure — one of each so the delay-cause axis has variance. |
| `service_pages` | 15 | Fully synthesized editorial source items. Spread across incoming / drafting / in_review / published statuses so the review-workflow demo has material. |

## Honesty in the demo

- All charts and tables the agent produces come from `query_database`. If the DB
  is unavailable the agent will say so — no fallback fabrication.
- The Kundenservice persona is instructed not to speculate on delivery times
  beyond the tariff's transit target when an active disruption applies without
  a resolved `expected_end`.
- The Kommunikation persona is instructed to flag contradictions between
  `service_disruptions.expected_end` and `service_pages.summary` rather than
  silently reconciling them.

## Swapping in real data

The load-bearing thing about this dataset is the **shape**, not the rows. To
run the harness against a real Post CH dataset:

1. Preserve the six table names and column names in `schema/001_init.sql`.
2. Replace `seed/index.mjs` with an ingest script pointed at your source system.
3. Re-run `pnpm semantic:build` — it regenerates `entities/*.yml` profile fields
   (distinct counts, sample values) from the live database.
4. The personas, glossary, catalog and metrics carry over unchanged.

## Known simplifications vs real Post CH

- No cross-border services in this dataset (`tariffs.is_domestic = true` throughout).
- No PostFinance banking entities — PostFinance is present only as a customer row.
- No package-locker (My Post 24) reservation state — only presence + hours.
- No employee dimension. Adding one would enable the internal HR / policy agent
  layer that Kim Kordel's Agent Factory covers today; it's an obvious extension.
