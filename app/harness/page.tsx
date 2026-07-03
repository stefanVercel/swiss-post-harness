import type { Metadata } from "next"
import { HarnessLanding } from "@/components/harness/harness-landing"
import { UI } from "@/lib/i18n/dictionary"
import { DEFAULT_LOCALE } from "@/lib/i18n/config"

export const metadata: Metadata = {
  title: UI[DEFAULT_LOCALE].metaTitle,
  description: UI[DEFAULT_LOCALE].metaDescription,
}

export default function HarnessPage() {
  return <HarnessLanding />
}
