import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedbackForm from "../src/components/FeedbackForm.jsx";

describe("FeedbackForm", () => {
  it("blocks submission and lists every required-field error", async () => {
    const user = userEvent.setup();
    render(<FeedbackForm />);

    await user.click(screen.getByRole("button", { name: /send feedback/i }));

    expect(screen.getByLabelText(/name/i)).toHaveAccessibleDescription(/name is required/i);
    expect(screen.getByLabelText(/email/i)).toHaveAccessibleDescription(/email is required/i);
    expect(screen.getByLabelText(/message/i)).toHaveAccessibleDescription(/message is required/i);
  });

  it("flags a malformed email without blocking the other fields", async () => {
    const user = userEvent.setup();
    render(<FeedbackForm />);

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /send feedback/i }));

    expect(screen.getByLabelText(/email/i)).toHaveAccessibleDescription(/valid email/i);
  });

  it("submits successfully once every field is valid", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<FeedbackForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/name/i), "Gungun Sharma");
    await user.type(screen.getByLabelText(/email/i), "gungun@example.com");
    await user.type(screen.getByLabelText(/message/i), "Loving the internship so far!");
    await user.click(screen.getByRole("button", { name: /send feedback/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/thanks/i);
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Gungun Sharma",
      email: "gungun@example.com",
      message: "Loving the internship so far!",
    });
  });
});
