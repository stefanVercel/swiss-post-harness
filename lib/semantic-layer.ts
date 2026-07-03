import { readFileSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"

/**
 * Filesystem-backed semantic layer.
 *
 * The Swiss Post domain pack ships a `semantic-layer/` directory (catalog,
 * metrics, glossary, per-entity field docs and answering guides). The agent
 * greps these before writing SQL, exactly as the personas describe. We load
 * them once at module init and expose them as grounding text + a lookup tool.
 */
const SEMANTIC_DIR = join(process.cwd(), "domains", "swisspost", "semantic-layer")

function safeRead(path: string): string {
  try {
    return readFileSync(path, "utf8")
  } catch {
    return ""
  }
}

export type SemanticLayer = {
  catalog: string
  metrics: string
  glossary: string
  entities: Record<string, string>
  guides: Record<string, string>
}

let cached: SemanticLayer | null = null

export function loadSemanticLayer(): SemanticLayer {
  if (cached) return cached

  const entities: Record<string, string> = {}
  const entitiesDir = join(SEMANTIC_DIR, "entities")
  if (existsSync(entitiesDir)) {
    for (const f of readdirSync(entitiesDir).filter((f) => f.endsWith(".yml"))) {
      entities[f.replace(/\.yml$/, "")] = safeRead(join(entitiesDir, f))
    }
  }

  const guides: Record<string, string> = {}
  const guidesDir = join(SEMANTIC_DIR, "guides")
  if (existsSync(guidesDir)) {
    for (const f of readdirSync(guidesDir).filter((f) => f.endsWith(".md"))) {
      guides[f.replace(/\.md$/, "")] = safeRead(join(guidesDir, f))
    }
  }

  cached = {
    catalog: safeRead(join(SEMANTIC_DIR, "catalog.yml")),
    metrics: safeRead(join(SEMANTIC_DIR, "metrics.yml")),
    glossary: safeRead(join(SEMANTIC_DIR, "glossary.yml")),
    entities,
    guides,
  }
  return cached
}

/**
 * Compact grounding block injected into the system prompt. Contains the
 * catalog, metrics and glossary in full (they are small and load-bearing) plus
 * an index of the entity + guide files retrievable via the `read_semantic_doc`
 * tool.
 */
export function buildGroundingContext(): string {
  const s = loadSemanticLayer()
  const entityNames = Object.keys(s.entities).join(", ")
  const guideNames = Object.keys(s.guides).join(", ")

  return [
    "# SEMANTIC LAYER — ground yourself here before writing SQL.",
    "",
    "## catalog.yml (entity discovery)",
    s.catalog,
    "",
    "## metrics.yml (canonical KPIs — reuse these sql_hints)",
    s.metrics,
    "",
    "## glossary.yml (map user terms -> columns)",
    s.glossary,
    "",
    "## Retrievable detail docs (use the read_semantic_doc tool):",
    `- entities: ${entityNames}`,
    `- guides: ${guideNames}`,
  ].join("\n")
}

export function readSemanticDoc(kind: "entity" | "guide", name: string): string {
  const s = loadSemanticLayer()
  const bag = kind === "entity" ? s.entities : s.guides
  return bag[name] ?? `No ${kind} doc named "${name}". Available: ${Object.keys(bag).join(", ")}`
}
