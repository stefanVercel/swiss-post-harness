# Service Catalog Guide

How the agent explains Swiss Post services and picks the right one for a customer scenario.

## The five domestic services

| Service | Format | Transit target | Positioning |
| --- | --- | --- | --- |
| **A-Post** | letter | 1 working day | Priority letters. Default for time-sensitive correspondence. |
| **B-Post** | letter | 3 working days | Economy letters. Bulk mailings, invoices, non-urgent. |
| **PostPac Priority** | parcel | 1 working day | Priority parcels. E-commerce, urgent B2B. |
| **PostPac Economy** | parcel | 3 working days | Economy parcels. Bulk fulfillment, returns. |
| **Assured** | parcel | 1 working day + signature | Insured parcels with signature; use for high-value goods. |

## Weight bands

Letters ladder up to 1 000 g, parcels to 30 000 g (Assured). Always join
`shipments` to `tariffs` on `tariff_id` to get both service and band in one query
instead of computing the band from `weight_g` after the fact.

## Choosing rules of thumb

- **Urgency wins.** If the customer says "morgen" or "übermorgen" → Priority.
- **Volume + no urgency → Economy.** Cost delta is meaningful at scale.
- **Value > CHF 500 → Assured.** Signature + insurance offsets loss risk.
- **International:** not in the current demo dataset (`is_domestic = true` only).

## Answering shape (Filiale / KAM)

For a business-customer briefing question:

1. **Their service mix.** `GROUP BY tariff.service_label` on the customer's shipments.
2. **Their SLA vs the network.** Compare their `on_time` rate to the fleet-wide
   average from the on_time_rate metric.
3. **Their volume trend proxy.** Use `customers.monthly_volume_k` and, where the
   dataset supports it, a `COUNT(*)` on shipments in the last 30 days.
4. **Risk callout.** Surface `contract_status` and `churn_risk_score`. If
   at_risk or score > 40, that's the headline.

## Answering shape (Kommunikation)

When drafting a service-page article from a tariff change:

- Lead with what changes for the customer (new price, new band).
- Cite the tariff row (id and effective_from) as the source.
- No speculation on future changes.
- Always propose a headline, dek, and 2-4 paragraphs — the article-drafter skill
  expects that shape.
