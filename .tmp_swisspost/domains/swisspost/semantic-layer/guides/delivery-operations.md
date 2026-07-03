# Delivery Operations Guide

How the agent should reason about SLA attainment, delay causes and canton logistics
when answering operational questions for the Kundenservice or Filiale persona.

## SLA reasoning

The on-time flag on `shipments.is_on_time` is authoritative for individual sendings.
For rate calculations:

```sql
SELECT
  100.0 * AVG(CASE WHEN is_on_time THEN 1 ELSE 0 END) AS on_time_pct,
  COUNT(*) AS delivered_count
FROM public.shipments
WHERE status = 'delivered';
```

- 95% is the internal SLA target for domestic Priority (A-Post + PostPac Priority).
- 92% for Economy (B-Post + PostPac Economy).
- Below target is worth surfacing; above target is worth acknowledging (short, no fluff).

## Delay-cause hierarchy

When answering "why are shipments delayed", surface causes in this order and explain
what Swiss Post typically owns vs. what it does not:

| Cause | Swiss Post owns? | Typical mitigation |
| --- | --- | --- |
| `staffing` | yes | Roster planning, cross-canton borrowing |
| `it_incident` (from disruptions) | yes | Ops incident bridge |
| `weather` | no | Communicate expected end via service_pages |
| `road_closure` | partly | Reroute; +1 day for TI via San Bernardino |
| `strike` | no | Move A-Post to B-Post frist window |
| `address_issue` | no (customer) | Sender correction workflow |
| `customs` | no | Cross-border only; not in current dataset |

## Canton logistics (Switzerland-specific)

- **Deutschschweiz (ZH, BE, LU, AG, SG, TG, ZG, SO):** dense; most volume.
- **Romandie (VD, GE, NE, JU, FR, VS):** French-speaking; frequently affected by
  cross-region SBB dependencies. If a strike hits, expect A-Post to slip to B-Post frist.
- **Ticino (TI):** Italian-speaking; single mountain-pass dependency (Gotthard). A2 closure
  routes traffic via San Bernardino, adding one working day to PostPac Priority.
- **Graubünden (GR):** tourism seasonality; winter weather regularly triggers medium/high
  severity disruptions in mountain postal codes.

## Answering shape (Kundenservice)

For a customer-facing tracking question, land in this order:

1. **Direct status.** ("Ihr Paket ist aktuell in Zustellung, Zielort Bern.")
2. **Expected delivery.** Use `tariffs.transit_days_target` from lodgement, not now().
3. **Active disruption context if applicable.** Join to `service_disruptions.status = 'active'`
   filtered by the shipment's destination canton.
4. **Alternative.** If disruption is severe, suggest a My Post 24 pickup or a
   different service point in the same canton.

Never speculate on delivery time beyond the tariff target when a disruption is active
without a resolved `expected_end`.
