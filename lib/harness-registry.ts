import type { PostIconName } from "@/components/post-icon"

/**
 * Harness registry — the single source of truth for the "one harness, many
 * agents" showcase on /harness (the primitives grid + the interactive run).
 *
 * Everything here is grounded in the real Swiss Post agent surface:
 *   - personas  → domains/swisspost/domain.config.ts (Kundenservice / Filiale / Kommunikation)
 *   - skills    → agent/skills/*  +  the generic harness skills folded into prompts
 *   - tools     → lib/tools.ts    (read tools shared by all; write tools per persona)
 *   - semantic  → domains/swisspost/semantic-layer/**
 *   - infra     → managed Vercel primitives, each tied to a concrete spot
 *
 * The three personas are NOT three agents — they are one harness reused,
 * differing only in which skills and write-tools they switch on. The reuse
 * counts and `personasUsingBlock` helper make that legible.
 */

export type PersonaId = "kundenservice" | "filiale" | "kommunikation"

export const PERSONA_ORDER: PersonaId[] = ["kundenservice", "filiale", "kommunikation"]

export interface PersonaMeta {
  readonly id: PersonaId
  readonly name: string
  readonly surface: string
  readonly channel: string
  readonly tagline: string
  readonly icon: PostIconName
  /** Accent used across the run + selector. `on` is the readable text on `color`. */
  readonly accent: { color: string; soft: string; on: string }
}

export const PERSONA_META: Record<PersonaId, PersonaMeta> = {
  kundenservice: {
    id: "kundenservice",
    name: "Kundenservice",
    surface: "Chat · Tracking, Tarife & Standorte",
    channel: "Web (Eve channel)",
    tagline: "Sendungen verfolgen, Tarife und Poststellen — mit Charts und Dashboards.",
    icon: "customercontact",
    accent: { color: "var(--sp-ink)", soft: "var(--sp-ink-soft)", on: "#ffffff" },
  },
  filiale: {
    id: "filiale",
    name: "Filiale / KAM",
    surface: "Chat · Case-Briefings & Watchlists",
    channel: "Web (Eve channel)",
    tagline: "Geschäftskunden analysieren, Case-Briefings und Watchlists speichern.",
    icon: "branch",
    accent: { color: "var(--sp-blue)", soft: "var(--sp-blue-soft)", on: "#ffffff" },
  },
  kommunikation: {
    id: "kommunikation",
    name: "Kommunikation",
    surface: "Editorial-Desk · Entwerfen & Publizieren",
    channel: "Web (Eve channel) + Editorial-Workflow",
    tagline: "Service-Seiten aus internen Quellen entwerfen, reviewen, publizieren.",
    icon: "newspaper",
    accent: { color: "var(--sp-yellow)", soft: "var(--sp-yellow-soft)", on: "var(--sp-ink)" },
  },
}

/* -------------------------------------------------------------------------- */
/* Shared building blocks                                                      */
/* -------------------------------------------------------------------------- */

export type BlockKind = "skill" | "tool" | "semantic" | "infra"

export interface Block {
  readonly id: string
  readonly kind: BlockKind
  readonly name: string
  readonly blurb: string
  /** For tools: authored in lib/tools.ts vs. framework sandbox default. */
  readonly source?: "authored" | "framework"
}

export const SKILLS: Record<string, Block> = {
  "build-rich-answers": {
    id: "build-rich-answers",
    kind: "skill",
    name: "build-rich-answers",
    blurb: "Charts, Tabellen, Karten und finalize_answer-Payloads für jede analytische Antwort.",
  },
  "render-dashboard": {
    id: "render-dashboard",
    kind: "skill",
    name: "render-dashboard",
    blurb: "Post-Dashboards: Ranglisten, Störungs-Boards, Volumen-Kurven nach Kanton.",
  },
  "swisspost-comparison": {
    id: "swisspost-comparison",
    kind: "skill",
    name: "swisspost-comparison",
    blurb: "Vergleich von Tarifen, Filialen oder Kunden — Preis, Laufzeit, Volumen, Head-to-Head.",
  },
  "swisspost-account-briefing": {
    id: "swisspost-account-briefing",
    kind: "skill",
    name: "swisspost-account-briefing",
    blurb: "Tiefes Account-Briefing je Geschäftskunde — Volumen, Service-Mix, SLA, Risiken.",
  },
  "swisspost-portfolio-scan": {
    id: "swisspost-portfolio-scan",
    kind: "skill",
    name: "swisspost-portfolio-scan",
    blurb: "Portfolio-Scan über Regionen/Kunden — Volumen-Mover, Vertragsrisiken, Ausreisser.",
  },
  watchlist: {
    id: "watchlist",
    kind: "skill",
    name: "watchlist",
    blurb: "Kunden-/Filial-Watchlists bauen und speichern, mit Refresh-und-Diff über die Zeit.",
  },
  "swisspost-service-page-drafter": {
    id: "swisspost-service-page-drafter",
    kind: "skill",
    name: "swisspost-service-page-drafter",
    blurb: "Entwirft post.ch Service-Seiten aus service_pages / service_disruptions für das Review.",
  },
  "swisspost-service-page-reviser": {
    id: "swisspost-service-page-reviser",
    kind: "skill",
    name: "swisspost-service-page-reviser",
    blurb: "Granulare Draft-Revisionen — Headline, Dek, Absätze, Pull-Quotes, Quellen.",
  },
  digest: {
    id: "digest",
    kind: "skill",
    name: "digest",
    blurb: "Bündelt mehrere Service-Seiten zu einem kundenfreundlichen Digest.",
  },
}

export const TOOLS: Record<string, Block> = {
  // Shared read tools — every persona gets these (lib/tools.ts readTools).
  query_database: {
    id: "query_database",
    kind: "tool",
    name: "query_database",
    blurb: "Ein einzelnes read-only SELECT gegen die Swiss Post Postgres (Neon).",
    source: "authored",
  },
  read_semantic_doc: {
    id: "read_semantic_doc",
    kind: "tool",
    name: "read_semantic_doc",
    blurb: "Liest ein Entity-Feldspec (entities/*.yml) oder einen Answering-Guide (guides/*.md).",
    source: "authored",
  },
  // Framework sandbox defaults — filesystem access to the semantic layer.
  bash: {
    id: "bash",
    kind: "tool",
    name: "bash / run",
    blurb: "Shell im Sandbox — grep/cat über den Semantic Layer vor dem SQL.",
    source: "framework",
  },
  load_skill: {
    id: "load_skill",
    kind: "tool",
    name: "load_skill",
    blurb: "Zieht die Instruktionen eines Skills bei Bedarf in den Turn.",
    source: "framework",
  },
  finalize_answer: {
    id: "finalize_answer",
    kind: "tool",
    name: "finalize_answer",
    blurb: "Emittiert die strukturierte finale Antwort (answer, charts, table, cards, refs).",
    source: "authored",
  },
  // Filiale / KAM write tools.
  save_report: {
    id: "save_report",
    kind: "tool",
    name: "save_report",
    blurb: "Persistiert ein strukturiertes Case-Briefing (Kunde / Filiale / Region).",
    source: "authored",
  },
  save_watchlist: {
    id: "save_watchlist",
    kind: "tool",
    name: "save_watchlist",
    blurb: "Persistiert eine benannte Watchlist mit Metrik-Snapshot für späteren Refresh.",
    source: "authored",
  },
  refresh_watchlist: {
    id: "refresh_watchlist",
    kind: "tool",
    name: "refresh_watchlist",
    blurb: "Re-queryt eine gespeicherte Watchlist und schreibt den neuen Snapshot.",
    source: "authored",
  },
  // Kommunikation write tools (durable editorial workflow).
  create_article_draft: {
    id: "create_article_draft",
    kind: "tool",
    name: "create_article_draft",
    blurb: "Legt einen Service-Seiten-Draft an (Revision 1, Status in_review).",
    source: "authored",
  },
  update_article_draft: {
    id: "update_article_draft",
    kind: "tool",
    name: "update_article_draft",
    blurb: "Ersetzt das Draft-Payload durch eine neue Revision.",
    source: "authored",
  },
  publish_article: {
    id: "publish_article",
    kind: "tool",
    name: "publish_article",
    blurb: "Publiziert einen reviewten Draft — nur nach explizitem Editor-Approval.",
    source: "authored",
  },
  save_digest: {
    id: "save_digest",
    kind: "tool",
    name: "save_digest",
    blurb: "Bündelt mehrere Service-Seiten zu einem gespeicherten Digest.",
    source: "authored",
  },
}

export const SEMANTIC: Record<string, Block> = {
  "catalog.yml": { id: "catalog.yml", kind: "semantic", name: "catalog.yml", blurb: "Top-Level-Index von Entities, Metriken und Guides." },
  "SCHEMA.md": { id: "SCHEMA.md", kind: "semantic", name: "SCHEMA.md", blurb: "Tabellen- und Spaltenreferenz für alle Entities." },
  "README.md": { id: "README.md", kind: "semantic", name: "README.md", blurb: "Wie man den Semantic Layer navigiert." },
  "glossary.yml": { id: "glossary.yml", kind: "semantic", name: "glossary.yml", blurb: "Domänenbegriffe — Nutzerwörter auf Spalten mappen." },
  "metrics.yml": { id: "metrics.yml", kind: "semantic", name: "metrics.yml", blurb: "Kanonische KPI-Definitionen mit sql_hints (Volumen, SLA, Laufzeit)." },
  "entities/shipments.yml": { id: "entities/shipments.yml", kind: "semantic", name: "entities/shipments.yml", blurb: "Sendungen — Status, Produkt, Kanton, Laufzeit." },
  "entities/customers.yml": { id: "entities/customers.yml", kind: "semantic", name: "entities/customers.yml", blurb: "Geschäftskunden — Segment, Volumen, Vertrag, Region." },
  "entities/tariffs.yml": { id: "entities/tariffs.yml", kind: "semantic", name: "entities/tariffs.yml", blurb: "Tarife — Produkt, Preis, Gewichtsstufe, Laufzeit." },
  "entities/service_points.yml": { id: "entities/service_points.yml", kind: "semantic", name: "entities/service_points.yml", blurb: "Poststellen — Öffnungszeiten, Services, Standort." },
  "entities/service_disruptions.yml": { id: "entities/service_disruptions.yml", kind: "semantic", name: "entities/service_disruptions.yml", blurb: "Störungen — Region, Impact, Zeitraum, Status." },
  "entities/service_pages.yml": { id: "entities/service_pages.yml", kind: "semantic", name: "entities/service_pages.yml", blurb: "Service-Seiten-Quellen für redaktionelle Drafts." },
  "guides/delivery-operations.md": { id: "guides/delivery-operations.md", kind: "semantic", name: "guides/delivery-operations.md", blurb: "Wie man Zustell-SLA, Volumen und Störungen liest." },
  "guides/service-catalog.md": { id: "guides/service-catalog.md", kind: "semantic", name: "guides/service-catalog.md", blurb: "Produkt- und Tarifkatalog — Vergleichslogik." },
}

export interface InfraBlock extends Block {
  readonly kind: "infra"
  readonly tag: string
  readonly icon: PostIconName
  readonly spot: string
}

export const INFRA: Record<string, InfraBlock> = {
  "ai-sdk": {
    id: "ai-sdk",
    kind: "infra",
    name: "AI SDK",
    tag: "open-source model toolkit",
    icon: "brain",
    blurb:
      "Vercels open-source TypeScript-Toolkit: ein provider-agnostisches Interface (generateText / streamText), strukturierte Outputs, Tool-Calling und UI-Streaming.",
    spot: "lib/agent.ts — der AI-SDK Model-Loop + Tool-Calling.",
  },
  "ai-gateway": {
    id: "ai-gateway",
    kind: "infra",
    name: "AI Gateway",
    tag: "ein Endpoint · OIDC · keine Keys",
    icon: "network",
    blurb: "Ein Endpoint für das Modell via OIDC — keine Provider-Keys zu verwalten.",
    spot: "model: ein Gateway-Endpoint, keine Keys.",
  },
  sandbox: {
    id: "sandbox",
    kind: "infra",
    name: "Vercel Sandbox",
    tag: "isolierte, ephemere Compute",
    icon: "server",
    blurb:
      "Isolierte, ephemere microVMs, in denen jeder Turn Tools und bash ausführt — der Semantic Layer wird eingehängt.",
    spot: "agent/sandbox — Semantic Layer auf /workspace gemountet.",
  },
  workflow: {
    id: "workflow",
    kind: "infra",
    name: "Workflow SDK",
    tag: "durable Turns · suspend/resume",
    icon: "history",
    blurb: "Durable Turns + der Editorial-Review-Workflow mit suspend/resume.",
    spot: "workflows/editorial-review — durable draft→review→publish.",
  },
  "fluid-compute": {
    id: "fluid-compute",
    kind: "infra",
    name: "Fluid Compute",
    tag: "skaliert auf null",
    icon: "flash",
    blurb: "Skaliert mit der Arbeit — bis auf null, während ein Turn im Review parkt.",
    spot: "Turns parken mit null Compute, während ein Workflow suspendiert.",
  },
  observability: {
    id: "observability",
    kind: "infra",
    name: "Observability",
    tag: "Traces über jeden Schritt",
    icon: "heartpulse",
    blurb: "Workflow-Run-Tags + Traces für jeden Schritt, Tool-Call und Token.",
    spot: "Run-Tags + Traces pro Step/Tool/Token.",
  },
  connect: {
    id: "connect",
    kind: "infra",
    name: "Vercel Connect",
    tag: "sichere private Konnektivität",
    icon: "key",
    blurb:
      "Verbindet Agents sicher mit privaten Backends über scoped, kurzlebige Credentials — keine langlebigen Secrets.",
    spot: "Scoped, kurzlebige Neon-Credentials für den Agenten.",
  },
  security: {
    id: "security",
    kind: "infra",
    name: "Vercel Security",
    tag: "BotID heute · Passport als Nächstes",
    icon: "maskshield",
    blurb:
      "Die Security-Familie vor dem Harness: BotID blockt automatisierten Traffic ohne CAPTCHA, Passport bringt Identity-Aware-Access.",
    spot: "BotID schützt Chat/Webhook-Routen; Passport folgt.",
  },
  "ai-elements": {
    id: "ai-elements",
    kind: "infra",
    name: "AI Elements + json-render",
    tag: "das DX- & UI-Layer",
    icon: "dashboard",
    blurb: "Die streamende Chat-Oberfläche plus modell-authorierte generative UI über den Render-Katalog.",
    spot: "components/* — Streaming-Chat + generative UI-Blöcke.",
  },
}

export const ALL_BLOCKS: Record<string, Block> = { ...SKILLS, ...TOOLS, ...SEMANTIC, ...INFRA }

/* -------------------------------------------------------------------------- */
/* Which persona composes which blocks                                         */
/* -------------------------------------------------------------------------- */

const SHARED_TOOLS = ["query_database", "read_semantic_doc", "bash", "load_skill", "finalize_answer"]
const ALL_SEMANTIC = Object.keys(SEMANTIC)
const ALL_INFRA = Object.keys(INFRA)

export const SHARED_TOOL_SET = new Set(SHARED_TOOLS)

export interface PersonaComposition {
  readonly skills: readonly string[]
  readonly tools: readonly string[]
  readonly semantic: readonly string[]
  readonly infra: readonly string[]
}

export const PERSONA_BLOCKS: Record<PersonaId, PersonaComposition> = {
  kundenservice: {
    skills: ["build-rich-answers", "render-dashboard", "swisspost-comparison"],
    tools: [...SHARED_TOOLS],
    semantic: ALL_SEMANTIC,
    infra: ALL_INFRA,
  },
  filiale: {
    skills: ["swisspost-account-briefing", "swisspost-portfolio-scan", "swisspost-comparison", "watchlist"],
    tools: [...SHARED_TOOLS, "save_report", "save_watchlist", "refresh_watchlist"],
    semantic: ALL_SEMANTIC,
    infra: ALL_INFRA,
  },
  kommunikation: {
    skills: ["swisspost-service-page-drafter", "swisspost-service-page-reviser", "digest", "build-rich-answers"],
    tools: [...SHARED_TOOLS, "create_article_draft", "update_article_draft", "publish_article", "save_digest"],
    semantic: ALL_SEMANTIC,
    infra: ALL_INFRA,
  },
}

/** Personas that compose a given block (any category). Powers "reused ×N". */
export function personasUsingBlock(blockId: string): PersonaId[] {
  return PERSONA_ORDER.filter((p) => {
    const c = PERSONA_BLOCKS[p]
    return (
      c.skills.includes(blockId) ||
      c.tools.includes(blockId) ||
      c.semantic.includes(blockId) ||
      c.infra.includes(blockId)
    )
  })
}

export function reuseCount(blockId: string): number {
  return personasUsingBlock(blockId).length
}

export function writeToolCount(p: PersonaId): number {
  return PERSONA_BLOCKS[p].tools.filter((t) => !SHARED_TOOL_SET.has(t)).length
}

/* -------------------------------------------------------------------------- */
/* Scripted runs — read → act → artifact on a durable workflow.                */
/* A choreographed, deterministic visualization sourced here — not a live call. */
/* -------------------------------------------------------------------------- */

export type RunLane = "channel" | "harness" | "model" | "tool" | "approval" | "done"

export type ChannelLine = { actor: "user" | "agent" | "system"; text: string; emphasis?: boolean }

export type RunStep = {
  lane: RunLane
  event: string
  note: string
  cmd?: string
  stdout?: string
  say?: ChannelLine
  /** A durable suspend — the turn parks here with zero compute. */
  pause?: boolean
  /** Block ids active at this step — lights the shared anatomy. */
  uses?: string[]
  /** Primitive id active at this step. */
  infra?: string
  produces?: "report" | "watchlist" | "draft" | "digest" | "answer"
  chart?: boolean
}

export interface Showcase {
  readonly personaId: PersonaId
  readonly request: string
  readonly outcome: string
  readonly run: RunStep[]
}

export const SHOWCASES: Record<PersonaId, Showcase> = {
  kundenservice: {
    personaId: "kundenservice",
    request: "Priority-Pakete in Bearbeitung nach Kanton — mit Chart.",
    outcome: "Ein reiches, teilbares Dashboard — Chart + Rangliste — in den Chat gestreamt.",
    run: [
      {
        lane: "channel",
        event: "turn.started",
        note: "Kundenservice fragt im Web-Chat. Eine durable Session und ein Turn beginnen.",
        infra: "fluid-compute",
        say: { actor: "user", text: "Zeig alle heute in Bearbeitung befindlichen Priority-Pakete nach Kanton mit Chart." },
      },
      {
        lane: "harness",
        event: "boot sandbox",
        note: "Bootet die Sandbox, mountet den Semantic Layer, lädt die Dashboard-Skills.",
        infra: "sandbox",
        uses: ["render-dashboard", "build-rich-answers", "load_skill", "catalog.yml"],
      },
      {
        lane: "model",
        event: "reason",
        note: "Greppt den Semantic Layer und liest das Sendungs-Schema, bevor SQL geschrieben wird.",
        infra: "ai-gateway",
        cmd: "grep -ril 'kanton' semantic-layer/",
        stdout: "entities/shipments.yml, metrics.yml",
        uses: ["bash", "read_semantic_doc", "SCHEMA.md", "entities/shipments.yml"],
      },
      {
        lane: "tool",
        event: "query_database",
        note: "Führt eine read-only SQL-Query für die Kanton-Rangliste aus.",
        cmd: "select canton, count(*) from shipments where product='priority' and status='in_processing' group by 1 order by 2 desc",
        stdout: "26 Kantone",
        uses: ["query_database"],
        say: { actor: "agent", text: "Priority-Volumen für alle 26 Kantone geladen." },
      },
      {
        lane: "tool",
        event: "create_chart",
        note: "Baut eine Balkenchart-Spec für die Rangliste.",
        uses: ["build-rich-answers"],
        chart: true,
      },
      {
        lane: "done",
        event: "finalize_answer",
        note: "Emittiert die strukturierte Antwort; AI Elements + json-render rendern das Dashboard.",
        infra: "observability",
        uses: ["finalize_answer", "ai-elements"],
        produces: "answer",
        say: { actor: "system", text: "Dashboard bereit — Chart + Rangliste.", emphasis: true },
      },
    ],
  },
  filiale: {
    personaId: "filiale",
    request: "Account-Briefing für einen Top-E-Commerce-Kunden — dann speichern.",
    outcome: "Ein gespeichertes Report-Artefakt in der Library — Volumen, Service-Mix, SLA, Risiken.",
    run: [
      {
        lane: "channel",
        event: "turn.started",
        note: "Ein KAM fragt nach einem vollen Account-Briefing. Der Turn beginnt.",
        infra: "fluid-compute",
        say: { actor: "user", text: "Account-Briefing für unseren Top-E-Commerce-Kunden — mit Volumen, Service-Mix, Risiken — dann speichern." },
      },
      {
        lane: "harness",
        event: "boot sandbox",
        note: "Bootet die Sandbox und lädt die Briefing- + Portfolio-Skills.",
        infra: "sandbox",
        uses: ["swisspost-account-briefing", "swisspost-portfolio-scan", "load_skill"],
      },
      {
        lane: "model",
        event: "reason",
        note: "Liest den Kunden-Guide, dann das Kunden- und Volumen-Profil.",
        infra: "ai-gateway",
        cmd: "cat semantic-layer/entities/customers.yml",
        stdout: "segment, volume, contract, sla",
        uses: ["read_semantic_doc", "guides/delivery-operations.md", "entities/customers.yml"],
      },
      {
        lane: "tool",
        event: "query_database",
        note: "Liest Sendungsvolumen, Service-Mix und SLA des Kunden.",
        cmd: "select month, parcels, letters, sla_pct from customer_volume where customer_id = $1 order by 1",
        stdout: "12 Monate · Service-Mix aggregiert",
        uses: ["query_database"],
        say: { actor: "agent", text: "Volumen, Service-Mix und SLA zusammengestellt." },
      },
      {
        lane: "approval",
        event: "session.waiting",
        note: "Ein Artefakt zu persistieren läuft als durable Workflow-Step — der Turn parkt hier mit null Compute und resumt von exakt diesem Punkt.",
        infra: "workflow",
        pause: true,
        uses: ["save_report"],
      },
      {
        lane: "tool",
        event: "save_report",
        note: "Der Turn resumt und persistiert das Briefing in die Library.",
        infra: "connect",
        uses: ["save_report"],
        produces: "report",
        say: { actor: "system", text: "Case-Briefing in der Library gespeichert.", emphasis: true },
      },
      {
        lane: "done",
        event: "turn.completed",
        note: "Das Briefing streamt zurück. Jeder Schritt wurde getract.",
        infra: "observability",
      },
    ],
  },
  kommunikation: {
    personaId: "kommunikation",
    request: "Service-Meldung aus aktuellen Störungen entwerfen und durch das Review führen.",
    outcome: "Ein Draft angelegt (in_review), auf Wunsch überarbeitet, dann publiziert — ein durable Workflow.",
    run: [
      {
        lane: "channel",
        event: "turn.started",
        note: "Eine Störung landet; der Editorial-Review-Workflow startet.",
        infra: "fluid-compute",
        say: { actor: "user", text: "Entwirf eine post.ch Service-Meldung aus den aktuellen Störungen und leg einen Draft für die Redaktion an." },
      },
      {
        lane: "harness",
        event: "boot sandbox",
        note: "Lädt die Drafter- + Digest-Skills; liest die Störungs-Zeilen.",
        infra: "sandbox",
        uses: ["swisspost-service-page-drafter", "digest", "entities/service_disruptions.yml"],
      },
      {
        lane: "tool",
        event: "create_article_draft",
        note: "Entwirft die Service-Seite aus DB-Events; Status wird in_review.",
        infra: "workflow",
        uses: ["create_article_draft"],
        produces: "draft",
        say: { actor: "agent", text: "Draft angelegt und ins Review eingereiht." },
      },
      {
        lane: "approval",
        event: "session.waiting",
        note: "Der durable Workflow suspendiert an einem Hook — null Compute — während der Draft in_review liegt, und resumt exakt dort.",
        infra: "workflow",
        pause: true,
        uses: ["update_article_draft"],
      },
      {
        lane: "tool",
        event: "resumeHook · revise",
        note: "Beim Resume überarbeitet der Workflow den Draft und schleift zurück durchs Review.",
        infra: "workflow",
        uses: ["update_article_draft"],
        say: { actor: "system", text: "Überarbeitet → zurück in der Queue." },
      },
      {
        lane: "tool",
        event: "resumeHook · publish_article",
        note: "Beim Resume publiziert der Workflow die Service-Seite auf post.ch.",
        infra: "connect",
        uses: ["publish_article"],
        say: { actor: "system", text: "Auf post.ch publiziert.", emphasis: true },
      },
      {
        lane: "done",
        event: "turn.completed",
        note: "Publiziert. Der ganze durable Run ist end-to-end getract.",
        infra: "observability",
      },
    ],
  },
}

/* -------------------------------------------------------------------------- */
/* Build / Run / Govern layers                                                 */
/* -------------------------------------------------------------------------- */

export type LayerId = "build" | "run" | "govern"

export const LAYERS: { id: LayerId; title: string; blurb: string; infra: string[] }[] = [
  {
    id: "build",
    title: "Build",
    blurb: "Den Harness als Ordner von Dateien schreiben — Instruktionen, Skills, Tools, Semantic Layer.",
    infra: ["ai-sdk", "ai-elements"],
  },
  {
    id: "run",
    title: "Run",
    blurb: "Jeder Turn läuft durable in einer Sandbox, erreicht über ein Gateway, skaliert auf null beim Parken.",
    infra: ["sandbox", "ai-gateway", "workflow", "fluid-compute"],
  },
  {
    id: "govern",
    title: "Govern",
    blurb: "Scoped Credentials, Security-Kontrollen und End-to-End-Traces über jeden Schritt.",
    infra: ["observability", "connect", "security"],
  },
]

/* Headline counters for the hero strip. */
export const HARNESS_STATS = {
  personas: PERSONA_ORDER.length,
  skills: Object.keys(SKILLS).length,
  semantic: Object.keys(SEMANTIC).length,
  primitives: Object.keys(INFRA).length,
}
