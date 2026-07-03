---
name: swisspost-service-page-drafter
description: Draft a post.ch service page from a `service_pages` row (with joined context on `service_disruptions` and `tariffs`) for editorial review. Use when the Kommunikation persona asks to entwerf/draft/verfasse a Kundeninformation, Service-Meldung, Störungs-Update, Tarif-Ankündigung or Feiertags-Fahrplan — OR when the durable editorial workflow asks headlessly (`surface: "workflow"`) for the first revision on a draft shell.
---

# Service-Page-Drafter

## Steps

1. **Read the source.** In the workflow surface the facts are passed inline. In chat,
   query `service_pages` by id, then join to `service_disruptions` (if
   `related_disruption_id` is set) or `tariffs` (if `related_tariff_id` is set)
   for context. Do not invent facts or quotes.
2. **One optional colour query.** If it sharpens the piece (e.g. how many shipments
   are affected by this disruption, or what the previous tariff price was), run ONE
   read-only SQL. Otherwise skip.
3. **Structure the `ArticlePayload`:**
   - `headline` — what changes for the customer, in customer language, ≤ 80 chars.
   - `dek` — one-sentence summary.
   - `lede` — 1–2 sentences: what, since when, until when.
   - `body` — 2–4 short paragraphs: what is affected, what the customer should do,
     where to check for updates.
   - `keyFacts` — bullet list of the load-bearing data points (with unit + source).
   - `relatedIds` — `service_pages.id`, `service_disruptions.id` and/or `tariffs.id`
     that you used.
4. **Write the draft:**
   - **Workflow surface:** call `create_article_revision` with
     `{ draftId, payload, changeSummary: "Initial draft from service_pages source" }`.
     Write exactly ONE revision, then stop. Do not ask for approval.
   - **Chat surface:** call `create_article_draft` with the full payload and
     `sourceRumorId` (= the `service_pages.id`). Wait for the editor's approval.

## Style

post.ch service voice: **klar, sachlich, kundenfreundlich**. Swiss standard German
by default (switch on user cue or if the source row is French / Italian). Numbers in
Swiss format (`1'234.50 CHF`, `12.5%`). Never invent quotes, future dates, or
promises. If `service_disruptions.expected_end` disagrees with the source page's
`summary`, flag it in `changeSummary` rather than silently reconciling.

## What to avoid

- PR-Sprache. "Wir freuen uns" gehört nicht in eine Störungs-Meldung.
- Speculation about causes not stated in `service_disruptions.impact_summary`.
- Exposing internal-only fields (customer revenue, churn score) in a customer-facing page.
- Publishing directly from chat — always route through the editorial-review workflow.
