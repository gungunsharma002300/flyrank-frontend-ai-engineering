"use client";

import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "fe06-streammate-messages";

function messageText(message: UIMessage) {
  return message.parts
    .filter((part): part is Extract<UIMessage["parts"][number], { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [showJump, setShowJump] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, setMessages, error } = useChat({
    transport: new DefaultChatTransport({ api: process.env.NEXT_PUBLIC_CHAT_API || "/api/chat-free" }),
  });

  const isGenerating = status === "submitted" || status === "streaming";

  const hasMessages = messages.length > 0;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UIMessage[];
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {
      // Ignore malformed local storage; a fresh conversation is safer.
    } finally {
      setHydrated(true);
    }
  }, [setMessages]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage can be unavailable or full; chat still works in memory.
    }
  }, [messages, hydrated]);

  useEffect(() => {
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isNearBottom]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const near = distance < 100;
    setIsNearBottom(near);
    setShowJump(!near);
  };

  const jumpToLatest = () => {
    setIsNearBottom(true);
    setShowJump(false);
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isGenerating) return;

    setIsNearBottom(true);
    sendMessage({ text });
    setInput("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit(event);
    }
  };

  const clearConversation = () => {
    if (isGenerating) stop();
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setInput("");
    setIsNearBottom(true);
  };

  const assistantLabel = useMemo(() => {
    if (status === "submitted") return "Thinking";
    if (status === "streaming") return "Streaming";
    return "Online";
  }, [status]);

  return (
    <main className="shell">
      <section className="app-card">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div>
              <h1>StreamMate</h1>
              <p>FE-06 · Streaming AI chat</p>
            </div>
          </div>

          <div className="header-actions">
            <div className={`status-pill ${isGenerating ? "busy" : ""}`}>
              <span className="status-dot" />
              {assistantLabel}
            </div>
            <button className="ghost-button" onClick={clearConversation} type="button">
              New chat
            </button>
          </div>
        </header>

        <div
          className="chat-scroll"
          ref={scrollRef}
          onScroll={updateScrollState}
          aria-label="Conversation"
        >
          {!hasMessages ? (
            <div className="welcome">
              <div className="welcome-orb" aria-hidden="true">✦</div>
              <p className="eyebrow">READY TO STREAM</p>
              <h2>Ask anything. Watch it arrive.</h2>
              <p className="welcome-copy">
                Responses appear token by token, and you can stop generation at any
                point without losing the partial answer.
              </p>
              <div className="suggestions">
                {[
                  "Explain React Server Components simply",
                  "Give me three frontend project ideas",
                  "What makes a good AI chat interface?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setInput(suggestion);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((message, index) => {
                const text = messageText(message);
                const isLast = index === messages.length - 1;
                const isAssistant = message.role === "assistant";
                const isLive = isLast && isAssistant && isGenerating;

                return (
                  <article
                    className={`message-row ${isAssistant ? "assistant" : "user"}`}
                    key={message.id}
                  >
                    <div className="avatar" aria-hidden="true">
                      {isAssistant ? "✦" : "Y"}
                    </div>
                    <div className="message-stack">
                      <div className="message-meta">
                        <span>{isAssistant ? "StreamMate" : "You"}</span>
                        {isLive && <span className="live-label">LIVE</span>}
                      </div>

                      {isAssistant && status === "submitted" && isLast ? (
                        <div className="thinking" aria-live="polite">
                          <span className="thinking-dot" />
                          <span className="thinking-dot" />
                          <span className="thinking-dot" />
                          <span>Thinking…</span>
                        </div>
                      ) : (
                        <div className="bubble">
                          {text || (isLive ? <span className="cursor" /> : null)}
                          {isLive && text && <span className="cursor" aria-hidden="true" />}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}

              {error && (
                <div className="error-box" role="alert">
                  <strong>Stream error</strong>
                  <span>{error.message || "Something went wrong. Please try again."}</span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {showJump && (
            <button className="jump-button" type="button" onClick={jumpToLatest}>
              ↓ Jump to latest
            </button>
          )}
        </div>

        <footer className="composer-wrap">
          <form className="composer" onSubmit={submit}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message StreamMate…"
              rows={1}
              aria-label="Message"
              disabled={isGenerating}
            />

            {isGenerating ? (
              <button
                className="send-button stop"
                type="button"
                onClick={() => stop()}
                aria-label="Stop generation"
                title="Stop generation"
              >
                <span className="stop-icon" />
              </button>
            ) : (
              <button
                className="send-button"
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                title="Send message"
              >
                ↑
              </button>
            )}
          </form>
          <div className="composer-hint">
            <span>Enter to send</span>
            <span>Shift + Enter for a new line</span>
            <span className="secure-note">● Gemini Free mode · API key required</span>
          </div>
        </footer>
      </section>
    </main>
  );
}
