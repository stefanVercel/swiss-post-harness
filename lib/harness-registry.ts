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

export type PersonaId = "kundenservice" | "filiale" | "kommunikation"

export const PERSONA_ORDER: PersonaId[] = ["kundenservice", "filiale", "kommunikation"]

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
  kundenservice: {
    id: "kundenservice",
    name: { en: "Customer Service", de: "Kundenservice", fr: "Service clientèle" },
    surface: {
      en: "Chat · tracking, tariffs & locations",
      de: "Chat · Tracking, Tarife & Standorte",
      fr: "Chat · suivi, tarifs et emplacements",
    },
    channel: { en: "Web (Eve channel)", de: "Web (Eve channel)", fr: "Web (canal Eve)" },
    tagline: {
      en: "Track shipments, tariffs and service points — with charts and dashboards.",
      de: "Sendungen verfolgen, Tarife und Poststellen — mit Charts und Dashboards.",
      fr: "Suivre les envois, tarifs et points de service — avec graphiques et tableaux de bord.",
    },
    icon: "customercontact",
    accent: { color: "var(--sp-ink)", soft: "var(--sp-ink-soft)", on: "#ffffff" },
  },
  filiale: {
    id: "filiale",
    name: { en: "Branch / KAM", de: "Filiale / KAM", fr: "Filiale / KAM" },
    surface: {
      en: "Chat · case briefings & watchlists",
      de: "Chat · Case-Briefings & Watchlists",
      fr: "Chat · dossiers et watchlists",
    },
    channel: { en: "Web (Eve channel)", de: "Web (Eve channel)", fr: "Web (canal Eve)" },
    tagline: {
      en: "Analyse business customers, save case briefings and watchlists.",
      de: "Geschäftskunden analysieren, Case-Briefings und Watchlists speichern.",
      fr: "Analyser les clients commerciaux, enregistrer dossiers et watchlists.",
    },
    icon: "branch",
    accent: { color: "var(--sp-blue)", soft: "var(--sp-blue-soft)", on: "#ffffff" },
  },
  kommunikation: {
    id: "kommunikation",
    name: { en: "Communications", de: "Kommunikation", fr: "Communication" },
    surface: {
      en: "Editorial desk · draft & publish",
      de: "Editorial-Desk · Entwerfen & Publizieren",
      fr: "Bureau éditorial · rédiger et publier",
    },
    channel: {
      en: "Web (Eve channel) + editorial workflow",
      de: "Web (Eve channel) + Editorial-Workflow",
      fr: "Web (canal Eve) + workflow éditorial",
    },
    tagline: {
      en: "Draft service pages from internal sources, review, publish.",
      de: "Service-Seiten aus internen Quellen entwerfen, reviewen, publizieren.",
      fr: "Rédiger des pages de service depuis des sources internes, relire, publier.",
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
  "render-dashboard": {
    id: "render-dashboard",
    kind: "skill",
    name: "render-dashboard",
    blurb: {
      en: "Post dashboards: rankings, disruption boards, volume curves by canton.",
      de: "Post-Dashboards: Ranglisten, Störungs-Boards, Volumen-Kurven nach Kanton.",
      fr: "Tableaux de bord Post : classements, tableaux de perturbations, courbes de volume par canton.",
    },
  },
  "swisspost-comparison": {
    id: "swisspost-comparison",
    kind: "skill",
    name: "swisspost-comparison",
    blurb: {
      en: "Compare tariffs, branches or customers — price, transit time, volume, head-to-head.",
      de: "Vergleich von Tarifen, Filialen oder Kunden — Preis, Laufzeit, Volumen, Head-to-Head.",
      fr: "Comparer tarifs, filiales ou clients — prix, délai, volume, face à face.",
    },
  },
  "swisspost-account-briefing": {
    id: "swisspost-account-briefing",
    kind: "skill",
    name: "swisspost-account-briefing",
    blurb: {
      en: "Deep account briefing per business customer — volume, service mix, SLA, risks.",
      de: "Tiefes Account-Briefing je Geschäftskunde — Volumen, Service-Mix, SLA, Risiken.",
      fr: "Dossier de compte approfondi par client commercial — volume, mix de services, SLA, risques.",
    },
  },
  "swisspost-portfolio-scan": {
    id: "swisspost-portfolio-scan",
    kind: "skill",
    name: "swisspost-portfolio-scan",
    blurb: {
      en: "Portfolio scan across regions/customers — volume movers, contract risks, outliers.",
      de: "Portfolio-Scan über Regionen/Kunden — Volumen-Mover, Vertragsrisiken, Ausreisser.",
      fr: "Scan de portefeuille par régions/clients — variations de volume, risques contractuels, valeurs aberrantes.",
    },
  },
  watchlist: {
    id: "watchlist",
    kind: "skill",
    name: "watchlist",
    blurb: {
      en: "Build and save customer/branch watchlists, with refresh-and-diff over time.",
      de: "Kunden-/Filial-Watchlists bauen und speichern, mit Refresh-und-Diff über die Zeit.",
      fr: "Créer et enregistrer des watchlists clients/filiales, avec rafraîchissement et diff dans le temps.",
    },
  },
  "swisspost-service-page-drafter": {
    id: "swisspost-service-page-drafter",
    kind: "skill",
    name: "swisspost-service-page-drafter",
    blurb: {
      en: "Drafts post.ch service pages from service_pages / service_disruptions for review.",
      de: "Entwirft post.ch Service-Seiten aus service_pages / service_disruptions für das Review.",
      fr: "Rédige des pages de service post.ch depuis service_pages / service_disruptions pour relecture.",
    },
  },
  "swisspost-service-page-reviser": {
    id: "swisspost-service-page-reviser",
    kind: "skill",
    name: "swisspost-service-page-reviser",
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
  save_report: {
    id: "save_report",
    kind: "tool",
    name: "save_report",
    blurb: {
      en: "Persists a structured case briefing (customer / branch / region).",
      de: "Persistiert ein strukturiertes Case-Briefing (Kunde / Filiale / Region).",
      fr: "Persiste un dossier structuré (client / filiale / région).",
    },
    source: "authored",
  },
  save_watchlist: {
    id: "save_watchlist",
    kind: "tool",
    name: "save_watchlist",
    blurb: {
      en: "Persists a named watchlist with a metric snapshot for later refresh.",
      de: "Persistiert eine benannte Watchlist mit Metrik-Snapshot für späteren Refresh.",
      fr: "Persiste une watchlist nommée avec un instantané de métriques pour rafraîchissement ultérieur.",
    },
    source: "authored",
  },
  refresh_watchlist: {
    id: "refresh_watchlist",
    kind: "tool",
    name: "refresh_watchlist",
    blurb: {
      en: "Re-queries a saved watchlist and writes the new snapshot.",
      de: "Re-queryt eine gespeicherte Watchlist und schreibt den neuen Snapshot.",
      fr: "Réinterroge une watchlist enregistrée et écrit le nouvel instantané.",
    },
    source: "authored",
  },
  create_article_draft: {
    id: "create_article_draft",
    kind: "tool",
    name: "create_article_draft",
    blurb: {
      en: "Creates a service page draft (revision 1, status in_review).",
      de: "Legt einen Service-Seiten-Draft an (Revision 1, Status in_review).",
      fr: "Crée un brouillon de page de service (révision 1, statut in_review).",
    },
    source: "authored",
  },
  update_article_draft: {
    id: "update_article_draft",
    kind: "tool",
    name: "update_article_draft",
    blurb: {
      en: "Replaces the draft payload with a new revision.",
      de: "Ersetzt das Draft-Payload durch eine neue Revision.",
      fr: "Remplace le payload du brouillon par une nouvelle révision.",
    },
    source: "authored",
  },
  publish_article: {
    id: "publish_article",
    kind: "tool",
    name: "publish_article",
    blurb: {
      en: "Publishes a reviewed draft — only after explicit editor approval.",
      de: "Publiziert einen reviewten Draft — nur nach explizitem Editor-Approval.",
      fr: "Publie un brouillon relu — uniquement après approbation explicite de l'éditeur.",
    },
    source: "authored",
  },
  save_digest: {
    id: "save_digest",
    kind: "tool",
    name: "save_digest",
    blurb: {
      en: "Bundles several service pages into one saved digest.",
      de: "Bündelt mehrere Service-Seiten zu einem gespeicherten Digest.",
      fr: "Regroupe plusieurs pages de service en un digest enregistré.",
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
  "entities/shipments.yml": sem(
    "entities/shipments.yml",
    "Shipments — status, product, canton, transit time.",
    "Sendungen — Status, Produkt, Kanton, Laufzeit.",
    "Envois — statut, produit, canton, délai.",
  ),
  "entities/customers.yml": sem(
    "entities/customers.yml",
    "Business customers — segment, volume, contract, region.",
    "Geschäftskunden — Segment, Volumen, Vertrag, Region.",
    "Clients commerciaux — segment, volume, contrat, région.",
  ),
  "entities/tariffs.yml": sem(
    "entities/tariffs.yml",
    "Tariffs — product, price, weight tier, transit time.",
    "Tarife — Produkt, Preis, Gewichtsstufe, Laufzeit.",
    "Tarifs — produit, prix, palier de poids, délai.",
  ),
  "entities/service_points.yml": sem(
    "entities/service_points.yml",
    "Service points — opening hours, services, location.",
    "Poststellen — Öffnungszeiten, Services, Standort.",
    "Points de service — horaires, services, emplacement.",
  ),
  "entities/service_disruptions.yml": sem(
    "entities/service_disruptions.yml",
    "Disruptions — region, impact, window, status.",
    "Störungen — Region, Impact, Zeitraum, Status.",
    "Perturbations — région, impact, période, statut.",
  ),
  "entities/service_pages.yml": sem(
    "entities/service_pages.yml",
    "Service page sources for editorial drafts.",
    "Service-Seiten-Quellen für redaktionelle Drafts.",
    "Sources de pages de service pour les brouillons éditoriaux.",
  ),
  "guides/delivery-operations.md": sem(
    "guides/delivery-operations.md",
    "How to read delivery SLA, volume and disruptions.",
    "Wie man Zustell-SLA, Volumen und Störungen liest.",
    "Comment lire le SLA de distribution, le volume et les perturbations.",
  ),
  "guides/service-catalog.md": sem(
    "guides/service-catalog.md",
    "Product and tariff catalog — comparison logic.",
    "Produkt- und Tarifkatalog — Vergleichslogik.",
    "Catalogue produits et tarifs — logique de comparaison.",
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
  kundenservice: {
    personaId: "kundenservice",
    request: {
      en: "Priority parcels in processing by canton — with a chart.",
      de: "Priority-Pakete in Bearbeitung nach Kanton — mit Chart.",
      fr: "Colis Priority en traitement par canton — avec un graphique.",
    },
    outcome: {
      en: "A rich, shareable dashboard — chart + ranking — streamed into the chat.",
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
            en: "Show all Priority parcels in processing today by canton, with a chart.",
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
        uses: ["render-dashboard", "build-rich-answers", "load_skill", "catalog.yml"],
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
          en: "entities/shipments.yml, metrics.yml",
          de: "entities/shipments.yml, metrics.yml",
          fr: "entities/shipments.yml, metrics.yml",
        },
        uses: ["bash", "read_semantic_doc", "SCHEMA.md", "entities/shipments.yml"],
      },
      {
        lane: "tool",
        event: "query_database",
        note: {
          en: "Runs a read-only SQL query for the canton ranking.",
          de: "Führt eine read-only SQL-Query für die Kanton-Rangliste aus.",
          fr: "Exécute une requête SQL en lecture seule pour le classement par canton.",
        },
        cmd: "select canton, count(*) from shipments where product='priority' and status='in_processing' group by 1 order by 2 desc",
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
  filiale: {
    personaId: "filiale",
    request: {
      en: "Account briefing for a top e-commerce customer — then save it.",
      de: "Account-Briefing für einen Top-E-Commerce-Kunden — dann speichern.",
      fr: "Dossier de compte pour un grand client e-commerce — puis l'enregistrer.",
    },
    outcome: {
      en: "A saved report artifact in the library — volume, service mix, SLA, risks.",
      de: "Ein gespeichertes Report-Artefakt in der Library — Volumen, Service-Mix, SLA, Risiken.",
      fr: "Un artefact de rapport enregistré dans la bibliothèque — volume, mix de services, SLA, risques.",
    },
    run: [
      {
        lane: "channel",
        event: "turn.started",
        note: {
          en: "A KAM asks for a full account briefing. The turn begins.",
          de: "Ein KAM fragt nach einem vollen Account-Briefing. Der Turn beginnt.",
          fr: "Un KAM demande un dossier de compte complet. Le tour démarre.",
        },
        infra: "fluid-compute",
        say: {
          actor: "user",
          text: {
            en: "Account briefing for our top e-commerce customer — with volume, service mix, risks — then save it.",
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
        uses: ["swisspost-account-briefing", "swisspost-portfolio-scan", "load_skill"],
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
        cmd: "cat semantic-layer/entities/customers.yml",
        stdout: {
          en: "segment, volume, contract, sla",
          de: "segment, volume, contract, sla",
          fr: "segment, volume, contract, sla",
        },
        uses: ["read_semantic_doc", "guides/delivery-operations.md", "entities/customers.yml"],
      },
      {
        lane: "tool",
        event: "query_database",
        note: {
          en: "Reads the customer's shipment volume, service mix and SLA.",
          de: "Liest Sendungsvolumen, Service-Mix und SLA des Kunden.",
          fr: "Lit le volume d'envois, le mix de services et le SLA du client.",
        },
        cmd: "select month, parcels, letters, sla_pct from customer_volume where customer_id = $1 order by 1",
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
        uses: ["save_report"],
      },
      {
        lane: "tool",
        event: "save_report",
        note: {
          en: "The turn resumes and persists the briefing to the library.",
          de: "Der Turn resumt und persistiert das Briefing in die Library.",
          fr: "Le tour reprend et persiste le dossier dans la bibliothèque.",
        },
        infra: "connect",
        uses: ["save_report"],
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
  kommunikation: {
    personaId: "kommunikation",
    request: {
      en: "Draft a service notice from current disruptions and run it through review.",
      de: "Service-Meldung aus aktuellen Störungen entwerfen und durch das Review führen.",
      fr: "Rédiger un avis de service depuis les perturbations actuelles et le passer en relecture.",
    },
    outcome: {
      en: "A draft created (in_review), revised on request, then published — one durable workflow.",
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
            en: "Draft a post.ch service notice from the current disruptions and create a draft for the editorial team.",
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
        uses: ["swisspost-service-page-drafter", "digest", "entities/service_disruptions.yml"],
      },
      {
        lane: "tool",
        event: "create_article_draft",
        note: {
          en: "Drafts the service page from DB events; status becomes in_review.",
          de: "Entwirft die Service-Seite aus DB-Events; Status wird in_review.",
          fr: "Rédige la page de service depuis les événements de la base ; le statut devient in_review.",
        },
        infra: "workflow",
        uses: ["create_article_draft"],
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
        uses: ["update_article_draft"],
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
        uses: ["update_article_draft"],
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
        event: "resumeHook · publish_article",
        note: {
          en: "On resume, the workflow publishes the service page to post.ch.",
          de: "Beim Resume publiziert der Workflow die Service-Seite auf post.ch.",
          fr: "À la reprise, le workflow publie la page de service sur post.ch.",
        },
        infra: "connect",
        uses: ["publish_article"],
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
