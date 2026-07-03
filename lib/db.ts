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
 * Recursively convert a DB value into something safe to hand to the model /
 * tool-output serializer. Postgres returns `Date` objects, `bigint`s and
 * `Buffer`s which are not plain JSON, and would fail the AI SDK's tool result
 * validation. Dates become ISO strings, bigints become numbers/strings.
 */
export function toJsonSafe<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (value instanceof Date) return value.toISOString() as unknown as T
  if (typeof value === "bigint") {
    const n = Number(value)
    return (Number.isSafeInteger(n) ? n : value.toString()) as unknown as T
  }
  if (Array.isArray(value)) return value.map((v) => toJsonSafe(v)) as unknown as T
  if (typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = toJsonSafe(v)
    }
    return out as T
  }
  return value
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

  const raw = (await sql.query(trimmed)) as Record<string, unknown>[]
  const rows = raw.map((r) => toJsonSafe(r))
  return { rows, rowCount: rows.length }
}
