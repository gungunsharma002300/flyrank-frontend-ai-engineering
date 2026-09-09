import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatWindow from "../src/components/ChatWindow.jsx";
import { sendMessage } from "../src/api/aiRoute.js";

// The AI route is mocked at the module boundary — this suite never makes
// a real network call, in or out of CI.
vi.mock("../src/api/aiRoute.js", () => ({
  sendMessage: vi.fn(),
}));

describe("ChatWindow", () => {
  it("sends a message and renders the mocked assistant reply", async () => {
    sendMessage.mockResolvedValueOnce({
      parts: [{ type: "text", content: "Hello back!" }],
    });
    const user = userEvent.setup();
    render(<ChatWindow />);

    await user.type(screen.getByLabelText(/message/i), "Hi there");
    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(await screen.findByText("Hello back!")).toBeInTheDocument();
    expect(sendMessage).toHaveBeenCalledWith("Hi there");
  });

  it("shows a retry-able error state when the mocked route rejects", async () => {
    sendMessage.mockRejectedValueOnce(new Error("network down"));
    const user = userEvent.setup();
    render(<ChatWindow />);

    await user.type(screen.getByLabelText(/message/i), "Will this fail?");
    await user.click(screen.getByRole("button", { name: /send/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);

    sendMessage.mockResolvedValueOnce({ parts: [{ type: "text", content: "Recovered!" }] });
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText("Recovered!")).toBeInTheDocument();
    expect(sendMessage).toHaveBeenCalledTimes(2);
  });
});
