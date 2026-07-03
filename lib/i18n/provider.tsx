"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { DEFAULT_LOCALE, LOCALE_LANG, toLocale, type Locale } from "./config"

const STORAGE_KEY = "harness.locale"

type LocaleContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  // Hydrate from localStorage on mount (client-only) so the choice sticks.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) setLocaleState(toLocale(stored))
    } catch {
      /* localStorage unavailable — keep default */
    }
  }, [])

  // Keep <html lang> in sync for a11y / SEO.
  useEffect(() => {
    document.documentElement.lang = LOCALE_LANG[locale]
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider")
  return ctx
}
