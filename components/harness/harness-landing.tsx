"use client"

import Link from "next/link"
import { PostIcon } from "@/components/post-icon"
import { Primitives } from "@/components/harness/primitives"
import { HarnessExplorer } from "@/components/harness/harness-explorer"
import { SectionShell, Eyebrow } from "@/components/harness/shared"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { HARNESS_STATS } from "@/lib/harness-registry"
import { useLocale } from "@/lib/i18n/provider"
import { UI } from "@/lib/i18n/dictionary"

const RED_BULL_LOGO =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Red_Bull_idCMb-1Vvp_1-Z16AvVNSA8y6E7kqOqnILqJTNzvwXi.svg"
const HERO_IMAGE =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Red_Bull_Banner_3-M6rhJOBMOfNONt4ppKquuYjtLLsrxN.jpeg"

export function HarnessLanding() {
  const { locale } = useLocale()
  const t = UI[locale]
  const stats = [
    { value: HARNESS_STATS.personas, label: t.statAgents },
    { value: HARNESS_STATS.skills, label: t.statSkills },
    { value: HARNESS_STATS.semantic, label: t.statSemantic },
    { value: HARNESS_STATS.primitives, label: t.statPrimitives },
  ]

  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-4" aria-label={t.homeAria}>
            <img src={RED_BULL_LOGO} alt="Red Bull" className="h-8 w-auto object-contain sm:h-9" />
            <span className="hidden border-l border-sidebar-border pl-4 font-heading text-sm font-extrabold sm:block">
              Intelligence Harness
            </span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Primary navigation">
            <a href="#harness-run" className="hidden rounded-full px-3 py-2 text-sm font-semibold text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground sm:inline-flex">
              {t.harnessRunNav}
            </a>
            <a href="#primitives" className="hidden rounded-full px-3 py-2 text-sm font-semibold text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground md:inline-flex">
              {t.technologyNav}
            </a>
            <LocaleSwitcher variant="onInk" />
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-destructive">
              <PostIcon name="speechbubble" size={15} />
              <span className="hidden sm:inline">{t.toChat}</span>
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-border bg-sidebar px-4 py-4 sm:px-6 sm:py-6">
        <div className="relative mx-auto min-h-[560px] max-w-6xl overflow-hidden rounded-3xl bg-sidebar sm:min-h-[620px]">
          <img src={HERO_IMAGE} alt="Red Bull aircraft and wingsuit athletes flying above a tropical coastline" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-sidebar/70" />
          <div className="relative flex min-h-[560px] max-w-2xl flex-col justify-end p-6 text-sidebar-foreground sm:min-h-[620px] sm:p-10 lg:p-14">
            <Eyebrow className="text-accent">{t.heroEyebrow}</Eyebrow>
            <h1 className="mt-4 text-balance font-heading text-[clamp(2.8rem,7vw,5.8rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.04em]">
              {t.heroTitlePre}<span className="text-accent">{t.heroTitleKey}</span>.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-sidebar-foreground/80 sm:text-lg">{t.heroLead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#harness-run" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-destructive">
                <PostIcon name="chevronright" size={16} />
                {t.heroCtaRun}
              </a>
              <a href="#primitives" className="inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 text-sm font-bold text-card-foreground transition-all hover:-translate-y-0.5 hover:bg-accent">
                <PostIcon name="layers" size={16} />
                {t.heroCtaTech}
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-4 grid max-w-6xl grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-sidebar-border bg-sidebar-accent px-5 py-5 text-sidebar-foreground">
              <div className="font-heading text-3xl font-extrabold tabular-nums text-accent">{stat.value}</div>
              <div className="mt-1 text-sm leading-snug text-sidebar-foreground/65">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <HarnessExplorer />
      <Primitives />

      <SectionShell tint="ink">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="text-balance font-heading text-[clamp(1.8rem,4vw,3rem)] font-extrabold uppercase leading-none">{t.closingTitle}</h2>
            <p className="mt-3 text-pretty text-[15px] leading-relaxed text-sidebar-foreground/75">{t.closingLead}</p>
          </div>
          <Link href="/" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-destructive">
            <PostIcon name="speechbubble" size={16} />
            {t.closingCta}
          </Link>
        </div>
      </SectionShell>
    </main>
  )
}
