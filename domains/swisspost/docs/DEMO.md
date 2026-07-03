# DEMO.md — Swiss Post run-of-show

A 12–15 minute walk-through of the three personas on one harness. Land the
"invest once in the foundation, not ten times in point solutions" message.

## Setup (before you start)

- `pnpm domain:use swisspost && pnpm domain:ingest && pnpm dev`
- Open two tabs: `/` (customer surface) and `/harness` (the anatomy).
- Have Swiss Post's Agent Factory story on Copilot Studio ready as the contrast.

## 0 · The frame (60s)

> "Swiss Post's Agent Factory is your Copilot-Studio bet on
> the many-agents future. That's the right instinct — the risk is that each
> agent ships with its own prompts, its own glue code, its own data plumbing,
> and rots on its own schedule. Vercel's alternative is one harness underneath
> — same model, same sandbox, same semantic layer — that many agents compose
> against. Let me show you what that looks like for your data."

## 1 · Kundenservice — read-only (3–4 min)

Open the app. Persona = **Kundenservice**.

Turns to run:
- "Wie viele Priority-Pakete sind heute in Zustellung? Bau ein Dashboard nach Kanton."
- "Welche Filialen in Zürich haben nach 18:00 offen und bieten Bargeldbezug?"
- "Vergleiche A-Post und PostPac Priority nach Preis und Laufzeit für 500g."
- "Wo gibt es aktuell Zustellstörungen?"

Point at the trace panel:
> "Every step is grepping the semantic layer at `/workspace/semantic-layer/`
> then issuing one SQL read. This is the 'we removed 80% of our agent's tools'
> pattern — the model reads the docs and writes the query, so the agent gets
> smarter every time you add a row to the semantic layer."

## 2 · Filiale / KAM — write, saveable artifacts (3–4 min)

Switch persona to **Filiale**. Same model, same sandbox — different skills and
write tools switched on.

Turns to run:
- "Erstelle ein Account-Briefing für Digitec Galaxus mit Volumen, SLA und Risiken — dann speichern."
- "Watchlist der 8 grössten Geschäftskunden nach Volumen für Q4 mit Snapshot der SLA. Speichern."
- "Welche Kunden liegen bei churn_risk_score > 40? Rank nach annual revenue."

Point at `save_report` and `save_watchlist`:
> "The write surface is intentionally small — three tools. The model can't
> write to shipments or customers. But it can create durable artifacts that
> your KAMs iterate against. That's your governance boundary, in code."

## 3 · Kommunikation — durable editorial workflow (4–5 min)

Switch persona to **Kommunikation**. Now the durable workflow lights up.

Turns to run:
- "Entwirf eine Kundeninformation aus der Störung dsr-2026-01."
- Open the trace tab: point at the workflow **suspending** — Fluid Compute at 0.
- "Als Redakteur: das ist gut, publiziere es."
- Workflow resumes from the exact step, `publish_article` runs.
- "Welche Drafts stecken aktuell im Review?"

Then:
> "This is the piece Copilot Studio doesn't give you. A draft parked in a
> durable state, compute at zero while it waits for a human, resumes on the
> exact step when approval arrives. This is the editorial governance layer
> Christina Meyer's ethics work assumes — human-in-the-loop as an
> architectural default, not a bolt-on."

## 4 · The anatomy (2 min)

Open `/harness`. Walk through:
- 9 primitives → your Agent Factory, only headless.
- Semantic layer of 6 entities → the compounding asset.
- Three personas → three "products" for zero incremental infra.

Land:
> "Every new team at Swiss Post that wants an agent — HR, procurement,
> operations, PostFinance — is a folder of files against this same harness.
> Not a new stack, not a new procurement cycle, not a new SOC audit. That is
> the business case."

## 5 · What to leave behind

- Link to the deployed demo.
- Screenshot of `/harness` slide.
- One-line offer: "We can stand up a Neon + this harness against a small
  Swiss Post dataset of your choice in a design-partner sprint. Two weeks."
