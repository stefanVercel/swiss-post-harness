// The /harness "primitives" section: the Vercel AI building blocks (sandbox,
// gateway, functions, storage, …) the harness is composed from, each tied to a
// concrete spot in the real agent surface via the harness registry.
import type { ReactNode } from "react";
import {
  Activity,
  Boxes,
  Code2,
  DoorOpen,
  LayoutTemplate,
  Link2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { SectionShell, SectionHeader } from "@/components/harness/shared";
import { INFRA } from "@/lib/harness-registry";

/**
 * The technology, starting WITH the technologies — the Vercel AI primitives that
 * power every turn, then the framework (Eve) that composes them. Each primitive
 * is its own card with a bespoke micro-diagram, not a bullet. All motion is CSS
 * keyframe based (disabled under prefers-reduced-motion).
 */

interface PrimitiveCard {
  readonly id: string;
  readonly name: string;
  readonly tag: string;
  readonly blurb: string;
  readonly icon: ReactNode;
  readonly viz: ReactNode;
}

const CARDS: PrimitiveCard[] = [
  {
    id: "ai-sdk",
    name: INFRA["ai-sdk"].name,
    tag: "open-source model toolkit",
    blurb: INFRA["ai-sdk"].blurb,
    icon: <Code2 className="size-4" />,
    viz: <VizAiSdk />,
  },
  {
    id: "ai-gateway",
    name: INFRA["ai-gateway"].name,
    tag: "one endpoint · OIDC · no keys",
    blurb: INFRA["ai-gateway"].blurb,
    icon: <DoorOpen className="size-4" />,
    viz: <VizGateway />,
  },
  {
    id: "sandbox",
    name: INFRA.sandbox.name,
    tag: "isolated ephemeral compute",
    blurb: INFRA.sandbox.blurb,
    icon: <Boxes className="size-4" />,
    viz: <VizSandbox />,
  },
  {
    id: "workflow",
    name: INFRA.workflow.name,
    tag: "durable turns · suspend/resume",
    blurb: INFRA.workflow.blurb,
    icon: <WorkflowIcon className="size-4" />,
    viz: <VizWorkflow />,
  },
  {
    id: "fluid-compute",
    name: INFRA["fluid-compute"].name,
    tag: "scales to zero",
    blurb: INFRA["fluid-compute"].blurb,
    icon: <Activity className="size-4" />,
    viz: <VizFluid />,
  },
  {
    id: "observability",
    name: INFRA.observability.name,
    tag: "traces over every step",
    blurb: INFRA.observability.blurb,
    icon: <Activity className="size-4" />,
    viz: <VizObservability />,
  },
  {
    id: "connect",
    name: INFRA.connect.name,
    tag: "secure private connectivity",
    blurb: INFRA.connect.blurb,
    icon: <Link2 className="size-4" />,
    viz: <VizConnect />,
  },
  {
    id: "security",
    name: INFRA.security.name,
    tag: "BotID today · Passport next",
    blurb: INFRA.security.blurb,
    icon: <ShieldCheck className="size-4" />,
    viz: <VizSecurity />,
  },
  {
    id: "elements",
    name: "AI Elements + json-render",
    tag: "the DX & UI layer",
    blurb:
      "The streaming chat surface (components/ai-elements/*) plus model-authored generative UI via the render catalog (components/render/catalog.tsx).",
    icon: <LayoutTemplate className="size-4" />,
    viz: <VizElements />,
  },
];

export function Primitives() {
  return (
    <SectionShell id="primitives">
      <SectionHeader
        eyebrow="The technology · Vercel AI primitives"
        eyebrowTone="blue"
        title={
          <>
            The primitives under every turn — composed by <span className="text-[var(--tm-blue)]">Eve</span>.
          </>
        }
        lead="The harness is not a framework we maintain. It is a thin composition of managed Vercel primitives, wired together by Eve — Vercel's agent framework. Each primitive does one job; Eve makes them act as one."
      />

      {/* Eve framing strip */}
      <div className="mt-8 flex flex-col gap-4 rounded-sm border border-[var(--tm-navy)] bg-[var(--tm-navy)] p-5 shadow-[var(--tm-shadow-md)] sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-white/10 text-white ring-1 ring-white/25">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="m-0 font-bold text-lg text-white">Eve</p>
            <p className="m-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--tm-blue-bright)]">
              the agent framework
            </p>
          </div>
        </div>
        <p className="m-0 text-[14px] leading-relaxed text-white/80 sm:border-l sm:border-white/15 sm:pl-6">
          You author an agent as a folder of files. Eve takes that folder and wires it onto the nine primitives below —
          the model toolkit, the gateway, sandboxes, durable workflows, fluid compute, traces, secure connectivity, bot
          and identity protection, and the UI layer — so the team ships behaviour, not plumbing.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card, i) => (
          <article
            key={card.id}
            className="hx-rise flex flex-col rounded-sm border border-[var(--tm-border)] bg-[var(--tm-box-bg)] p-4 shadow-[var(--tm-shadow-xs)] transition-shadow hover:shadow-[var(--tm-shadow-md)]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-[var(--tm-accent-soft)] text-[var(--tm-blue)] ring-1 ring-[var(--tm-border)]">
                {card.icon}
              </span>
              <div className="min-w-0">
                <h3 className="m-0 truncate font-bold text-[15px] text-[var(--tm-navy)]">{card.name}</h3>
                <p className="m-0 truncate font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--tm-text-muted)]">
                  {card.tag}
                </p>
              </div>
            </div>

            <div className="mt-3.5 flex h-28 items-center justify-center overflow-hidden rounded-sm border border-[var(--tm-cell-border)] bg-[var(--tm-navy-soft)] px-3">
              {card.viz}
            </div>

            <p className="mt-3.5 text-[12.5px] leading-relaxed text-[var(--tm-text-muted)]">{card.blurb}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Micro-diagrams — one per primitive                                          */
/* -------------------------------------------------------------------------- */

const chip =
  "rounded-sm border border-[var(--tm-cell-border)] bg-[var(--tm-box-bg)] px-2 py-1 font-mono text-[10.5px] leading-none text-[var(--tm-navy)] shadow-[var(--tm-shadow-xs)]";

/** AI SDK — one provider-agnostic call surface running the tool-calling loop. */
function VizAiSdk() {
  return (
    <div className="flex w-full items-center justify-center gap-3">
      <div className="relative flex size-[84px] items-center justify-center">
        <span
          aria-hidden
          className="hx-orbit absolute inset-0 rounded-full border-2 border-dashed border-[var(--tm-blue)]/45"
        />
        <span
          aria-hidden
          className="absolute -top-0.5 left-1/2 size-2 -translate-x-1/2 rounded-full bg-[var(--tm-blue)] hx-orbit"
          style={{ transformOrigin: "50% 43px" }}
        />
        <div className="flex flex-col items-center gap-1">
          <span className={chip}>streamText</span>
          <RefreshCw className="size-3 text-[var(--tm-text-muted)]" aria-hidden />
          <span className={chip}>tool()</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[9px] uppercase tracking-wide text-[var(--tm-text-muted)]">one toolkit</span>
        <span className={chip}>generateObject</span>
        <span className={chip}>useChat</span>
        <span className={chip}>any model</span>
      </div>
    </div>
  );
}

/** AI Gateway — many providers funnel into one endpoint; tokens stream across. */
function VizGateway() {
  const providers = ["anthropic", "openai", "xai"];
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
            <path
              key={i}
              d={`M0,${y} C 40,${y} 40,30 80,30`}
              fill="none"
              stroke="var(--tm-blue)"
              strokeWidth={1.25}
              opacity={0.5}
            />
          ))}
        </svg>
        <span className="hx-stream absolute left-1/3 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[var(--tm-blue)]" />
        <span
          className="hx-stream absolute left-1/2 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[var(--tm-blue)]"
          style={{ animationDelay: "0.7s" }}
        />
      </div>
      <span className="rounded-sm bg-[var(--tm-navy)] px-2 py-1.5 text-center font-mono text-[9.5px] font-bold uppercase leading-tight text-white">
        1<br />endpoint
      </span>
    </div>
  );
}

/** Vercel Sandbox — an isolated, ephemeral microVM that boots, runs, disposes. */
function VizSandbox() {
  return (
    <div className="w-full">
      <div className="rounded-sm border border-dashed border-[var(--tm-blue)]/55 bg-[var(--tm-box-bg)] p-2 shadow-[var(--tm-shadow-xs)]">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wide text-[var(--tm-navy)]">
            <Boxes className="size-3 text-[var(--tm-blue)]" aria-hidden />
            microVM
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wide text-[var(--tm-text-muted)]">
            <span aria-hidden className="size-1.5 rounded-full bg-[var(--tm-value-up)] hx-blink" />
            isolated
          </span>
        </div>
        <pre className="mt-1.5 overflow-hidden rounded-sm bg-[var(--tm-navy)] px-2 py-1 font-mono text-[10px] leading-snug text-[var(--tm-blue-bright)]">
          <span className="text-white/50">$ </span>bash · query_database
        </pre>
        <p className="mt-1 font-mono text-[9px] text-[var(--tm-text-muted)]">semantic layer mounted in</p>
      </div>
      <div className="mt-1.5 flex items-center justify-center gap-1 font-mono text-[9px] uppercase tracking-wide text-[var(--tm-text-muted)]">
        <span>boot</span>
        <span aria-hidden>→</span>
        <span className="text-[var(--tm-blue)]">run</span>
        <span aria-hidden>→</span>
        <span>dispose</span>
      </div>
    </div>
  );
}

/** Workflow SDK — a durable turn that suspends (zero compute) then resumes. */
function VizWorkflow() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide">
        <span className="rounded-sm bg-[var(--tm-blue)] px-2 py-1 text-white">run</span>
        <span className="h-px w-2 bg-[var(--tm-border)]" aria-hidden />
        <span className="flex items-center gap-1 rounded-sm border border-dashed border-[var(--tm-amber)] px-2 py-1 text-[var(--tm-amber)]">
          <span className="size-1.5 rounded-full bg-[var(--tm-amber)] hx-blink" aria-hidden />
          parked
        </span>
        <span className="h-px w-2 bg-[var(--tm-border)]" aria-hidden />
        <span className="rounded-sm bg-[var(--tm-value-up)] px-2 py-1 text-white">resume</span>
      </div>
      <p className="mt-2 text-center font-mono text-[10px] text-[var(--tm-text-muted)]">
        suspend → resume from the exact step
      </p>
    </div>
  );
}

/** Fluid Compute — compute that breathes down to zero while parked. */
function VizFluid() {
  const bars = [0, 1, 2, 3, 4];
  return (
    <div className="flex w-full flex-col items-center gap-1">
      <div className="flex h-14 items-end gap-1.5">
        {bars.map((b) => (
          <span
            key={b}
            className="hx-fluid-bar w-3 rounded-sm bg-[var(--tm-blue)]"
            style={{ height: "100%", animationDelay: `${b * 0.18}s` }}
          />
        ))}
      </div>
      <div className="flex w-full items-center justify-between font-mono text-[9.5px] uppercase tracking-wide text-[var(--tm-text-muted)]">
        <span>work</span>
        <span>→ 0 when idle</span>
      </div>
    </div>
  );
}

/** Observability — a trace waterfall over steps, tools and tokens. */
function VizObservability() {
  const spans = [
    { w: "92%", label: "turn", delay: 0 },
    { w: "64%", label: "tool", delay: 0.15 },
    { w: "78%", label: "model", delay: 0.3 },
    { w: "40%", label: "token", delay: 0.45 },
  ];
  return (
    <div className="flex w-full flex-col gap-1.5">
      {spans.map((s, i) => (
        <div key={i} className="flex items-center gap-2" style={{ paddingLeft: `${i * 8}px` }}>
          <span
            className="hx-trace-bar h-2 rounded-full bg-[var(--tm-blue)]"
            style={{ width: s.w, animationDelay: `${s.delay}s`, opacity: 1 - i * 0.12 }}
          />
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-wide text-[var(--tm-text-muted)]">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Vercel Connect — a scoped, short-lived credential bridging to a private backend. */
function VizConnect() {
  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      <div className="flex w-full items-center justify-between gap-1">
        <span className={chip}>agent</span>
        <div className="relative flex h-7 flex-1 items-center" aria-hidden>
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--tm-border)]" />
          <span className="hx-stream absolute left-2 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[var(--tm-blue)]" />
          <span className="absolute left-1/2 top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--tm-blue)] bg-[var(--tm-box-bg)]">
            <Link2 className="size-3 text-[var(--tm-blue)]" />
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-sm bg-[var(--tm-navy)] px-2 py-1.5 font-mono text-[9.5px] font-bold uppercase leading-none text-white">
          Supabase
        </span>
      </div>
      <span className="rounded-sm bg-[var(--tm-accent-soft)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[var(--tm-link)]">
        scoped · short-lived token
      </span>
      <span className="font-mono text-[9px] text-[var(--tm-text-muted)]">no long-lived secrets</span>
    </div>
  );
}

/** Vercel Security — BotID now, Passport-ready identity access next. */
function VizSecurity() {
  return (
    <div className="flex w-full items-center justify-center gap-3">
      <div className="flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-sm border border-[var(--tm-value-up)]/40 bg-[#eef7ee] px-2 py-1 font-mono text-[10px] text-[var(--tm-value-up)]">
          BotID · human ✓
        </span>
        <span className="inline-flex items-center gap-1 rounded-sm border border-[var(--tm-red)]/40 bg-[#fdecec] px-2 py-1 font-mono text-[10px] text-[var(--tm-red)] line-through">
          bot ✗
        </span>
        <span className="inline-flex items-center gap-1 rounded-sm border border-[var(--tm-blue)]/35 bg-[var(--tm-accent-soft)] px-2 py-1 font-mono text-[10px] text-[var(--tm-link)]">
          Passport · access
        </span>
      </div>
      <div className="relative flex size-14 items-center justify-center" aria-hidden>
        <span className="hx-scan absolute inset-0 overflow-hidden rounded-full" />
        <ShieldCheck className="size-9 text-[var(--tm-blue)]" />
      </div>
      <span className="rounded-sm bg-[var(--tm-navy)] px-2 py-1.5 text-center font-mono text-[9px] font-bold uppercase leading-tight text-white">
        secure<br />surface
      </span>
    </div>
  );
}

/** AI Elements + json-render — a streamed answer bubble and generative chart. */
function VizElements() {
  return (
    <div className="flex w-full items-center justify-center gap-3">
      <div className="flex flex-col gap-1.5">
        <span className="rounded-sm rounded-bl-none bg-[var(--tm-navy)] px-2.5 py-1.5 text-[10px] font-semibold text-white">
          Answer ✓
        </span>
        <span className="rounded-sm border border-[var(--tm-cell-border)] bg-[var(--tm-box-bg)] px-2.5 py-1 font-mono text-[9px] text-[var(--tm-text-muted)]">
          finalize_answer
        </span>
      </div>
      <div className="flex h-14 items-end gap-1 rounded-sm border border-[var(--tm-cell-border)] bg-[var(--tm-box-bg)] p-1.5">
        {["55%", "80%", "38%", "66%"].map((h, i) => (
          <span key={i} className="w-2.5 rounded-sm bg-[var(--tm-blue)]" style={{ height: h }} />
        ))}
      </div>
    </div>
  );
}
