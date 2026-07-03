"use client"

import type { UIMessage } from "ai"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function ToolPart({ part }: { part: any }) {
  const [open, setOpen] = useState(false)
  const name = part.type?.replace(/^tool-/, "") ?? "tool"
  const state = part.state as string | undefined
  const isWrite = !["query_database", "read_semantic_doc"].includes(name)

  const status =
    state === "output-available" ? "done" : state === "output-error" ? "error" : "running"

  return (
    <div className="rounded-md border border-border bg-secondary/50 text-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <span
          className={`inline-block h-2 w-2 shrink-0 rounded-full ${
            status === "done" ? "bg-emerald-500" : status === "error" ? "bg-destructive" : "bg-amber-400 animate-pulse"
          }`}
          aria-hidden
        />
        <span className="font-mono text-xs font-medium">{name}</span>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            isWrite ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {isWrite ? "write" : "read"}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">{open ? "verbergen" : "Details"}</span>
      </button>
      {open && (
        <div className="space-y-2 border-t border-border px-3 py-2">
          {part.input != null && (
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">Input</div>
              <pre className="overflow-x-auto rounded bg-background p-2 text-[11px] leading-relaxed">
                {JSON.stringify(part.input, null, 2)}
              </pre>
            </div>
          )}
          {part.output != null && (
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">Output</div>
              <pre className="max-h-64 overflow-auto rounded bg-background p-2 text-[11px] leading-relaxed">
                {JSON.stringify(part.output, null, 2)}
              </pre>
            </div>
          )}
          {part.errorText && <div className="text-xs text-destructive">{part.errorText}</div>}
        </div>
      )}
    </div>
  )
}

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Agent</span>
        )}
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <div
                key={i}
                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "whitespace-pre-wrap rounded-br-sm bg-foreground text-background"
                    : "rounded-bl-sm border border-border bg-card text-card-foreground"
                }`}
              >
                {isUser ? (
                  part.text
                ) : (
                  <div className="prose-chat">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            )
          }
          if (typeof part.type === "string" && part.type.startsWith("tool-")) {
            return <ToolPart key={i} part={part} />
          }
          if (part.type === "dynamic-tool") {
            return <ToolPart key={i} part={part} />
          }
          return null
        })}
      </div>
    </div>
  )
}
