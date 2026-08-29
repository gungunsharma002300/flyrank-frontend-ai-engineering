"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { ToolPartRenderer } from "@/components/tool-part-renderer";

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 pt-10">
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

      <div className="flex-1 space-y-5 overflow-y-auto pb-28">
        {messages.length === 0 && (
          <div
            className="rounded-2xl border border-dashed p-8 text-center text-sm"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            Try:{" "}
            <span className="font-medium" style={{ color: "var(--text)" }}>
              &quot;Preview https://vercel.com for me&quot;
            </span>
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
                  <p key={i} className="text-sm" style={{ color: "var(--text)" }}>
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
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed inset-x-0 bottom-0 border-t backdrop-blur"
        style={{ borderColor: "var(--border)", background: "rgba(250,250,248,0.92)" }}
      >
        <div className="mx-auto flex max-w-2xl gap-2 p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a URL and ask me to preview it…"
            className="flex-1 rounded-full border bg-white px-4 py-2.5 text-sm outline-none transition"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          />
          <button
            type="submit"
            disabled={status !== "ready"}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-white transition disabled:opacity-40"
            style={{ background: "var(--main)" }}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
