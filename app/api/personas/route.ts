import { listPersonas, domain } from "@/lib/domain"

export async function GET() {
  return Response.json({
    domain: { name: domain.name, tagline: domain.tagline, brand: domain.brand },
    personas: listPersonas().map((p) => ({
      slug: p.slug,
      label: p.label,
      role: p.role,
      tagline: p.tagline,
      hint: p.hint,
      writeTools: p.writeTools,
      examplePrompts: p.examplePrompts,
    })),
  })
}
