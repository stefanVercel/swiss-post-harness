import { listReports } from "@/lib/artifacts"

/** Lightweight view of the Red Bull field artifacts persisted so far. */
export async function GET() {
  const reports = await listReports()
  return Response.json({ reports })
}
