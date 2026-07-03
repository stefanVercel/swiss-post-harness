import { sql } from "./db"

/**
 * Data-access for the artifact + editorial tables (002_artifacts.sql,
 * 003_editorial_v2.sql). These back the Filiale persona (reports, watchlists)
 * and the Kommunikation persona (article drafts, revision ledger, review
 * feedback thread). All writes are parameterised via tagged templates.
 *
 * `anon_owner` is the demo tenant key — a single 'demo' owner for now.
 */
const OWNER = "demo"

export type ArticlePayload = {
  headline: string
  dek?: string
  lede?: string
  body?: string[] | string
  keyFacts?: string[]
  sources?: string[]
  pullQuotes?: string[]
  relatedIds?: string[]
  [k: string]: unknown
}

/* -------------------------------------------------------------------------- */
/* Reports (Filiale case briefings)                                            */
/* -------------------------------------------------------------------------- */

export async function saveReport(title: string, payload: unknown) {
  const rows = await sql`
    INSERT INTO public.reports (anon_owner, title, payload)
    VALUES (${OWNER}, ${title}, ${JSON.stringify(payload)}::jsonb)
    RETURNING id, title, created_at
  `
  return rows[0]
}

export async function listReports() {
  return sql`
    SELECT id, title, created_at, updated_at
    FROM public.reports
    WHERE anon_owner = ${OWNER}
    ORDER BY created_at DESC
  `
}

/* -------------------------------------------------------------------------- */
/* Watchlists (Filiale)                                                        */
/* -------------------------------------------------------------------------- */

export async function saveWatchlist(title: string, payload: unknown, snapshot: unknown) {
  const rows = await sql`
    INSERT INTO public.watchlists (anon_owner, title, payload, snapshot)
    VALUES (${OWNER}, ${title}, ${JSON.stringify(payload)}::jsonb, ${JSON.stringify(snapshot)}::jsonb)
    RETURNING id, title, created_at
  `
  return rows[0]
}

export async function getWatchlist(id: string) {
  const rows = await sql`SELECT * FROM public.watchlists WHERE id = ${id} AND anon_owner = ${OWNER}`
  return rows[0]
}

export async function refreshWatchlistSnapshot(id: string, snapshot: unknown) {
  const rows = await sql`
    UPDATE public.watchlists
    SET snapshot = ${JSON.stringify(snapshot)}::jsonb, updated_at = now()
    WHERE id = ${id} AND anon_owner = ${OWNER}
    RETURNING id, title, snapshot, updated_at
  `
  return rows[0]
}

export async function listWatchlists() {
  return sql`
    SELECT id, title, created_at, updated_at
    FROM public.watchlists
    WHERE anon_owner = ${OWNER}
    ORDER BY created_at DESC
  `
}

/* -------------------------------------------------------------------------- */
/* Digests (Kommunikation)                                                     */
/* -------------------------------------------------------------------------- */

export async function saveDigest(title: string, payload: unknown) {
  const rows = await sql`
    INSERT INTO public.digests (anon_owner, title, payload)
    VALUES (${OWNER}, ${title}, ${JSON.stringify(payload)}::jsonb)
    RETURNING id, title, created_at
  `
  return rows[0]
}

/* -------------------------------------------------------------------------- */
/* Article drafts + revision ledger + feedback thread (Kommunikation)          */
/* -------------------------------------------------------------------------- */

/** Create a draft and its revision 1 in one transaction-like sequence. */
export async function createArticleDraft(
  title: string,
  payload: ArticlePayload,
  sourceRumorId?: string | null,
) {
  const draftRows = await sql`
    INSERT INTO public.article_drafts (anon_owner, title, payload, status, source_rumor_id, rev_count)
    VALUES (${OWNER}, ${title}, ${JSON.stringify(payload)}::jsonb, 'in_review', ${sourceRumorId ?? null}, 1)
    RETURNING id
  `
  const draftId = draftRows[0].id as string

  const revRows = await sql`
    INSERT INTO public.article_revisions (draft_id, rev_number, payload, author, change_summary)
    VALUES (${draftId}, 1, ${JSON.stringify(payload)}::jsonb, 'agent', 'Initial draft from service_pages source')
    RETURNING id
  `
  const revId = revRows[0].id as string

  await sql`UPDATE public.article_drafts SET head_revision_id = ${revId} WHERE id = ${draftId}`

  // Stamp the source page so the poller never double-drafts.
  if (sourceRumorId) {
    await sql`UPDATE public.service_pages SET drafted_at = now(), status = 'drafting' WHERE id = ${sourceRumorId}`
  }

  return { draftId, revisionId: revId, revNumber: 1 }
}

/** Append a new immutable revision and repoint the draft head. */
export async function createArticleRevision(
  draftId: string,
  payload: ArticlePayload,
  changeSummary: string,
  author: "agent" | "editor" | "system" = "agent",
  feedbackId?: string | null,
) {
  const draftRows = await sql`SELECT rev_count, head_revision_id FROM public.article_drafts WHERE id = ${draftId}`
  if (!draftRows[0]) throw new Error(`No draft ${draftId}`)
  const nextRev = (Number(draftRows[0].rev_count) || 0) + 1
  const basedOn = draftRows[0].head_revision_id as string | null

  const revRows = await sql`
    INSERT INTO public.article_revisions
      (draft_id, rev_number, payload, author, change_summary, feedback_id, based_on_revision_id)
    VALUES
      (${draftId}, ${nextRev}, ${JSON.stringify(payload)}::jsonb, ${author}, ${changeSummary}, ${feedbackId ?? null}, ${basedOn})
    RETURNING id
  `
  const revId = revRows[0].id as string

  await sql`
    UPDATE public.article_drafts
    SET payload = ${JSON.stringify(payload)}::jsonb,
        head_revision_id = ${revId},
        rev_count = ${nextRev},
        status = 'in_review',
        updated_at = now()
    WHERE id = ${draftId}
  `
  return { revisionId: revId, revNumber: nextRev }
}

export async function getDraftHead(draftId: string): Promise<ArticlePayload | null> {
  const rows = await sql`SELECT payload FROM public.article_drafts WHERE id = ${draftId}`
  return (rows[0]?.payload as ArticlePayload) ?? null
}

export async function listArticleRevisions(draftId: string) {
  return sql`
    SELECT id, rev_number, author, change_summary, created_at
    FROM public.article_revisions
    WHERE draft_id = ${draftId}
    ORDER BY rev_number DESC
  `
}

export async function updateArticleDraft(draftId: string, payload: ArticlePayload, changeSummary: string) {
  return createArticleRevision(draftId, payload, changeSummary, "agent")
}

export async function publishArticle(draftId: string) {
  const rows = await sql`
    UPDATE public.article_drafts
    SET status = 'published', published_at = now(), updated_at = now()
    WHERE id = ${draftId}
    RETURNING id, title, published_at
  `
  return rows[0]
}

export async function addFeedback(
  draftId: string,
  role: "editor" | "agent" | "system",
  kind: "change_request" | "agent_reply" | "note" | "decision",
  body: string,
) {
  const rows = await sql`
    INSERT INTO public.editorial_feedback (draft_id, role, kind, body)
    VALUES (${draftId}, ${role}, ${kind}, ${body})
    RETURNING id
  `
  return rows[0]
}

export async function listDrafts() {
  return sql`
    SELECT d.id, d.title, d.status, d.rev_count, d.source_rumor_id, d.created_at, d.updated_at,
           sp.headline AS source_headline
    FROM public.article_drafts d
    LEFT JOIN public.service_pages sp ON sp.id = d.source_rumor_id
    WHERE d.anon_owner = ${OWNER}
    ORDER BY d.updated_at DESC
  `
}
