"use client"

import useSWR from "swr"
import { useState } from "react"
import Link from "next/link"
import { HarnessChat } from "@/components/harness-chat"
import { ArtifactsPanel } from "@/components/artifacts-panel"
import { PostIcon, type PostIconName } from "@/components/post-icon"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { useLocale } from "@/lib/i18n/provider"
import { UI } from "@/lib/i18n/dictionary"
import type { PersonasResponse } from "@/lib/ui-types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const PERSONA_ICON: Record<string, PostIconName> = {
  kundenservice: "customercontact",
  filiale: "branch",
  kommunikation: "newspaper",
}

export function HarnessShell() {
  const { locale } = useLocale()
  const t = UI[locale]
  const { data } = useSWR<PersonasResponse>(`/api/personas?locale=${locale}`, fetcher)
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [artifactsKey, setArtifactsKey] = useState(0)

  if (!data) {
    return (
      <div className="flex h-dvh items-center justify-center text-sm text-muted-foreground">
        {t.loading}
      </div>
    )
  }

  const active = data.personas.find((p) => p.slug === activeSlug) ?? data.personas[0]

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Brand bar */}
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
          <PostIcon name="parcel" size={20} />
        </div>
        <div className="min-w-0">
          <h1 className="font-heading text-sm font-bold leading-tight text-foreground md:text-base">
            {data.domain.name}
          </h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">{t.semanticLayerLabel}</p>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LocaleSwitcher variant="light" />
          <Link
            href="/harness"
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-accent"
          >
            <PostIcon name="network" size={16} />
            <span className="hidden sm:inline">{t.viewHarness}</span>
            <span className="sm:hidden">{t.viewHarnessShort}</span>
          </Link>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr_300px]">
        {/* Persona nav */}
        <nav className="flex gap-2 overflow-x-auto border-b border-border bg-sidebar p-3 md:flex-col md:overflow-y-auto md:border-b-0 md:border-r">
          <div className="hidden px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-sidebar-foreground/60 md:block">
            {t.teams}
          </div>
          {data.personas.map((p) => {
            const isActive = p.slug === active.slug
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => setActiveSlug(p.slug)}
                className={`shrink-0 rounded-lg px-3 py-2 text-left transition-colors md:w-full ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <PostIcon name={PERSONA_ICON[p.slug] ?? "speechbubble"} size={16} />
                  <span className="text-sm font-semibold">{p.label}</span>
                </div>
                <div
                  className={`mt-0.5 hidden text-[11px] leading-snug md:block ${
                    isActive ? "text-primary-foreground/80" : "text-sidebar-foreground/60"
                  }`}
                >
                  {p.role}
                </div>
                <div className="mt-1.5 hidden md:flex">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : p.writeTools.length
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "bg-sidebar-accent/50 text-sidebar-foreground/60"
                    }`}
                  >
                    {p.writeTools.length ? `${p.writeTools.length} ${t.writeToolsSuffix}` : t.readOnly}
                  </span>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Chat */}
        <main className="min-h-0 min-w-0">
          <HarnessChat persona={active} onArtifactsMaybeChanged={() => setArtifactsKey((k) => k + 1)} />
        </main>

        {/* Artifacts */}
        <aside className="hidden min-h-0 border-l border-border bg-secondary/30 lg:block">
          <ArtifactsPanel refreshKey={artifactsKey} />
        </aside>
      </div>
    </div>
  )
}
