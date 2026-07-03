# SCHEMA.md — quick SQL reference

Six tables. Read-only for the agent. All identifiers `public.<table>`.

## `service_points`  — physical network (8 rows)
| column | type | notes |
| --- | --- | --- |
| `id` | text PK | slug, e.g. `zh-sihlpost` |
| `name` | text | full name |
| `kind` | text | `filiale` \| `agentur` \| `mypost24` \| `business_center` |
| `canton` | text | 2-letter code |
| `city` / `postal_code` | text | |
| `opens_mon_fri` / `opens_sat` / `opens_sun` | text | `"HH:MM-HH:MM"` |
| `services` | text[] | `{parcel,letter,cash,id_check,packstation}` |
| `weekly_visits_k` | numeric | thousands / week |
| `on_time_pct` | numeric | 0-100 SLA |
| `lat` / `lng` | numeric | |
| `status` | text | `active` \| `temporarily_closed` \| `closed` |

## `customers` — billed principals (8 rows)
| column | type | notes |
| --- | --- | --- |
| `id` | text PK | |
| `name` | text | |
| `segment` | text | `pk` \| `kmu` \| `gk` |
| `industry` / `primary_canton` | text | |
| `monthly_volume_k` | numeric | k shipments / month |
| `annual_revenue_chf` | numeric | |
| `is_key_account` | boolean | |
| `contract_status` | text | `active` \| `at_risk` \| `renewal_due` \| `churned` |
| `churn_risk_score` | numeric | 0-100 |

## `tariffs` — service catalog (10 rows)
| column | type | notes |
| --- | --- | --- |
| `id` | text PK | |
| `service` | text | `a_post` \| `b_post` \| `postpac_priority` \| `postpac_economy` \| `assured` |
| `service_label` | text | customer-facing name |
| `format` | text | `letter` \| `parcel` \| `oversize` |
| `weight_from_g` / `weight_to_g` | integer | grams |
| `price_chf` | numeric | |
| `transit_days_target` | integer | 1 for Priority, 3 for Economy |
| `is_domestic` | boolean | |
| `effective_from` | date | |

## `shipments` — parcels + letters (~30 rows)
| column | type | notes |
| --- | --- | --- |
| `id` | text PK | tracking number |
| `customer_id` | text FK | → `customers.id` |
| `tariff_id` | text FK | → `tariffs.id` |
| `origin_sp_id` | text FK | → `service_points.id` |
| `destination_canton` / `destination_city` | text | |
| `weight_g` | integer | |
| `status` | text | `lodged` \| `in_transit` \| `out_for_delivery` \| `delivered` \| `returned` \| `delayed` |
| `lodged_at` / `delivered_at` | timestamptz | |
| `delayed_reason` | text | `weather` \| `staffing` \| `address_issue` \| `customs` \| `other` \| NULL |
| `is_on_time` | boolean | |
| `service_label` | text | denormalized |

## `service_disruptions` — active operational issues (5 rows)
| column | type | notes |
| --- | --- | --- |
| `id` | text PK | |
| `headline` | text | |
| `cause` | text | `weather` \| `strike` \| `road_closure` \| `it_incident` \| `branch_closed` |
| `cantons` | text[] | affected cantons |
| `postal_codes` | text[] | |
| `severity` | text | `low` \| `medium` \| `high` \| `critical` |
| `started_at` / `expected_end` | timestamptz | |
| `status` | text | `active` \| `monitoring` \| `resolved` |
| `impact_summary` | text | short prose |
| `affected_services` | text[] | |

## `service_pages` — editorial source items (15 rows)
| column | type | notes |
| --- | --- | --- |
| `id` | text PK | |
| `category` | text | `tariffs` \| `disruptions` \| `how_to` \| `holidays` \| `product_launch` \| `policy` |
| `headline` | text | |
| `source` | text | `internal_ops` \| `pr` \| `product` \| `disruption_desk` |
| `status` | text | `incoming` \| `drafting` \| `in_review` \| `published` |
| `priority` | text | `low` \| `medium` \| `high` |
| `relevance_pct` | numeric | 0-100 |
| `published_at` | timestamptz | nullable |
| `summary` | text | |
| `related_disruption_id` | text FK | → `service_disruptions.id` |
| `related_tariff_id` | text FK | → `tariffs.id` |

## Frequent joins

```sql
-- Shipments with customer + tariff + origin
SELECT s.id, c.name AS customer, t.service_label, sp.name AS origin, s.status
FROM public.shipments s
JOIN public.customers c ON c.id = s.customer_id
JOIN public.tariffs   t ON t.id = s.tariff_id
JOIN public.service_points sp ON sp.id = s.origin_sp_id;

-- Editorial backlog joined with cause context
SELECT p.id, p.headline, p.status, p.priority, d.cause, d.severity
FROM public.service_pages p
LEFT JOIN public.service_disruptions d ON d.id = p.related_disruption_id
WHERE p.status IN ('incoming', 'in_review')
ORDER BY p.priority DESC, p.relevance_pct DESC NULLS LAST;
```
