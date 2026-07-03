import type { Metadata } from "next"
import Link from "next/link"
import { PostIcon } from "@/components/post-icon"
import { Primitives } from "@/components/harness/primitives"
import { HarnessExplorer } from "@/components/harness/harness-explorer"
import { SectionShell, Eyebrow, Key } from "@/components/harness/shared"
import { HARNESS_STATS } from "@/lib/harness-registry"

export const metadata: Metadata = {
  title: "Ein Harness, viele Agenten · Swiss Post Intelligence",
  description:
    "Sieh dem Swiss Post Harness bei der Arbeit zu: die Vercel-AI-Primitives unter jedem Turn und ein interaktiver Run, der die geteilte Anatomie live erhellt.",
}

const STATS: { value: number; label: string }[] = [
  { value: HARNESS_STATS.personas, label: "Agenten heute" },
  { value: HARNESS_STATS.skills, label: "wiederverwendbare Skills" },
  { value: HARNESS_STATS.semantic, label: "semantische Dateien" },
  { value: HARNESS_STATS.primitives, label: "Vercel-Primitives" },
]

export default function HarnessPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Zur Swiss Post Intelligence Startseite">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <PostIcon name="parcel" size={20} />
            </span>
            <span className="font-heading text-sm font-extrabold tracking-tight">Swiss Post Intelligence</span>
          </Link>
          <nav className="flex items-center gap-1.5">
            <a href="#harness-run" className="hidden rounded px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-block">
              Harness-Run
            </a>
            <a href="#primitives" className="hidden rounded px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-block">
              Die Technologie
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded bg-foreground px-3 py-1.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              <PostIcon name="speechbubble" size={15} />
              Zum Chat
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <SectionShell>
        <div className="max-w-3xl">
          <Eyebrow>Swiss Post · der Intelligence-Harness</Eyebrow>
          <h1 className="mt-3 text-balance font-heading text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.03] tracking-tight">
            Ein Harness, <Key>viele Agenten</Key>.
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Kauf keine AI-Features und bau sie nicht einzeln. Bau einen Harness — ein headless, komponierbares Fundament
            über euren eigenen Daten — und jeder neue Agent wird eine günstige Komposition statt ein Neubau.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#harness-run"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <PostIcon name="chevronright" size={16} />
              Den Harness-Run ansehen
            </a>
            <a
              href="#primitives"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-muted"
            >
              <PostIcon name="layers" size={16} />
              Die Technologie
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-card px-4 py-5">
              <div className="font-heading text-3xl font-extrabold tabular-nums">{s.value}</div>
              <div className="mt-1 text-[12.5px] leading-snug text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* The interactive proof */}
      <HarnessExplorer />

      {/* The technology */}
      <Primitives />

      {/* Closing CTA */}
      <SectionShell tint="ink">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="text-balance font-heading text-[clamp(1.4rem,3vw,2rem)] font-extrabold leading-tight">
              Bau den Harness einmal. Verzins ihn für immer.
            </h2>
            <p className="mt-3 text-pretty text-[15px] leading-relaxed text-sidebar-foreground/75">
              Eure Daten einmal als Semantic Layer modelliert, eure Fachexpertise als wiederverwendbare Skills, jeder
              Agent auf derselben gemanagten Infrastruktur. Der nächste Agent ist eine Komposition entfernt.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <PostIcon name="speechbubble" size={16} />
            Den Research-Agenten öffnen
          </Link>
        </div>
      </SectionShell>
    </main>
  )
}
