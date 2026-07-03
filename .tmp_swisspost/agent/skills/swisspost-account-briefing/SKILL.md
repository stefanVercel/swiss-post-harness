---
description: Build an in-depth account briefing for one Swiss Post business customer (GK or KMU) — snapshot, service mix, SLA vs network, top delay causes, contract status, churn risk and a one-line verdict. Use when the user asks to "erstelle ein Account-Briefing", "brief mich auf Kunde X", "bereite ein KAM-Gespräch vor", "prep me for the meeting with X", or "how is Kunde Y performing".
---

# Account-Briefing (KAM / Filiale)

Produce a structured business-customer briefing. Follow `guides/service-catalog.md`
for the answering shape.

## Steps

1. **Frame the account.** Confirm which customer. Pull the base row from `customers`
   (segment, industry, is_key_account, contract_status, monthly_volume_k, annual_revenue_chf,
   churn_risk_score, primary_canton).
2. **Pull actuals.** Join to `shipments` for the trailing 30 days:
   - shipment count, distribution by `tariff.service_label`,
   - on-time rate on delivered rows,
   - top 3 delay causes from `shipments.delayed_reason`,
   - top destination cantons.
3. **Benchmark.** Compare the customer's on-time rate to the fleet-wide baseline
   from `metrics.on_time_rate`. Note the delta in percentage points.
4. **Assemble the briefing.** Structure below.

## Briefing shape

- **Objective:** what this briefing is for (renewal, escalation, quarterly review).
- **Snapshot:** name, segment (PK/KMU/GK), industry, primary canton, key-account flag,
  monthly volume (k), annual revenue (CHF), contract status.
- **Service mix (last 30d):** compact table — service_label × shipment count × share %.
- **SLA:** customer on-time rate vs network baseline; delta in pp. Say "over" or "under" plainly.
- **Delay signals:** top 3 delayed_reason values with counts. Attribute to Swiss Post or not
  per `guides/delivery-operations.md`.
- **Risk callout:** contract_status + churn_risk_score. If `at_risk` OR `score > 40`, lead with it.
- **Verdict:** one-line recommendation for the next action.

Cite CHF in Swiss format (`1'234'567 CHF`, `12.5%`). On save, call `save_report` (HITL)
with the structured payload. Never fabricate a figure the query didn't return.
