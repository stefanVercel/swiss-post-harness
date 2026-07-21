/**
 * Minimal `DomainConfig` contract for the intelligence harness.
 *
 * The original domain pack imports this type from the (not-included) harness
 * runtime. We reproduce the shape the Red Bull field-sales `domain.config.ts` actually
 * uses so the pack drops in unmodified except for the import path.
 */
export type PersonaMode = "customer" | "analyst" | string

export interface ExamplePrompt {
  label: string
  prompt: string
}

export interface PersonaConfig {
  slug: string
  label: string
  role: string
  tagline: string
  hint: string
  systemPromptPath: string
  skills: string[]
  writeTools: string[]
  defaultMode: PersonaMode
  examplePrompts: ExamplePrompt[]
}

export interface DomainConfig {
  slug: string
  name: string
  tagline: string
  brand: {
    primary: string
    accent: string
    logo: string
    favicon: string
    ogImage: string
    fontFamily: string
  }
  personas: PersonaConfig[]
  database: {
    schemaDir: string
    seedDir: string
    semanticLayerDir: string
  }
  agent: {
    glossaryPath: string
    answerStyle: {
      voice: string
      avoid: string[]
    }
  }
  docs: {
    architecturePath: string
    demoPath: string
    dataPath: string
  }
}
