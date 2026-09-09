import { useState } from "react";
import ChatMessage from "./ChatMessage.jsx";
import { sendMessage } from "../api/aiRoute.js";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");

  function updateMessage(id, patch) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  async function requestReply(id, text) {
    updateMessage(id, { status: "pending", onRetry: undefined });
    try {
      const data = await sendMessage(text);
      updateMessage(id, { status: "complete", parts: data.parts ?? [] });
    } catch {
      updateMessage(id, { status: "error", onRetry: () => requestReply(id, text) });
    }
  }

  async function handleSend(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");

    const userMessage = {
      id: nextId(),
      role: "user",
      status: "complete",
      parts: [{ type: "text", content: text }],
    };
    const assistantId = nextId();
    const assistantMessage = { id: assistantId, role: "assistant", status: "pending", parts: [] };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    await requestReply(assistantId, text);
  }

  return (
    <section aria-label="AI chat">
      <h2>Chat</h2>
      <div className="messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <form onSubmit={handleSend}>
        <label htmlFor="chat-input">Message</label>
        <input
          id="chat-input"
          name="message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          autoComplete="off"
        />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
