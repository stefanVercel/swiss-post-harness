import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

/**
 * Single shared read/write Neon client for the Swiss Post harness.
 *
 * The `query_database` agent tool only ever passes SELECT statements through
 * `runReadOnlyQuery` (guarded below). The editorial / report write tools use
 * the same connection but go through parameterised tagged-template calls.
 */
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!connectionString) {
  throw new Error("[db] Missing DATABASE_URL / POSTGRES_URL environment variable")
}

export const sql: NeonQueryFunction<false, false> = neon(connectionString)

/** Statements the read-only agent tool must never be allowed to run. */
const FORBIDDEN = /\b(insert|update|delete|drop|alter|truncate|create|grant|revoke|comment|copy|merge|call|do|vacuum)\b/i

export type QueryResult = {
  rows: Record<string, unknown>[]
  rowCount: number
}

/**
 * Execute a single read-only SELECT (or WITH ... SELECT) statement.
 * Throws on anything that could mutate data or on multi-statement input.
 */
export async function runReadOnlyQuery(query: string): Promise<QueryResult> {
  const trimmed = query.trim().replace(/;\s*$/, "")

  if (trimmed.includes(";")) {
    throw new Error("Only a single statement is allowed.")
  }
  const lead = trimmed.slice(0, 6).toLowerCase()
  if (!lead.startsWith("select") && !lead.startsWith("with")) {
    throw new Error("Only SELECT / WITH queries are permitted for this persona.")
  }
  if (FORBIDDEN.test(trimmed)) {
    throw new Error("Query contains a forbidden (write/DDL) keyword.")
  }

  const rows = (await sql.query(trimmed)) as Record<string, unknown>[]
  return { rows, rowCount: rows.length }
}
