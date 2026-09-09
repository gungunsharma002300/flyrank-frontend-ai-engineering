import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatMessage from "../src/components/ChatMessage.jsx";

describe("ChatMessage", () => {
  it("renders text parts as plain content", () => {
    render(
      <ChatMessage
        message={{
          role: "assistant",
          status: "complete",
          parts: [{ type: "text", content: "Here is your answer." }],
        }}
      />
    );

    expect(screen.getByRole("article")).toHaveTextContent("Here is your answer.");
  });

  it("shows a pending state while waiting on a reply", () => {
    render(<ChatMessage message={{ role: "assistant", status: "pending", parts: [] }} />);

    expect(screen.getByRole("status")).toHaveTextContent(/thinking/i);
  });

  it("marks a streaming reply as a live region", () => {
    render(
      <ChatMessage
        message={{
          role: "assistant",
          status: "streaming",
          parts: [{ type: "text", content: "Partial ans" }],
        }}
      />
    );

    const article = screen.getByRole("article", { name: /streaming/i });
    expect(article).toHaveAttribute("aria-live", "polite");
  });

  it("shows an error banner with a working retry action", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<ChatMessage message={{ role: "assistant", status: "error", parts: [], onRetry }} />);

    expect(screen.getByRole("alert")).toHaveTextContent(/something went wrong/i);
    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders a tool call chip followed by its nested tool result", () => {
    render(
      <ChatMessage
        message={{
          role: "assistant",
          status: "complete",
          parts: [
            { type: "tool_call", name: "get_weather" },
            {
              type: "tool_result",
              name: "get_weather",
              status: "success",
              result: { city: "Delhi", tempC: 31 },
            },
          ],
        }}
      />
    );

    expect(screen.getByText(/called/i)).toHaveTextContent("get_weather");
    expect(screen.getByRole("group", { name: /get_weather result/i })).toHaveTextContent("Delhi");
  });
});
