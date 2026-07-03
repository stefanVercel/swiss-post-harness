"use client"

import { LOCALES, LOCALE_SHORT, LOCALE_NAME } from "@/lib/i18n/config"
import { useLocale } from "@/lib/i18n/provider"
import { cn } from "@/lib/utils"

/**
 * Compact EN/DE/FR segmented control. Variant "light" reads on light surfaces
 * (chat brand bar), "onInk" reads on the near-black harness header.
 */
export function LocaleSwitcher({
  variant = "light",
  className,
}: {
  variant?: "light" | "onInk"
  className?: string
}) {
  const { locale, setLocale } = useLocale()
  const onInk = variant === "onInk"

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border p-0.5",
        onInk ? "border-sidebar-border bg-sidebar" : "border-border bg-card",
        className,
      )}
    >
      {LOCALES.map((l) => {
        const selected = l === locale
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={LOCALE_NAME[l]}
            title={LOCALE_NAME[l]}
            onClick={() => setLocale(l)}
            className={cn(
              "rounded px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "bg-primary text-primary-foreground"
                : onInk
                  ? "text-sidebar-foreground/70 hover:text-sidebar-foreground"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            {LOCALE_SHORT[l]}
          </button>
        )
      })}
    </div>
  )
}
