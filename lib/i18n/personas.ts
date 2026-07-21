import type { Locale } from "./config"

export type LocalizedExample = { label: string; prompt: string }
export type LocalizedPersona = { label: string; role: string; tagline: string; hint: string; examplePrompts: LocalizedExample[] }

const entries = {
  "route-copilot": {
    label: "Route & Huddle Copilot", role: "ASM daily route readiness", tagline: "Turn the morning huddle into an executable day.",
    hint: "Prioritize stops, targets and market guidance before the first visit.",
    examplePrompts: [
      { label: "Build today’s route", prompt: "Prepare today’s Zürich route. Rank every stop by execution opportunity, include the morning huddle priorities, and save the route briefing." },
      { label: "Huddle digest", prompt: "Turn today’s market huddle into a concise on-route digest with targets, watch-outs, and talk tracks." },
      { label: "Pocket Guide", prompt: "What does the Pocket Guide recommend when a priority SKU has low availability but enough facings?" },
    ],
  },
  "store-coach": {
    label: "In-Store Predictive Coach", role: "Striker visit execution", tagline: "The next best action for this store, right now.",
    hint: "Use store history, SKU signals, planogram gaps and agreements to rank actions.",
    examplePrompts: [
      { label: "Start store visit", prompt: "I’m starting the visit at Coop Zürich HB. Build a ranked action plan using current SKU performance, prior visit gaps, and key-account agreements, then save it." },
      { label: "Fix availability", prompt: "Which priority SKU should I address first at Coop Zürich HB and why?" },
      { label: "Close visit", prompt: "Complete the open visibility assignment and save a short visit summary with the remaining follow-ups." },
    ],
  },
  "playbook-manager": {
    label: "Market Playbook Manager", role: "Field Application Manager", tagline: "Design once, validate safely, roll out by market.",
    hint: "Author targeting rules, preview assignments and publish governed playbooks.",
    examplePrompts: [
      { label: "Create playbook", prompt: "Create a Swiss priority-SKU recovery playbook for stores below 90% availability or missing target facings. Preview assignments before saving." },
      { label: "Validate coverage", prompt: "Preview which stores and SKUs the current recovery rule would target, grouped by retailer." },
      { label: "Publish version", prompt: "Publish the reviewed Swiss priority-SKU recovery playbook version 2." },
    ],
  },
} satisfies Record<string, LocalizedPersona>

function localizedCopy(value: LocalizedPersona, locale: Locale): LocalizedPersona {
  if (locale === "de") return { ...value, role: value.role === "ASM daily route readiness" ? "ASM Tages- und Routenplanung" : value.role === "Striker visit execution" ? "Striker Store-Ausführung" : "Field Application Management" }
  if (locale === "fr") return { ...value, role: value.role === "ASM daily route readiness" ? "Préparation quotidienne ASM" : value.role === "Striker visit execution" ? "Exécution de visite Striker" : "Gestion des playbooks marché" }
  return value
}

export const PERSONA_I18N: Record<string, Record<Locale, LocalizedPersona>> = Object.fromEntries(
  Object.entries(entries).map(([slug, value]) => [slug, { en: value, de: localizedCopy(value, "de"), fr: localizedCopy(value, "fr") }]),
)

export function localizePersonaField(slug: string, locale: Locale): LocalizedPersona | null {
  return PERSONA_I18N[slug]?.[locale] ?? null
}
