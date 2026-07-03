"use client";

/**
 * The interactive centerpiece of the /harness page: a self-driving "watch the
 * harness work" demo that replays a scripted agent run (tool steps, timings,
 * outputs) for the selected persona, with play/pause/restep controls. It is a
 * choreographed visualization sourced from the harness registry, not a live
 * agent call — so the explainer is deterministic and never hits the backend.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Play,
  Pause,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Terminal,
  BarChart3,
  FileText,
  Newspaper,
  ListChecks,
} from "lucide-react";
import { SectionShell, SectionHeader, SoWhat, Label } from "@/components/harness/shared";
import { PERSONA_ACCENT } from "@/components/harness/accents";
import {
  ALL_BLOCKS,
  INFRA,
  PERSONA_BLOCKS,
  PERSONA_META,
  PERSONA_ORDER,
  SHOWCASES,
  agentsUsingBlock,
  reuseCount,
  type PersonaId,
  type RunStep,
} from "@/lib/harness-registry";
import { cn } from "@/lib/utils";

/** Shared read-tools every persona gets — the rest are persona-specific writes. */
const SHARED_TOOLS = new Set([
  "query_database",
  "create_chart",
  "finalize_answer",
  "bash",
  "read_file",
  "load_skill",
]);

const LANE_LABEL: Record<RunStep["lane"], string> = {
  channel: "channel",
  harness: "harness",
  model: "model",
  tool: "tool",
  approval: "workflow",
  done: "done",
};

const LANE_COLOR: Record<RunStep["lane"], string> = {
  channel: "var(--tm-blue)",
  harness: "var(--tm-navy)",
  model: "#6d28d9",
  tool: "var(--tm-red)",
  approval: "var(--tm-amber)",
  done: "var(--tm-value-up)",
};

const STEP_MS = 1500;

export function HarnessExplorer() {
  const [persona, setPersona] = useState<PersonaId>("scout");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const run = SHOWCASES[persona].run;
  const active = run[stepIndex];
  const atPark = active?.pause === true;
  const atEnd = stepIndex >= run.length - 1;

  const reset = useCallback(() => {
    setStepIndex(0);
    setPlaying(false);
  }, []);

  const advance = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, run.length - 1));
  }, [run.length]);

  const selectPersona = useCallback((p: PersonaId) => {
    setPersona(p);
    setStepIndex(0);
    setPlaying(false);
  }, []);

  // Auto-advance while playing; linger a little at a durable park.
  useEffect(() => {
    if (!playing) return;
    if (atEnd) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(
      () => setStepIndex((i) => Math.min(i + 1, run.length - 1)),
      atPark ? STEP_MS * 1.4 : STEP_MS,
    );
    return () => clearTimeout(t);
  }, [playing, stepIndex, atPark, atEnd, run.length]);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [stepIndex, persona]);

  const usedBlocks = useMemo(() => new Set(active?.uses ?? []), [active]);
  const activeInfra = active?.infra;
  const visibleSteps = run.slice(0, stepIndex + 1);
  const composition = PERSONA_BLOCKS[persona];
  const progress = ((stepIndex + 1) / run.length) * 100;
  const accent = PERSONA_ACCENT[persona].color;

  return (
    <SectionShell id="harness-run">
      <SectionHeader
        eyebrow="The interactive proof"
        eyebrowTone="red"
        title={
          <>
            Watch one run light up the <span className="text-[var(--tm-blue)]">shared harness</span>.
          </>
        }
        lead="Fan, scout, and editor are not three products — they are three compositions of one agent: same model, same sandbox, same semantic layer, differing only in the skills and write-tools they switch on. Pick a persona and play the run: the left is the surface a person sees; the right is the shared anatomy each step touches, lit live."
      />

      {/* Persona selector */}
      <div role="tablist" aria-label="Choose a persona" className="mt-8 grid gap-2.5 sm:grid-cols-3">
        {PERSONA_ORDER.map((p) => {
          const meta = PERSONA_META[p];
          const writeTools = PERSONA_BLOCKS[p].tools.filter((t) => !SHARED_TOOLS.has(t));
          const selected = p === persona;
          const pa = PERSONA_ACCENT[p];
          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectPersona(p)}
              className="group flex flex-col gap-1 rounded-sm border bg-[var(--tm-box-bg)] px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tm-blue-bright)]"
              style={{
                borderColor: selected ? pa.color : "var(--tm-border)",
                background: selected ? pa.soft : "var(--tm-box-bg)",
                boxShadow: selected ? "var(--tm-shadow-sm)" : "var(--tm-shadow-xs)",
              }}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-bold text-[15px] leading-none text-[var(--tm-navy)]">{meta.name}</span>
                <span
                  className="rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide"
                  style={
                    writeTools.length === 0
                      ? { background: "var(--tm-table-header-bg)", color: "var(--tm-text-muted)" }
                      : { background: pa.color, color: "#fff" }
                  }
                >
                  {writeTools.length === 0 ? "read-only" : `${writeTools.length} write`}
                </span>
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--tm-text-muted)]">
                {meta.surface.split(" · ")[0]}
              </span>
              <span className="mt-0.5 text-[12.5px] leading-snug text-[var(--tm-text-muted)]">{meta.tagline}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* LEFT: the human surface + run playback */}
        <div className="flex flex-col overflow-hidden rounded-sm border border-[var(--tm-border)] bg-[var(--tm-box-bg)] shadow-[var(--tm-shadow-sm)]">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--tm-border)] bg-[var(--tm-table-header-bg)] px-3 py-2">
            <span className="min-w-0 truncate font-mono text-[11px] uppercase tracking-wide text-[var(--tm-text-muted)]">
              {PERSONA_META[persona].surface}
            </span>
            <div className="flex items-center gap-1">
              <ControlButton
                label={playing ? "Pause run" : atEnd ? "Run complete" : "Play run"}
                onClick={() => setPlaying((v) => !v)}
                disabled={atEnd}
              >
                {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              </ControlButton>
              <ControlButton label="Step forward" onClick={advance} disabled={atEnd}>
                <ChevronRight className="size-4" />
              </ControlButton>
              <ControlButton label="Reset run" onClick={reset} disabled={stepIndex === 0 && !playing}>
                <RotateCcw className="size-4" />
              </ControlButton>
            </div>
          </div>

          {/* Progress */}
          <div
            className="h-1 w-full bg-[var(--tm-table-header-bg)]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={run.length}
            aria-valuenow={stepIndex + 1}
            aria-label="Run progress"
          >
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, background: atEnd ? "var(--tm-value-up)" : accent }}
            />
          </div>

          {/* Transcript — a miniature of the real Ask/agent chat surface */}
          <div
            ref={transcriptRef}
            className="flex min-h-[300px] flex-1 flex-col gap-2.5 overflow-y-auto p-3"
            aria-live="polite"
          >
            {visibleSteps.map((step, i) => (
              <StepRow key={i} step={step} accent={accent} isLast={i === stepIndex} />
            ))}
          </div>

          {/* Current-step detail */}
          <div className="border-t border-[var(--tm-border)] p-3">
            <div className="flex items-center gap-2">
              <span
                className="rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase leading-none text-white"
                style={{ background: LANE_COLOR[active.lane] }}
              >
                {LANE_LABEL[active.lane]}
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-[var(--tm-text-muted)]">
                {active.event}
              </span>
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-[var(--tm-text-muted)]">
                {stepIndex + 1} / {run.length}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-snug text-[var(--tm-text)]">{active.note}</p>

            {active.cmd ? (
              <pre className="mt-2 overflow-x-auto rounded-sm bg-[var(--tm-navy)] p-2.5 font-mono text-[11px] leading-relaxed text-[var(--tm-blue-bright)]">
                <span className="text-white/50">$ </span>
                {active.cmd}
                {active.stdout ? <span className="text-white/70">{`\n→ ${active.stdout}`}</span> : ""}
              </pre>
            ) : null}

            {atPark ? (
              <div className="mt-3 flex items-center gap-2 rounded-sm border border-[var(--tm-amber)]/40 bg-[#fbf3e6] px-3 py-2 text-[12px] text-[var(--tm-amber)]">
                <Clock className="size-4 shrink-0" aria-hidden />
                <span>Durable workflow parked — zero compute — then resumes from this exact step.</span>
              </div>
            ) : null}

            {atEnd ? (
              <div className="mt-3 flex items-center gap-2 rounded-sm border border-[var(--tm-value-up)]/40 bg-[#eef7ee] px-3 py-2 text-[12px] font-semibold text-[var(--tm-text)]">
                <CheckCircle2 className="size-4 shrink-0 text-[var(--tm-value-up)]" aria-hidden />
                <span>{SHOWCASES[persona].outcome}</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* RIGHT: the shared anatomy, lit live */}
        <div className="space-y-3">
          <AnatomyRow label={`Skills loaded · ${composition.skills.length}`}>
            {composition.skills.map((id) => (
              <LitChip key={id} id={id} lit={usedBlocks.has(id)} accent={accent} />
            ))}
          </AnatomyRow>

          <AnatomyRow label={`Tools available · ${composition.tools.length}`}>
            {composition.tools.map((id) => (
              <LitChip key={id} id={id} lit={usedBlocks.has(id)} accent={accent} />
            ))}
          </AnatomyRow>

          <AnatomyRow label={`Semantic layer · ${composition.semantic.length} files`}>
            {composition.semantic.map((id) => (
              <LitChip key={id} id={id} lit={usedBlocks.has(id)} accent={accent} />
            ))}
          </AnatomyRow>

          <AnatomyRow label={`Infrastructure · ${Object.keys(INFRA).length} primitives`}>
            {Object.keys(INFRA).map((id) => (
              <LitChip key={id} id={id} lit={activeInfra === id} accent="var(--tm-blue)" />
            ))}
          </AnatomyRow>
        </div>
      </div>

      <SoWhat className="mt-8">
        One agent, three jobs, zero forks: the anatomy never changes — only which parts a request lights up. That is
        what &ldquo;one harness, many agents&rdquo; looks like at runtime.
      </SoWhat>
    </SectionShell>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  readonly label: string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex size-7 items-center justify-center rounded-sm text-[var(--tm-navy)] transition-colors hover:bg-[var(--tm-navy-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tm-blue-bright)] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function AnatomyRow({ label, children }: { readonly label: string; readonly children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-[var(--tm-border)] bg-[var(--tm-box-bg)] p-3 shadow-[var(--tm-shadow-xs)]">
      <Label>{label}</Label>
      <div className="mt-2.5 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Rich chat transcript — UI-element mockups driven by the run steps           */
/* -------------------------------------------------------------------------- */

/** One run step → a stack of chat elements (bubbles, tool calls, artifacts). */
function StepRow({
  step,
  accent,
  isLast,
}: {
  readonly step: RunStep;
  readonly accent: string;
  readonly isLast: boolean;
}) {
  const nodes: ReactNode[] = [];
  const say = step.say;
  const ev = step.event.toLowerCase();

  if (say?.actor === "user") nodes.push(<UserBubble key="u">{say.text}</UserBubble>);

  if (step.cmd) nodes.push(<ToolCallCard key="cmd" event={step.event} cmd={step.cmd} stdout={step.stdout} />);

  if (ev.includes("create_chart")) nodes.push(<ChartMockCard key="chart" />);

  if (step.produces === "report") nodes.push(<ArtifactCard key="art" kind="report" status="saved" accent={accent} />);
  if (step.produces === "watchlist") nodes.push(<ArtifactCard key="art" kind="watchlist" status="saved" accent={accent} />);
  if (step.produces === "digest") nodes.push(<ArtifactCard key="art" kind="digest" status="saved" accent={accent} />);
  if (step.produces === "article") nodes.push(<ArtifactCard key="art" kind="article" status="in_review" accent={accent} />);
  else if (ev.includes("revise")) nodes.push(<ArtifactCard key="art" kind="article" status="revised" accent={accent} />);
  else if (ev.includes("publish")) nodes.push(<ArtifactCard key="art" kind="article" status="published" accent={accent} />);

  if (step.pause) nodes.push(<ParkedCard key="park" />);

  if (say?.actor === "agent") nodes.push(<AgentBubble key="a">{say.text}</AgentBubble>);
  if (say?.actor === "system") nodes.push(<SystemBubble key="s" emphasis={say.emphasis}>{say.text}</SystemBubble>);

  if (nodes.length === 0) nodes.push(<StatusChip key="st" lane={step.lane} text={step.event} pulse={isLast} />);

  return <div className="flex flex-col gap-2.5">{nodes}</div>;
}

function UserBubble({ children }: { readonly children: ReactNode }) {
  return (
    <div className="ml-auto max-w-[88%] rounded-sm rounded-br-none bg-[var(--tm-navy)] px-3 py-2 text-[13px] font-semibold leading-snug text-white">
      {children}
    </div>
  );
}

function AgentBubble({ children }: { readonly children: ReactNode }) {
  return (
    <div className="mr-auto max-w-[88%] rounded-sm rounded-bl-none border border-[var(--tm-cell-border)] bg-[var(--tm-box-bg)] px-3 py-2 text-[13px] leading-snug text-[var(--tm-text)] shadow-[var(--tm-shadow-xs)]">
      {children}
    </div>
  );
}

function SystemBubble({ children, emphasis }: { readonly children: ReactNode; readonly emphasis?: boolean }) {
  if (emphasis) {
    return (
      <div className="mr-auto flex max-w-[88%] items-center gap-2 rounded-sm border border-[var(--tm-value-up)]/40 bg-[#eef7ee] px-3 py-2 text-[13px] font-semibold leading-snug text-[var(--tm-value-up)]">
        <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
        {children}
      </div>
    );
  }
  return (
    <div className="mx-auto rounded-full bg-[var(--tm-table-header-bg)] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wide text-[var(--tm-text-muted)]">
      {children}
    </div>
  );
}

/** A tool call rendered as a compact terminal card. */
function ToolCallCard({
  event,
  cmd,
  stdout,
}: {
  readonly event: string;
  readonly cmd: string;
  readonly stdout?: string;
}) {
  return (
    <div className="mr-auto w-[92%] overflow-hidden rounded-sm border border-[var(--tm-cell-border)] bg-[var(--tm-box-bg)] shadow-[var(--tm-shadow-xs)]">
      <div className="flex items-center gap-1.5 border-b border-[var(--tm-cell-border)] bg-[var(--tm-table-header-bg)] px-2.5 py-1">
        <Terminal className="size-3 text-[var(--tm-text-muted)]" aria-hidden />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-[var(--tm-text-muted)]">
          {event}
        </span>
      </div>
      <pre className="overflow-x-auto bg-[var(--tm-navy)] px-2.5 py-1.5 font-mono text-[10.5px] leading-snug text-[var(--tm-blue-bright)]">
        <span className="text-white/50">$ </span>
        {cmd}
        {stdout ? <span className="block text-white/70">{`→ ${stdout}`}</span> : null}
      </pre>
    </div>
  );
}

/** A miniature savable dashboard — chart + leaderboard rows. */
function ChartMockCard() {
  const rows = [
    { club: "Bayern München", w: "100%" },
    { club: "Leverkusen", w: "71%" },
    { club: "Dortmund", w: "63%" },
    { club: "Stuttgart", w: "44%" },
  ];
  return (
    <div className="mr-auto w-[92%] overflow-hidden rounded-sm border border-[var(--tm-cell-border)] bg-[var(--tm-box-bg)] shadow-[var(--tm-shadow-xs)]">
      <div className="flex items-center justify-between border-b border-[var(--tm-cell-border)] bg-[var(--tm-table-header-bg)] px-2.5 py-1.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-[var(--tm-navy)]">
          <BarChart3 className="size-3 text-[var(--tm-blue)]" aria-hidden />
          Squad value · Bundesliga
        </span>
        <span className="rounded-sm bg-[var(--tm-accent-soft)] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[var(--tm-link)]">
          chart
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-2.5">
        {rows.map((r, i) => (
          <div key={r.club} className="flex items-center gap-2">
            <span className="w-24 shrink-0 truncate text-[11px] text-[var(--tm-text)]">
              {i + 1}. {r.club}
            </span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-sm bg-[var(--tm-table-header-bg)]">
              <span className="hx-trace-bar block h-full rounded-sm bg-[var(--tm-blue)]" style={{ width: r.w, animationDelay: `${i * 0.08}s` }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type ArtifactKindMock = "report" | "watchlist" | "digest" | "article";
type ArtifactStatus = "saved" | "in_review" | "revised" | "published";

const ARTIFACT_META: Record<ArtifactKindMock, { title: string; icon: ReactNode }> = {
  report: { title: "Scouting report", icon: <FileText className="size-4" /> },
  watchlist: { title: "Watchlist", icon: <ListChecks className="size-4" /> },
  digest: { title: "Rumour digest", icon: <FileText className="size-4" /> },
  article: { title: "Article draft", icon: <Newspaper className="size-4" /> },
};

const STATUS_META: Record<ArtifactStatus, { label: string; sub: string; color: string }> = {
  saved: { label: "saved", sub: "saved to the Library", color: "var(--tm-blue)" },
  in_review: { label: "in review", sub: "queued for editorial review", color: "var(--tm-amber)" },
  revised: { label: "revised", sub: "back in the review queue", color: "var(--tm-blue)" },
  published: { label: "published", sub: "live on the feed", color: "var(--tm-value-up)" },
};

/** A persisted-artifact card — the kind the canvas opens in the real app. */
function ArtifactCard({
  kind,
  status,
  accent,
}: {
  readonly kind: ArtifactKindMock;
  readonly status: ArtifactStatus;
  readonly accent: string;
}) {
  const meta = ARTIFACT_META[kind];
  const st = STATUS_META[status];
  return (
    <div
      className="mr-auto flex w-[92%] items-center gap-2.5 rounded-sm border border-[var(--tm-cell-border)] bg-[var(--tm-box-bg)] px-3 py-2.5 shadow-[var(--tm-shadow-xs)]"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-sm"
        style={{ background: "var(--tm-navy-soft)", color: accent }}
        aria-hidden
      >
        {meta.icon}
      </span>
      <div className="min-w-0 flex-1">
        <span className="block truncate font-bold text-[13px] text-[var(--tm-navy)]">{meta.title}</span>
        <span className="block truncate text-[11px] text-[var(--tm-text-muted)]">{st.sub}</span>
      </div>
      <span
        className="shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white"
        style={{ background: st.color }}
      >
        {st.label}
      </span>
    </div>
  );
}

/** The durable-workflow park marker. */
function ParkedCard() {
  return (
    <div className="mr-auto flex w-[92%] items-center gap-2 rounded-sm border border-dashed border-[var(--tm-amber)]/50 bg-[#fbf3e6] px-3 py-2 text-[12px] text-[var(--tm-amber)]">
      <Clock className="size-3.5 shrink-0" aria-hidden />
      <span>Durable workflow parked — zero compute — resumes from this exact step.</span>
    </div>
  );
}

/** A faint status line for harness/model steps with no chat output of their own. */
function StatusChip({ lane, text, pulse }: { readonly lane: RunStep["lane"]; readonly text: string; readonly pulse: boolean }) {
  return (
    <div className="mr-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--tm-cell-border)] bg-[var(--tm-box-bg)] px-2.5 py-1">
      <span
        aria-hidden
        className={`size-1.5 rounded-full${pulse ? " hx-blink" : ""}`}
        style={{ background: LANE_COLOR[lane] }}
      />
      <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--tm-text-muted)]">{text}</span>
    </div>
  );
}

/** A block chip that lights when the active step uses it; shows reuse ×N. */
function LitChip({ id, lit, accent }: { readonly id: string; readonly lit: boolean; readonly accent: string }) {
  const block = ALL_BLOCKS[id];
  const count = reuseCount(id);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2 py-1 font-mono text-[11px] leading-none transition-all",
      )}
      title={block ? `${block.blurb} · reused by ${agentsUsingBlock(id).length} persona(s)` : id}
      style={
        lit
          ? { background: accent, color: "#fff", border: "1px solid transparent", boxShadow: "var(--tm-shadow-sm)" }
          : {
              background: "var(--tm-box-bg)",
              color: "var(--tm-text-muted)",
              border: "1px solid var(--tm-cell-border)",
            }
      }
    >
      {block?.name ?? id}
      {count > 1 ? (
        <span
          className="rounded-[3px] px-1 py-px text-[8.5px] font-bold"
          style={lit ? { background: "rgba(255,255,255,0.24)", color: "#fff" } : { background: "var(--tm-table-header-bg)", color: "var(--tm-text-muted)" }}
        >
          ×{count}
        </span>
      ) : null}
    </span>
  );
}
