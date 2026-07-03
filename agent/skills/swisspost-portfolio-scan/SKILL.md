---
description: Scan the Swiss Post customer portfolio — volume by segment/industry, revenue concentration, at-risk customers, churn signals, and canton distribution. Use when the user asks about the book of business, "welche Kunden sind at risk", "Umsatz nach Branche", "Top-Kunden nach Volumen", "wo verlieren wir", "pacing", or portfolio-level comparisons.
---

# Portfolio scan

Analytical view across the entire `customers` book (optionally joined to `shipments`),
not a single-account briefing. If the user names one customer, redirect to
`swisspost-account-briefing` instead.

## Tools

- `customers` for the book: `segment`, `industry`, `primary_canton`, `monthly_volume_k`,
  `annual_revenue_chf`, `is_key_account`, `contract_status`, `churn_risk_score`.
- `shipments` for actuals: trailing count, on-time rate, delay causes.
- `metrics.on_time_rate`, `metrics.at_risk_customer_count`, `metrics.revenue_by_industry`
  for the canonical KPIs.

## Playbook

- **"Umsatz nach Branche" / "Revenue by industry"** →
  ```sql
  SELECT industry, SUM(annual_revenue_chf) AS revenue_chf,
         COUNT(*) AS customer_count
  FROM public.customers
  GROUP BY 1 ORDER BY revenue_chf DESC;
  ```
- **"Top-Kunden nach Volumen"** → order `customers` by `monthly_volume_k DESC`,
  optionally filter `segment = 'gk'` or `is_key_account = true`.
- **"Welche Kunden sind at risk"** →
  filter `contract_status = 'at_risk' OR churn_risk_score > 40`.
  Rank by `annual_revenue_chf DESC` so the biggest exposures come first.
- **"Volumen-Rückgang / pacing"** → join `customers` to `shipments`; compare last 30 days
  to prior 30 days by counting shipments per customer. Surface anyone with a > 20% drop.
- **"Konzentrations-Risiko"** → what share of total book revenue sits in the top 3 customers.
  Use `annual_revenue_chf` sum.

## Output

Lead with the answer or the risk. Add a compact table (customer × industry × metric).
State the pp / % delta plainly. Attribute nothing to Swiss Post's account
teams — this is diagnostic data, not commentary. Cite figures in Swiss format
(`1'234'567 CHF`, `12.5%`). All 2026 figures are demo-grade.
