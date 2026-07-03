import type { PillarId } from "./story";

/**
 * Harness registry — the single source of truth for the "one harness, many
 * agents" explainer (`app/harness`) and the print deck (`app/deck`).
 *
 * Everything here is sourced truthfully from the real Football0 agent surface:
 *   - skills      → agent/skills/*            (8 skills)
 *   - tools       → agent/tools/*             (10 authored) + sandbox defaults
 *   - subagents   → none (single-agent harness + one sandbox)
 *   - semantic    → agent/sandbox/workspace/semantic-layer/**
 *   - infra       → Vercel primitives, each tied to a concrete file/spot
 *
 * The three personas (Fan / Scout / Internal, see lib/personas.ts) are NOT
 * three agents — they are one harness reused, differing only in which skills
 * and write-tools they compose. The reuse counts and `agentsUsingBlock` helper
 * make that legible. Modeled on the commercetools presentation-data.ts pattern.
 */

export type PersonaId = "fan" | "scout" | "internal";

export const PERSONA_META: Record<
  PersonaId,
  { name: string; surface: string; channel: string; tagline: string }
> = {
  fan: {
    name: "Fan",
    surface: "Chat · rich answers & savable dashboards",
    channel: "Web (Eve channel)",
    tagline: "Explore Bundesliga data with charts and dashboards.",
  },
  scout: {
    name: "Scout",
    surface: "Chat · signing cases, watchlists & reports",
    channel: "Web (Eve channel)",
    tagline: "Deep scouting with saveable reports and watchlists.",
  },
  internal: {
    name: "Internal",
    surface: "Editorial desk · drafts, digests & publish",
    channel: "Web (Eve channel) + editorial workflow",
    tagline: "Draft from DB events, review, and publish.",
  },
};

export const PERSONA_ORDER: PersonaId[] = ["fan", "scout", "internal"];

/* -------------------------------------------------------------------------- */
/* Shared building blocks                                                      */
/* -------------------------------------------------------------------------- */

export type BlockKind = "skill" | "tool" | "subagent" | "semantic" | "infra";

export interface Block {
  readonly id: string;
  readonly kind: BlockKind;
  readonly name: string;
  readonly blurb: string;
  /** For tools: framework default (sandbox) vs authored in agent/tools. */
  readonly source?: "authored" | "framework";
}

export const SKILLS: Record<string, Block> = {
  "build-rich-answers": {
    id: "build-rich-answers",
    kind: "skill",
    name: "build-rich-answers",
    blurb: "Charts, tables, cards, and finalize_answer payloads for any analytical answer.",
  },
  "render-dashboard": {
    id: "render-dashboard",
    kind: "skill",
    name: "render-dashboard",
    blurb: "Transfermarkt-style dashboards: leaderboards, rumour boards, age pyramids.",
  },
  "squad-comparison": {
    id: "squad-comparison",
    kind: "skill",
    name: "squad-comparison",
    blurb: "Side-by-side club/player comparison — value, age, depth, head-to-head.",
  },
  "scouting-report": {
    id: "scouting-report",
    kind: "skill",
    name: "scouting-report",
    blurb: "In-depth single-player report — profile, value trajectory, role, outlook.",
  },
  "transfer-market-analysis": {
    id: "transfer-market-analysis",
    kind: "skill",
    name: "transfer-market-analysis",
    blurb: "Rumours, linked moves, fees, expiring contracts, value movers.",
  },
  watchlist: {
    id: "watchlist",
    kind: "skill",
    name: "watchlist",
    blurb: "Build and save player watchlists with refresh-and-diff over time.",
  },
  "article-drafter": {
    id: "article-drafter",
    kind: "skill",
    name: "article-drafter",
    blurb: "Draft editorial articles from news / transfer_rumors rows for review.",
  },
  digest: {
    id: "digest",
    kind: "skill",
    name: "digest",
    blurb: "Compile transfer-rumour digests from the database for editorial.",
  },
};

export const TOOLS: Record<string, Block> = {
  // Shared, authored.
  query_database: {
    id: "query_database",
    kind: "tool",
    name: "query_database",
    blurb: "Single read-only SELECT/WITH query against the Bundesliga Postgres.",
    source: "authored",
  },
  create_chart: {
    id: "create_chart",
    kind: "tool",
    name: "create_chart",
    blurb: "Validate and emit a Football chart spec for the renderer.",
    source: "authored",
  },
  finalize_answer: {
    id: "finalize_answer",
    kind: "tool",
    name: "finalize_answer",
    blurb: "Emit the structured final answer (answer, charts, table, cards, refs).",
    source: "authored",
  },
  // Scout write-tools — the persona-specific additions to the shared core.
  save_report: {
    id: "save_report",
    kind: "tool",
    name: "save_report",
    blurb: "Persist a scouting report to the Library.",
    source: "authored",
  },
  save_watchlist: {
    id: "save_watchlist",
    kind: "tool",
    name: "save_watchlist",
    blurb: "Persist a player watchlist (with snapshot).",
    source: "authored",
  },
  refresh_watchlist: {
    id: "refresh_watchlist",
    kind: "tool",
    name: "refresh_watchlist",
    blurb: "Refresh a watchlist with current values and show diffs.",
    source: "authored",
  },
  // Internal write-tools — the persona-specific additions to the shared core.
  create_article_draft: {
    id: "create_article_draft",
    kind: "tool",
    name: "create_article_draft",
    blurb: "Create an article draft (status in_review).",
    source: "authored",
  },
  update_article_draft: {
    id: "update_article_draft",
    kind: "tool",
    name: "update_article_draft",
    blurb: "Update an article draft's content or status.",
    source: "authored",
  },
  publish_article: {
    id: "publish_article",
    kind: "tool",
    name: "publish_article",
    blurb: "Publish a reviewed draft to the feed.",
    source: "authored",
  },
  save_digest: {
    id: "save_digest",
    kind: "tool",
    name: "save_digest",
    blurb: "Persist a transfer-rumour digest to the Library.",
    source: "authored",
  },
  // Shared framework defaults — the sandbox filesystem tools.
  bash: {
    id: "bash",
    kind: "tool",
    name: "bash / run",
    blurb: "Run shell commands in the sandbox — grep/cat over the semantic layer.",
    source: "framework",
  },
  read_file: {
    id: "read_file",
    kind: "tool",
    name: "read_file",
    blurb: "Read a file from the mounted /workspace semantic layer.",
    source: "framework",
  },
  load_skill: {
    id: "load_skill",
    kind: "tool",
    name: "load_skill",
    blurb: "Pull a skill's instructions into the turn on demand.",
    source: "framework",
  },
};

/**
 * Subagents: none. Football0 is a deliberately simple harness — one model, one
 * sandbox, skills loaded on demand. Kept as an explicit (empty) category so the
 * explainer can state the design choice rather than imply a gap.
 */
export const SUBAGENTS: Record<string, Block> = {};

export const SEMANTIC: Record<string, Block> = {
  "catalog.yml": {
    id: "catalog.yml",
    kind: "semantic",
    name: "catalog.yml",
    blurb: "Top-level index of entities, metrics, and guides.",
  },
  "SCHEMA.md": {
    id: "SCHEMA.md",
    kind: "semantic",
    name: "SCHEMA.md",
    blurb: "Table + column reference for clubs, players, transfer_rumors, news.",
  },
  "README.md": {
    id: "README.md",
    kind: "semantic",
    name: "README.md",
    blurb: "How to navigate the semantic layer.",
  },
  "glossary.yml": {
    id: "glossary.yml",
    kind: "semantic",
    name: "glossary.yml",
    blurb: "Domain terms — market value, position groups, contract status.",
  },
  "metrics.yml": {
    id: "metrics.yml",
    kind: "semantic",
    name: "metrics.yml",
    blurb: "Reusable metric definitions (squad value, age, value-per-minute).",
  },
  "entities/clubs.yml": {
    id: "entities/clubs.yml",
    kind: "semantic",
    name: "entities/clubs.yml",
    blurb: "Clubs entity — squad value, average age, stadium, manager.",
  },
  "entities/players.yml": {
    id: "entities/players.yml",
    kind: "semantic",
    name: "entities/players.yml",
    blurb: "Players entity — value, position, age, output, contract.",
  },
  "entities/transfer_rumors.yml": {
    id: "entities/transfer_rumors.yml",
    kind: "semantic",
    name: "entities/transfer_rumors.yml",
    blurb: "Transfer rumours — linked club, fee, probability, status.",
  },
  "entities/news.yml": {
    id: "entities/news.yml",
    kind: "semantic",
    name: "entities/news.yml",
    blurb: "News entity — headline, category, linked club/player.",
  },
  "guides/market-values.md": {
    id: "guides/market-values.md",
    kind: "semantic",
    name: "guides/market-values.md",
    blurb: "How market values are expressed and compared.",
  },
  "guides/positions.md": {
    id: "guides/positions.md",
    kind: "semantic",
    name: "guides/positions.md",
    blurb: "Position groups and role taxonomy.",
  },
  "guides/squad-building.md": {
    id: "guides/squad-building.md",
    kind: "semantic",
    name: "guides/squad-building.md",
    blurb: "Squad depth, age curves, and balance heuristics.",
  },
  "guides/transfers.md": {
    id: "guides/transfers.md",
    kind: "semantic",
    name: "guides/transfers.md",
    blurb: "How to read rumours, fees, and probability.",
  },
};

export const INFRA: Record<string, Block> = {
  "ai-sdk": {
    id: "ai-sdk",
    kind: "infra",
    name: "AI SDK",
    blurb:
      "Vercel's open-source TypeScript AI toolkit: one provider-agnostic interface (generateText / streamText), structured outputs, tool calling, and UI streaming.",
  },
  "ai-gateway": {
    id: "ai-gateway",
    kind: "infra",
    name: "AI Gateway",
    blurb: "One endpoint for the model (anthropic/claude-opus-4.8) via OIDC — no provider keys.",
  },
  workflow: {
    id: "workflow",
    kind: "infra",
    name: "Workflow SDK",
    blurb: "Durable turns + the editorial-review workflow (workflows/editorial-review.ts) with suspend/resume.",
  },
  sandbox: {
    id: "sandbox",
    kind: "infra",
    name: "Vercel Sandbox",
    blurb:
      "Isolated, ephemeral microVMs where each turn's tools and bash run — fast, secure code execution; the semantic layer mounts in (agent/sandbox/sandbox.ts).",
  },
  "fluid-compute": {
    id: "fluid-compute",
    kind: "infra",
    name: "Fluid Compute",
    blurb: "Scales with the work, down to zero while a turn is parked for review.",
  },
  observability: {
    id: "observability",
    kind: "infra",
    name: "Observability",
    blurb: "Workflow run tags + traces for every step, tool call, and token.",
  },
  connect: {
    id: "connect",
    kind: "infra",
    name: "Vercel Connect",
    blurb:
      "Securely connect AI apps and agents to external systems and private backends with scoped, short-lived credentials — no long-lived secrets to leak.",
  },
  security: {
    id: "security",
    kind: "infra",
    name: "Vercel Security",
    blurb:
      "The security family in front of the harness: BotID blocks automated traffic without CAPTCHA, and Passport will add identity-aware access for protected agent experiences.",
  },
  "ai-elements": {
    id: "ai-elements",
    kind: "infra",
    name: "AI Elements",
    blurb: "The streaming chat UI primitives (components/ai-elements/*).",
  },
  "json-render": {
    id: "json-render",
    kind: "infra",
    name: "json-render",
    blurb: "Model-authored generative UI via the render catalog (components/render/catalog.tsx).",
  },
};

export const ALL_BLOCKS: Record<string, Block> = {
  ...SKILLS,
  ...TOOLS,
  ...SUBAGENTS,
  ...SEMANTIC,
  ...INFRA,
};

/* -------------------------------------------------------------------------- */
/* Which persona uses which blocks                                             */
/* -------------------------------------------------------------------------- */

const SHARED_TOOLS = ["query_database", "create_chart", "finalize_answer", "bash", "read_file", "load_skill"];
const ALL_SEMANTIC = Object.keys(SEMANTIC);
const ALL_INFRA = Object.keys(INFRA);

export interface PersonaComposition {
  readonly skills: readonly string[];
  readonly tools: readonly string[];
  readonly subagents: readonly string[];
  readonly semantic: readonly string[];
  readonly infra: readonly string[];
}

export const PERSONA_BLOCKS: Record<PersonaId, PersonaComposition> = {
  fan: {
    skills: ["build-rich-answers", "render-dashboard", "squad-comparison"],
    tools: [...SHARED_TOOLS],
    subagents: [],
    semantic: ALL_SEMANTIC,
    infra: ALL_INFRA,
  },
  scout: {
    skills: ["scouting-report", "transfer-market-analysis", "squad-comparison", "watchlist"],
    tools: [...SHARED_TOOLS, "save_report", "save_watchlist", "refresh_watchlist"],
    subagents: [],
    semantic: ALL_SEMANTIC,
    infra: ALL_INFRA,
  },
  internal: {
    skills: ["article-drafter", "digest", "build-rich-answers"],
    tools: [...SHARED_TOOLS, "create_article_draft", "update_article_draft", "publish_article", "save_digest"],
    subagents: [],
    semantic: ALL_SEMANTIC,
    infra: ALL_INFRA,
  },
};

/** Personas that compose a given block (any category). Powers "reused by N". */
export function agentsUsingBlock(blockId: string): PersonaId[] {
  return PERSONA_ORDER.filter((p) => {
    const c = PERSONA_BLOCKS[p];
    return (
      c.skills.includes(blockId) ||
      c.tools.includes(blockId) ||
      c.subagents.includes(blockId) ||
      c.semantic.includes(blockId) ||
      c.infra.includes(blockId)
    );
  });
}

export function reuseCount(blockId: string): number {
  return agentsUsingBlock(blockId).length;
}

/* -------------------------------------------------------------------------- */
/* The three layers: Build / Run / Govern                                      */
/* -------------------------------------------------------------------------- */

export type LayerId = "build" | "run" | "govern";

export const LAYERS: { id: LayerId; title: string; blurb: string; infra: string[] }[] = [
  {
    id: "build",
    title: "Build",
    blurb: "Author the harness as a folder of files — instructions, skills, tools, semantic layer.",
    infra: ["ai-sdk", "json-render", "ai-elements"],
  },
  {
    id: "run",
    title: "Run",
    blurb: "Each turn executes durably in a sandbox, reached through one gateway, scaling to zero when parked.",
    infra: ["sandbox", "ai-gateway", "workflow", "fluid-compute"],
  },
  {
    id: "govern",
    title: "Govern",
    blurb: "Scoped credentials, security controls, and end-to-end traces over every step.",
    infra: ["observability", "connect", "security"],
  },
];

/* -------------------------------------------------------------------------- */
/* Technical foundations — each tied to a concrete Football0 spot              */
/* -------------------------------------------------------------------------- */

export const FOUNDATIONS: { infraId: string; spot: string }[] = [
  { infraId: "ai-sdk", spot: "agent/agent.ts — the AI SDK model loop + tool calling, configured by defineAgent." },
  { infraId: "workflow", spot: "workflows/editorial-review.ts — durable draft→review→publish." },
  { infraId: "sandbox", spot: "agent/sandbox/sandbox.ts — semantic layer mounted at /workspace." },
  { infraId: "ai-elements", spot: "components/ai-elements/* — the streaming chat surface." },
  { infraId: "json-render", spot: "components/render/catalog.tsx — model-authored UI blocks." },
  { infraId: "ai-gateway", spot: "model: anthropic/claude-opus-4.8 — one endpoint, no keys." },
  { infraId: "fluid-compute", spot: "Turns park with zero compute while a durable workflow is suspended." },
  { infraId: "observability", spot: "Workflow run tags + traces per step/tool/token." },
  { infraId: "connect", spot: "Scoped, short-lived Supabase + WhatsApp credentials for AI apps and agents." },
  { infraId: "security", spot: "BotID guards chat/webhook routes today; Passport adds identity-aware access next." },
];

/* -------------------------------------------------------------------------- */
/* d0 / bash-filesystem KPIs (Vercel "we removed 80% of our agent's tools")    */
/* -------------------------------------------------------------------------- */

export type Kpi = {
  id: "time" | "tokens" | "success";
  label: string;
  simple: string;
  heavy: string;
  delta: string;
};

export const HARNESS_KPIS: Kpi[] = [
  { id: "time", label: "Time", simple: "77s", heavy: "275s", delta: "3.5× faster" },
  { id: "tokens", label: "Tokens", simple: "~61k", heavy: "~97k", delta: "~37% fewer" },
  { id: "success", label: "Success", simple: "100%", heavy: "80%", delta: "+20 pts" },
];

/* -------------------------------------------------------------------------- */
/* Pillar view — maps the strategic story (lib/story.ts) to real blocks        */
/*                                                                             */
/* The three pillars are argued in lib/story.ts; here we ground each one in    */
/* the concrete agent surface that PROVES it. The redesigned /deck and         */
/* /harness consume these so a claim on a slide always resolves to real        */
/* skills, tools, semantic files, and infra — never hand-waved copy.           */
/* -------------------------------------------------------------------------- */

/** Block ids, grouped by category, that evidence a single pillar. */
export interface PillarEvidence {
  /** INFRA ids — the Vercel primitives that back the pillar. */
  readonly infra: readonly string[];
  /** SKILL ids — authored capabilities that demonstrate the pillar. */
  readonly skills: readonly string[];
  /** TOOL ids — typically the persona-specific write-tools and shared read-tools. */
  readonly tools: readonly string[];
  /** SEMANTIC ids — semantic-layer files reused across personas. */
  readonly semantic: readonly string[];
}

const WRITE_TOOLS = [
  "save_report",
  "save_watchlist",
  "refresh_watchlist",
  "create_article_draft",
  "update_article_draft",
  "publish_article",
  "save_digest",
];

/**
 * Truthful mapping from each pillar to the registry blocks that evidence it.
 * Ids are validated against the registry by `assertPillarEvidence()` below, so
 * a typo or a removed block fails fast rather than rendering a dead reference.
 */
export const PILLAR_EVIDENCE: Record<PillarId, PillarEvidence> = {
  // Headless & composable: one model + one sandbox, with skills + the shared
  // read-tools composed per persona. Proof = the full skill library reused.
  "headless-composable": {
    infra: ["ai-sdk", "sandbox"],
    skills: Object.keys(SKILLS),
    tools: ["query_database", "create_chart", "finalize_answer", "load_skill", "read_file", "bash"],
    semantic: [],
  },
  // Data foundation: the semantic layer is the asset; the model greps it with
  // bash + read_file. Proof = the full semantic layer + the filesystem tools.
  "data-foundation": {
    infra: ["sandbox", "ai-sdk", "ai-gateway"],
    skills: [],
    tools: ["bash", "read_file", "query_database", "load_skill"],
    semantic: Object.keys(SEMANTIC),
  },
  // Build vs. buy: the marginal agent is a few write-tools on managed infra —
  // no new stack. Proof = the persona-specific write-tools + the run infra.
  "build-vs-buy": {
    infra: ["workflow", "ai-gateway", "observability", "fluid-compute", "connect", "security"],
    skills: [],
    tools: WRITE_TOOLS,
    semantic: [],
  },
};

/** Flat, ordered list of every block id that evidences a pillar. */
export function pillarBlockIds(pillarId: PillarId): string[] {
  const e = PILLAR_EVIDENCE[pillarId];
  return [...e.infra, ...e.skills, ...e.tools, ...e.semantic];
}

/** Resolved Block objects evidencing a pillar (unknown ids are dropped). */
export function pillarBlocks(pillarId: PillarId): Block[] {
  return pillarBlockIds(pillarId)
    .map((id) => ALL_BLOCKS[id])
    .filter((b): b is Block => Boolean(b));
}

/** Resolved INFRA blocks for a pillar — the primitives to spotlight. */
export function pillarInfra(pillarId: PillarId): Block[] {
  return PILLAR_EVIDENCE[pillarId].infra
    .map((id) => INFRA[id])
    .filter((b): b is Block => Boolean(b));
}

/** The FOUNDATIONS entries (infra + concrete spot) backing a pillar. */
export function pillarFoundations(pillarId: PillarId): { infraId: string; spot: string }[] {
  const infraIds = new Set(PILLAR_EVIDENCE[pillarId].infra);
  return FOUNDATIONS.filter((f) => infraIds.has(f.infraId));
}

/**
 * Dev-time integrity check: every id referenced by a pillar must exist in the
 * registry. Keeps the strategic copy and the real agent surface in lockstep.
 * Throws on the first dangling id so drift is caught at import in development.
 */
function assertPillarEvidence(): void {
  for (const [pillarId, evidence] of Object.entries(PILLAR_EVIDENCE)) {
    for (const id of [...evidence.infra, ...evidence.skills, ...evidence.tools, ...evidence.semantic]) {
      if (!ALL_BLOCKS[id]) {
        throw new Error(`PILLAR_EVIDENCE[${pillarId}] references unknown block id "${id}"`);
      }
    }
  }
}

if (process.env.NODE_ENV !== "production") {
  assertPillarEvidence();
}

/* -------------------------------------------------------------------------- */
/* Scripted runs — read → act → artifact on a durable workflow.                */
/* Structured to later bind to real Eve NDJSON stream events.                   */
/* -------------------------------------------------------------------------- */

export type RunLane = "channel" | "harness" | "model" | "tool" | "approval" | "done";

export type ChannelLine = {
  actor: "user" | "agent" | "system";
  text: string;
  emphasis?: boolean;
};

export type RunStep = {
  lane: RunLane;
  event: string; // short mono label / Eve stream event
  note: string;
  cmd?: string;
  stdout?: string;
  say?: ChannelLine;
  pause?: boolean; // a durable suspend — the turn parks here with zero compute
  uses?: string[]; // block ids active at this step — lights the anatomy
  infra?: string; // primitive id active
  produces?: "report" | "article" | "watchlist" | "digest" | "answer";
};

export interface Showcase {
  readonly personaId: PersonaId;
  readonly request: string;
  readonly outcome: string;
  readonly run: RunStep[];
}

export const SHOWCASES: Record<PersonaId, Showcase> = {
  fan: {
    personaId: "fan",
    request: "Build a dashboard ranking every Bundesliga club by squad market value.",
    outcome: "A rich, savable dashboard — chart + leaderboard — streamed into the chat.",
    run: [
      {
        lane: "channel",
        event: "turn.started",
        note: "A fan asks in the web chat. A durable session and turn begin.",
        infra: "fluid-compute",
        say: { actor: "user", text: "Rank all Bundesliga clubs by squad value, with a chart." },
      },
      {
        lane: "harness",
        event: "boot sandbox",
        note: "Boots the sandbox, mounts the semantic layer, loads the dashboard skills.",
        infra: "sandbox",
        uses: ["render-dashboard", "build-rich-answers", "load_skill", "catalog.yml"],
      },
      {
        lane: "model",
        event: "reason",
        note: "Reads the schema to find the squad-value column before querying.",
        infra: "ai-gateway",
        uses: ["read_file", "SCHEMA.md", "entities/clubs.yml"],
      },
      {
        lane: "tool",
        event: "query_database",
        note: "Runs one read-only SQL query for the club value ranking.",
        cmd: "select name, squad_market_value_eur from club_value_ranking order by 2 desc",
        stdout: "18 clubs ranked",
        uses: ["query_database"],
        say: { actor: "agent", text: "Pulled squad values for all 18 clubs." },
      },
      {
        lane: "tool",
        event: "create_chart",
        note: "Builds a boxy bar chart spec for the ranking.",
        uses: ["create_chart"],
      },
      {
        lane: "done",
        event: "finalize_answer",
        note: "Emits the structured answer; AI Elements + json-render render the dashboard.",
        infra: "observability",
        uses: ["finalize_answer", "json-render", "ai-elements"],
        produces: "answer",
        say: { actor: "system", text: "Dashboard ready — chart + leaderboard.", emphasis: true },
      },
    ],
  },
  scout: {
    personaId: "scout",
    request: "Build a signing-case scouting report on Jamal Musiala and save it.",
    outcome: "A saved report artifact in the Library — fit, value, risk, comparables.",
    run: [
      {
        lane: "channel",
        event: "turn.started",
        note: "A scout asks for a full signing case. The turn begins.",
        infra: "fluid-compute",
        say: { actor: "user", text: "Full signing-case report on Musiala — then save it." },
      },
      {
        lane: "harness",
        event: "boot sandbox",
        note: "Boots the sandbox and loads the scouting + market skills.",
        infra: "sandbox",
        uses: ["scouting-report", "transfer-market-analysis", "load_skill"],
      },
      {
        lane: "model",
        event: "reason",
        note: "Greps the player guide, then queries the player's profile + value.",
        infra: "ai-gateway",
        uses: ["bash", "guides/market-values.md", "entities/players.yml"],
      },
      {
        lane: "tool",
        event: "query_database",
        note: "Reads Musiala's profile, output, and comparables.",
        cmd: "select name, age, market_value_eur, goals, assists from players where name ilike '%musiala%'",
        stdout: "1 row · comparables fetched",
        uses: ["query_database"],
        say: { actor: "agent", text: "Profile, output, and comparables assembled." },
      },
      {
        lane: "approval",
        event: "session.waiting",
        note: "Persisting an artifact runs as a durable workflow step, so the turn parks here — zero compute — then resumes from this exact point.",
        infra: "workflow",
        pause: true,
        uses: ["save_report"],
      },
      {
        lane: "tool",
        event: "save_report",
        note: "The turn resumes and persists the report to the Library.",
        infra: "connect",
        uses: ["save_report"],
        produces: "report",
        say: { actor: "system", text: "Report saved to the Library.", emphasis: true },
      },
      {
        lane: "done",
        event: "turn.completed",
        note: "The report streams back. Every step was traced.",
        infra: "observability",
      },
    ],
  },
  internal: {
    personaId: "internal",
    request: "Draft an article from the latest high-probability rumour and run it through review.",
    outcome: "A draft created (in_review), revised on request, then published — a durable workflow.",
    run: [
      {
        lane: "channel",
        event: "turn.started / simulate-rumor",
        note: "A rumour lands; the editorial-review workflow starts.",
        infra: "fluid-compute",
        say: { actor: "user", text: "Draft an article from the top rumour and queue it for review." },
      },
      {
        lane: "harness",
        event: "boot sandbox",
        note: "Loads the article-drafter + digest skills; reads the rumour row.",
        infra: "sandbox",
        uses: ["article-drafter", "digest", "entities/transfer_rumors.yml"],
      },
      {
        lane: "tool",
        event: "create_article_draft",
        note: "Drafts the article from DB events; status becomes in_review.",
        infra: "workflow",
        uses: ["create_article_draft"],
        produces: "article",
        say: { actor: "agent", text: "Draft created and queued for review." },
      },
      {
        lane: "approval",
        event: "session.waiting",
        note: "The durable workflow suspends on a hook — zero compute — while the draft sits in_review, then resumes exactly where it left off.",
        infra: "workflow",
        pause: true,
        uses: ["update_article_draft"],
      },
      {
        lane: "tool",
        event: "resumeHook · revise",
        note: "On resume the workflow revises the draft and loops back through review.",
        infra: "workflow",
        uses: ["update_article_draft"],
        say: { actor: "system", text: "Revised → back in the queue." },
      },
      {
        lane: "tool",
        event: "resumeHook · publish_article",
        note: "On resume the workflow publishes the article to the feed.",
        infra: "connect",
        uses: ["publish_article"],
        say: { actor: "system", text: "Published to the feed.", emphasis: true },
      },
      {
        lane: "done",
        event: "turn.completed",
        note: "Published. The whole durable run is traced end to end.",
        infra: "observability",
      },
    ],
  },
};
