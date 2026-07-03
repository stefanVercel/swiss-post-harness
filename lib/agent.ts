import { ToolLoopAgent, stepCountIs, type InferAgentUIMessage } from "ai"
import { domain, getPersona, loadPersonaPrompt, loadPersonaSkills } from "./domain"
import { buildGroundingContext } from "./semantic-layer"
import { readTools, writeToolsFor } from "./tools"

const MODEL = "anthropic/claude-sonnet-4.5"

/** Compose the full system prompt for a persona from all grounding sources. */
function buildInstructions(personaSlug: string): string {
  const persona = getPersona(personaSlug)
  if (!persona) throw new Error(`Unknown persona: ${personaSlug}`)

  const personaPrompt = loadPersonaPrompt(persona)
  const grounding = buildGroundingContext()
  const skills = loadPersonaSkills(persona)

  const skillsBlock = skills.length
    ? skills.map((s) => `### Skill: ${s.slug}\n${s.body}`).join("\n\n")
    : "No domain-specific skill files loaded for this persona; follow the persona playbook above."

  const canWrite = persona.writeTools.length
    ? `You MAY use these write tools: ${persona.writeTools.join(", ")}.`
    : "You are READ-ONLY. You have no write tools. Never claim to have saved or published anything."

  return [
    `# ${domain.name} — Persona: ${persona.label} (${persona.role})`,
    "",
    `Answer style: ${domain.agent.answerStyle.voice}.`,
    `Never do: ${domain.agent.answerStyle.avoid.join("; ")}.`,
    "",
    "## Persona system prompt",
    personaPrompt,
    "",
    "## Tools & permissions",
    "You have read tools `query_database` (single read-only SELECT) and `read_semantic_doc`.",
    canWrite,
    "Always ground in the semantic layer before writing SQL. Reuse metric sql_hints verbatim where they fit.",
    "Present figures in Swiss format (1'234.50 CHF, 12.5%). All 2026 numbers are demo-grade.",
    "",
    "## Applicable skills",
    skillsBlock,
    "",
    "## Semantic layer",
    grounding,
  ].join("\n")
}

/** Build a ToolLoopAgent scoped to a single persona's capabilities. */
export function buildAgent(personaSlug: string) {
  const persona = getPersona(personaSlug)
  if (!persona) throw new Error(`Unknown persona: ${personaSlug}`)

  const tools = {
    ...readTools,
    ...writeToolsFor(persona.writeTools),
  }

  return new ToolLoopAgent({
    model: MODEL,
    instructions: buildInstructions(personaSlug),
    tools,
    stopWhen: stepCountIs(12),
  })
}

// A representative agent purely for UI message type inference.
export type HarnessUIMessage = InferAgentUIMessage<ReturnType<typeof buildAgent>>
