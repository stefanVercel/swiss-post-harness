import { createAgentUIStreamResponse } from "ai"
import { buildAgent } from "@/lib/agent"
import { getPersona } from "@/lib/domain"

export const maxDuration = 60

export async function POST(req: Request) {
  const { messages, persona } = await req.json()

  const personaSlug = typeof persona === "string" ? persona : "kundenservice"
  if (!getPersona(personaSlug)) {
    return new Response(JSON.stringify({ error: `Unknown persona: ${personaSlug}` }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const agent = buildAgent(personaSlug)

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  })
}
