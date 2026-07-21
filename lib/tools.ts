import { tool } from "ai"
import { z } from "zod"
import { runReadOnlyQuery } from "./db"
import { readSemanticDoc } from "./semantic-layer"
import * as art from "./artifacts"

export const readTools = {
  query_database: tool({
    description: "Run one read-only SQL SELECT against the synthetic Red Bull field-sales Postgres database. Ground queries in the semantic layer first.",
    inputSchema: z.object({ query: z.string(), rationale: z.string().optional() }),
    execute: async ({ query }) => {
      try { const { rows, rowCount } = await runReadOnlyQuery(query); return { ok: true, rowCount, rows: rows.slice(0, 200), truncated: rowCount > 200 } }
      catch (error) { return { ok: false, error: error instanceof Error ? error.message : String(error) } }
    },
  }),
  read_semantic_doc: tool({
    description: "Read a Red Bull field-sales entity specification or workflow guide.",
    inputSchema: z.object({ kind: z.enum(["entity", "guide"]), name: z.string() }),
    execute: async ({ kind, name }) => ({ content: readSemanticDoc(kind, name) }),
  }),
}

const record = z.record(z.string(), z.any())
const allWriteTools = {
  save_route_briefing: tool({ description: "Save a ranked daily route briefing.", inputSchema: z.object({ title: z.string(), routeId: z.string(), payload: record }), execute: async ({ title, routeId, payload }) => ({ ok: true, briefing: await art.saveReport(title, { type: "route_briefing", routeId, ...payload }) }) }),
  save_huddle_digest: tool({ description: "Save a concise market huddle digest.", inputSchema: z.object({ title: z.string(), marketId: z.string(), payload: record }), execute: async ({ title, marketId, payload }) => ({ ok: true, digest: await art.saveDigest(title, { type: "huddle_digest", marketId, ...payload }) }) }),
  generate_visit_plan: tool({ description: "Save a ranked, store-specific visit plan.", inputSchema: z.object({ title: z.string(), storeId: z.string(), visitId: z.string().optional(), actions: z.array(z.object({ rank: z.number().int().positive(), title: z.string(), rationale: z.string(), productId: z.string().optional(), completionCheck: z.string() })) }), execute: async (input) => ({ ok: true, plan: await art.saveReport(input.title, { type: "visit_plan", ...input }) }) }),
  complete_visit_assignment: tool({ description: "Record assignment completion. Call only after explicit user intent.", inputSchema: z.object({ assignmentId: z.string(), evidence: z.string(), completedAt: z.string() }), execute: async (input) => ({ ok: true, completion: await art.saveReport(`Completed ${input.assignmentId}`, { type: "assignment_completion", ...input }) }) }),
  save_visit_summary: tool({ description: "Save visit outcome and follow-ups.", inputSchema: z.object({ title: z.string(), storeId: z.string(), visitId: z.string().optional(), payload: record }), execute: async ({ title, ...payload }) => ({ ok: true, summary: await art.saveReport(title, { type: "visit_summary", ...payload }) }) }),
  preview_playbook_assignments: tool({ description: "Preview stores and SKUs matching a governed recovery rule without writing assignments.", inputSchema: z.object({ marketId: z.string(), availabilityBelow: z.number().min(0).max(100), prioritySkuOnly: z.boolean().default(true), missingTargetFacings: z.boolean().default(true) }), execute: async ({ marketId, availabilityBelow, prioritySkuOnly, missingTargetFacings }) => {
    const conditions = [`ra.market_id = '${marketId.replaceAll("'", "''")}'`, `spp.on_shelf_availability_pct < ${availabilityBelow}`]
    if (prioritySkuOnly) conditions.push("p.priority = true")
    if (missingTargetFacings) conditions.push("spp.facings < spp.target_facings")
    return runReadOnlyQuery(`SELECT s.id AS store_id, s.name AS store_name, ra.name AS retailer, p.id AS product_id, p.name AS product_name, spp.on_shelf_availability_pct, spp.facings, spp.target_facings FROM stores s JOIN retail_accounts ra ON ra.id=s.account_id JOIN store_product_performance spp ON spp.store_id=s.id JOIN products p ON p.id=spp.product_id WHERE ${conditions.join(" AND ")} ORDER BY spp.on_shelf_availability_pct ASC`)
  } }),
  save_market_playbook: tool({ description: "Save a versioned draft market playbook after preview.", inputSchema: z.object({ title: z.string(), marketId: z.string(), version: z.number().int().positive(), rules: record, previewSummary: record }), execute: async ({ title, ...payload }) => ({ ok: true, playbook: await art.saveReport(title, { type: "market_playbook", status: "draft", ...payload }) }) }),
  publish_market_playbook: tool({ description: "Record publication of an explicitly approved playbook version.", inputSchema: z.object({ playbookId: z.string(), version: z.number().int().positive(), approvalNote: z.string() }), execute: async (input) => ({ ok: true, publication: await art.saveReport(`Published playbook v${input.version}`, { type: "playbook_publication", status: "published", ...input }) }) }),
} as const

export type WriteToolName = keyof typeof allWriteTools
export function writeToolsFor(names: string[]) {
  const out: Record<string, (typeof allWriteTools)[WriteToolName]> = {}
  for (const name of names) if (name in allWriteTools) out[name] = allWriteTools[name as WriteToolName]
  return out
}
