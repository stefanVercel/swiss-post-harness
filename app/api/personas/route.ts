import { listPersonas, domain } from "@/lib/domain"
import { toLocale } from "@/lib/i18n/config"
import { localizePersonaField } from "@/lib/i18n/personas"

export async function GET(req: Request) {
  const locale = toLocale(new URL(req.url).searchParams.get("locale"))

  return Response.json({
    domain: { name: domain.name, tagline: domain.tagline, brand: domain.brand },
    personas: listPersonas().map((p) => {
      const l10n = localizePersonaField(p.slug, locale)
      return {
        slug: p.slug,
        label: l10n?.label ?? p.label,
        role: l10n?.role ?? p.role,
        tagline: l10n?.tagline ?? p.tagline,
        hint: l10n?.hint ?? p.hint,
        writeTools: p.writeTools,
        examplePrompts: l10n?.examplePrompts ?? p.examplePrompts,
      }
    }),
  })
}
