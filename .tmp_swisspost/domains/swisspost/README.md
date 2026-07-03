# Swiss Post domain pack — full drop-in

A drop-in domain for the Vercel Eve intelligence-harness (the same repo that powers
the FC Bayern and P7S1 demos). Three personas — **Kundenservice**, **Filiale / KAM**,
**Kommunikation** — on one shared harness, with five Swiss Post-specific skills
alongside the shared toolkit.

## Drop it in

From the root of the harness repo (`github.com/stefanVercel/P7S1harness` or its
FC Bayern equivalent), extract this bundle. It contains two subtrees:

```
domains/swisspost/        # the domain pack — self-contained
agent/skills/swisspost-*  # five new Swiss Post-flavored skills (non-destructive)
```

Both drop into the existing repo. Nothing existing gets overwritten — the P7S1 and
FC Bayern demos keep working.

```bash
# 1. Extract into the repo root (both subtrees land in place)
unzip ~/Downloads/swisspost-bundle.zip -d /path/to/harness-repo/

# 2. Add brand assets
mkdir -p public/domains/swisspost
# drop Swiss Post logo / favicon / OG image in public/domains/swisspost/

# 3. Validate the config, then activate
pnpm domain:validate swisspost
pnpm domain:use swisspost

# 4. Ingest schema + seed into Neon (needs DATABASE_URL)
pnpm domain:ingest

# 5. Regenerate the profiled semantic layer
pnpm semantic:build

# 6. Run it
pnpm dev
```

Open `http://localhost:3000`, pick a persona, ask a question.

## What you get

| Persona | Slug | Write | Skills |
| --- | --- | --- | --- |
| Kundenservice | `kundenservice` | read-only | build-rich-answers, render-dashboard, swisspost-comparison |
| Filiale / KAM | `filiale` | save_report, save_watchlist, refresh_watchlist | swisspost-account-briefing, swisspost-portfolio-scan, swisspost-comparison, watchlist |
| Kommunikation | `kommunikation` | full editorial write set | swisspost-service-page-drafter, swisspost-service-page-reviser, digest, build-rich-answers |

## The five Swiss Post skills

Written specifically for the Swiss Post data model — no leftover Joyn / CPM / player
vocabulary. Live under `agent/skills/` alongside the shared skills. The FC Bayern
and P7S1 domains keep using their originals; only the swisspost domain reaches for
these.

| Skill | Purpose |
| --- | --- |
| `swisspost-account-briefing` | KAM/Filiale briefing on one business customer. Snapshot + service mix + SLA vs network + delay causes + risk callout + verdict. Ends with `save_report`. |
| `swisspost-portfolio-scan` | Portfolio-level analysis across the customer book: revenue by industry, top volume, at-risk customers, concentration risk, pacing trends. |
| `swisspost-comparison` | Two-column side-by-side: customer vs customer, branch vs branch, or tariff vs tariff — same axes, no cross-entity comparison. |
| `swisspost-service-page-drafter` | Draft a post.ch service page from a `service_pages` row + joined disruption / tariff context. Runs on both chat and workflow surfaces. |
| `swisspost-service-page-reviser` | Minimal, granular revisions from editor feedback using the sugar tools (`set_headline`, `revise_text`, etc.). |

## Shared skills used as-is

`build-rich-answers`, `render-dashboard`, `digest`, and `watchlist` are already
domain-agnostic — they get reused verbatim.

## What's in the domain pack

```
domains/swisspost/
  domain.config.ts           # entry point (references swisspost-* skills)
  schema/
    001_init.sql             # 6 core tables
    002_artifacts.sql        # reports/watchlists/drafts/digests/workflows
    003_editorial_v2.sql     # revision ledger + feedback thread
  seed/index.mjs             # synthetic seed (~85 rows across 6 tables)
  personas/                  # kundenservice / filiale / kommunikation
  semantic-layer/            # catalog + metrics + glossary + 6 entities + 2 guides + SCHEMA.md
  docs/                      # ARCHITECTURE / DEMO / DATA
```

See `docs/ARCHITECTURE.md` for how it wires into the harness and `docs/DEMO.md`
for a 12–15 min run-of-show against a Swiss Post buyer.
