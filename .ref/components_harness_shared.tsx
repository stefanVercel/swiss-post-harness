import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Light, presentation-only building blocks shared across the /harness sections.
 * Everything here renders in the global Transfermarkt light palette — white
 * boxes, navy/blue accents, hairline borders, a boxy data-UI feel — so the
 * harness reads as the same product as the Ask page.
 */

/** A full-bleed section band with a centered, max-width content column. */
export function SectionShell({
  id,
  children,
  className,
  tint,
}: {
  readonly id?: string;
  readonly children: ReactNode;
  readonly className?: string;
  /** Optional alternate background to separate adjacent bands. */
  readonly tint?: "plain" | "soft" | "navy";
}) {
  const bg =
    tint === "soft"
      ? "bg-[var(--tm-navy-soft)]"
      : tint === "navy"
        ? "bg-[var(--tm-navy)]"
        : "bg-[var(--tm-body-bg)]";
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 border-b border-[var(--tm-border)]", bg, className)}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">{children}</div>
    </section>
  );
}

/** Uppercase mono eyebrow with a leading accent dot. */
export function Eyebrow({
  children,
  tone = "blue",
  className,
}: {
  readonly children: ReactNode;
  readonly tone?: "blue" | "navy" | "red";
  readonly className?: string;
}) {
  const color =
    tone === "red"
      ? "var(--tm-red)"
      : tone === "navy"
        ? "var(--tm-navy)"
        : "var(--tm-link)";
  return (
    <p
      className={cn(
        "m-0 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em]",
        className,
      )}
      style={{ color }}
    >
      <span aria-hidden className="inline-block size-1.5 rounded-full" style={{ background: color }} />
      {children}
    </p>
  );
}

/** Section header: eyebrow + title + optional lead. */
export function SectionHeader({
  eyebrow,
  eyebrowTone,
  title,
  lead,
  align = "left",
  onDark = false,
}: {
  readonly eyebrow: string;
  readonly eyebrowTone?: "blue" | "navy" | "red";
  readonly title: ReactNode;
  readonly lead?: ReactNode;
  readonly align?: "left" | "center";
  readonly onDark?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow tone={onDark ? "blue" : eyebrowTone} className={align === "center" ? "justify-center" : undefined}>
        {eyebrow}
      </Eyebrow>
      <h2
        className={cn(
          "mt-3 text-balance font-bold tracking-tight",
          "text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.08]",
          onDark ? "text-white" : "text-[var(--tm-navy)]",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "mt-4 text-pretty text-[15px] leading-relaxed sm:text-base",
            onDark ? "text-white/75" : "text-[var(--tm-text-muted)]",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Small uppercase panel label. */
export function Label({
  children,
  style,
  className,
}: {
  readonly children: ReactNode;
  readonly style?: CSSProperties;
  readonly className?: string;
}) {
  return (
    <p
      className={cn(
        "m-0 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--tm-text-muted)]",
        className,
      )}
      style={style}
    >
      {children}
    </p>
  );
}

/** The leader-facing "so what" line, with a red key bar — light. */
export function SoWhat({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-sm border border-[var(--tm-border)] border-l-[3px] border-l-[var(--tm-red)] bg-[var(--tm-box-bg)] px-4 py-3 shadow-[var(--tm-shadow-xs)]",
        className,
      )}
    >
      <span className="shrink-0 pt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--tm-red)]">
        So what
      </span>
      <p className="m-0 min-w-0 flex-1 text-[14px] font-semibold leading-relaxed text-[var(--tm-text)]">{children}</p>
    </div>
  );
}

/** A minimal "harness" glyph — node hub with spokes. Inherits currentColor. */
export function HarnessGlyph({ size = 22, className }: { readonly size?: number; readonly className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12 3v4M12 17v4M4.5 7.5l3 2M16.5 14.5l3 2M19.5 7.5l-3 2M7.5 14.5l-3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" />
      <circle cx="12" cy="21" r="1.5" fill="currentColor" />
      <circle cx="4" cy="7" r="1.5" fill="currentColor" />
      <circle cx="20" cy="7" r="1.5" fill="currentColor" />
      <circle cx="4" cy="17" r="1.5" fill="currentColor" />
      <circle cx="20" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}
