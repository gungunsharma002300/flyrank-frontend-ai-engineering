"use client";

import { FormEvent, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = prompt.trim();
    if (!content || busy) return;
    setError("");
    setPrompt("");
    const nextMessages: Message[] = [...messages, { role: "user", content }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${response.status})`);
      }
      if (!response.body) throw new Error("Streaming is not supported by this response.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "assistant", content: answer }]);
      }
      answer += decoder.decode();
      setMessages([...nextMessages, { role: "assistant", content: answer }]);
    } catch (e) {
      setMessages(nextMessages);
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-mark">✦</div>
        <div><p className="eyebrow">FE-11 · PRODUCTION DEMO</p><h1>AI Studio</h1></div>
        <span className="status"><i /> Ready to test</span>
      </header>
      <section className="hero">
        <p className="eyebrow">YOUR AI WORKSPACE</p>
        <h2>Ideas in.<br /><span>Clarity out.</span></h2>
        <p className="intro">A small, responsive AI chat demo built with server-side API credentials, input limits, and rate limiting.</p>
      </section>
      <section className="chat-panel" aria-label="AI chat">
        <div className="panel-heading"><div><h3>Conversation</h3><p>Be specific. Never share sensitive information.</p></div><span className="secure">● Protected API</span></div>
        <div className="messages" aria-live="polite" aria-relevant="additions text">
          {messages.length === 0 && <div className="empty"><div className="sparkle">✧</div><h3>What would you like to explore?</h3><p>Ask for an explanation, outline, or a fresh perspective.</p></div>}
          {messages.map((m, i) => <article className={`message ${m.role}`} key={`${i}-${m.role}`}><span className="role">{m.role === "user" ? "YOU" : "AI STUDIO"}</span><p>{m.content || (busy && m.role === "assistant" ? "Thinking…" : "")}</p></article>)}
        </div>
        <form className="composer" onSubmit={submit}>
          <label className="sr-only" htmlFor="prompt">Your message</label>
          <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value.slice(0, 4000))} placeholder="Ask your question… (max 4,000 characters)" rows={2} maxLength={4000} disabled={busy} />
          <div className="composer-bottom"><span>{prompt.length}/4000 characters</span><button disabled={busy || !prompt.trim()}>{busy ? "Generating…" : "Send message ↗"}</button></div>
        </form>
        {error && <p className="error" role="alert">{error}</p>}
        <p className="disclaimer">AI can make mistakes. Verify important information.</p>
      </section>
      <footer><span>Built for FE-11 · Production deployment and README</span><span>Responsive · Server-side secrets · Rate limited</span></footer>
    </main>
  );
}