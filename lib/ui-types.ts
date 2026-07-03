export type PersonaMeta = {
  slug: string
  label: string
  role: string
  tagline: string
  hint: string
  writeTools: string[]
  examplePrompts: { label: string; prompt: string }[]
}

export type DomainMeta = {
  name: string
  tagline: string
  brand: { primary: string; accent: string; logo: string; favicon: string; ogImage: string; fontFamily: string }
}

export type PersonasResponse = {
  domain: DomainMeta
  personas: PersonaMeta[]
}
