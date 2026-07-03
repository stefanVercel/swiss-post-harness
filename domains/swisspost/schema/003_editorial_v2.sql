-- Editorial v2 — genuinely agentic editorial/transfer-rumor workflow.
--
-- v1 stored only the live `payload` on `article_drafts` plus a single
-- `review_notes` string. v2 adds an immutable revision ledger (every agent /
-- editor / system edit is one row with a full payload snapshot + change
-- summary) and a feedback thread (the agentic surface: change requests, agent
-- replies, notes, decisions). The workflow + desk read both for diff-first,
-- fully-auditable review.

-- ---------------------------------------------------------------------------
-- 1. Widen the status check constraints to the v2 lifecycle.
--    draft → drafting → in_review → changes_requested → revising → approved
--    → published  (failed is terminal for workflows).
-- ---------------------------------------------------------------------------
alter table public.article_drafts drop constraint if exists article_drafts_status_check;
alter table public.article_drafts
  add constraint article_drafts_status_check
  check (status in (
    'draft', 'drafting', 'in_review', 'changes_requested',
    'revising', 'approved', 'published'
  ));

alter table public.editorial_workflows drop constraint if exists editorial_workflows_status_check;
alter table public.editorial_workflows
  add constraint editorial_workflows_status_check
  check (status in (
    'drafting', 'revising', 'awaiting_review', 'in_review',
    'changes_requested', 'approved', 'published', 'failed'
  ));

-- ---------------------------------------------------------------------------
-- 2. Head-revision pointer + counter on the draft, and an idempotency stamp
--    on the rumour so the poller never double-drafts.
-- ---------------------------------------------------------------------------
alter table public.article_drafts
  add column if not exists head_revision_id uuid,
  add column if not exists rev_count int not null default 0;

alter table public.service_pages
  add column if not exists drafted_at timestamptz;

-- ---------------------------------------------------------------------------
-- 3. article_revisions — immutable ledger of full payload snapshots.
-- ---------------------------------------------------------------------------
create table if not exists public.article_revisions (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.article_drafts(id) on delete cascade,
  rev_number int not null,
  payload jsonb not null,
  author text not null check (author in ('agent', 'editor', 'system')),
  change_summary text,
  feedback_id uuid,
  based_on_revision_id uuid references public.article_revisions(id),
  created_at timestamptz not null default now(),
  unique (draft_id, rev_number)
);

create index if not exists article_revisions_draft_idx
  on public.article_revisions (draft_id, rev_number desc);
create index if not exists article_revisions_feedback_idx
  on public.article_revisions (feedback_id);

-- ---------------------------------------------------------------------------
-- 4. editorial_feedback — the review thread (change requests, replies, notes).
-- ---------------------------------------------------------------------------
create table if not exists public.editorial_feedback (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.article_drafts(id) on delete cascade,
  role text not null check (role in ('editor', 'agent', 'system')),
  kind text not null check (kind in ('change_request', 'agent_reply', 'note', 'decision')),
  body text not null,
  resulting_revision_id uuid references public.article_revisions(id),
  created_at timestamptz not null default now()
);

create index if not exists editorial_feedback_draft_idx
  on public.editorial_feedback (draft_id, created_at);

-- head_revision_id references article_revisions; add the FK now that the table
-- exists (kept separate so re-running the column add above stays idempotent).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'article_drafts_head_revision_fk'
  ) then
    alter table public.article_drafts
      add constraint article_drafts_head_revision_fk
      foreign key (head_revision_id) references public.article_revisions(id);
  end if;
end $$;
