/**
 * Swiss Post domain pack — Post CH / Die Schweizerische Post intelligence harness.
 *
 * Satisfies the `DomainConfig` contract. Pure data only (no Node built-ins):
 * the persona definitions here drive both the UI (labels, taglines, suggestion
 * chips) and server-side capability (`skills`, `writeTools`). Path fields are
 * relative to this directory and resolved by the Node/agent-side loaders.
 *
 * Three personas that match Swiss Post's actual buyer surface:
 *   • Kundenservice — read-only shipment / tariff / service-point lookups.
 *   • Filiale       — frontline / KAM view with saveable case briefings and
 *                     business-customer watchlists.
 *   • Kommunikation — post.ch editorial team; drafts service pages from the
 *                     `service_pages` source table and runs the durable
 *                     editorial-review workflow before publish.
 */
import type { DomainConfig } from "../../harness/lib/domain-types";

const config: DomainConfig = {
  slug: "swisspost",
  name: "Swiss Post Intelligence Harness",
  tagline:
    "One agent, three teams — a Swiss Post intelligence harness with a Neon + filesystem semantic layer, dual answer modes, and savable case briefings, service dashboards and editorial drafts.",

  brand: {
    primary: "#FFCC00", // Swiss Post yellow
    accent: "#1F1F1F", // Swiss Post black
    logo: "/domains/swisspost/logo-full.png",
    favicon: "/domains/swisspost/icon.svg",
    ogImage: "/domains/swisspost/logo-full.png",
    fontFamily: "Frutiger, Inter, system-ui",
  },

  personas: [
    {
      slug: "kundenservice",
      label: "Kundenservice",
      role: "Read-only Tracking, Tarife & Standorte",
      tagline: "Read-only Tracking, Tarife & Standorte",
      hint:
        "Track shipments, look up tariffs and find service points — with charts and dashboards.",
      systemPromptPath: "personas/kundenservice.md",
      skills: ["build-rich-answers", "render-dashboard", "swisspost-comparison"],
      writeTools: [],
      defaultMode: "customer",
      examplePrompts: [
        {
          label: "Sendungsstatus",
          prompt:
            "Zeig mir alle heute in Bearbeitung befindlichen Priority-Pakete nach Kanton mit einem Chart.",
        },
        {
          label: "Filialen in Zürich",
          prompt:
            "Welche Poststellen in Zürich haben nach 18:00 geöffnet und bieten Bargeldbezug?",
        },
        {
          label: "Tarife A-Post vs PostPac",
          prompt:
            "Vergleiche A-Post und PostPac Priority nach Preis, Laufzeit und Gewichtsstufe.",
        },
        {
          label: "Aktive Störungen",
          prompt:
            "Wo gibt es aktuell Zustellstörungen und welche Regionen sind betroffen?",
        },
      ],
    },
    {
      slug: "filiale",
      label: "Filiale / KAM",
      role: "Case-Briefings, Watchlists & Geschäftskunden",
      tagline: "Case-Briefings, Watchlists & Geschäftskunden",
      hint:
        "Analyse Geschäftskunden, erstelle Case-Briefings und Watchlists — mit speicherbaren Reports.",
      systemPromptPath: "personas/filiale.md",
      skills: [
        "swisspost-account-briefing",
        "swisspost-portfolio-scan",
        "swisspost-comparison",
        "watchlist",
      ],
      writeTools: ["save_report", "save_watchlist", "refresh_watchlist"],
      defaultMode: "customer",
      examplePrompts: [
        {
          label: "KAM Briefing",
          prompt:
            "Erstelle ein Account-Briefing für unseren Top-Kunden im Bereich E-Commerce mit Sendungsvolumen, Service-Mix und Risiken — dann speichern.",
        },
        {
          label: "Volumen-Watchlist",
          prompt:
            "Erstelle eine Watchlist der 8 grössten Geschäftskunden nach Paket-Volumen im Q4-2026 und speichere sie.",
        },
        {
          label: "Vertragsrisiken",
          prompt:
            "Welche Geschäftskunden haben in den letzten 90 Tagen einen Volumen-Rückgang > 20% gezeigt? Nach Region ranken.",
        },
        {
          label: "SLA-Ausblick",
          prompt:
            "Welche Filialen liegen unter dem 95%-Zustell-SLA und was sind die Hauptursachen?",
        },
      ],
    },
    {
      slug: "kommunikation",
      label: "Kommunikation",
      role: "Service-Seiten entwerfen & publizieren",
      tagline: "Service-Seiten entwerfen & publizieren",
      hint:
        "Entwerfe post.ch Service-Seiten aus internen Quellen, mit Editorial-Review-Workflow bis Publish.",
      systemPromptPath: "personas/kommunikation.md",
      skills: [
        "swisspost-service-page-drafter",
        "swisspost-service-page-reviser",
        "digest",
        "build-rich-answers",
      ],
      writeTools: [
        "create_article_draft",
        "update_article_draft",
        "publish_article",
        "create_article_revision",
        "set_headline",
        "set_dek",
        "revise_text",
        "add_pull_quote",
        "add_source",
        "list_article_revisions",
        "save_digest",
      ],
      defaultMode: "customer",
      examplePrompts: [
        {
          label: "Störungs-Update",
          prompt:
            "Entwirf eine post.ch Service-Meldung aus den aktuellen Störungs-Einträgen und lege einen Article-Draft für die Redaktion an.",
        },
        {
          label: "Tarif-Änderung",
          prompt:
            "Erstelle einen Entwurf einer Kundeninformation zur nächsten Tariferhöhung basierend auf dem tariffs-Table und speichere ihn als Draft.",
        },
        {
          label: "Feiertags-Fahrplan",
          prompt:
            "Kompiliere die Feiertags-Zustellfahrpläne für Ostern in eine kundenfreundliche Übersicht und speichere sie als Digest.",
        },
        {
          label: "Review-Pipeline",
          prompt:
            "Welche Article-Drafts sind aktuell im Editorial-Review-Workflow?",
        },
      ],
    },
  ],

  database: {
    schemaDir: "schema",
    seedDir: "seed",
    semanticLayerDir: "semantic-layer",
  },

  agent: {
    glossaryPath: "semantic-layer/glossary.yml",
    answerStyle: {
      voice:
        "präziser, Schweiz-fluenter Analyst für Post CH-Teams; Deutsch als Standardsprache, Englisch wenn der Nutzer wechselt",
      avoid: [
        "erfundene Zahlen",
        "Beratung ausserhalb des vorhandenen Datenmodells",
      ],
    },
  },

  docs: {
    architecturePath: "docs/ARCHITECTURE.md",
    demoPath: "docs/DEMO.md",
    dataPath: "docs/DATA.md",
  },
};

export default config;
