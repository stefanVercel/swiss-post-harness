import type { DomainConfig } from "../../lib/domain-types"

const config: DomainConfig = {
  slug: "redbull",
  name: "Red Bull Intelligence Harness",
  tagline: "One field-sales agent, three focused workflows — route readiness, predictive in-store execution, and governed market playbooks.",
  brand: { primary: "#DB0A40", accent: "#0B1E3D", logo: "", favicon: "", ogImage: "", fontFamily: "Geist, system-ui" },
  personas: [
    {
      slug: "route-copilot", label: "Route & Huddle Copilot", role: "ASM daily route readiness", tagline: "Turn the morning huddle into an executable day.",
      hint: "Prioritize stops, surface targets and turn market guidance into a concise route briefing.", systemPromptPath: "personas/route-copilot.md",
      skills: ["route-prioritization", "huddle-synthesis", "pocket-guide"], writeTools: ["save_route_briefing", "save_huddle_digest"], defaultMode: "analyst",
      examplePrompts: [
        { label: "Build today’s route", prompt: "Prepare today’s Zürich route. Rank every stop by execution opportunity, include the morning huddle priorities, and save the route briefing." },
        { label: "Huddle digest", prompt: "Turn today’s market huddle into a concise on-route digest with targets, watch-outs, and talk tracks." },
        { label: "Pocket Guide", prompt: "What does the Pocket Guide recommend when a priority SKU has low availability but enough facings?" },
      ],
    },
    {
      slug: "store-coach", label: "In-Store Predictive Coach", role: "Striker visit execution", tagline: "The next best action for this store, right now.",
      hint: "Combine store history, assortment, planogram gaps and agreements into a ranked visit plan.", systemPromptPath: "personas/store-coach.md",
      skills: ["store-diagnosis", "next-best-action", "agreement-check"], writeTools: ["generate_visit_plan", "complete_visit_assignment", "save_visit_summary"], defaultMode: "analyst",
      examplePrompts: [
        { label: "Start store visit", prompt: "I’m starting the visit at Coop Zürich HB. Build a ranked action plan using current SKU performance, prior visit gaps, and key-account agreements, then save it." },
        { label: "Fix availability", prompt: "Which priority SKU should I address first at Coop Zürich HB and why?" },
        { label: "Close visit", prompt: "Complete the open visibility assignment and save a short visit summary with the remaining follow-ups." },
      ],
    },
    {
      slug: "playbook-manager", label: "Market Playbook Manager", role: "Field Application Manager", tagline: "Design once, validate safely, roll out by market.",
      hint: "Define targeting rules, preview assignments, check conflicts and publish governed playbooks.", systemPromptPath: "personas/playbook-manager.md",
      skills: ["rule-authoring", "assignment-preview", "playbook-governance"], writeTools: ["save_market_playbook", "preview_playbook_assignments", "publish_market_playbook"], defaultMode: "analyst",
      examplePrompts: [
        { label: "Create playbook", prompt: "Create a Swiss priority-SKU recovery playbook for stores below 90% availability or missing target facings. Preview assignments before saving." },
        { label: "Validate coverage", prompt: "Preview which stores and SKUs the current recovery rule would target, grouped by retailer." },
        { label: "Publish version", prompt: "Publish the reviewed Swiss priority-SKU recovery playbook version 2." },
      ],
    },
  ],
  database: { schemaDir: "schema", seedDir: "seed", semanticLayerDir: "semantic-layer" },
  agent: { glossaryPath: "semantic-layer/glossary.yml", answerStyle: { voice: "concise, evidence-led Red Bull field-sales copilot; English by default", avoid: ["invented operational figures", "generic advice without store evidence", "publishing without explicit approval"] } },
  docs: { architecturePath: "docs/ARCHITECTURE.md", demoPath: "docs/DEMO.md", dataPath: "docs/DATA.md" },
}
export default config
