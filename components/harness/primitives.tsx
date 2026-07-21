"use client"

import type { ReactNode } from "react"
import { PostIcon } from "@/components/post-icon"
import { SectionShell, SectionHeader, Key, Label } from "@/components/harness/shared"
import { getRegistry } from "@/lib/harness-registry"
import { useLocale } from "@/lib/i18n/provider"
import { HARNESS } from "@/lib/i18n/harness-copy"

/**
 * "The technology" — the managed Vercel primitives every turn is composed from,
 * wired together by Eve. Each primitive is its own card with a bespoke
 * micro-diagram (not a bullet), then a Build/Run/Govern strip that shows how a
 * folder of files maps onto the runtime. All motion is CSS-keyframe based and
 * disabled under prefers-reduced-motion.
 */

const VIZ: Record<string, ReactNode> = {
  "ai-sdk": <VizAiSdk />,
  "ai-gateway": <VizGateway />,
  sandbox: <VizSandbox />,
  workflow: <VizWorkflow />,
  "fluid-compute": <VizFluid />,
  observability: <VizObservability />,
  connect: <VizConnect />,
  security: <VizSecurity />,
  "ai-elements": <VizElements />,
}

export function Primitives() {
  const { locale } = useLocale()
  const c = HARNESS[locale]
  const reg = getRegistry(locale)
  const cards = Object.values(reg.infra)
  return (
    <SectionShell id="primitives" tint="soft">
      <SectionHeader
        eyebrow={c.techEyebrow}
        title={
          <>
            {c.techTitlePre}
            <Key>{c.techTitleKey}</Key>
            {c.techTitlePost}
          </>
        }
        lead={c.techLead}
      />

      {/* Eve framing strip */}
      <div className="mt-8 flex flex-col gap-4 rounded-lg border border-sidebar-border bg-sidebar p-5 text-sidebar-foreground shadow-md sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <PostIcon name="rocket" size={22} />
          </span>
          <div>
            <p className="m-0 font-heading text-lg font-bold">Eve</p>
            <p className="m-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-primary">{c.eveTag}</p>
          </div>
        </div>
        <p className="m-0 text-[14px] leading-relaxed text-sidebar-foreground/80 sm:border-l sm:border-sidebar-border sm:pl-6">
          {c.eveParagraph}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <article
            key={card.id}
            className="hx-rise flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            style={{ animationDelay: `${i * 55}ms` }}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-foreground ring-1 ring-border">
                <PostIcon name={card.icon} size={18} />
              </span>
              <div className="min-w-0">
                <h3 className="m-0 truncate font-heading text-[15px] font-bold text-card-foreground">{card.name}</h3>
                <p className="m-0 truncate font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                  {card.tag}
                </p>
              </div>
            </div>

            <div className="mt-3.5 flex h-28 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/50 px-3">
              {VIZ[card.id]}
            </div>

            <p className="mt-3.5 text-[12.5px] leading-relaxed text-muted-foreground">{card.blurb}</p>
          </article>
        ))}
      </div>

      {/* Build / Run / Govern strip */}
      <div className="mt-10">
        <Label>{c.foldersLabel}</Label>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {reg.layers.map((layer, i) => (
            <div key={layer.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-foreground font-mono text-[11px] font-bold text-background">
                  {i + 1}
                </span>
                <h3 className="m-0 font-heading text-base font-bold text-card-foreground">{layer.title}</h3>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{layer.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {layer.infra.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-foreground"
                  >
                    <PostIcon name={reg.infra[id].icon} size={12} className="text-muted-foreground" />
                    {reg.infra[id].name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

/* -------------------------------------------------------------------------- */
/* Micro-diagrams — one per primitive                                          */
/* -------------------------------------------------------------------------- */

const chip =
  "rounded border border-border bg-card px-2 py-1 font-mono text-[10.5px] leading-none text-foreground shadow-sm"

function useViz() {
  const { locale } = useLocale()
  return HARNESS[locale].viz
}

function VizAiSdk() {
  const v = useViz()
  return (
    <div className="flex w-full items-center justify-center gap-3">
      <div className="relative flex h-[84px] w-[84px] items-center justify-center">
        <span aria-hidden className="hx-orbit absolute inset-0 rounded-full border-2 border-dashed border-primary/60" />
        <div className="flex flex-col items-center gap-1">
          <span className={chip}>streamText</span>
          <PostIcon name="history" size={12} className="text-muted-foreground" />
          <span className={chip}>tool()</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[9px] uppercase tracking-wide text-muted-foreground">{v.oneToolkit}</span>
        <span className={chip}>generateObject</span>
        <span className={chip}>any model</span>
      </div>
    </div>
  )
}

function VizGateway() {
  const providers = ["anthropic", "openai", "xai"]
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex flex-col gap-1">
        {providers.map((p) => (
          <span key={p} className={chip}>
            {p}
          </span>
        ))}
      </div>
      <div className="relative flex h-16 flex-1 items-center" aria-hidden>
        <svg viewBox="0 0 80 60" className="h-full w-full" preserveAspectRatio="none">
          {[12, 30, 48].map((y, i) => (
            <path key={i} d={`M0,${y} C 40,${y} 40,30 80,30`} fill="none" stroke="var(--sp-ink)" strokeWidth={1.25} opacity={0.35} />
          ))}
        </svg>
        <span className="hx-stream absolute left-1/3 top-1/2 h-1.5 w-1.5 rounded-full bg-foreground" />
        <span className="hx-stream absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-foreground" style={{ animationDelay: "0.7s" }} />
      </div>
      <span className="rounded bg-foreground px-2 py-1.5 text-center font-mono text-[9.5px] font-bold uppercase leading-tight text-background">
        1<br />endpoint
      </span>
    </div>
  )
}

function VizSandbox() {
  const v = useViz()
  return (
    <div className="w-full">
      <div className="rounded-md border border-dashed border-primary bg-card p-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wide text-foreground">
            <PostIcon name="server" size={12} />
            microVM
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
            <span aria-hidden className="hx-blink h-1.5 w-1.5 rounded-full" style={{ background: "var(--sp-green)" }} />
            {v.isolated}
          </span>
        </div>
        <pre className="mt-1.5 overflow-hidden rounded bg-sidebar px-2 py-1 font-mono text-[10px] leading-snug text-primary">
          <span className="text-sidebar-foreground/50">$ </span>bash · query_database
        </pre>
        <p className="mt-1 font-mono text-[9px] text-muted-foreground">{v.semanticMounted}</p>
      </div>
      <div className="mt-1.5 flex items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-wide text-muted-foreground">
        <span>{v.boot}</span>
        <span aria-hidden>→</span>
        <span className="font-bold text-foreground">{v.run}</span>
        <span aria-hidden>→</span>
        <span>{v.dispose}</span>
      </div>
    </div>
  )
}

function VizWorkflow() {
  const v = useViz()
  return (
    <div className="w-full">
      <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide">
        <span className="rounded bg-foreground px-2 py-1 text-background">{v.run}</span>
        <span className="h-px w-2 bg-border" aria-hidden />
        <span
          className="inline-flex items-center gap-1 rounded border border-dashed px-2 py-1"
          style={{ color: "var(--sp-amber)", borderColor: "var(--sp-amber)" }}
        >
          <span className="hx-blink h-1.5 w-1.5 rounded-full" style={{ background: "var(--sp-amber)" }} aria-hidden />
          {v.parked}
        </span>
        <span className="h-px w-2 bg-border" aria-hidden />
        <span className="rounded px-2 py-1 text-white" style={{ background: "var(--sp-green)" }}>
          resume
        </span>
      </div>
      <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">{v.suspendResume}</p>
    </div>
  )
}

function VizFluid() {
  const v = useViz()
  return (
    <div className="flex w-full flex-col items-center gap-1">
      <div className="flex h-14 items-end gap-1.5">
        {[0, 1, 2, 3, 4].map((b) => (
          <span key={b} className="hx-fluid-bar w-3 rounded-sm bg-foreground" style={{ height: "100%", animationDelay: `${b * 0.18}s` }} />
        ))}
      </div>
      <div className="flex w-full items-center justify-between font-mono text-[9.5px] uppercase tracking-wide text-muted-foreground">
        <span>{v.work}</span>
        <span>{v.idleZero}</span>
      </div>
    </div>
  )
}

function VizObservability() {
  const spans = [
    { w: "92%", label: "turn", delay: 0 },
    { w: "64%", label: "tool", delay: 0.15 },
    { w: "78%", label: "model", delay: 0.3 },
    { w: "40%", label: "token", delay: 0.45 },
  ]
  return (
    <div className="flex w-full flex-col gap-1.5">
      {spans.map((s, i) => (
        <div key={i} className="flex items-center gap-2" style={{ paddingLeft: `${i * 8}px` }}>
          <span
            className="hx-trace-bar h-2 rounded-full bg-foreground"
            style={{ width: s.w, animationDelay: `${s.delay}s`, opacity: 1 - i * 0.14 }}
          />
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-wide text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function VizConnect() {
  const v = useViz()
  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      <div className="flex w-full items-center justify-between gap-1">
        <span className={chip}>agent</span>
        <div className="relative flex h-7 flex-1 items-center" aria-hidden>
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
          <span className="hx-stream absolute left-2 top-1/2 h-1.5 w-1.5 rounded-full bg-foreground" />
          <span className="absolute left-1/2 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-foreground bg-card">
            <PostIcon name="key" size={11} />
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded bg-foreground px-2 py-1.5 font-mono text-[9.5px] font-bold uppercase leading-none text-background">
          Neon
        </span>
      </div>
      <span className="rounded bg-accent px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-foreground">
        {v.scopedToken}
      </span>
      <span className="font-mono text-[9px] text-muted-foreground">{v.noSecrets}</span>
    </div>
  )
}

function VizSecurity() {
  const v = useViz()
  return (
    <div className="flex w-full items-center justify-center gap-3">
      <div className="flex flex-col gap-1.5">
        <span
          className="inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-[10px]"
          style={{ color: "var(--sp-green)", borderColor: "color-mix(in srgb, var(--sp-green) 40%, transparent)", background: "var(--sp-green-soft)" }}
        >
          <PostIcon name="checkmark" size={11} /> {v.human}
        </span>
        <span
          className="inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-[10px] line-through"
          style={{ color: "var(--sp-red)", borderColor: "color-mix(in srgb, var(--sp-red) 40%, transparent)", background: "var(--sp-red-soft)" }}
        >
          <PostIcon name="closex" size={11} /> {v.bot}
        </span>
        <span className="inline-flex items-center gap-1 rounded border border-border bg-accent px-2 py-1 font-mono text-[10px] text-foreground">
          <PostIcon name="lockclosed" size={11} /> {v.passport}
        </span>
      </div>
      <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full" aria-hidden>
        <span className="hx-scan absolute inset-0" />
        <PostIcon name="maskshield" size={34} className="text-foreground" />
      </div>
    </div>
  )
}

function VizElements() {
  const v = useViz()
  return (
    <div className="flex w-full items-center justify-center gap-3">
      <div className="flex flex-col gap-1.5">
        <span className="rounded rounded-bl-none bg-foreground px-2.5 py-1.5 text-[10px] font-semibold text-background">
          {v.answer}
        </span>
        <span className="rounded border border-border bg-card px-2.5 py-1 font-mono text-[9px] text-muted-foreground">
          finalize_answer
        </span>
      </div>
      <div className="flex h-14 items-end gap-1 rounded border border-border bg-card p-1.5">
        {["55%", "80%", "38%", "66%"].map((h, i) => (
          <span key={i} className="w-2.5 rounded-sm bg-primary" style={{ height: h }} />
        ))}
      </div>
    </div>
  )
}
