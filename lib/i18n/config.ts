/**
 * i18n core config — a single source of truth for the three supported locales.
 * English is the default; German and French are the other Swiss Post languages.
 */

export const LOCALES = ["en", "de", "fr"] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"

/** Short label shown in the EN/DE/FR switcher. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  fr: "FR",
}

/** Full endonym — used for the switcher tooltip and the agent language directive. */
export const LOCALE_NAME: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
}

/** BCP-47 tag for the <html lang> attribute. */
export const LOCALE_LANG: Record<Locale, string> = {
  en: "en",
  de: "de-CH",
  fr: "fr-CH",
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value)
}

/** Coerce any input (query param, storage) to a valid locale. */
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE
}

/** A translated string in every locale. */
export type Localized<T = string> = Record<Locale, T>

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value[DEFAULT_LOCALE]
}
