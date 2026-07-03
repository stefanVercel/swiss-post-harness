import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import domainConfig from "../domains/swisspost/domain.config"
import type { DomainConfig, PersonaConfig } from "./domain-types"

const DOMAIN_DIR = join(process.cwd(), "domains", "swisspost")
const SKILLS_DIR = join(process.cwd(), "agent", "skills")

export const domain: DomainConfig = domainConfig

export function getPersona(slug: string): PersonaConfig | undefined {
  return domain.personas.find((p) => p.slug === slug)
}

export function listPersonas(): PersonaConfig[] {
  return domain.personas
}

/** Read a persona's markdown system prompt (relative to the domain dir). */
export function loadPersonaPrompt(persona: PersonaConfig): string {
  const path = join(DOMAIN_DIR, persona.systemPromptPath)
  try {
    return readFileSync(path, "utf8")
  } catch {
    return `You are the ${persona.label} persona for ${domain.name}.`
  }
}

/**
 * Load the body of any domain-specific SKILL.md that lives under agent/skills.
 * Generic harness skills (build-rich-answers, watchlist, digest, ...) are not
 * shipped as files in this pack — we fold their intent into the persona prompt
 * instead, so we only surface the skills that actually exist on disk.
 */
export function loadSkill(slug: string): string | null {
  const path = join(SKILLS_DIR, slug, "SKILL.md")
  if (!existsSync(path)) return null
  return readFileSync(path, "utf8")
}

export function loadPersonaSkills(persona: PersonaConfig): { slug: string; body: string }[] {
  const out: { slug: string; body: string }[] = []
  for (const slug of persona.skills) {
    const body = loadSkill(slug)
    if (body) out.push({ slug, body })
  }
  return out
}
