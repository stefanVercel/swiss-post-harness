"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useMemo, useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChatMessage } from "@/components/chat-message"
import type { PersonaMeta } from "@/lib/ui-types"

export function HarnessChat({
  persona,
  onArtifactsMaybeChanged,
}: {
  persona: PersonaMeta
  onArtifactsMaybeChanged: () => void
}) {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest({ messages }) {
          return { body: { messages, persona: persona.slug } }
        },
      }),
    [persona.slug],
  )

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport,
    onFinish: () => onArtifactsMaybeChanged(),
  })

  // Reset the thread when switching personas — each persona is its own session.
  useEffect(() => {
    setMessages([])
  }, [persona.slug, setMessages])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const busy = status === "submitted" || status === "streaming"

  function submit(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value })
    setInput("")
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-6 md:px-8">
        {messages.length === 0 && (
          <div className="mx-auto max-w-2xl pt-6">
            <h2 className="font-heading text-lg font-bold text-foreground">{persona.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{persona.hint}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {persona.examplePrompts.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => submit(ex.prompt)}
                  className="rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-accent"
                >
                  <div className="text-sm font-semibold text-card-foreground">{ex.label}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{ex.prompt}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {busy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Agent denkt nach…
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error.message}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
        className="border-t border-border bg-card px-4 py-3 md:px-8"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                e.preventDefault()
                submit(input)
              }
            }}
            rows={1}
            placeholder={`Frag ${persona.label}…`}
            className="max-h-40 min-h-[44px] flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <Button type="submit" disabled={busy || !input.trim()} className="h-11 shrink-0">
            Senden
          </Button>
        </div>
      </form>
    </div>
  )
}
