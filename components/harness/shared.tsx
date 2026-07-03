import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Presentation-only building blocks shared across the /harness showcase
 * sections. Everything renders in the Swiss Post system — white cards, a yellow
 * key accent, near-black ink surfaces, hairline borders — so the showcase reads
 * as the same product as the chat harness.
 */

/** A full-bleed section band with a centered, max-width content column. */
export function SectionShell({
  id,
  children,
  className,
  tint = "plain",
}: {
  readonly id?: string
  readonly children: ReactNode
  readonly className?: string
  readonly tint?: "plain" | "soft" | "ink"
}) {
  const bg = tint === "soft" ? "bg-muted/40" : tint === "ink" ? "bg-sidebar text-sidebar-foreground" : "bg-background"
  return (
    <section id={id} className={cn("scroll-mt-20 border-b border-border", bg, className)}>
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-20">{children}</div>
    </section>
  )
}

/** Uppercase mono eyebrow with a leading yellow key bar. */
export function Eyebrow({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return (
    <p
      className={cn(
        "m-0 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden className="inline-block h-3 w-1 rounded-full bg-primary" />
      {children}
    </p>
  )
}

/** A yellow key-highlight for one word in a heading — the Swiss Post signature. */
export function Key({ children }: { readonly children: ReactNode }) {
  return <span className="box-decoration-clone rounded-sm bg-primary px-1.5 text-primary-foreground">{children}</span>
}

/** Section header: eyebrow + title + optional lead. */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  readonly eyebrow: string
  readonly title: ReactNode
  readonly lead?: ReactNode
  readonly align?: "left" | "center"
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow className={align === "center" ? "justify-center" : undefined}>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-balance font-heading text-[clamp(1.6rem,3.4vw,2.5rem)] font-extrabold leading-[1.08] tracking-tight">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">{lead}</p>
      ) : null}
    </div>
  )
}

/** Small uppercase panel label. */
export function Label({
  children,
  className,
  style,
}: {
  readonly children: ReactNode
  readonly className?: string
  readonly style?: CSSProperties
}) {
  return (
    <p
      className={cn(
        "m-0 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
      style={style}
    >
      {children}
    </p>
  )
}

/** The leader-facing "so what" line, with a yellow key bar. */
export function SoWhat({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-md border border-border border-l-4 border-l-primary bg-card px-4 py-3 shadow-sm",
        className,
      )}
    >
      <span className="shrink-0 pt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground">
        So what
      </span>
      <p className="m-0 min-w-0 flex-1 text-[14px] font-semibold leading-relaxed text-foreground">{children}</p>
    </div>
  )
}
