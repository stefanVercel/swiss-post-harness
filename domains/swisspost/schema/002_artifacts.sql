-- Legacy artifact persistence retained for compatibility with existing demos.
-- New Red Bull field-sales writes use route briefings, visit plans, summaries,
-- and governed market playbooks from 003_field_sales_artifacts.sql.

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  anon_owner text not null default 'demo',
  title text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_drafts (
  id uuid primary key default gen_random_uuid(),
  anon_owner text not null default 'demo',
  title text not null,
  payload jsonb not null,
  status text not null default 'draft'
    check (status in ('draft', 'in_review', 'changes_requested', 'published')),
  source_rumor_id text references public.service_pages(id),
  assignee text,
  review_notes text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  anon_owner text not null default 'demo',
  title text not null,
  payload jsonb not null,
  snapshot jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.digests (
  id uuid primary key default gen_random_uuid(),
  anon_owner text not null default 'demo',
  title text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.editorial_workflows (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid references public.article_drafts(id) on delete cascade,
  rumor_id text references public.service_pages(id),
  status text not null default 'drafting'
    check (status in ('drafting', 'awaiting_review', 'changes_requested', 'published', 'failed')),
  resume_token text,
  review_decision text check (review_decision in ('approve', 'changes_requested')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists article_drafts_status_idx on public.article_drafts (status);
create index if not exists editorial_workflows_status_idx on public.editorial_workflows (status);
create index if not exists reports_owner_idx on public.reports (anon_owner, created_at desc);
create index if not exists watchlists_owner_idx on public.watchlists (anon_owner, created_at desc);
create index if not exists digests_owner_idx on public.digests (anon_owner, created_at desc);
