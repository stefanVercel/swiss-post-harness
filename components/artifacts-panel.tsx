"use client"

import useSWR from "swr"
import { PostIcon, type PostIconName } from "@/components/post-icon"
import { useLocale } from "@/lib/i18n/provider"
import { UI } from "@/lib/i18n/dictionary"

type Artifacts = {
  reports: { id: string; title: string; created_at: string }[]
  watchlists: { id: string; title: string; updated_at: string }[]
  drafts: { id: string; title: string; status: string; rev_count: number; source_headline?: string }[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function statusColor(status: string) {
  switch (status) {
    case "published":
      return "bg-emerald-100 text-emerald-800"
    case "in_review":
      return "bg-amber-100 text-amber-800"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function ArtifactsPanel({ refreshKey }: { refreshKey: number }) {
  const { locale } = useLocale()
  const t = UI[locale]
  const { data } = useSWR<Artifacts>(`/api/artifacts?k=${refreshKey}`, fetcher, {
    refreshInterval: 0,
  })

  const empty =
    !data || (data.reports.length === 0 && data.watchlists.length === 0 && data.drafts.length === 0)

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

      {data?.drafts && data.drafts.length > 0 && (
        <Section title={t.articleDrafts} icon="statusedit">
          {data.drafts.map((d) => (
            <div key={d.id} className="rounded-md border border-border bg-card p-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-card-foreground">{d.title}</span>
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${statusColor(d.status)}`}>
                  {d.status}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">{t.revPrefix} {d.rev_count}</div>
            </div>
          ))}
        </Section>
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

      {data?.watchlists && data.watchlists.length > 0 && (
        <Section title={t.watchlists} icon="favoritestar">
          {data.watchlists.map((w) => (
            <div key={w.id} className="rounded-md border border-border bg-card p-2.5 text-xs font-medium text-card-foreground">
              {w.title}
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
