/**
 * One-shot DB setup for the Red Bull field-sales domain pack.
 *
 *   node scripts/db-setup.mjs
 *
 * Runs every schema/*.sql migration in order (each file executed as a single
 * simple-query batch so Postgres dollar-quoted DO blocks survive), then calls
 * the domain seed. Idempotent: schema files use IF NOT EXISTS and the seed
 * truncates before inserting.
 */
import "dotenv/config";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { neon, Pool } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOMAIN_DIR = join(__dirname, "..", "domains", "swisspost");

const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("[db-setup] Missing DATABASE_URL / POSTGRES_URL");
  process.exit(1);
}

async function runSchema() {
  const schemaDir = join(DOMAIN_DIR, "schema");
  const files = readdirSync(schemaDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  // Pool uses the simple query protocol for multi-statement / dollar-quoted SQL.
  const pool = new Pool({ connectionString });
  try {
    for (const file of files) {
      const sqlText = readFileSync(join(schemaDir, file), "utf8");
      console.log(`[db-setup] applying schema: ${file}`);
      await pool.query(sqlText);
    }
  } finally {
    await pool.end();
  }
}

async function runSeed() {
  const { seed } = await import(join(DOMAIN_DIR, "seed", "index.mjs"));
  const sql = neon(connectionString);
  console.log("[db-setup] seeding...");
  const counts = await seed(sql);
  console.log("[db-setup] seeded rows:", counts);
}

async function main() {
  await runSchema();
  await runSeed();
  console.log("[db-setup] done.");
}

main().catch((err) => {
  console.error("[db-setup] failed:", err);
  process.exit(1);
});
