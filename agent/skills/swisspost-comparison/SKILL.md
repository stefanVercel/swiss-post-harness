---
description: Compare two or more Swiss Post entities side by side — customer vs customer, branch (Filiale) vs branch, or tariff vs tariff. Use when the user says "vergleiche", "compare", "X vs Y", "welcher/welche ist besser", or asks for a head-to-head on the same axes.
---

# Vergleich / Comparison

Pull the entities from the relevant table and render a two-column (or N-column)
comparison. Never mix entity types (customer vs branch = don't do that).

## Comparing customers

Base row from `customers` for each — compare:
`segment`, `industry`, `primary_canton`, `is_key_account`, `contract_status`,
`monthly_volume_k`, `annual_revenue_chf`, `churn_risk_score`.

Then a trailing-30-day operational compare via `shipments`:

```sql
SELECT customer_id,
       COUNT(*)                                                       AS shipments_30d,
       ROUND(100.0 * AVG(CASE WHEN is_on_time THEN 1 ELSE 0 END), 1) AS on_time_pct,
       COUNT(*) FILTER (WHERE status = 'delayed')                     AS delayed_count
FROM public.shipments
WHERE customer_id IN ('<a>', '<b>')
  AND lodged_at >= now() - interval '30 days'
GROUP BY customer_id;
```

## Comparing branches (service_points)

Base row from `service_points` — compare:
`kind`, `canton`, `services`, opening-hour buckets, `weekly_visits_k`, `on_time_pct`, `status`.

Then a shipment-origin compare via `shipments.origin_sp_id` for volume and delay causes.

## Comparing tariffs

Rows from `tariffs` filtered to the same `weight_from_g`/`weight_to_g` band or the
same `format`. Compare `price_chf` and `transit_days_target`. Never compare across
formats without saying so (a letter tariff vs a parcel tariff is apples-to-oranges).

## Output

- Compact two-column comparison table with the axes above.
- One paragraph of verdict — where each is stronger, where risk sits, where they
  overlap. No superlatives without numbers.
- CHF in Swiss format (`1'234.50 CHF`), percentages to one decimal.
