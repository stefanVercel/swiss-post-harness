# Architecture — Swiss Post domain pack

This domain pack turns the Vercel Eve harness into a **Swiss Post intelligence agent**.
Three personas, one shared runtime, one semantic layer.

## The domain pack

```
domains/swisspost/
  domain.config.ts           # entry point — satisfies DomainConfig contract
  schema/001_init.sql        # 6 tables in Neon Postgres
  seed/index.mjs             # synthetic seed (called by pnpm domain:ingest)
  semantic-layer/            # YAML + Markdown synced into agent sandbox
    catalog.yml
    metrics.yml
    glossary.yml
    entities/*.yml           # 6 entity files
    guides/*.md              # 2 domain guides
    SCHEMA.md
    README.md
  personas/
    kundenservice.md         # read-only customer service
    filiale.md               # frontline / KAM with saveable reports + watchlists
    kommunikation.md         # post.ch editorial with durable review workflow
  docs/
    ARCHITECTURE.md          # this file
    DEMO.md                  # run-of-show
    DATA.md                  # dataset notes
```

## Three personas — same harness

| Persona | Read/Write | Skills | Write tools |
| --- | --- | --- | --- |
| **Kundenservice** | read-only | build-rich-answers, render-dashboard, squad-comparison | — |
| **Filiale / KAM** | write (artifacts only) | scouting-report, transfer-market-analysis, squad-comparison, watchlist | save_report, save_watchlist, refresh_watchlist |
| **Kommunikation** | write (editorial) | article-drafter, article-reviser, digest, build-rich-answers | create/update/publish article, revisions, set_headline, set_dek, revise_text, add_pull_quote, add_source, list_article_revisions, save_digest |

Same model (`anthropic/claude-opus-4.8` via AI Gateway), same sandbox, same
semantic layer. Only the skills and write tools differ. That is the entire
"one harness, many agents" point.

## What plugs into what

- **AI SDK** — model loop + tool calling (`agent/agent.ts`).
- **AI Gateway** — one endpoint, no keys.
- **Vercel Sandbox** — ephemeral microVM per turn; the semantic layer mounts at
  `/workspace/semantic-layer/`.
- **Workflow SDK** — durable editorial-review workflow (`workflows/editorial-review.ts`)
  for the Kommunikation persona.
- **Fluid Compute** — turns scale to zero while a review is suspended.
- **Observability** — traces per step / tool / token.
- **Vercel Connect** — scoped short-lived credentials to Neon.
- **Vercel Security** — BotID today; Passport for identity-aware access next.
- **AI Elements + json-render** — streaming chat + generative UI blocks.

None of that changes when you swap FC Bayern → P7S1 → Swiss Post. Only this
domain folder does.

## Data flow

```
service_pages ──┐
                │
service_disruptions ──── related_disruption_id ──> service_pages
                                                       │
                                                       ▼
customers ── customer_id ──> shipments               article-drafter
                              │      │                    │
                              │      │                    ▼
tariffs ── tariff_id ─────────┘      │            editorial-review
                                     │             workflow (suspend)
service_points ── origin_sp_id ──────┘                   │
                                                          ▼
                                                       publish_article
```

Reads flow up: the model greps semantic-layer files, then issues a single
read-only SQL against the six tables. Writes are limited to `save_report`,
`save_watchlist`, and the article draft/revision/publish family — no writes
touch the source tables.
