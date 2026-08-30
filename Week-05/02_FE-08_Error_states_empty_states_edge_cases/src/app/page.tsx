"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { ToolPartRenderer } from "@/components/tool-part-renderer";

const EXAMPLE_PROMPT = "Preview https://vercel.com for me";

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, regenerate, clearError } =
    useChat({
      transport: new DefaultChatTransport({ api: "/api/chat" }),
    });

  const trimmed = input.trim();
  const isEmpty = trimmed.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty || status !== "ready") return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleTryExample = () => {
    sendMessage({ text: EXAMPLE_PROMPT });
  };

  return (
    <div
      className="mx-auto flex w-full max-w-2xl flex-col px-6 pt-10"
      style={{ minHeight: "100dvh" }}
    >
      <header className="mb-8 flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold"
          style={{ background: "var(--main)", color: "var(--bg)", fontFamily: "var(--font-heading)" }}
        >
          GS
        </div>
        <div>
          <h1
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}
          >
            Link Preview Tool
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Paste a URL — I&apos;ll fetch it for real and show a preview card.
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto pb-32">
        {/* Designed first-run empty state: not a dead end, a next action */}
        {messages.length === 0 && (
          <div
            className="rounded-2xl border border-dashed p-8 text-center"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            <p className="text-sm">No conversations yet — try a real link.</p>
            <button
              onClick={handleTryExample}
              className="mt-3 rounded-full border px-4 py-1.5 text-sm font-medium transition hover:bg-white"
              style={{ borderColor: "var(--border)", color: "var(--main)" }}
            >
              &quot;{EXAMPLE_PROMPT}&quot;
            </button>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--muted)" }}
            >
              {message.role === "user" ? "You" : "Assistant"}
            </p>
            {message.parts.map((part, i) => {
              if (part.type === "text") {
                return (
                  <p key={i} className="text-sm break-words" style={{ color: "var(--text)" }}>
                    {part.text}
                  </p>
                );
              }
              if (part.type === "tool-fetchMetaTags") {
                return (
                  <ToolPartRenderer
                    key={i}
                    part={part as unknown as React.ComponentProps<typeof ToolPartRenderer>["part"]}
                  />
                );
              }
              return null;
            })}
          </div>
        ))}

        {status === "submitted" && (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Thinking…
          </p>
        )}

        {/* Mid-stream / API failure: designed error with a working retry,
            not a silent hang or a raw stack trace. */}
        {error && (
          <div
            className="max-w-md rounded-2xl border p-4"
            style={{ borderColor: "#F3C7B8", background: "#FDF1EC" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: "var(--accent)" }}
              >
                !
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  That request failed
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  {error.message.includes("429") || error.message.toLowerCase().includes("rate")
                    ? "You're sending requests too quickly. Wait a moment and try again."
                    : "This could be a network issue or a temporary problem with the AI service."}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => regenerate()}
                    className="rounded-full px-4 py-1.5 text-xs font-medium text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => clearError()}
                    className="rounded-full px-4 py-1.5 text-xs font-medium"
                    style={{ color: "var(--muted)" }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed inset-x-0 bottom-0 border-t backdrop-blur"
        style={{
          borderColor: "var(--border)",
          background: "rgba(250,250,248,0.92)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="mx-auto max-w-2xl p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a URL and ask me to preview it…"
              className="flex-1 rounded-full border bg-white px-4 py-2.5 text-sm outline-none transition"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            />
            <button
              type="submit"
              disabled={isEmpty || status !== "ready"}
              className="rounded-full px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-40"
              style={{ background: "var(--main)" }}
            >
              Send
            </button>
          </div>
          {/* Empty-input edge case: quiet inline guidance, not a blocking alert */}
          {input.length > 0 && isEmpty && (
            <p className="mt-1.5 text-xs" style={{ color: "var(--accent)" }}>
              Type something before sending.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
