# Swiss Post Semantic Layer (2026)

**This directory contains definitions only — no row data.** All rows live in Neon Postgres.
The agent grounds here first, then queries the database with `query_database`.

## Source hierarchy (read in this order)

1. `catalog.yml` — discover entities and sample questions.
2. `metrics.yml` — canonical KPI definitions with SQL hints.
3. `glossary.yml` — bilingual DE/EN terminology (A-Post, PostPac Priority, GK/KMU, on-time rate, etc.).
4. `entities/*.yml` — full schema, joins, profiled sample values.
5. `guides/*.md` — domain playbooks (delivery operations, service catalog).
6. `SCHEMA.md` — quick SQL reference.
7. **`query_database`** — read-only SQL against Neon (the only data path for rows).

## Layout

| Path | Purpose |
| --- | --- |
| `catalog.yml` | Entity inventory |
| `metrics.yml` | Canonical KPI definitions |
| `glossary.yml` | Bilingual DE/EN terms |
| `entities/` | Per-table schema + profiled sample values |
| `guides/` | Domain playbooks |
| `SCHEMA.md` | SQL quick reference |

## How to explore (sandbox)

```bash
cat /workspace/semantic-layer/catalog.yml
grep -i "on-time" /workspace/semantic-layer/glossary.yml
cat /workspace/semantic-layer/entities/shipments.yml
```

Then run SQL via `query_database`. Never invent numbers — if the DB is unavailable, say so.

> **Dataset:** 8 service points across ZH/BE/VD/GE/BS/TI, 8 customers (GK + KMU across
> e-commerce/retail/CPG/industrial/finance), 10 tariff rows spanning A-Post/B-Post/
> PostPac Priority/Economy/Assured, ~30 shipments in mixed statuses, 5 active or
> resolved disruptions, and 15 service-page source items across
> tariffs/disruptions/how-to/holidays/product-launch/policy categories.
> All figures synthesized for demo purposes — customer names refer to real
> Swiss businesses but volumes and CHF numbers are illustrative.
