import { listReports, listWatchlists, listDrafts } from "@/lib/artifacts"

/** Lightweight view of everything the write tools have persisted so far. */
export async function GET() {
  const [reports, watchlists, drafts] = await Promise.all([listReports(), listWatchlists(), listDrafts()])
  return Response.json({ reports, watchlists, drafts })
}
