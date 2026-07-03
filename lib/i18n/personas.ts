import type { Locale } from "./config"

/**
 * Localized persona chrome for the chat app (label / role / hint / example
 * prompts). The domain config (domains/swisspost/domain.config.ts) stays the
 * source of truth for slugs, skills and write-tools; this only translates the
 * user-facing text. Keyed by persona slug.
 */

export type LocalizedExample = { label: string; prompt: string }

export type LocalizedPersona = {
  label: string
  role: string
  tagline: string
  hint: string
  examplePrompts: LocalizedExample[]
}

export const PERSONA_I18N: Record<string, Record<Locale, LocalizedPersona>> = {
  kundenservice: {
    en: {
      label: "Customer Service",
      role: "Read-only tracking, tariffs & locations",
      tagline: "Read-only tracking, tariffs & locations",
      hint: "Track shipments, look up tariffs and find service points — with charts and dashboards.",
      examplePrompts: [
        { label: "Shipment status", prompt: "Show all Priority parcels currently in processing today by canton, with a chart." },
        { label: "Service points in Zürich", prompt: "Which service points in Zürich are open after 18:00 and offer cash withdrawal?" },
        { label: "Tariffs A-Post vs PostPac", prompt: "Compare A-Post and PostPac Priority by price, transit time and weight tier." },
        { label: "Active disruptions", prompt: "Where are there currently delivery disruptions and which regions are affected?" },
      ],
    },
    de: {
      label: "Kundenservice",
      role: "Read-only Tracking, Tarife & Standorte",
      tagline: "Read-only Tracking, Tarife & Standorte",
      hint: "Track shipments, look up tariffs and find service points — with charts and dashboards.",
      examplePrompts: [
        { label: "Sendungsstatus", prompt: "Zeig mir alle heute in Bearbeitung befindlichen Priority-Pakete nach Kanton mit einem Chart." },
        { label: "Filialen in Zürich", prompt: "Welche Poststellen in Zürich haben nach 18:00 geöffnet und bieten Bargeldbezug?" },
        { label: "Tarife A-Post vs PostPac", prompt: "Vergleiche A-Post und PostPac Priority nach Preis, Laufzeit und Gewichtsstufe." },
        { label: "Aktive Störungen", prompt: "Wo gibt es aktuell Zustellstörungen und welche Regionen sind betroffen?" },
      ],
    },
    fr: {
      label: "Service clientèle",
      role: "Suivi, tarifs et emplacements (lecture seule)",
      tagline: "Suivi, tarifs et emplacements (lecture seule)",
      hint: "Suivez les envois, consultez les tarifs et trouvez les points de service — avec graphiques et tableaux de bord.",
      examplePrompts: [
        { label: "Statut d'envoi", prompt: "Affiche tous les colis Priority en cours de traitement aujourd'hui par canton, avec un graphique." },
        { label: "Points de service à Zurich", prompt: "Quels points de service à Zurich sont ouverts après 18h00 et proposent le retrait d'espèces ?" },
        { label: "Tarifs A-Post vs PostPac", prompt: "Compare A-Post et PostPac Priority par prix, délai d'acheminement et palier de poids." },
        { label: "Perturbations actives", prompt: "Où y a-t-il actuellement des perturbations de distribution et quelles régions sont touchées ?" },
      ],
    },
  },
  filiale: {
    en: {
      label: "Branch / KAM",
      role: "Case briefings, watchlists & business customers",
      tagline: "Case briefings, watchlists & business customers",
      hint: "Analyse business customers, build case briefings and watchlists — with saveable reports.",
      examplePrompts: [
        { label: "KAM briefing", prompt: "Create an account briefing for our top e-commerce customer with shipment volume, service mix and risks — then save it." },
        { label: "Volume watchlist", prompt: "Build a watchlist of the 8 largest business customers by parcel volume in Q4 2026 and save it." },
        { label: "Contract risks", prompt: "Which business customers have shown a volume drop > 20% in the last 90 days? Rank by region." },
        { label: "SLA outlook", prompt: "Which branches are below the 95% delivery SLA and what are the main causes?" },
      ],
    },
    de: {
      label: "Filiale / KAM",
      role: "Case-Briefings, Watchlists & Geschäftskunden",
      tagline: "Case-Briefings, Watchlists & Geschäftskunden",
      hint: "Analyse Geschäftskunden, erstelle Case-Briefings und Watchlists — mit speicherbaren Reports.",
      examplePrompts: [
        { label: "KAM Briefing", prompt: "Erstelle ein Account-Briefing für unseren Top-Kunden im Bereich E-Commerce mit Sendungsvolumen, Service-Mix und Risiken — dann speichern." },
        { label: "Volumen-Watchlist", prompt: "Erstelle eine Watchlist der 8 grössten Geschäftskunden nach Paket-Volumen im Q4-2026 und speichere sie." },
        { label: "Vertragsrisiken", prompt: "Welche Geschäftskunden haben in den letzten 90 Tagen einen Volumen-Rückgang > 20% gezeigt? Nach Region ranken." },
        { label: "SLA-Ausblick", prompt: "Welche Filialen liegen unter dem 95%-Zustell-SLA und was sind die Hauptursachen?" },
      ],
    },
    fr: {
      label: "Filiale / KAM",
      role: "Dossiers, watchlists et clients commerciaux",
      tagline: "Dossiers, watchlists et clients commerciaux",
      hint: "Analysez les clients commerciaux, créez des dossiers et des watchlists — avec des rapports enregistrables.",
      examplePrompts: [
        { label: "Briefing KAM", prompt: "Crée un dossier de compte pour notre principal client e-commerce avec le volume d'envois, le mix de services et les risques — puis enregistre-le." },
        { label: "Watchlist de volume", prompt: "Crée une watchlist des 8 plus grands clients commerciaux par volume de colis au T4 2026 et enregistre-la." },
        { label: "Risques contractuels", prompt: "Quels clients commerciaux ont affiché une baisse de volume > 20% ces 90 derniers jours ? Classe par région." },
        { label: "Perspective SLA", prompt: "Quelles filiales sont sous le SLA de distribution de 95% et quelles en sont les causes principales ?" },
      ],
    },
  },
  kommunikation: {
    en: {
      label: "Communications",
      role: "Draft & publish service pages",
      tagline: "Draft & publish service pages",
      hint: "Draft post.ch service pages from internal sources, with an editorial review workflow through publish.",
      examplePrompts: [
        { label: "Disruption update", prompt: "Draft a post.ch service notice from the current disruption entries and create an article draft for the editorial team." },
        { label: "Tariff change", prompt: "Create a draft customer notice about the next tariff increase based on the tariffs table and save it as a draft." },
        { label: "Holiday schedule", prompt: "Compile the holiday delivery schedules for Easter into a customer-friendly overview and save it as a digest." },
        { label: "Review pipeline", prompt: "Which article drafts are currently in the editorial review workflow?" },
      ],
    },
    de: {
      label: "Kommunikation",
      role: "Service-Seiten entwerfen & publizieren",
      tagline: "Service-Seiten entwerfen & publizieren",
      hint: "Entwerfe post.ch Service-Seiten aus internen Quellen, mit Editorial-Review-Workflow bis Publish.",
      examplePrompts: [
        { label: "Störungs-Update", prompt: "Entwirf eine post.ch Service-Meldung aus den aktuellen Störungs-Einträgen und lege einen Article-Draft für die Redaktion an." },
        { label: "Tarif-Änderung", prompt: "Erstelle einen Entwurf einer Kundeninformation zur nächsten Tariferhöhung basierend auf dem tariffs-Table und speichere ihn als Draft." },
        { label: "Feiertags-Fahrplan", prompt: "Kompiliere die Feiertags-Zustellfahrpläne für Ostern in eine kundenfreundliche Übersicht und speichere sie als Digest." },
        { label: "Review-Pipeline", prompt: "Welche Article-Drafts sind aktuell im Editorial-Review-Workflow?" },
      ],
    },
    fr: {
      label: "Communication",
      role: "Rédiger et publier des pages de service",
      tagline: "Rédiger et publier des pages de service",
      hint: "Rédigez des pages de service post.ch à partir de sources internes, avec un workflow de relecture éditoriale jusqu'à la publication.",
      examplePrompts: [
        { label: "Mise à jour perturbation", prompt: "Rédige un avis de service post.ch à partir des entrées de perturbation actuelles et crée un brouillon d'article pour la rédaction." },
        { label: "Changement de tarif", prompt: "Crée un brouillon d'information client sur la prochaine hausse tarifaire à partir de la table tariffs et enregistre-le comme brouillon." },
        { label: "Horaires des fêtes", prompt: "Compile les horaires de distribution des fêtes de Pâques en un aperçu clair pour les clients et enregistre-le comme digest." },
        { label: "Pipeline de relecture", prompt: "Quels brouillons d'article sont actuellement dans le workflow de relecture éditoriale ?" },
      ],
    },
  },
}

export function localizePersonaField(slug: string, locale: Locale): LocalizedPersona | null {
  return PERSONA_I18N[slug]?.[locale] ?? null
}
