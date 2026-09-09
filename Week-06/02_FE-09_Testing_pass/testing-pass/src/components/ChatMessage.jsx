import ToolResult from "./ToolResult.jsx";

export default function ChatMessage({ message }) {
  const { role, status, parts = [], onRetry } = message;

  if (status === "pending") {
    return (
      <div className="chat-message" role="status" aria-label={`${role} message pending`}>
        Thinking…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        className="chat-message chat-message--error"
        role="alert"
        aria-label={`${role} message failed`}
      >
        <p>Something went wrong sending this message.</p>
        {onRetry && (
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="chat-message"
      role="article"
      aria-label={status === "streaming" ? `${role} message, streaming` : `${role} message`}
      aria-live={status === "streaming" ? "polite" : undefined}
    >
      {parts.map((part, index) => {
        if (part.type === "text") {
          return <p key={index}>{part.content}</p>;
        }
        if (part.type === "code") {
          return (
            <pre key={index}>
              <code>{part.content}</code>
            </pre>
          );
        }
        if (part.type === "tool_call") {
          return (
            <p key={index} className="tool-call-chip">
              Called <strong>{part.name}</strong>
            </p>
          );
        }
        if (part.type === "tool_result") {
          return (
            <ToolResult
              key={index}
              name={part.name}
              status={part.status}
              result={part.result}
              error={part.error}
            />
          );
        }
        return null;
      })}
      {status === "streaming" && (
        <span className="cursor" aria-hidden="true">
          ▍
        </span>
      )}
    </div>
  );
}
