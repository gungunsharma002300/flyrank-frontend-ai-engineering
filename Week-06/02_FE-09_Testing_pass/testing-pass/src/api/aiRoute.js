// The single seam between the UI and the AI backend. Every test in this
// project mocks this module instead of hitting a real network endpoint —
// see tests/ChatWindow.test.jsx and e2e/primary-flow.spec.js.
export async function sendMessage(message) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error(`AI request failed with status ${res.status}`);
  }

  return res.json(); // expected shape: { parts: ChatPart[] }
}
