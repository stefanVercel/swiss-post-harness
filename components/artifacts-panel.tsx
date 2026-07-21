"use client"

import useSWR from "swr"
import { PostIcon, type PostIconName } from "@/components/post-icon"
import { useLocale } from "@/lib/i18n/provider"
import { UI } from "@/lib/i18n/dictionary"

type Artifacts = {
  reports: { id: string; title: string; created_at: string }[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ArtifactsPanel({ refreshKey }: { refreshKey: number }) {
  const { locale } = useLocale()
  const t = UI[locale]
  const { data } = useSWR<Artifacts>(`/api/artifacts?k=${refreshKey}`, fetcher, {
    refreshInterval: 0,
  })

  const empty = !data || data.reports.length === 0

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {t.savedArtifacts}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{t.artifactsHint}</p>

      {empty && (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          <PostIcon name="save" size={24} className="text-muted-foreground/60" />
          {t.artifactsEmpty}
        </div>
      )}

      {data?.reports && data.reports.length > 0 && (
        <Section title={t.reports} icon="document">
          {data.reports.map((r) => (
            <div key={r.id} className="rounded-md border border-border bg-card p-2.5 text-xs font-medium text-card-foreground">
              {r.title}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: PostIconName
  children: React.ReactNode
}) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        <PostIcon name={icon} size={13} />
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
