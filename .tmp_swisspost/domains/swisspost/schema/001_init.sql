-- Swiss Post domain — initial schema.
-- 6 core tables: channels-equivalent (service_points), inventory-equivalent (shipments),
-- accounts (customers), catalog (tariffs), events (service_disruptions),
-- editorial source (service_pages).
--
-- Idempotent: safe to re-run.

-- ============================================================================
-- service_points — Filialen, Agenturen, My Post 24 lockers, business branches
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.service_points (
  id           text PRIMARY KEY,               -- slug, e.g. "bern-schanzenpost"
  name         text NOT NULL,
  kind         text NOT NULL,                  -- filiale | agentur | mypost24 | business_center
  canton       text NOT NULL,                  -- ZH, BE, VD, GE, TI, ...
  city         text NOT NULL,
  postal_code  text NOT NULL,
  opens_mon_fri text,                          -- "07:30-18:30"
  opens_sat    text,
  opens_sun    text,
  services     text[],                         -- {parcel, letter, cash, id_check, packstation}
  weekly_visits_k numeric,                     -- avg thousands of customer visits / week
  on_time_pct  numeric,                        -- SLA attainment (0-100)
  lat          numeric,
  lng          numeric,
  status       text NOT NULL DEFAULT 'active'  -- active | temporarily_closed | closed
);

-- ============================================================================
-- customers — business + consumer principals
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id                  text PRIMARY KEY,        -- slug
  name                text NOT NULL,
  segment             text NOT NULL,           -- pk (Privat) | kmu | gk (Grosskunde)
  industry            text,                    -- e-commerce, retail, finance, public, media, ...
  primary_canton      text,
  monthly_volume_k    numeric,                 -- k shipments / month
  annual_revenue_chf  numeric,                 -- what Swiss Post bills this customer / year
  is_key_account      boolean NOT NULL DEFAULT false,
  contract_status     text,                    -- active | at_risk | renewal_due | churned
  churn_risk_score    numeric                  -- 0-100, higher = more risk
);

-- ============================================================================
-- tariffs — service catalog (A-Post, B-Post, PostPac Priority/Economy, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tariffs (
  id              text PRIMARY KEY,            -- slug, e.g. "postpac-priority-2kg"
  service         text NOT NULL,               -- a_post | b_post | postpac_priority | postpac_economy | assured
  service_label   text NOT NULL,               -- "PostPac Priority"
  format          text NOT NULL,               -- letter | parcel | oversize
  weight_from_g   integer NOT NULL,
  weight_to_g     integer NOT NULL,
  price_chf       numeric NOT NULL,
  transit_days_target integer,                 -- 1 for A-Post, 2-3 for B-Post
  is_domestic     boolean NOT NULL DEFAULT true,
  effective_from  date NOT NULL
);

-- ============================================================================
-- shipments — parcels + letters (the inventory / operational grain)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shipments (
  id                  text PRIMARY KEY,        -- tracking number
  customer_id         text REFERENCES public.customers(id),
  tariff_id           text REFERENCES public.tariffs(id),
  origin_sp_id        text REFERENCES public.service_points(id),
  destination_canton  text NOT NULL,
  destination_city    text NOT NULL,
  weight_g            integer,
  status              text NOT NULL,           -- lodged | in_transit | out_for_delivery | delivered | returned | delayed
  lodged_at           timestamptz NOT NULL,
  delivered_at        timestamptz,
  delayed_reason      text,                    -- weather | staffing | address_issue | customs | other
  is_on_time          boolean,
  service_label       text                     -- denormalized for grep-ability
);

-- ============================================================================
-- service_disruptions — active operational issues (weather, closures, incidents)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.service_disruptions (
  id             text PRIMARY KEY,
  headline       text NOT NULL,
  cause          text NOT NULL,                -- weather | strike | road_closure | it_incident | branch_closed
  cantons        text[],                       -- affected cantons
  postal_codes   text[],
  severity       text NOT NULL,                -- low | medium | high | critical
  started_at     timestamptz NOT NULL,
  expected_end   timestamptz,
  status         text NOT NULL,                -- active | monitoring | resolved
  impact_summary text,                         -- short prose
  affected_services text[]                     -- {parcel, letter, cash, packstation}
);

-- ============================================================================
-- service_pages — post.ch source content (analog of wire_stories in P7S1)
-- Feeds the editorial workflow. Anything a customer might read on post.ch.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.service_pages (
  id           text PRIMARY KEY,
  category     text NOT NULL,                  -- tariffs | disruptions | how_to | holidays | product_launch | policy
  headline     text NOT NULL,
  source       text NOT NULL,                  -- internal_ops | pr | product | disruption_desk
  status       text NOT NULL DEFAULT 'incoming', -- incoming | drafting | in_review | published
  priority     text NOT NULL DEFAULT 'medium', -- low | medium | high
  relevance_pct numeric,                       -- 0-100 editorial-scored
  published_at timestamptz,
  summary      text,
  related_disruption_id text REFERENCES public.service_disruptions(id),
  related_tariff_id     text REFERENCES public.tariffs(id)
);

-- Simple indexes for the questions the agent runs most.
CREATE INDEX IF NOT EXISTS shipments_status_idx    ON public.shipments (status);
CREATE INDEX IF NOT EXISTS shipments_customer_idx  ON public.shipments (customer_id);
CREATE INDEX IF NOT EXISTS shipments_lodged_idx    ON public.shipments (lodged_at DESC);
CREATE INDEX IF NOT EXISTS service_points_canton_idx ON public.service_points (canton);
CREATE INDEX IF NOT EXISTS disruptions_status_idx  ON public.service_disruptions (status);
CREATE INDEX IF NOT EXISTS service_pages_status_idx ON public.service_pages (status);
