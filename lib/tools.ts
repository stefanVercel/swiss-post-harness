import { tool } from "ai"
import { z } from "zod"
import { runReadOnlyQuery } from "./db"
import { readSemanticDoc } from "./semantic-layer"
import * as art from "./artifacts"

/**
 * Tool registry for the Swiss Post harness.
 *
 * `readTools` are available to every persona. `writeToolsFor(persona)` returns
 * only the subset whose keys appear in the persona's `writeTools` array from
 * domain.config.ts — enforcing the read-only / write boundary at the tool level
 * rather than relying on the prompt alone.
 */

/* ----------------------------- read tools -------------------------------- */

export const readTools = {
  query_database: tool({
    description:
      "Run a single read-only SQL SELECT (or WITH...SELECT) against the Swiss Post Postgres database. " +
      "Ground yourself in the semantic layer (catalog/metrics/glossary) first. Prefer one join over multiple round-trips.",
    inputSchema: z.object({
      query: z.string().describe("A single read-only SELECT statement. No semicolons, no DDL/DML."),
      rationale: z.string().optional().describe("One line: which entity/metric this maps to."),
    }),
    execute: async ({ query }) => {
      try {
        const { rows, rowCount } = await runReadOnlyQuery(query)
        // Cap payload so we never blow the context with a huge result set.
        const capped = rows.slice(0, 200)
        return { ok: true, rowCount, rows: capped, truncated: rowCount > capped.length }
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
      }
    },
  }),

  read_semantic_doc: tool({
    description:
      "Read a detail doc from the semantic layer: an entity field spec (entities/*.yml) or an answering guide (guides/*.md).",
    inputSchema: z.object({
      kind: z.enum(["entity", "guide"]),
      name: z
        .string()
        .describe(
          "entity: customers | shipments | tariffs | service_points | service_disruptions | service_pages. guide: delivery-operations | service-catalog",
        ),
    }),
    execute: async ({ kind, name }) => ({ content: readSemanticDoc(kind, name) }),
  }),
}

/* ----------------------------- write tools ------------------------------- */

const articlePayloadSchema = z
  .object({
    headline: z.string(),
    dek: z.string().optional(),
    lede: z.string().optional(),
    body: z.union([z.array(z.string()), z.string()]).optional(),
    keyFacts: z.array(z.string()).optional(),
    sources: z.array(z.string()).optional(),
    pullQuotes: z.array(z.string()).optional(),
    relatedIds: z.array(z.string()).optional(),
  })
  .passthrough()

const allWriteTools = {
  /* -------- Filiale / KAM -------- */
  save_report: tool({
    description: "Persist a structured case briefing (per customer / branch / region).",
    inputSchema: z.object({
      title: z.string(),
      payload: z.record(z.string(), z.any()).describe("The structured briefing (snapshot, serviceMix, sla, risks, verdict)."),
    }),
    execute: async ({ title, payload }) => ({ ok: true, report: await art.saveReport(title, payload) }),
  }),

  save_watchlist: tool({
    description: "Persist a named watchlist of customers/branches with a metrics snapshot for later refresh.",
    inputSchema: z.object({
      title: z.string(),
      payload: z.record(z.string(), z.any()).describe("The watchlist definition (ids, columns, filter)."),
      snapshot: z.record(z.string(), z.any()).describe("Current metric values for each entry."),
    }),
    execute: async ({ title, payload, snapshot }) => ({
      ok: true,
      watchlist: await art.saveWatchlist(title, payload, snapshot),
    }),
  }),

  refresh_watchlist: tool({
    description: "Re-run metrics for a saved watchlist and store the new snapshot.",
    inputSchema: z.object({
      id: z.string(),
      snapshot: z.record(z.string(), z.any()).describe("Freshly-queried metric values."),
    }),
    execute: async ({ id, snapshot }) => ({ ok: true, watchlist: await art.refreshWatchlistSnapshot(id, snapshot) }),
  }),

  /* -------- Kommunikation -------- */
  create_article_draft: tool({
    description:
      "Create a post.ch service-page draft (revision 1) from a service_pages source. Routes into editorial review — do NOT publish from chat.",
    inputSchema: z.object({
      title: z.string(),
      payload: articlePayloadSchema,
      sourceRumorId: z.string().optional().describe("The originating service_pages.id."),
    }),
    execute: async ({ title, payload, sourceRumorId }) => ({
      ok: true,
      draft: await art.createArticleDraft(title, payload, sourceRumorId ?? null),
    }),
  }),

  update_article_draft: tool({
    description: "Replace the full draft payload with a new revision.",
    inputSchema: z.object({
      draftId: z.string(),
      payload: articlePayloadSchema,
      changeSummary: z.string(),
    }),
    execute: async ({ draftId, payload, changeSummary }) => ({
      ok: true,
      revision: await art.updateArticleDraft(draftId, payload, changeSummary),
    }),
  }),

  create_article_revision: tool({
    description: "Append a new immutable revision to a draft (used inside the editorial workflow surface).",
    inputSchema: z.object({
      draftId: z.string(),
      payload: articlePayloadSchema,
      changeSummary: z.string(),
      feedbackId: z.string().optional(),
    }),
    execute: async ({ draftId, payload, changeSummary, feedbackId }) => ({
      ok: true,
      revision: await art.createArticleRevision(draftId, payload, changeSummary, "agent", feedbackId ?? null),
    }),
  }),

  set_headline: tool({
    description: "Granular edit: change only the headline, producing a tight new revision.",
    inputSchema: z.object({ draftId: z.string(), headline: z.string(), feedbackId: z.string().optional() }),
    execute: async ({ draftId, headline, feedbackId }) => {
      const head = (await art.getDraftHead(draftId)) ?? { headline }
      const next = { ...head, headline }
      return { ok: true, revision: await art.createArticleRevision(draftId, next, `Headline geändert: „${headline}“`, "agent", feedbackId ?? null) }
    },
  }),

  set_dek: tool({
    description: "Granular edit: change only the dek (one-line summary).",
    inputSchema: z.object({ draftId: z.string(), dek: z.string(), feedbackId: z.string().optional() }),
    execute: async ({ draftId, dek, feedbackId }) => {
      const head = (await art.getDraftHead(draftId)) ?? { headline: "" }
      const next = { ...head, dek }
      return { ok: true, revision: await art.createArticleRevision(draftId, next, "Dek angepasst", "agent", feedbackId ?? null) }
    },
  }),

  revise_text: tool({
    description: "Granular edit: replace the lede, the whole body, or one body paragraph by index.",
    inputSchema: z.object({
      draftId: z.string(),
      target: z.union([z.literal("lede"), z.literal("body"), z.number()]).describe("'lede' | 'body' | body paragraph index"),
      text: z.union([z.string(), z.array(z.string())]),
      feedbackId: z.string().optional(),
    }),
    execute: async ({ draftId, target, text, feedbackId }) => {
      const head = ((await art.getDraftHead(draftId)) ?? { headline: "" }) as art.ArticlePayload
      const next: art.ArticlePayload = { ...head }
      if (target === "lede") {
        next.lede = Array.isArray(text) ? text.join(" ") : text
      } else if (target === "body") {
        next.body = Array.isArray(text) ? text : [text]
      } else if (typeof target === "number") {
        const body = Array.isArray(head.body) ? [...head.body] : head.body ? [head.body] : []
        body[target] = Array.isArray(text) ? text.join(" ") : text
        next.body = body
      }
      return {
        ok: true,
        revision: await art.createArticleRevision(draftId, next, `Text überarbeitet (${String(target)})`, "agent", feedbackId ?? null),
      }
    },
  }),

  add_pull_quote: tool({
    description: "Add a pull quote sourced from verifiable data (e.g. a disruption impact_summary). Never fabricate.",
    inputSchema: z.object({ draftId: z.string(), quote: z.string(), feedbackId: z.string().optional() }),
    execute: async ({ draftId, quote, feedbackId }) => {
      const head = ((await art.getDraftHead(draftId)) ?? { headline: "" }) as art.ArticlePayload
      const next = { ...head, pullQuotes: [...(head.pullQuotes ?? []), quote] }
      return { ok: true, revision: await art.createArticleRevision(draftId, next, "Pull-Quote ergänzt", "agent", feedbackId ?? null) }
    },
  }),

  add_source: tool({
    description: "Add a citation to a service_pages / service_disruptions / tariffs id.",
    inputSchema: z.object({ draftId: z.string(), sourceId: z.string(), feedbackId: z.string().optional() }),
    execute: async ({ draftId, sourceId, feedbackId }) => {
      const head = ((await art.getDraftHead(draftId)) ?? { headline: "" }) as art.ArticlePayload
      const next = { ...head, sources: [...(head.sources ?? []), sourceId] }
      return { ok: true, revision: await art.createArticleRevision(draftId, next, `Quelle ergänzt: ${sourceId}`, "agent", feedbackId ?? null) }
    },
  }),

  list_article_revisions: tool({
    description: "List the revision ledger for a draft (newest first).",
    inputSchema: z.object({ draftId: z.string() }),
    execute: async ({ draftId }) => ({ ok: true, revisions: await art.listArticleRevisions(draftId) }),
  }),

  publish_article: tool({
    description: "Publish a draft. Only call this after an explicit editor approval signal.",
    inputSchema: z.object({ draftId: z.string() }),
    execute: async ({ draftId }) => ({ ok: true, published: await art.publishArticle(draftId) }),
  }),

  save_digest: tool({
    description: "Bundle several related service pages into one customer-facing digest.",
    inputSchema: z.object({
      title: z.string(),
      payload: z.record(z.string(), z.any()).describe("The digest bundle (items, intro, sections)."),
    }),
    execute: async ({ title, payload }) => ({ ok: true, digest: await art.saveDigest(title, payload) }),
  }),
} as const

export type WriteToolName = keyof typeof allWriteTools

/** Return only the write tools this persona is permitted to use. */
export function writeToolsFor(names: string[]) {
  const out: Record<string, (typeof allWriteTools)[WriteToolName]> = {}
  for (const name of names) {
    if (name in allWriteTools) {
      out[name] = allWriteTools[name as WriteToolName]
    }
  }
  return out
}
