"use client"

/**
 * The interactive centerpiece of /harness: a self-driving "watch the harness
 * work" demo that replays a scripted agent run (tool steps, timings, outputs)
 * for the selected persona, with play / step / reset controls. It is a
 * choreographed visualization sourced from the harness registry — deterministic
 * and never hits the backend — so the left shows the surface a person sees and
 * the right shows the shared anatomy each step lights up.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { PostIcon, type PostIconName } from "@/components/post-icon"
import { SectionShell, SectionHeader, SoWhat, Key, Label } from "@/components/harness/shared"
import {
  ALL_BLOCKS,
  INFRA,
  PERSONA_BLOCKS,
  PERSONA_META,
  PERSONA_ORDER,
  SHARED_TOOL_SET,
  SHOWCASES,
  personasUsingBlock,
  reuseCount,
  writeToolCount,
  type PersonaId,
  type RunLane,
  type RunStep,
} from "@/lib/harness-registry"
import { cn } from "@/lib/utils"

const LANE_LABEL: Record<RunLane, string> = {
  channel: "channel",
  harness: "harness",
  model: "model",
  tool: "tool",
  approval: "workflow",
  done: "done",
}

const LANE_COLOR: Record<RunLane, string> = {
  channel: "var(--sp-blue)",
  harness: "var(--sp-ink)",
  model: "var(--sp-ink)",
  tool: "var(--sp-amber)",
  approval: "var(--sp-amber)",
  done: "var(--sp-green)",
}

const STEP_MS = 1600

export function HarnessExplorer() {
  const [persona, setPersona] = useState<PersonaId>("filiale")
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const transcriptRef = useRef<HTMLDivElement>(null)

  const run = SHOWCASES[persona].run
  const active = run[stepIndex]
  const atPark = active?.pause === true
  const atEnd = stepIndex >= run.length - 1
  const accent = PERSONA_META[persona].accent

  const reset = useCallback(() => {
    setStepIndex(0)
    setPlaying(false)
  }, [])

  const advance = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, run.length - 1))
  }, [run.length])

  const selectPersona = useCallback((p: PersonaId) => {
    setPersona(p)
    setStepIndex(0)
    setPlaying(false)
  }, [])

  useEffect(() => {
    if (!playing) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStepIndex((i) => Math.min(i + 1, run.length - 1)), atPark ? STEP_MS * 1.4 : STEP_MS)
    return () => clearTimeout(t)
  }, [playing, stepIndex, atPark, atEnd, run.length])

  useEffect(() => {
    const el = transcriptRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [stepIndex, persona])

  const usedBlocks = useMemo(() => new Set(active?.uses ?? []), [active])
  const activeInfra = active?.infra
  const visibleSteps = run.slice(0, stepIndex + 1)
  const composition = PERSONA_BLOCKS[persona]
  const progress = ((stepIndex + 1) / run.length) * 100

  return (
    <SectionShell id="harness-run">
      <SectionHeader
        eyebrow="Der interaktive Beweis"
        title={
          <>
            Sieh zu, wie ein Run den <Key>geteilten Harness</Key> zum Leuchten bringt.
          </>
        }
        lead="Kundenservice, Filiale und Kommunikation sind nicht drei Produkte — sie sind drei Kompositionen eines Agenten: dasselbe Modell, dieselbe Sandbox, derselbe Semantic Layer, unterschiedlich nur in den Skills und Write-Tools, die sie einschalten. Wähl eine Persona und spiel den Run: links die Oberfläche, die ein Mensch sieht; rechts die geteilte Anatomie, die jeder Schritt live erhellt."
      />

      {/* Persona selector */}
      <div role="tablist" aria-label="Persona wählen" className="mt-8 grid gap-2.5 sm:grid-cols-3">
        {PERSONA_ORDER.map((p) => {
          const meta = PERSONA_META[p]
          const writes = writeToolCount(p)
          const selected = p === persona
          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectPersona(p)}
              className="group flex flex-col gap-1 rounded-lg border bg-card px-4 py-3 text-left shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{
                borderColor: selected ? meta.accent.color : "var(--border)",
                background: selected ? meta.accent.soft : "var(--card)",
              }}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <PostIcon name={meta.icon} size={16} />
                  <span className="font-heading text-[15px] font-bold leading-none text-card-foreground">{meta.name}</span>
                </span>
                <span
                  className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide"
                  style={
                    writes === 0
                      ? { background: "var(--muted)", color: "var(--muted-foreground)" }
                      : { background: meta.accent.color, color: meta.accent.on }
                  }
                >
                  {writes === 0 ? "read-only" : `${writes} write`}
                </span>
              </span>
              <span className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{meta.tagline}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* LEFT: the human surface + run playback */}
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/60 px-3 py-2">
            <span className="min-w-0 truncate font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              {PERSONA_META[persona].surface}
            </span>
            <div className="flex items-center gap-1">
              <ControlButton label={playing ? "Run pausieren" : atEnd ? "Run fertig" : "Run abspielen"} onClick={() => setPlaying((v) => !v)} disabled={atEnd}>
                <PostIcon name={playing ? "closex" : "chevronright"} size={16} />
              </ControlButton>
              <ControlButton label="Schritt vor" onClick={advance} disabled={atEnd}>
                <PostIcon name="chevronright" size={16} />
              </ControlButton>
              <ControlButton label="Run zurücksetzen" onClick={reset} disabled={stepIndex === 0 && !playing}>
                <PostIcon name="history" size={16} />
              </ControlButton>
            </div>
          </div>

          {/* Progress */}
          <div
            className="h-1 w-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={run.length}
            aria-valuenow={stepIndex + 1}
            aria-label="Run-Fortschritt"
          >
            <div className="h-full transition-all duration-500 ease-out" style={{ width: `${progress}%`, background: atEnd ? "var(--sp-green)" : accent.color }} />
          </div>

          {/* Transcript */}
          <div ref={transcriptRef} className="flex min-h-[320px] flex-1 flex-col gap-2.5 overflow-y-auto p-3" aria-live="polite">
            {visibleSteps.map((step, i) => (
              <StepRow key={i} step={step} accent={accent.color} isLast={i === stepIndex} />
            ))}
          </div>

          {/* Current-step detail */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <span className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase leading-none text-white" style={{ background: LANE_COLOR[active.lane] }}>
                {LANE_LABEL[active.lane]}
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">{active.event}</span>
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
                {stepIndex + 1} / {run.length}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-snug text-foreground">{active.note}</p>

            {active.cmd ? (
              <pre className="mt-2 overflow-x-auto rounded bg-sidebar p-2.5 font-mono text-[11px] leading-relaxed text-primary">
                <span className="text-sidebar-foreground/50">$ </span>
                {active.cmd}
                {active.stdout ? <span className="text-sidebar-foreground/70">{`\n→ ${active.stdout}`}</span> : ""}
              </pre>
            ) : null}

            {atEnd ? (
              <div
                className="mt-3 flex items-center gap-2 rounded border px-3 py-2 text-[12px] font-semibold text-foreground"
                style={{ borderColor: "color-mix(in srgb, var(--sp-green) 40%, transparent)", background: "var(--sp-green-soft)" }}
              >
                <PostIcon name="checkmark" size={16} className="shrink-0" />
                <span>{SHOWCASES[persona].outcome}</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* RIGHT: the shared anatomy, lit live */}
        <div className="space-y-3">
          <AnatomyRow label={`Skills geladen · ${composition.skills.length}`} icon="statusedit">
            {composition.skills.map((id) => (
              <LitChip key={id} id={id} lit={usedBlocks.has(id)} accent={accent} />
            ))}
          </AnatomyRow>

          <AnatomyRow label={`Tools verfügbar · ${composition.tools.length}`} icon="gear">
            {composition.tools.map((id) => (
              <LitChip key={id} id={id} lit={usedBlocks.has(id)} accent={accent} write={!SHARED_TOOL_SET.has(id)} />
            ))}
          </AnatomyRow>

          <AnatomyRow label={`Semantic Layer · ${composition.semantic.length} Dateien`} icon="database">
            {composition.semantic.map((id) => (
              <LitChip key={id} id={id} lit={usedBlocks.has(id)} accent={accent} />
            ))}
          </AnatomyRow>

          <AnatomyRow label={`Infrastruktur · ${Object.keys(INFRA).length} Primitives`} icon="server">
            {Object.keys(INFRA).map((id) => (
              <LitChip key={id} id={id} lit={activeInfra === id} accent={{ color: "var(--sp-ink)", soft: "var(--sp-ink-soft)", on: "#fff" }} icon={INFRA[id].icon} />
            ))}
          </AnatomyRow>
        </div>
      </div>

      <SoWhat className="mt-8">
        Ein Agent, drei Jobs, null Forks: die Anatomie ändert sich nie — nur welche Teile eine Anfrage erhellt. So sieht
        „ein Harness, viele Agenten“ zur Laufzeit aus.
      </SoWhat>
    </SectionShell>
  )
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  readonly label: string
  readonly onClick: () => void
  readonly disabled?: boolean
  readonly children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-7 w-7 items-center justify-center rounded text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function AnatomyRow({ label, icon, children }: { readonly label: string; readonly icon: PostIconName; readonly children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
      <Label className="flex items-center gap-1.5">
        <PostIcon name={icon} size={13} />
        {label}
      </Label>
      <div className="mt-2.5 flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Chat transcript — UI-element mockups driven by the run steps                 */
/* -------------------------------------------------------------------------- */

function StepRow({ step, accent, isLast }: { readonly step: RunStep; readonly accent: string; readonly isLast: boolean }) {
  const nodes: ReactNode[] = []
  const say = step.say
  const ev = step.event.toLowerCase()

  if (say?.actor === "user") nodes.push(<UserBubble key="u">{say.text}</UserBubble>)
  if (step.cmd) nodes.push(<ToolCallCard key="cmd" event={step.event} cmd={step.cmd} stdout={step.stdout} />)
  if (step.chart) nodes.push(<ChartMockCard key="chart" />)

  if (step.produces === "report") nodes.push(<ArtifactCard key="art" kind="report" status="saved" accent={accent} />)
  if (step.produces === "watchlist") nodes.push(<ArtifactCard key="art" kind="watchlist" status="saved" accent={accent} />)
  if (step.produces === "digest") nodes.push(<ArtifactCard key="art" kind="digest" status="saved" accent={accent} />)
  if (step.produces === "draft") nodes.push(<ArtifactCard key="art" kind="draft" status="in_review" accent={accent} />)
  else if (ev.includes("revise")) nodes.push(<ArtifactCard key="art" kind="draft" status="revised" accent={accent} />)
  else if (ev.includes("publish")) nodes.push(<ArtifactCard key="art" kind="draft" status="published" accent={accent} />)

  if (step.pause) nodes.push(<ParkedCard key="park" />)

  if (say?.actor === "agent") nodes.push(<AgentBubble key="a">{say.text}</AgentBubble>)
  if (say?.actor === "system") nodes.push(<SystemBubble key="s" emphasis={say.emphasis}>{say.text}</SystemBubble>)

  if (nodes.length === 0) nodes.push(<StatusChip key="st" lane={step.lane} text={step.event} pulse={isLast} />)

  return <div className="flex flex-col gap-2.5">{nodes}</div>
}

function UserBubble({ children }: { readonly children: ReactNode }) {
  return (
    <div className="ml-auto max-w-[88%] rounded-md rounded-br-none bg-sidebar px-3 py-2 text-[13px] font-semibold leading-snug text-sidebar-foreground">
      {children}
    </div>
  )
}

function AgentBubble({ children }: { readonly children: ReactNode }) {
  return (
    <div className="mr-auto max-w-[88%] rounded-md rounded-bl-none border border-border bg-card px-3 py-2 text-[13px] leading-snug text-foreground shadow-sm">
      {children}
    </div>
  )
}

function SystemBubble({ children, emphasis }: { readonly children: ReactNode; readonly emphasis?: boolean }) {
  if (emphasis) {
    return (
      <div
        className="mr-auto flex max-w-[88%] items-center gap-2 rounded-md border px-3 py-2 text-[13px] font-semibold leading-snug"
        style={{ color: "var(--sp-green)", borderColor: "color-mix(in srgb, var(--sp-green) 40%, transparent)", background: "var(--sp-green-soft)" }}
      >
        <PostIcon name="checkmark" size={14} className="shrink-0" />
        {children}
      </div>
    )
  }
  return (
    <div className="mx-auto rounded-full bg-muted px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide text-muted-foreground">
      {children}
    </div>
  )
}

function ToolCallCard({ event, cmd, stdout }: { readonly event: string; readonly cmd: string; readonly stdout?: string }) {
  return (
    <div className="mr-auto w-[92%] overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/60 px-2.5 py-1">
        <PostIcon name="database" size={12} className="text-muted-foreground" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{event}</span>
      </div>
      <pre className="overflow-x-auto bg-sidebar px-2.5 py-1.5 font-mono text-[10.5px] leading-snug text-primary">
        <span className="text-sidebar-foreground/50">$ </span>
        {cmd}
        {stdout ? <span className="block text-sidebar-foreground/70">{`→ ${stdout}`}</span> : null}
      </pre>
    </div>
  )
}

function ChartMockCard() {
  const rows = [
    { label: "Zürich", w: "100%" },
    { label: "Bern", w: "72%" },
    { label: "Waadt", w: "58%" },
    { label: "Aargau", w: "41%" },
  ]
  return (
    <div className="mr-auto w-[92%] overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-2.5 py-1.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-foreground">
          <PostIcon name="dashboard" size={12} />
          Priority-Volumen · nach Kanton
        </span>
        <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[9px] uppercase text-foreground">chart</span>
      </div>
      <div className="flex flex-col gap-1.5 p-2.5">
        {rows.map((r, i) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="w-20 shrink-0 truncate text-[11px] text-foreground">
              {i + 1}. {r.label}
            </span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-sm bg-muted">
              <span className="hx-trace-bar block h-full rounded-sm bg-primary" style={{ width: r.w, animationDelay: `${i * 0.08}s` }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

type ArtifactKindMock = "report" | "watchlist" | "digest" | "draft"
type ArtifactStatus = "saved" | "in_review" | "revised" | "published"

const ARTIFACT_META: Record<ArtifactKindMock, { title: string; icon: PostIconName }> = {
  report: { title: "Case-Briefing", icon: "document" },
  watchlist: { title: "Watchlist", icon: "favoritestar" },
  digest: { title: "Digest", icon: "newsletter" },
  draft: { title: "Service-Seiten-Draft", icon: "newspaper" },
}

const STATUS_META: Record<ArtifactStatus, { label: string; sub: string; color: string }> = {
  saved: { label: "saved", sub: "in der Library gespeichert", color: "var(--sp-blue)" },
  in_review: { label: "in review", sub: "im Editorial-Review", color: "var(--sp-amber)" },
  revised: { label: "revised", sub: "zurück in der Queue", color: "var(--sp-blue)" },
  published: { label: "published", sub: "live auf post.ch", color: "var(--sp-green)" },
}

function ArtifactCard({ kind, status, accent }: { readonly kind: ArtifactKindMock; readonly status: ArtifactStatus; readonly accent: string }) {
  const meta = ARTIFACT_META[kind]
  const st = STATUS_META[status]
  return (
    <div className="mr-auto flex w-[92%] items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2.5 shadow-sm" style={{ borderLeft: `3px solid ${accent}` }}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-foreground" aria-hidden>
        <PostIcon name={meta.icon} size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <span className="block truncate font-heading text-[13px] font-bold text-card-foreground">{meta.title}</span>
        <span className="block truncate text-[11px] text-muted-foreground">{st.sub}</span>
      </div>
      <span className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white" style={{ background: st.color }}>
        {st.label}
      </span>
    </div>
  )
}

function ParkedCard() {
  return (
    <div
      className="mr-auto flex w-[92%] items-center gap-2 rounded-md border border-dashed px-3 py-2 text-[12px]"
      style={{ color: "var(--sp-amber)", borderColor: "color-mix(in srgb, var(--sp-amber) 50%, transparent)", background: "var(--sp-amber-soft)" }}
    >
      <PostIcon name="history" size={14} className="shrink-0" />
      <span>Durable Workflow geparkt — null Compute — resumt von exakt diesem Schritt.</span>
    </div>
  )
}

function StatusChip({ lane, text, pulse }: { readonly lane: RunLane; readonly text: string; readonly pulse: boolean }) {
  return (
    <div className="mr-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1">
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", pulse && "hx-blink")} style={{ background: LANE_COLOR[lane] }} />
      <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{text}</span>
    </div>
  )
}

function LitChip({
  id,
  lit,
  accent,
  write,
  icon,
}: {
  readonly id: string
  readonly lit: boolean
  readonly accent: { color: string; soft: string; on: string }
  readonly write?: boolean
  readonly icon?: PostIconName
}) {
  const block = ALL_BLOCKS[id]
  const count = reuseCount(id)
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-[11px] leading-none transition-all"
      title={block ? `${block.blurb} · genutzt von ${personasUsingBlock(id).length} Persona(s)` : id}
      style={
        lit
          ? { background: accent.color, color: accent.on, border: "1px solid transparent", boxShadow: "0 1px 2px rgba(0,0,0,0.12)" }
          : { background: "var(--card)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }
      }
    >
      {icon ? <PostIcon name={icon} size={11} /> : null}
      {write ? <PostIcon name="save" size={10} /> : null}
      {block?.name ?? id}
      {count > 1 ? (
        <span
          className="rounded-[3px] px-1 py-px text-[8.5px] font-bold"
          style={lit ? { background: "rgba(255,255,255,0.28)", color: accent.on } : { background: "var(--muted)", color: "var(--muted-foreground)" }}
        >
          ×{count}
        </span>
      ) : null}
    </span>
  )
}
