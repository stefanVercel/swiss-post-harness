import type { Locale } from "./config"

/**
 * Deep chrome strings for the /harness showcase sections (the interactive run
 * explorer and the primitives grid). Kept separate from the general UI
 * dictionary in dictionary.ts to keep each file focused. All three locales are
 * complete; English is the default.
 */

export type HarnessCopy = {
  // Explorer section
  runEyebrow: string
  runTitlePre: string
  runTitleKey: string
  runTitlePost: string
  runLead: string
  personaSelectAria: string
  writeBadge: string // e.g. "write" -> `${n} write`
  readOnlyBadge: string
  ctrlPause: string
  ctrlDone: string
  ctrlPlay: string
  ctrlStep: string
  ctrlReset: string
  progressAria: string
  skillsLoaded: (n: number) => string
  toolsAvailable: (n: number) => string
  semanticFiles: (n: number) => string
  infraPrimitives: (n: number) => string
  reuseTooltip: (blurb: string, n: number) => string
  runSoWhat: string
  chartTitle: string
  chartRows: { label: string; w: string }[]
  parked: string
  artifactTitles: { report: string; watchlist: string; digest: string; draft: string }
  statusLabels: { saved: string; in_review: string; revised: string; published: string }
  statusSubs: { saved: string; in_review: string; revised: string; published: string }
  // Primitives section
  techEyebrow: string
  techTitlePre: string
  techTitleKey: string
  techTitlePost: string
  techLead: string
  eveTag: string
  eveParagraph: string
  foldersLabel: string
  viz: {
    oneToolkit: string
    isolated: string
    semanticMounted: string
    boot: string
    run: string
    dispose: string
    parked: string
    suspendResume: string
    work: string
    idleZero: string
    scopedToken: string
    noSecrets: string
    human: string
    bot: string
    passport: string
    answer: string
  }
}

export const HARNESS: Record<Locale, HarnessCopy> = {
  en: {
    runEyebrow: "The interactive proof",
    runTitlePre: "Watch a run light up the ",
    runTitleKey: "shared harness",
    runTitlePost: ".",
    runLead:
      "Route & Huddle Copilot, In-Store Predictive Coach and Market Playbook Manager are three field-sales compositions of one agent: the same model, sandbox and semantic layer, with role-specific skills and governed actions. Pick a role and play the run: the field experience appears on the left while the shared agent anatomy lights up live on the right.",
    personaSelectAria: "Choose persona",
    writeBadge: "write",
    readOnlyBadge: "read-only",
    ctrlPause: "Pause run",
    ctrlDone: "Run finished",
    ctrlPlay: "Play run",
    ctrlStep: "Step forward",
    ctrlReset: "Reset run",
    progressAria: "Run progress",
    skillsLoaded: (n) => `Skills loaded · ${n}`,
    toolsAvailable: (n) => `Tools available · ${n}`,
    semanticFiles: (n) => `Semantic layer · ${n} files`,
    infraPrimitives: (n) => `Infrastructure · ${n} primitives`,
    reuseTooltip: (blurb, n) => `${blurb} · used by ${n} persona(s)`,
    runSoWhat:
      "One agent, three jobs, zero forks: the anatomy never changes — only which parts a request lights up. That's what \"one harness, many agents\" looks like at runtime.",
    chartTitle: "Route priority · by store",
    chartRows: [
      { label: "Coop Zürich HB", w: "100%" },
      { label: "avec Stadelhofen", w: "82%" },
      { label: "Migros Limmatplatz", w: "68%" },
      { label: "Coop Oerlikon", w: "54%" },
    ],
    parked: "Durable workflow parked — zero compute — resumes from exactly this step.",
    artifactTitles: { report: "Route briefing", watchlist: "Visit plan", digest: "Visit summary", draft: "Market playbook" },
    statusLabels: { saved: "saved", in_review: "in review", revised: "revised", published: "published" },
    statusSubs: {
      saved: "saved to the library",
      in_review: "in editorial review",
      revised: "back in the queue",
      published: "live in the market workspace",
    },
    techEyebrow: "The technology · Vercel AI primitives",
    techTitlePre: "The primitives under every turn — composed by ",
    techTitleKey: "Eve",
    techTitlePost: ".",
    techLead:
      "The harness isn't a framework we maintain. It's a thin composition of managed Vercel primitives, wired together by Eve — Vercel's agent framework. Each primitive does exactly one thing; Eve makes them act as one.",
    eveTag: "the agent framework",
    eveParagraph:
      "You write an agent as a folder of files. Eve takes that folder and wires it onto the nine primitives below — model toolkit, gateway, sandboxes, durable workflows, fluid compute, traces, secure connectivity, bot and identity protection, and the UI layer — so the team ships behaviour, not plumbing.",
    foldersLabel: "One folder structure — Eve maps it onto the runtime",
    viz: {
      oneToolkit: "one toolkit",
      isolated: "isolated",
      semanticMounted: "semantic layer mounted",
      boot: "boot",
      run: "run",
      dispose: "dispose",
      parked: "parked",
      suspendResume: "suspend → resume from the exact step",
      work: "work",
      idleZero: "→ 0 when idle",
      scopedToken: "scoped · short-lived token",
      noSecrets: "no long-lived secrets",
      human: "human",
      bot: "bot",
      passport: "Passport",
      answer: "Answer ✓",
    },
  },
  de: {
    runEyebrow: "Der interaktive Beweis",
    runTitlePre: "Sieh zu, wie ein Run den ",
    runTitleKey: "geteilten Harness",
    runTitlePost: " zum Leuchten bringt.",
    runLead:
      "Route & Huddle Copilot, In-Store Predictive Coach und Market Playbook Manager sind drei Field-Sales-Kompositionen eines Agenten: dasselbe Modell, dieselbe Sandbox und derselbe Semantic Layer, ergänzt um rollenspezifische Skills und kontrollierte Aktionen. Wähle eine Rolle und spiele den Run: links die Field Experience, rechts die gemeinsame Agent-Anatomie, die live aufleuchtet.",
    personaSelectAria: "Persona wählen",
    writeBadge: "write",
    readOnlyBadge: "read-only",
    ctrlPause: "Run pausieren",
    ctrlDone: "Run fertig",
    ctrlPlay: "Run abspielen",
    ctrlStep: "Schritt vor",
    ctrlReset: "Run zurücksetzen",
    progressAria: "Run-Fortschritt",
    skillsLoaded: (n) => `Skills geladen · ${n}`,
    toolsAvailable: (n) => `Tools verfügbar · ${n}`,
    semanticFiles: (n) => `Semantic Layer · ${n} Dateien`,
    infraPrimitives: (n) => `Infrastruktur · ${n} Primitives`,
    reuseTooltip: (blurb, n) => `${blurb} · genutzt von ${n} Persona(s)`,
    runSoWhat:
      "Ein Agent, drei Jobs, null Forks: die Anatomie ändert sich nie — nur welche Teile eine Anfrage erhellt. So sieht „ein Harness, viele Agenten“ zur Laufzeit aus.",
    chartTitle: "Priority-Volumen · nach Kanton",
    chartRows: [
      { label: "Zürich", w: "100%" },
      { label: "Bern", w: "72%" },
      { label: "Waadt", w: "58%" },
      { label: "Aargau", w: "41%" },
    ],
    parked: "Durable Workflow geparkt — null Compute — resumt von exakt diesem Schritt.",
    artifactTitles: { report: "Case-Briefing", watchlist: "Watchlist", digest: "Digest", draft: "Service-Seiten-Draft" },
    statusLabels: { saved: "saved", in_review: "in review", revised: "revised", published: "published" },
    statusSubs: {
      saved: "in der Library gespeichert",
      in_review: "im Editorial-Review",
      revised: "zurück in der Queue",
      published: "live auf post.ch",
    },
    techEyebrow: "Die Technologie · Vercel AI Primitives",
    techTitlePre: "Die Primitives unter jedem Turn — komponiert von ",
    techTitleKey: "Eve",
    techTitlePost: ".",
    techLead:
      "Der Harness ist kein Framework, das wir warten. Er ist eine dünne Komposition gemanagter Vercel-Primitives, verdrahtet von Eve — Vercels Agent-Framework. Jedes Primitive macht genau eine Sache; Eve lässt sie als eines wirken.",
    eveTag: "the agent framework",
    eveParagraph:
      "Du schreibst einen Agenten als Ordner von Dateien. Eve nimmt diesen Ordner und verdrahtet ihn auf die neun Primitives unten — Model-Toolkit, Gateway, Sandboxes, durable Workflows, Fluid Compute, Traces, sichere Konnektivität, Bot- und Identity-Schutz und das UI-Layer — damit das Team Verhalten shippt, nicht Plumbing.",
    foldersLabel: "Eine Ordnerstruktur — Eve mappt sie auf die Runtime",
    viz: {
      oneToolkit: "one toolkit",
      isolated: "isoliert",
      semanticMounted: "semantic layer eingehängt",
      boot: "boot",
      run: "run",
      dispose: "dispose",
      parked: "parked",
      suspendResume: "suspend → resume vom exakten Step",
      work: "work",
      idleZero: "→ 0 wenn idle",
      scopedToken: "scoped · kurzlebiger Token",
      noSecrets: "keine langlebigen Secrets",
      human: "human",
      bot: "bot",
      passport: "Passport",
      answer: "Antwort ✓",
    },
  },
  fr: {
    runEyebrow: "La preuve interactive",
    runTitlePre: "Regardez une exécution illuminer le ",
    runTitleKey: "harness partagé",
    runTitlePost: ".",
    runLead:
      "Route & Huddle Copilot, In-Store Predictive Coach et Market Playbook Manager sont trois compositions field sales d'un même agent : même modèle, même sandbox et même couche sémantique, avec des skills et actions gouvernées propres à chaque rôle. Choisissez un rôle et lancez l'exécution : l'expérience terrain apparaît à gauche et l'anatomie partagée s'illumine à droite.",
    personaSelectAria: "Choisir la persona",
    writeBadge: "écriture",
    readOnlyBadge: "lecture seule",
    ctrlPause: "Mettre en pause",
    ctrlDone: "Exécution terminée",
    ctrlPlay: "Lancer l'exécution",
    ctrlStep: "Étape suivante",
    ctrlReset: "Réinitialiser",
    progressAria: "Progression de l'exécution",
    skillsLoaded: (n) => `Skills chargés · ${n}`,
    toolsAvailable: (n) => `Outils disponibles · ${n}`,
    semanticFiles: (n) => `Couche sémantique · ${n} fichiers`,
    infraPrimitives: (n) => `Infrastructure · ${n} primitives`,
    reuseTooltip: (blurb, n) => `${blurb} · utilisé par ${n} persona(s)`,
    runSoWhat:
      "Un agent, trois métiers, zéro fork : l'anatomie ne change jamais — seules changent les parties qu'une requête illumine. Voilà à quoi ressemble « un harness, plusieurs agents » à l'exécution.",
    chartTitle: "Volume prioritaire · par canton",
    chartRows: [
      { label: "Zurich", w: "100%" },
      { label: "Berne", w: "72%" },
      { label: "Vaud", w: "58%" },
      { label: "Argovie", w: "41%" },
    ],
    parked: "Workflow durable en pause — zéro compute — reprend exactement à cette étape.",
    artifactTitles: {
      report: "Briefing de cas",
      watchlist: "Watchlist",
      digest: "Digest",
      draft: "Brouillon de page service",
    },
    statusLabels: { saved: "enregistré", in_review: "en revue", revised: "révisé", published: "publié" },
    statusSubs: {
      saved: "enregistré dans la bibliothèque",
      in_review: "en revue éditoriale",
      revised: "de retour dans la file",
      published: "en ligne sur post.ch",
    },
    techEyebrow: "La technologie · primitives IA de Vercel",
    techTitlePre: "Les primitives sous chaque tour — composées par ",
    techTitleKey: "Eve",
    techTitlePost: ".",
    techLead:
      "Le harness n'est pas un framework que nous maintenons. C'est une fine composition de primitives Vercel gérées, câblées par Eve — le framework d'agents de Vercel. Chaque primitive fait exactement une chose ; Eve les fait agir comme une seule.",
    eveTag: "le framework d'agents",
    eveParagraph:
      "Vous écrivez un agent comme un dossier de fichiers. Eve prend ce dossier et le câble sur les neuf primitives ci-dessous — toolkit de modèle, gateway, sandboxes, workflows durables, fluid compute, traces, connectivité sécurisée, protection contre les bots et les identités, et la couche UI — afin que l'équipe livre du comportement, pas de la tuyauterie.",
    foldersLabel: "Une structure de dossiers — Eve la mappe sur le runtime",
    viz: {
      oneToolkit: "un seul toolkit",
      isolated: "isolé",
      semanticMounted: "couche sémantique montée",
      boot: "boot",
      run: "run",
      dispose: "dispose",
      parked: "en pause",
      suspendResume: "suspendre → reprendre à l'étape exacte",
      work: "charge",
      idleZero: "→ 0 au repos",
      scopedToken: "restreint · jeton éphémère",
      noSecrets: "aucun secret durable",
      human: "humain",
      bot: "bot",
      passport: "Passport",
      answer: "Réponse ✓",
    },
  },
}
