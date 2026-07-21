import type { Locale } from "./config"

/**
 * Static UI strings for the chat app chrome and the /harness showcase chrome,
 * in English (default), German and French. Data-driven content (personas, the
 * harness registry) is localized in their own modules.
 */

type Dict = {
  // chat shell
  loading: string
  semanticLayerLabel: string
  viewHarness: string
  viewHarnessShort: string
  teams: string
  writeToolsSuffix: string
  readOnly: string
  // chat
  askPlaceholder: (name: string) => string
  send: string
  thinking: string
  // chat message
  agent: string
  details: string
  hide: string
  input: string
  output: string
  write: string
  read: string
  // artifacts
  savedArtifacts: string
  artifactsHint: string
  artifactsEmpty: string
  articleDrafts: string
  reports: string
  watchlists: string
  revPrefix: string
  // harness page chrome
  harnessRunNav: string
  technologyNav: string
  toChat: string
  homeAria: string
  heroEyebrow: string
  heroTitlePre: string
  heroTitleKey: string
  heroLead: string
  heroCtaRun: string
  heroCtaTech: string
  statAgents: string
  statSkills: string
  statSemantic: string
  statPrimitives: string
  closingTitle: string
  closingLead: string
  closingCta: string
  metaTitle: string
  metaDescription: string
}

export const UI: Record<Locale, Dict> = {
  en: {
    loading: "Loading harness…",
    semanticLayerLabel: "Neon + filesystem semantic layer",
    viewHarness: "See the harness",
    viewHarnessShort: "Harness",
    teams: "Teams",
    writeToolsSuffix: "write tools",
    readOnly: "read-only",
    askPlaceholder: (name) => `Ask ${name}…`,
    send: "Send",
    thinking: "Agent is thinking…",
    agent: "Agent",
    details: "Details",
    hide: "hide",
    input: "Input",
    output: "Output",
    write: "write",
    read: "read",
    savedArtifacts: "Saved artifacts",
    artifactsHint: "Populated by write tools (reports, watchlists, drafts).",
    artifactsEmpty:
      "No artifacts yet. Let a write-capable persona (Filiale / Kommunikation) save something.",
    articleDrafts: "Article drafts",
    reports: "Reports",
    watchlists: "Watchlists",
    revPrefix: "rev",
    harnessRunNav: "Harness run",
    technologyNav: "The technology",
    toChat: "To the chat",
    homeAria: "To the Red Bull Intelligence home",
    heroEyebrow: "Red Bull · the intelligence harness",
    heroTitlePre: "One harness, ",
    heroTitleKey: "many agents",
    heroLead:
      "Don't buy AI features and don't build them one by one. Build a harness — a headless, composable foundation over your own data — and every new agent becomes a cheap composition instead of a rebuild.",
    heroCtaRun: "Watch the harness run",
    heroCtaTech: "The technology",
    statAgents: "agents today",
    statSkills: "reusable skills",
    statSemantic: "semantic files",
    statPrimitives: "Vercel primitives",
    closingTitle: "Build the harness once. Compound it forever.",
    closingLead:
      "Your data modelled once as a semantic layer, your expertise as reusable skills, every agent on the same managed infrastructure. The next agent is one composition away.",
    closingCta: "Open the research agent",
    metaTitle: "One harness, many agents · Red Bull Intelligence",
    metaDescription:
      "Watch the Red Bull harness at work: the Vercel AI primitives under every turn and an interactive run that lights up the shared anatomy live.",
  },
  de: {
    loading: "Lade Harness…",
    semanticLayerLabel: "Neon + Filesystem Semantic Layer",
    viewHarness: "Harness ansehen",
    viewHarnessShort: "Harness",
    teams: "Teams",
    writeToolsSuffix: "Write-Tools",
    readOnly: "read-only",
    askPlaceholder: (name) => `Frag ${name}…`,
    send: "Senden",
    thinking: "Agent denkt nach…",
    agent: "Agent",
    details: "Details",
    hide: "verbergen",
    input: "Input",
    output: "Output",
    write: "write",
    read: "read",
    savedArtifacts: "Gespeicherte Artefakte",
    artifactsHint: "Wird durch Write-Tools befüllt (Reports, Watchlists, Drafts).",
    artifactsEmpty:
      "Noch keine Artefakte. Bitte einen Write-fähigen Persona (Filiale / Kommunikation) etwas speichern lassen.",
    articleDrafts: "Article-Drafts",
    reports: "Reports",
    watchlists: "Watchlists",
    revPrefix: "rev",
    harnessRunNav: "Harness-Run",
    technologyNav: "Die Technologie",
    toChat: "Zum Chat",
    homeAria: "Zur Red Bull Intelligence Startseite",
    heroEyebrow: "Red Bull · der Intelligence-Harness",
    heroTitlePre: "Ein Harness, ",
    heroTitleKey: "viele Agenten",
    heroLead:
      "Kauf keine AI-Features und bau sie nicht einzeln. Bau einen Harness — ein headless, komponierbares Fundament über euren eigenen Daten — und jeder neue Agent wird eine günstige Komposition statt ein Neubau.",
    heroCtaRun: "Den Harness-Run ansehen",
    heroCtaTech: "Die Technologie",
    statAgents: "Agenten heute",
    statSkills: "wiederverwendbare Skills",
    statSemantic: "semantische Dateien",
    statPrimitives: "Vercel-Primitives",
    closingTitle: "Bau den Harness einmal. Verzins ihn für immer.",
    closingLead:
      "Eure Daten einmal als Semantic Layer modelliert, eure Fachexpertise als wiederverwendbare Skills, jeder Agent auf derselben gemanagten Infrastruktur. Der nächste Agent ist eine Komposition entfernt.",
    closingCta: "Den Research-Agenten öffnen",
    metaTitle: "Ein Harness, viele Agenten · Red Bull Intelligence",
    metaDescription:
      "Sieh dem Red Bull Harness bei der Arbeit zu: die Vercel-AI-Primitives unter jedem Turn und ein interaktiver Run, der die geteilte Anatomie live erhellt.",
  },
  fr: {
    loading: "Chargement du harness…",
    semanticLayerLabel: "Couche sémantique Neon + système de fichiers",
    viewHarness: "Voir le harness",
    viewHarnessShort: "Harness",
    teams: "Équipes",
    writeToolsSuffix: "outils d'écriture",
    readOnly: "lecture seule",
    askPlaceholder: (name) => `Demander à ${name}…`,
    send: "Envoyer",
    thinking: "L'agent réfléchit…",
    agent: "Agent",
    details: "Détails",
    hide: "masquer",
    input: "Entrée",
    output: "Sortie",
    write: "écriture",
    read: "lecture",
    savedArtifacts: "Artefacts enregistrés",
    artifactsHint: "Alimenté par les outils d'écriture (rapports, watchlists, brouillons).",
    artifactsEmpty:
      "Pas encore d'artefacts. Laissez une persona avec droits d'écriture (Filiale / Communication) en enregistrer un.",
    articleDrafts: "Brouillons d'article",
    reports: "Rapports",
    watchlists: "Watchlists",
    revPrefix: "rév",
    harnessRunNav: "Exécution du harness",
    technologyNav: "La technologie",
    toChat: "Vers le chat",
    homeAria: "Vers l'accueil Red Bull Intelligence",
    heroEyebrow: "Red Bull · le harness d'intelligence",
    heroTitlePre: "Un harness, ",
    heroTitleKey: "plusieurs agents",
    heroLead:
      "N'achetez pas des fonctions d'IA et ne les construisez pas une par une. Construisez un harness — un socle headless et composable sur vos propres données — et chaque nouvel agent devient une composition bon marché plutôt qu'une reconstruction.",
    heroCtaRun: "Voir l'exécution du harness",
    heroCtaTech: "La technologie",
    statAgents: "agents aujourd'hui",
    statSkills: "skills réutilisables",
    statSemantic: "fichiers sémantiques",
    statPrimitives: "primitives Vercel",
    closingTitle: "Construisez le harness une fois. Capitalisez pour toujours.",
    closingLead:
      "Vos données modélisées une fois en couche sémantique, votre expertise en skills réutilisables, chaque agent sur la même infrastructure gérée. Le prochain agent n'est qu'à une composition.",
    closingCta: "Ouvrir l'agent de recherche",
    metaTitle: "Un harness, plusieurs agents · Red Bull Intelligence",
    metaDescription:
      "Regardez le harness Red Bull à l'œuvre : les primitives IA de Vercel sous chaque tour et une exécution interactive qui illumine l'anatomie partagée en direct.",
  },
}
