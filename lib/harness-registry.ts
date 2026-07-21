import type { PostIconName } from "@/components/post-icon"
import { pick, type Locale, type Localized } from "@/lib/i18n/config"

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
 * User-facing prose is authored in EN/DE/FR (`Localized<string>`); identifiers
 * (skill/tool/file/product names, SQL, bash) stay language-neutral. Call
 * `getRegistry(locale)` to get fully-resolved plain-string structures for the
 * UI. Composition helpers below are locale-independent (they key off ids only).
 */

type T = Localized<string>

export type PersonaId = "route-copilot" | "store-coach" | "playbook-manager"

export const PERSONA_ORDER: PersonaId[] = ["route-copilot", "store-coach", "playbook-manager"]

/* -------------------------------------------------------------------------- */
/* Personas                                                                    */
/* -------------------------------------------------------------------------- */

type Accent = { color: string; soft: string; on: string }

interface RawPersonaMeta {
  readonly id: PersonaId
  readonly name: T
  readonly surface: T
  readonly channel: T
  readonly tagline: T
  readonly icon: PostIconName
  readonly accent: Accent
}

export interface PersonaMeta {
  readonly id: PersonaId
  readonly name: string
  readonly surface: string
  readonly channel: string
  readonly tagline: string
  readonly icon: PostIconName
  readonly accent: Accent
}

const RAW_PERSONA_META: Record<PersonaId, RawPersonaMeta> = {
  "route-copilot": {
    id: "route-copilot",
    name: { en: "Route & Huddle Copilot", de: "Route & Huddle Copilot", fr: "Route & Huddle Copilot" },
    surface: {
      en: "Morning huddle · route priorities",
      de: "Morning Huddle · Routenprioritäten",
      fr: "Morning huddle · priorités de tournée",
    },
    channel: { en: "Web + mobile field view", de: "Web + Mobile Field View", fr: "Web + vue mobile terrain" },
    tagline: {
      en: "Turn market signals into a focused route brief and store-by-store priorities.",
      de: "Marktsignale in ein fokussiertes Routenbriefing und Store-Prioritäten übersetzen.",
      fr: "Transformer les signaux marché en briefing de tournée et priorités par magasin.",
    },
    icon: "parcel",
    accent: { color: "var(--sp-red)", soft: "var(--sp-red-soft)", on: "#ffffff" },
  },
  "store-coach": {
    id: "store-coach",
    name: { en: "In-Store Predictive Coach", de: "In-Store Predictive Coach", fr: "In-Store Predictive Coach" },
    surface: {
      en: "Store visit · next best actions",
      de: "Store Visit · Next Best Actions",
      fr: "Visite magasin · meilleures actions",
    },
    channel: { en: "Mobile field assistant", de: "Mobiler Field Assistant", fr: "Assistant mobile terrain" },
    tagline: {
      en: "Diagnose availability and visibility gaps, then create an evidence-based visit plan.",
      de: "Availability- und Visibility-Gaps diagnostizieren und einen evidenzbasierten Besuchsplan erstellen.",
      fr: "Diagnostiquer les écarts de disponibilité et visibilité, puis créer un plan de visite factuel.",
    },
    icon: "branch",
    accent: { color: "var(--sp-blue)", soft: "var(--sp-blue-soft)", on: "#ffffff" },
  },
  "playbook-manager": {
    id: "playbook-manager",
    name: { en: "Market Playbook Manager", de: "Market Playbook Manager", fr: "Market Playbook Manager" },
    surface: {
      en: "Market workspace · govern & publish",
      de: "Market Workspace · Steuern & Publizieren",
      fr: "Workspace marché · gouverner et publier",
    },
    channel: {
      en: "Web + governed approval workflow",
      de: "Web + kontrollierter Approval-Workflow",
      fr: "Web + workflow d'approbation gouverné",
    },
    tagline: {
      en: "Convert market strategy into transparent assignment rules, preview impact, approve and publish.",
      de: "Marktstrategie in transparente Assignment-Regeln übersetzen, Wirkung prüfen, freigeben und publizieren.",
      fr: "Convertir la stratégie marché en règles transparentes, prévisualiser, approuver et publier.",
    },
    icon: "newspaper",
    accent: { color: "var(--sp-yellow)", soft: "var(--sp-yellow-soft)", on: "var(--sp-ink)" },
  },
}

/* -------------------------------------------------------------------------- */
/* Shared building blocks                                                      */
/* -------------------------------------------------------------------------- */

export type BlockKind = "skill" | "tool" | "semantic" | "infra"

interface RawBlock {
  readonly id: string
  readonly kind: BlockKind
  readonly name: string
  readonly blurb: T
  readonly source?: "authored" | "framework"
}

export interface Block {
  readonly id: string
  readonly kind: BlockKind
  readonly name: string
  readonly blurb: string
  readonly source?: "authored" | "framework"
}

const RAW_SKILLS: Record<string, RawBlock> = {
  "build-rich-answers": {
    id: "build-rich-answers",
    kind: "skill",
    name: "build-rich-answers",
    blurb: {
      en: "Charts, tables, maps and finalize_answer payloads for every analytical answer.",
      de: "Charts, Tabellen, Karten und finalize_answer-Payloads für jede analytische Antwort.",
      fr: "Graphiques, tableaux, cartes et payloads finalize_answer pour chaque réponse analytique.",
    },
  },
  "prioritize-route": {
    id: "prioritize-route",
    kind: "skill",
    name: "prioritize-route",
    blurb: {
      en: "Post dashboards: rankings, disruption boards, volume curves by canton.",
      de: "Post-Dashboards: Ranglisten, Störungs-Boards, Volumen-Kurven nach Kanton.",
      fr: "Tableaux de bord Post : classements, tableaux de perturbations, courbes de volume par canton.",
    },
  },
  "compare-store-execution": {
    id: "compare-store-execution",
    kind: "skill",
    name: "compare-store-execution",
    blurb: {
      en: "Compare tariffs, branches or customers — price, transit time, volume, head-to-head.",
      de: "Vergleich von Tarifen, Filialen oder Kunden — Preis, Laufzeit, Volumen, Head-to-Head.",
      fr: "Comparer tarifs, store-coachs ou clients — prix, délai, volume, face à face.",
    },
  },
  "diagnose-store-execution": {
    id: "diagnose-store-execution",
    kind: "skill",
    name: "diagnose-store-execution",
    blurb: {
      en: "Deep account briefing per business customer — volume, service mix, SLA, risks.",
      de: "Tiefes Account-Briefing je Geschäftskunde — Volumen, Service-Mix, SLA, Risiken.",
      fr: "Dossier de compte approfondi par client commercial — volume, mix de services, SLA, risques.",
    },
  },
  "recommend-next-best-actions": {
    id: "recommend-next-best-actions",
    kind: "skill",
    name: "recommend-next-best-actions",
    blurb: {
      en: "Portfolio scan across regions/customers — volume movers, contract risks, outliers.",
      de: "Portfolio-Scan über Regionen/Kunden — Volumen-Mover, Vertragsrisiken, Ausreisser.",
      fr: "Scan de portefeuille par régions/clients — variations de volume, risques contractuels, valeurs aberrantes.",
    },
  },
  "visit-planning": {
    id: "visit-planning",
    kind: "skill",
    name: "visit-planning",
    blurb: {
      en: "Build and save customer/branch visit-plannings, with refresh-and-diff over time.",
      de: "Kunden-/Filial-Watchlists bauen und speichern, mit Refresh-und-Diff über die Zeit.",
      fr: "Créer et enregistrer des visit-plannings clients/store-coachs, avec rafraîchissement et diff dans le temps.",
    },
  },
  "author-market-playbook": {
    id: "author-market-playbook",
    kind: "skill",
    name: "author-market-playbook",
    blurb: {
      en: "Drafts post.ch service pages from service_pages / service_disruptions for review.",
      de: "Entwirft post.ch Service-Seiten aus service_pages / service_disruptions für das Review.",
      fr: "Rédige des pages de service post.ch depuis service_pages / service_disruptions pour relecture.",
    },
  },
  "review-playbook-impact": {
    id: "review-playbook-impact",
    kind: "skill",
    name: "review-playbook-impact",
    blurb: {
      en: "Granular draft revisions — headline, dek, paragraphs, pull quotes, sources.",
      de: "Granulare Draft-Revisionen — Headline, Dek, Absätze, Pull-Quotes, Quellen.",
      fr: "Révisions granulaires de brouillon — titre, chapô, paragraphes, citations, sources.",
    },
  },
  digest: {
    id: "digest",
    kind: "skill",
    name: "digest",
    blurb: {
      en: "Bundles several service pages into one customer-friendly digest.",
      de: "Bündelt mehrere Service-Seiten zu einem kundenfreundlichen Digest.",
      fr: "Regroupe plusieurs pages de service en un digest clair pour les clients.",
    },
  },
}

const RAW_TOOLS: Record<string, RawBlock> = {
  query_database: {
    id: "query_database",
    kind: "tool",
    name: "query_database",
    blurb: {
      en: "A single read-only SELECT against the Swiss Post Postgres (Neon).",
      de: "Ein einzelnes read-only SELECT gegen die Swiss Post Postgres (Neon).",
      fr: "Un seul SELECT en lecture seule sur la base Postgres Swiss Post (Neon).",
    },
    source: "authored",
  },
  read_semantic_doc: {
    id: "read_semantic_doc",
    kind: "tool",
    name: "read_semantic_doc",
    blurb: {
      en: "Reads an entity field spec (entities/*.yml) or an answering guide (guides/*.md).",
      de: "Liest ein Entity-Feldspec (entities/*.yml) oder einen Answering-Guide (guides/*.md).",
      fr: "Lit une spec de champs d'entité (entities/*.yml) ou un guide de réponse (guides/*.md).",
    },
    source: "authored",
  },
  bash: {
    id: "bash",
    kind: "tool",
    name: "bash / run",
    blurb: {
      en: "Shell in the sandbox — grep/cat across the semantic layer before the SQL.",
      de: "Shell im Sandbox — grep/cat über den Semantic Layer vor dem SQL.",
      fr: "Shell dans la sandbox — grep/cat sur la couche sémantique avant le SQL.",
    },
    source: "framework",
  },
  load_skill: {
    id: "load_skill",
    kind: "tool",
    name: "load_skill",
    blurb: {
      en: "Pulls a skill's instructions into the turn on demand.",
      de: "Zieht die Instruktionen eines Skills bei Bedarf in den Turn.",
      fr: "Charge les instructions d'un skill dans le tour à la demande.",
    },
    source: "framework",
  },
  finalize_answer: {
    id: "finalize_answer",
    kind: "tool",
    name: "finalize_answer",
    blurb: {
      en: "Emits the structured final answer (answer, charts, table, cards, refs).",
      de: "Emittiert die strukturierte finale Antwort (answer, charts, table, cards, refs).",
      fr: "Émet la réponse finale structurée (answer, charts, table, cards, refs).",
    },
    source: "authored",
  },
  save_route_brief: {
    id: "save_route_brief",
    kind: "tool",
    name: "save_route_brief",
    blurb: {
      en: "Saves a route briefing with huddle priorities and store objectives.",
      de: "Speichert ein Routenbriefing mit Huddle-Prioritäten und Store-Zielen.",
      fr: "Enregistre un briefing de tournée avec priorités et objectifs magasin.",
    },
    source: "authored",
  },
  create_visit_plan: {
    id: "create_visit_plan",
    kind: "tool",
    name: "create_visit_plan",
    blurb: {
      en: "Creates evidence-based assignments for a planned store visit.",
      de: "Erstellt evidenzbasierte Assignments für einen geplanten Store Visit.",
      fr: "Crée des missions factuelles pour une visite magasin planifiée.",
    },
    source: "authored",
  },
  complete_assignment: {
    id: "complete_assignment",
    kind: "tool",
    name: "complete_assignment",
    blurb: {
      en: "Completes a visit assignment and records field evidence.",
      de: "Schliesst ein Visit Assignment ab und erfasst Field Evidence.",
      fr: "Termine une mission de visite et enregistre les preuves terrain.",
    },
    source: "authored",
  },
  save_visit_summary: {
    id: "save_visit_summary",
    kind: "tool",
    name: "save_visit_summary",
    blurb: {
      en: "Persists the visit outcome, Perfect Store score and follow-ups.",
      de: "Speichert Visit Outcome, Perfect Store Score und Follow-ups.",
      fr: "Enregistre le résultat, le score Perfect Store et les suivis.",
    },
    source: "authored",
  },
  preview_playbook: {
    id: "preview_playbook",
    kind: "tool",
    name: "preview_playbook",
    blurb: {
      en: "Previews which stores and assignments a proposed rule set would create.",
      de: "Zeigt vorab, welche Stores und Assignments ein Regelwerk erzeugen würde.",
      fr: "Prévisualise les magasins et missions générés par les règles proposées.",
    },
    source: "authored",
  },
  publish_playbook: {
    id: "publish_playbook",
    kind: "tool",
    name: "publish_playbook",
    blurb: {
      en: "Publishes an approved market playbook with a versioned audit trail.",
      de: "Publiziert ein freigegebenes Market Playbook mit versioniertem Audit Trail.",
      fr: "Publie un playbook marché approuvé avec piste d'audit versionnée.",
    },
    source: "authored",
  },
}

function sem(id: string, en: string, de: string, fr: string): RawBlock {
  return { id, kind: "semantic", name: id, blurb: { en, de, fr } }
}

const RAW_SEMANTIC: Record<string, RawBlock> = {
  "catalog.yml": sem(
    "catalog.yml",
    "Top-level index of entities, metrics and guides.",
    "Top-Level-Index von Entities, Metriken und Guides.",
    "Index de haut niveau des entités, métriques et guides.",
  ),
  "SCHEMA.md": sem(
    "SCHEMA.md",
    "Table and column reference for all entities.",
    "Tabellen- und Spaltenreferenz für alle Entities.",
    "Référence des tables et colonnes pour toutes les entités.",
  ),
  "README.md": sem(
    "README.md",
    "How to navigate the semantic layer.",
    "Wie man den Semantic Layer navigiert.",
    "Comment naviguer dans la couche sémantique.",
  ),
  "glossary.yml": sem(
    "glossary.yml",
    "Domain terms — map user words to columns.",
    "Domänenbegriffe — Nutzerwörter auf Spalten mappen.",
    "Termes du domaine — associer les mots des utilisateurs aux colonnes.",
  ),
  "metrics.yml": sem(
    "metrics.yml",
    "Canonical KPI definitions with sql_hints (volume, SLA, transit time).",
    "Kanonische KPI-Definitionen mit sql_hints (Volumen, SLA, Laufzeit).",
    "Définitions canoniques des KPI avec sql_hints (volume, SLA, délai).",
  ),
  "entities/stores.yml": sem(
    "entities/stores.yml",
    "Stores — account, format, location and priority score.",
    "Stores — Account, Format, Standort und Priority Score.",
    "Magasins — compte, format, emplacement et score de priorité.",
  ),
  "entities/products.yml": sem(
    "entities/products.yml",
    "Products — category, pack size and priority status.",
    "Produkte — Kategorie, Packungsgrösse und Prioritätsstatus.",
    "Produits — catégorie, format et statut prioritaire.",
  ),
  "entities/store_product_performance.yml": sem(
    "entities/store_product_performance.yml",
    "Weekly sales, OSA, facings and planogram compliance by store and SKU.",
    "Wöchentliche Sales, OSA, Facings und Planogram Compliance je Store und SKU.",
    "Ventes, OSA, facings et conformité planogramme par magasin et SKU.",
  ),
  "entities/key_account_agreements.yml": sem(
    "entities/key_account_agreements.yml",
    "Active account clauses and minimum visibility commitments.",
    "Aktive Account-Klauseln und Mindest-Visibility-Commitments.",
    "Clauses actives et engagements minimum de visibilité.",
  ),
  "entities/routes.yml": sem(
    "entities/routes.yml",
    "Daily routes, ordered stops and store objectives.",
    "Tagesrouten, geordnete Stopps und Store-Ziele.",
    "Tournées quotidiennes, arrêts ordonnés et objectifs magasin.",
  ),
  "entities/store_visits.yml": sem(
    "entities/store_visits.yml",
    "Visit status, Perfect Store score, assignments and evidence.",
    "Visit-Status, Perfect Store Score, Assignments und Evidence.",
    "Statut de visite, score Perfect Store, missions et preuves.",
  ),
  "entities/market_playbooks.yml": sem(
    "entities/market_playbooks.yml",
    "Versioned assignment rules and publication state by market.",
    "Versionierte Assignment-Regeln und Publikationsstatus je Markt.",
    "Règles de mission versionnées et statut de publication par marché.",
  ),
  "guides/route-huddle.md": sem(
    "guides/route-huddle.md",
    "How to prioritize a route and prepare the morning huddle.",
    "Wie eine Route priorisiert und das Morning Huddle vorbereitet wird.",
    "Comment prioriser une tournée et préparer le morning huddle.",
  ),
  "guides/in-store-coaching.md": sem(
    "guides/in-store-coaching.md",
    "How to diagnose availability and visibility gaps in store.",
    "Wie Availability- und Visibility-Gaps im Store diagnostiziert werden.",
    "Comment diagnostiquer les écarts de disponibilité et visibilité.",
  ),
  "guides/playbook-authoring.md": sem(
    "guides/playbook-authoring.md",
    "How to author, preview, approve and publish market rules.",
    "Wie Marktregeln erstellt, geprüft, freigegeben und publiziert werden.",
    "Comment rédiger, prévisualiser, approuver et publier les règles marché.",
  ),
}

interface RawInfraBlock extends RawBlock {
  readonly kind: "infra"
  readonly tag: T
  readonly icon: PostIconName
  readonly spot: T
}

export interface InfraBlock extends Block {
  readonly kind: "infra"
  readonly tag: string
  readonly icon: PostIconName
  readonly spot: string
}

const RAW_INFRA: Record<string, RawInfraBlock> = {
  "ai-sdk": {
    id: "ai-sdk",
    kind: "infra",
    name: "AI SDK",
    tag: {
      en: "open-source model toolkit",
      de: "open-source model toolkit",
      fr: "boîte à outils de modèles open source",
    },
    icon: "brain",
    blurb: {
      en: "Vercel's open-source TypeScript toolkit: a provider-agnostic interface (generateText / streamText), structured outputs, tool calling and UI streaming.",
      de: "Vercels open-source TypeScript-Toolkit: ein provider-agnostisches Interface (generateText / streamText), strukturierte Outputs, Tool-Calling und UI-Streaming.",
      fr: "La boîte à outils TypeScript open source de Vercel : une interface agnostique (generateText / streamText), sorties structurées, appel d'outils et streaming UI.",
    },
    spot: {
      en: "lib/agent.ts — the AI SDK model loop + tool calling.",
      de: "lib/agent.ts — der AI-SDK Model-Loop + Tool-Calling.",
      fr: "lib/agent.ts — la boucle de modèle AI SDK + appel d'outils.",
    },
  },
  "ai-gateway": {
    id: "ai-gateway",
    kind: "infra",
    name: "AI Gateway",
    tag: {
      en: "one endpoint · OIDC · no keys",
      de: "ein Endpoint · OIDC · keine Keys",
      fr: "un endpoint · OIDC · sans clés",
    },
    icon: "network",
    blurb: {
      en: "One endpoint for the model via OIDC — no provider keys to manage.",
      de: "Ein Endpoint für das Modell via OIDC — keine Provider-Keys zu verwalten.",
      fr: "Un seul endpoint pour le modèle via OIDC — aucune clé de fournisseur à gérer.",
    },
    spot: {
      en: "model: one gateway endpoint, no keys.",
      de: "model: ein Gateway-Endpoint, keine Keys.",
      fr: "model : un endpoint de gateway, sans clés.",
    },
  },
  sandbox: {
    id: "sandbox",
    kind: "infra",
    name: "Vercel Sandbox",
    tag: {
      en: "isolated, ephemeral compute",
      de: "isolierte, ephemere Compute",
      fr: "compute isolé et éphémère",
    },
    icon: "server",
    blurb: {
      en: "Isolated, ephemeral microVMs where each turn runs tools and bash — the semantic layer is mounted in.",
      de: "Isolierte, ephemere microVMs, in denen jeder Turn Tools und bash ausführt — der Semantic Layer wird eingehängt.",
      fr: "Des microVM isolées et éphémères où chaque tour exécute des outils et bash — la couche sémantique y est montée.",
    },
    spot: {
      en: "agent/sandbox — semantic layer mounted on /workspace.",
      de: "agent/sandbox — Semantic Layer auf /workspace gemountet.",
      fr: "agent/sandbox — couche sémantique montée sur /workspace.",
    },
  },
  workflow: {
    id: "workflow",
    kind: "infra",
    name: "Workflow SDK",
    tag: {
      en: "durable turns · suspend/resume",
      de: "durable Turns · suspend/resume",
      fr: "tours durables · suspend/resume",
    },
    icon: "history",
    blurb: {
      en: "Durable turns + the editorial review workflow with suspend/resume.",
      de: "Durable Turns + der Editorial-Review-Workflow mit suspend/resume.",
      fr: "Tours durables + le workflow de relecture éditoriale avec suspend/resume.",
    },
    spot: {
      en: "workflows/editorial-review — durable draft→review→publish.",
      de: "workflows/editorial-review — durable draft→review→publish.",
      fr: "workflows/editorial-review — draft→review→publish durable.",
    },
  },
  "fluid-compute": {
    id: "fluid-compute",
    kind: "infra",
    name: "Fluid Compute",
    tag: { en: "scales to zero", de: "skaliert auf null", fr: "descend à zéro" },
    icon: "flash",
    blurb: {
      en: "Scales with the work — down to zero while a turn parks in review.",
      de: "Skaliert mit der Arbeit — bis auf null, während ein Turn im Review parkt.",
      fr: "S'adapte au travail — jusqu'à zéro pendant qu'un tour attend en relecture.",
    },
    spot: {
      en: "Turns park with zero compute while a workflow is suspended.",
      de: "Turns parken mit null Compute, während ein Workflow suspendiert.",
      fr: "Les tours attendent avec zéro compute pendant qu'un workflow est suspendu.",
    },
  },
  observability: {
    id: "observability",
    kind: "infra",
    name: "Observability",
    tag: {
      en: "traces across every step",
      de: "Traces über jeden Schritt",
      fr: "traces sur chaque étape",
    },
    icon: "heartpulse",
    blurb: {
      en: "Workflow run tags + traces for every step, tool call and token.",
      de: "Workflow-Run-Tags + Traces für jeden Schritt, Tool-Call und Token.",
      fr: "Tags de run de workflow + traces pour chaque étape, appel d'outil et token.",
    },
    spot: {
      en: "Run tags + traces per step/tool/token.",
      de: "Run-Tags + Traces pro Step/Tool/Token.",
      fr: "Tags de run + traces par étape/outil/token.",
    },
  },
  connect: {
    id: "connect",
    kind: "infra",
    name: "Vercel Connect",
    tag: {
      en: "secure private connectivity",
      de: "sichere private Konnektivität",
      fr: "connectivité privée sécurisée",
    },
    icon: "key",
    blurb: {
      en: "Connects agents securely to private backends via scoped, short-lived credentials — no long-lived secrets.",
      de: "Verbindet Agents sicher mit privaten Backends über scoped, kurzlebige Credentials — keine langlebigen Secrets.",
      fr: "Connecte les agents en toute sécurité aux backends privés via des identifiants limités et éphémères — aucun secret durable.",
    },
    spot: {
      en: "Scoped, short-lived Neon credentials for the agent.",
      de: "Scoped, kurzlebige Neon-Credentials für den Agenten.",
      fr: "Identifiants Neon limités et éphémères pour l'agent.",
    },
  },
  security: {
    id: "security",
    kind: "infra",
    name: "Vercel Security",
    tag: {
      en: "BotID today · Passport next",
      de: "BotID heute · Passport als Nächstes",
      fr: "BotID aujourd'hui · Passport ensuite",
    },
    icon: "maskshield",
    blurb: {
      en: "The security family in front of the harness: BotID blocks automated traffic without CAPTCHA, Passport brings identity-aware access.",
      de: "Die Security-Familie vor dem Harness: BotID blockt automatisierten Traffic ohne CAPTCHA, Passport bringt Identity-Aware-Access.",
      fr: "La famille sécurité devant le harness : BotID bloque le trafic automatisé sans CAPTCHA, Passport apporte un accès basé sur l'identité.",
    },
    spot: {
      en: "BotID protects chat/webhook routes; Passport follows.",
      de: "BotID schützt Chat/Webhook-Routen; Passport folgt.",
      fr: "BotID protège les routes chat/webhook ; Passport suit.",
    },
  },
  "ai-elements": {
    id: "ai-elements",
    kind: "infra",
    name: "AI Elements + json-render",
    tag: { en: "the DX & UI layer", de: "das DX- & UI-Layer", fr: "la couche DX et UI" },
    icon: "dashboard",
    blurb: {
      en: "The streaming chat surface plus model-authored generative UI via the render catalog.",
      de: "Die streamende Chat-Oberfläche plus modell-authorierte generative UI über den Render-Katalog.",
      fr: "L'interface de chat en streaming plus une UI générative écrite par le modèle via le catalogue de rendu.",
    },
    spot: {
      en: "components/* — streaming chat + generative UI blocks.",
      de: "components/* — Streaming-Chat + generative UI-Blöcke.",
      fr: "components/* — chat en streaming + blocs d'UI générative.",
    },
  },
}

/* -------------------------------------------------------------------------- */
/* Composition — which persona composes which blocks (locale-independent)      */
/* -------------------------------------------------------------------------- */

const SHARED_TOOLS = ["query_database", "read_semantic_doc", "bash", "load_skill", "finalize_answer"]
const ALL_SEMANTIC = Object.keys(RAW_SEMANTIC)
const ALL_INFRA = Object.keys(RAW_INFRA)

export const SHARED_TOOL_SET = new Set(SHARED_TOOLS)

export interface PersonaComposition {
  readonly skills: readonly string[]
  readonly tools: readonly string[]
  readonly semantic: readonly string[]
  readonly infra: readonly string[]
}

export const PERSONA_BLOCKS: Record<PersonaId, PersonaComposition> = {
  "route-copilot": {
    skills: ["build-rich-answers", "prioritize-route", "compare-store-execution"],
    tools: [...SHARED_TOOLS, "save_route_brief"],
    semantic: ALL_SEMANTIC,
    infra: ALL_INFRA,
  },
  "store-coach": {
    skills: ["diagnose-store-execution", "recommend-next-best-actions", "compare-store-execution", "visit-planning"],
    tools: [...SHARED_TOOLS, "create_visit_plan", "complete_assignment", "save_visit_summary"],
    semantic: ALL_SEMANTIC,
    infra: ALL_INFRA,
  },
  "playbook-manager": {
    skills: ["author-market-playbook", "review-playbook-impact", "digest", "build-rich-answers"],
    tools: [...SHARED_TOOLS, "preview_playbook", "publish_playbook"],
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

type RawChannelLine = { actor: "user" | "agent" | "system"; text: T; emphasis?: boolean }

type RawRunStep = {
  lane: RunLane
  event: string
  note: T
  cmd?: string
  stdout?: T
  say?: RawChannelLine
  pause?: boolean
  uses?: string[]
  infra?: string
  produces?: "report" | "watchlist" | "draft" | "digest" | "answer"
  chart?: boolean
}

interface RawShowcase {
  readonly personaId: PersonaId
  readonly request: T
  readonly outcome: T
  readonly run: RawRunStep[]
}

/* Resolved (plain-string) shapes the UI consumes. */
export type ChannelLine = { actor: "user" | "agent" | "system"; text: string; emphasis?: boolean }
export type RunStep = {
  lane: RunLane
  event: string
  note: string
  cmd?: string
  stdout?: string
  say?: ChannelLine
  pause?: boolean
  uses?: string[]
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

const RAW_SHOWCASES: Record<PersonaId, RawShowcase> = {
  "route-copilot": {
    personaId: "route-copilot",
    request: {
      en: "Build today’s Zürich route brief — rank stores by execution risk and show the priorities.",
      de: "Priority-Pakete in Bearbeitung nach Kanton — mit Chart.",
      fr: "Colis Priority en traitement par canton — avec un graphique.",
    },
    outcome: {
      en: "A focused route briefing — ranked stops, execution risks and huddle priorities — streamed into the field view.",
      de: "Ein reiches, teilbares Dashboard — Chart + Rangliste — in den Chat gestreamt.",
      fr: "Un tableau de bord riche et partageable — graphique + classement — diffusé dans le chat.",
    },
    run: [
      {
        lane: "channel",
        event: "turn.started",
        note: {
          en: "Customer Service asks in the web chat. A durable session and a turn begin.",
          de: "Kundenservice fragt im Web-Chat. Eine durable Session und ein Turn beginnen.",
          fr: "Le service clientèle pose sa question dans le chat web. Une session durable et un tour démarrent.",
        },
        infra: "fluid-compute",
        say: {
          actor: "user",
          text: {
            en: "Build today’s Zürich route brief. Rank my stops by execution risk and show the top store priorities.",
            de: "Zeig alle heute in Bearbeitung befindlichen Priority-Pakete nach Kanton mit Chart.",
            fr: "Affiche tous les colis Priority en traitement aujourd'hui par canton, avec un graphique.",
          },
        },
      },
      {
        lane: "harness",
        event: "boot sandbox",
        note: {
          en: "Boots the sandbox, mounts the semantic layer, loads the dashboard skills.",
          de: "Bootet die Sandbox, mountet den Semantic Layer, lädt die Dashboard-Skills.",
          fr: "Démarre la sandbox, monte la couche sémantique, charge les skills de tableau de bord.",
        },
        infra: "sandbox",
        uses: ["prioritize-route", "build-rich-answers", "load_skill", "catalog.yml"],
      },
      {
        lane: "model",
        event: "reason",
        note: {
          en: "Greps the semantic layer and reads the shipments schema before writing SQL.",
          de: "Greppt den Semantic Layer und liest das Sendungs-Schema, bevor SQL geschrieben wird.",
          fr: "Parcourt la couche sémantique et lit le schéma des envois avant d'écrire le SQL.",
        },
        infra: "ai-gateway",
        cmd: "grep -ril 'canton' semantic-layer/",
        stdout: {
          en: "entities/routes.yml, metrics.yml",
          de: "entities/routes.yml, metrics.yml",
          fr: "entities/routes.yml, metrics.yml",
        },
        uses: ["bash", "read_semantic_doc", "SCHEMA.md", "entities/routes.yml"],
      },
      {
        lane: "tool",
        event: "query_database",
        note: {
          en: "Runs a read-only SQL query for the canton ranking.",
          de: "Führt eine read-only SQL-Query für die Kanton-Rangliste aus.",
          fr: "Exécute une requête SQL en lecture seule pour le classement par canton.",
        },
        cmd: "select s.name, s.priority_score, min(sp.on_shelf_availability_pct) as osa from route_stops rs join stores s on s.id=rs.store_id join store_product_performance sp on sp.store_id=s.id where rs.route_id=$1 group by 1,2 order by 2 desc",
        stdout: { en: "26 cantons", de: "26 Kantone", fr: "26 cantons" },
        uses: ["query_database"],
        say: {
          actor: "agent",
          text: {
            en: "Loaded Priority volume for all 26 cantons.",
            de: "Priority-Volumen für alle 26 Kantone geladen.",
            fr: "Volume Priority chargé pour les 26 cantons.",
          },
        },
      },
      {
        lane: "tool",
        event: "create_chart",
        note: {
          en: "Builds a bar-chart spec for the ranking.",
          de: "Baut eine Balkenchart-Spec für die Rangliste.",
          fr: "Construit une spec de graphique en barres pour le classement.",
        },
        uses: ["build-rich-answers"],
        chart: true,
      },
      {
        lane: "done",
        event: "finalize_answer",
        note: {
          en: "Emits the structured answer; AI Elements + json-render render the dashboard.",
          de: "Emittiert die strukturierte Antwort; AI Elements + json-render rendern das Dashboard.",
          fr: "Émet la réponse structurée ; AI Elements + json-render affichent le tableau de bord.",
        },
        infra: "observability",
        uses: ["finalize_answer", "ai-elements"],
        produces: "answer",
        say: {
          actor: "system",
          text: {
            en: "Dashboard ready — chart + ranking.",
            de: "Dashboard bereit — Chart + Rangliste.",
            fr: "Tableau de bord prêt — graphique + classement.",
          },
          emphasis: true,
        },
      },
    ],
  },
  "store-coach": {
    personaId: "store-coach",
    request: {
      en: "Coach my Coop Zürich HB visit — diagnose the gaps and create the visit plan.",
      de: "Account-Briefing für einen Top-E-Commerce-Kunden — dann speichern.",
      fr: "Dossier de compte pour un grand client e-commerce — puis l'enregistrer.",
    },
    outcome: {
      en: "A saved visit plan — OSA gaps, facing gaps, account clauses and next best actions.",
      de: "Ein gespeichertes Report-Artefakt in der Library — Volumen, Service-Mix, SLA, Risiken.",
      fr: "Un artefact de rapport enregistré dans la bibliothèque — volume, mix de services, SLA, risques.",
    },
    run: [
      {
        lane: "channel",
        event: "turn.started",
        note: {
          en: "A field sales rep opens the next store visit. The coaching turn begins.",
          de: "Ein KAM fragt nach einem vollen Account-Briefing. Der Turn beginnt.",
          fr: "Un KAM demande un dossier de compte complet. Le tour démarre.",
        },
        infra: "fluid-compute",
        say: {
          actor: "user",
          text: {
            en: "Coach my Coop Zürich HB visit — show OSA and facing gaps, active agreements and the next best actions — then create the visit plan.",
            de: "Account-Briefing für unseren Top-E-Commerce-Kunden — mit Volumen, Service-Mix, Risiken — dann speichern.",
            fr: "Dossier de compte pour notre grand client e-commerce — avec volume, mix de services, risques — puis l'enregistrer.",
          },
        },
      },
      {
        lane: "harness",
        event: "boot sandbox",
        note: {
          en: "Boots the sandbox and loads the briefing + portfolio skills.",
          de: "Bootet die Sandbox und lädt die Briefing- + Portfolio-Skills.",
          fr: "Démarre la sandbox et charge les skills de dossier + portefeuille.",
        },
        infra: "sandbox",
        uses: ["diagnose-store-execution", "recommend-next-best-actions", "load_skill"],
      },
      {
        lane: "model",
        event: "reason",
        note: {
          en: "Reads the customer guide, then the customer and volume profile.",
          de: "Liest den Kunden-Guide, dann das Kunden- und Volumen-Profil.",
          fr: "Lit le guide client, puis le profil du client et des volumes.",
        },
        infra: "ai-gateway",
        cmd: "cat semantic-layer/entities/store_product_performance.yml",
        stdout: {
          en: "segment, volume, contract, sla",
          de: "segment, volume, contract, sla",
          fr: "segment, volume, contract, sla",
        },
        uses: ["read_semantic_doc", "guides/delivery-operations.md", "entities/store_product_performance.yml"],
      },
      {
        lane: "tool",
        event: "query_database",
        note: {
          en: "Reads the customer's shipment volume, service mix and SLA.",
          de: "Liest Sendungsvolumen, Service-Mix und SLA des Kunden.",
          fr: "Lit le volume d'envois, le mix de services et le SLA du client.",
        },
        cmd: "select p.name, sp.on_shelf_availability_pct, sp.facings, sp.target_facings from store_product_performance sp join products p on p.id=sp.product_id where sp.store_id=$1 order by sp.on_shelf_availability_pct",
        stdout: {
          en: "12 months · service mix aggregated",
          de: "12 Monate · Service-Mix aggregiert",
          fr: "12 mois · mix de services agrégé",
        },
        uses: ["query_database"],
        say: {
          actor: "agent",
          text: {
            en: "Compiled volume, service mix and SLA.",
            de: "Volumen, Service-Mix und SLA zusammengestellt.",
            fr: "Volume, mix de services et SLA compilés.",
          },
        },
      },
      {
        lane: "approval",
        event: "session.waiting",
        note: {
          en: "Persisting an artifact runs as a durable workflow step — the turn parks here with zero compute and resumes from exactly this point.",
          de: "Ein Artefakt zu persistieren läuft als durable Workflow-Step — der Turn parkt hier mit null Compute und resumt von exakt diesem Punkt.",
          fr: "Persister un artefact s'exécute comme une étape de workflow durable — le tour attend ici avec zéro compute et reprend exactement à ce point.",
        },
        infra: "workflow",
        pause: true,
        uses: ["create_visit_plan"],
      },
      {
        lane: "tool",
        event: "create_visit_plan",
        note: {
          en: "The turn resumes and persists the briefing to the library.",
          de: "Der Turn resumt und persistiert das Briefing in die Library.",
          fr: "Le tour reprend et persiste le dossier dans la bibliothèque.",
        },
        infra: "connect",
        uses: ["create_visit_plan"],
        produces: "report",
        say: {
          actor: "system",
          text: {
            en: "Case briefing saved to the library.",
            de: "Case-Briefing in der Library gespeichert.",
            fr: "Dossier enregistré dans la bibliothèque.",
          },
          emphasis: true,
        },
      },
      {
        lane: "done",
        event: "turn.completed",
        note: {
          en: "The briefing streams back. Every step was traced.",
          de: "Das Briefing streamt zurück. Jeder Schritt wurde getract.",
          fr: "Le dossier est renvoyé en streaming. Chaque étape a été tracée.",
        },
        infra: "observability",
      },
    ],
  },
  "playbook-manager": {
    personaId: "playbook-manager",
    request: {
      en: "Create a Swiss priority-SKU recovery playbook, preview its impact and publish it after approval.",
      de: "Service-Meldung aus aktuellen Störungen entwerfen und durch das Review führen.",
      fr: "Rédiger un avis de service depuis les perturbations actuelles et le passer en relecture.",
    },
    outcome: {
      en: "A versioned market playbook — impact previewed, approved and published through one durable workflow.",
      de: "Ein Draft angelegt (in_review), auf Wunsch überarbeitet, dann publiziert — ein durable Workflow.",
      fr: "Un brouillon créé (in_review), révisé sur demande, puis publié — un seul workflow durable.",
    },
    run: [
      {
        lane: "channel",
        event: "turn.started",
        note: {
          en: "A disruption lands; the editorial review workflow starts.",
          de: "Eine Störung landet; der Editorial-Review-Workflow startet.",
          fr: "Une perturbation arrive ; le workflow de relecture éditoriale démarre.",
        },
        infra: "fluid-compute",
        say: {
          actor: "user",
          text: {
            en: "Create a Swiss market playbook that assigns recovery actions when a priority SKU drops below 90% OSA, then preview the impact.",
            de: "Entwirf eine post.ch Service-Meldung aus den aktuellen Störungen und leg einen Draft für die Redaktion an.",
            fr: "Rédige un avis de service post.ch depuis les perturbations actuelles et crée un brouillon pour la rédaction.",
          },
        },
      },
      {
        lane: "harness",
        event: "boot sandbox",
        note: {
          en: "Loads the drafter + digest skills; reads the disruption rows.",
          de: "Lädt die Drafter- + Digest-Skills; liest die Störungs-Zeilen.",
          fr: "Charge les skills de rédaction + digest ; lit les lignes de perturbation.",
        },
        infra: "sandbox",
        uses: ["author-market-playbook", "digest", "entities/market_playbooks.yml"],
      },
      {
        lane: "tool",
        event: "preview_playbook",
        note: {
          en: "Drafts the service page from DB events; status becomes in_review.",
          de: "Entwirft die Service-Seite aus DB-Events; Status wird in_review.",
          fr: "Rédige la page de service depuis les événements de la base ; le statut devient in_review.",
        },
        infra: "workflow",
        uses: ["preview_playbook"],
        produces: "draft",
        say: {
          actor: "agent",
          text: {
            en: "Draft created and queued for review.",
            de: "Draft angelegt und ins Review eingereiht.",
            fr: "Brouillon créé et mis en file pour relecture.",
          },
        },
      },
      {
        lane: "approval",
        event: "session.waiting",
        note: {
          en: "The durable workflow suspends at a hook — zero compute — while the draft is in_review, and resumes exactly there.",
          de: "Der durable Workflow suspendiert an einem Hook — null Compute — während der Draft in_review liegt, und resumt exakt dort.",
          fr: "Le workflow durable se suspend à un hook — zéro compute — pendant que le brouillon est in_review, et reprend exactement là.",
        },
        infra: "workflow",
        pause: true,
        uses: ["preview_playbook"],
      },
      {
        lane: "tool",
        event: "resumeHook · revise",
        note: {
          en: "On resume, the workflow revises the draft and loops back through review.",
          de: "Beim Resume überarbeitet der Workflow den Draft und schleift zurück durchs Review.",
          fr: "À la reprise, le workflow révise le brouillon et repasse par la relecture.",
        },
        infra: "workflow",
        uses: ["preview_playbook"],
        say: {
          actor: "system",
          text: {
            en: "Revised → back in the queue.",
            de: "Überarbeitet → zurück in der Queue.",
            fr: "Révisé → de retour dans la file.",
          },
        },
      },
      {
        lane: "tool",
        event: "resumeHook · publish_playbook",
        note: {
          en: "On resume, the workflow publishes the service page to post.ch.",
          de: "Beim Resume publiziert der Workflow die Service-Seite auf post.ch.",
          fr: "À la reprise, le workflow publie la page de service sur post.ch.",
        },
        infra: "connect",
        uses: ["publish_playbook"],
        say: {
          actor: "system",
          text: {
            en: "Published to post.ch.",
            de: "Auf post.ch publiziert.",
            fr: "Publié sur post.ch.",
          },
          emphasis: true,
        },
      },
      {
        lane: "done",
        event: "turn.completed",
        note: {
          en: "Published. The whole durable run is traced end to end.",
          de: "Publiziert. Der ganze durable Run ist end-to-end getract.",
          fr: "Publié. Toute l'exécution durable est tracée de bout en bout.",
        },
        infra: "observability",
      },
    ],
  },
}

/* -------------------------------------------------------------------------- */
/* Build / Run / Govern layers                                                 */
/* -------------------------------------------------------------------------- */

export type LayerId = "build" | "run" | "govern"

interface RawLayer {
  id: LayerId
  title: string
  blurb: T
  infra: string[]
}

export interface Layer {
  id: LayerId
  title: string
  blurb: string
  infra: string[]
}

const RAW_LAYERS: RawLayer[] = [
  {
    id: "build",
    title: "Build",
    blurb: {
      en: "Write the harness as a folder of files — instructions, skills, tools, semantic layer.",
      de: "Den Harness als Ordner von Dateien schreiben — Instruktionen, Skills, Tools, Semantic Layer.",
      fr: "Écrire le harness comme un dossier de fichiers — instructions, skills, outils, couche sémantique.",
    },
    infra: ["ai-sdk", "ai-elements"],
  },
  {
    id: "run",
    title: "Run",
    blurb: {
      en: "Every turn runs durably in a sandbox, reached over a gateway, scaling to zero when parked.",
      de: "Jeder Turn läuft durable in einer Sandbox, erreicht über ein Gateway, skaliert auf null beim Parken.",
      fr: "Chaque tour s'exécute durablement dans une sandbox, joint via un gateway, descendant à zéro à l'arrêt.",
    },
    infra: ["sandbox", "ai-gateway", "workflow", "fluid-compute"],
  },
  {
    id: "govern",
    title: "Govern",
    blurb: {
      en: "Scoped credentials, security controls and end-to-end traces across every step.",
      de: "Scoped Credentials, Security-Kontrollen und End-to-End-Traces über jeden Schritt.",
      fr: "Identifiants limités, contrôles de sécurité et traces de bout en bout sur chaque étape.",
    },
    infra: ["observability", "connect", "security"],
  },
]

/* -------------------------------------------------------------------------- */
/* Resolver — turn localized data into plain strings for a given locale.       */
/* -------------------------------------------------------------------------- */

function resolveBlock(b: RawBlock, locale: Locale): Block {
  return { id: b.id, kind: b.kind, name: b.name, blurb: pick(b.blurb, locale), source: b.source }
}

function resolveInfra(b: RawInfraBlock, locale: Locale): InfraBlock {
  return {
    id: b.id,
    kind: "infra",
    name: b.name,
    blurb: pick(b.blurb, locale),
    tag: pick(b.tag, locale),
    icon: b.icon,
    spot: pick(b.spot, locale),
  }
}

function resolveStep(s: RawRunStep, locale: Locale): RunStep {
  return {
    lane: s.lane,
    event: s.event,
    note: pick(s.note, locale),
    cmd: s.cmd,
    stdout: s.stdout ? pick(s.stdout, locale) : undefined,
    say: s.say ? { actor: s.say.actor, text: pick(s.say.text, locale), emphasis: s.say.emphasis } : undefined,
    pause: s.pause,
    uses: s.uses,
    infra: s.infra,
    produces: s.produces,
    chart: s.chart,
  }
}

export interface ResolvedRegistry {
  personaMeta: Record<PersonaId, PersonaMeta>
  skills: Record<string, Block>
  tools: Record<string, Block>
  semantic: Record<string, Block>
  infra: Record<string, InfraBlock>
  allBlocks: Record<string, Block>
  showcases: Record<PersonaId, Showcase>
  layers: Layer[]
}

function mapValues<V, R>(obj: Record<string, V>, fn: (v: V) => R): Record<string, R> {
  const out: Record<string, R> = {}
  for (const k of Object.keys(obj)) out[k] = fn(obj[k])
  return out
}

/** Build a fully-resolved, plain-string registry for the given locale. */
export function getRegistry(locale: Locale): ResolvedRegistry {
  const skills = mapValues(RAW_SKILLS, (b) => resolveBlock(b, locale))
  const tools = mapValues(RAW_TOOLS, (b) => resolveBlock(b, locale))
  const semantic = mapValues(RAW_SEMANTIC, (b) => resolveBlock(b, locale))
  const infra = mapValues(RAW_INFRA, (b) => resolveInfra(b, locale))

  const personaMeta = PERSONA_ORDER.reduce(
    (acc, id) => {
      const m = RAW_PERSONA_META[id]
      acc[id] = {
        id: m.id,
        name: pick(m.name, locale),
        surface: pick(m.surface, locale),
        channel: pick(m.channel, locale),
        tagline: pick(m.tagline, locale),
        icon: m.icon,
        accent: m.accent,
      }
      return acc
    },
    {} as Record<PersonaId, PersonaMeta>,
  )

  const showcases = PERSONA_ORDER.reduce(
    (acc, id) => {
      const s = RAW_SHOWCASES[id]
      acc[id] = {
        personaId: s.personaId,
        request: pick(s.request, locale),
        outcome: pick(s.outcome, locale),
        run: s.run.map((step) => resolveStep(step, locale)),
      }
      return acc
    },
    {} as Record<PersonaId, Showcase>,
  )

  const layers = RAW_LAYERS.map((l) => ({ id: l.id, title: l.title, blurb: pick(l.blurb, locale), infra: l.infra }))

  return {
    personaMeta,
    skills,
    tools,
    semantic,
    infra,
    allBlocks: { ...skills, ...tools, ...semantic, ...infra },
    showcases,
    layers,
  }
}

/* Headline counters for the hero strip (locale-independent). */
export const HARNESS_STATS = {
  personas: PERSONA_ORDER.length,
  skills: Object.keys(RAW_SKILLS).length,
  semantic: Object.keys(RAW_SEMANTIC).length,
  primitives: Object.keys(RAW_INFRA).length,
}
