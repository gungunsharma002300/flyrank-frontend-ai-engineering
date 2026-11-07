import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InsightsPanel from "../components/InsightsPanel";

describe("InsightsPanel", () => {
  it("shows the empty state and disables the button when there's no data", () => {
    render(<InsightsPanel status="idle" data={null} errorMessage="" onGenerate={() => {}} hasData={false} />);

    expect(screen.getByTestId("insights-empty")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /generate insights/i })).toBeDisabled();
  });

  it("calls onGenerate when the button is clicked with data available", () => {
    const onGenerate = vi.fn();
    render(<InsightsPanel status="idle" data={null} errorMessage="" onGenerate={onGenerate} hasData={true} />);

    fireEvent.click(screen.getByRole("button", { name: /generate insights/i }));
    expect(onGenerate).toHaveBeenCalledTimes(1);
  });

  it("shows a loading state and disables the button while loading", () => {
    render(<InsightsPanel status="loading" data={null} errorMessage="" onGenerate={() => {}} hasData={true} />);

    expect(screen.getByTestId("insights-loading")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders a friendly error message when the request fails", () => {
    render(
      <InsightsPanel
        status="error"
        data={null}
        errorMessage="The AI service returned an error. Please try again."
        onGenerate={() => {}}
        hasData={true}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/returned an error/i);
  });

  it("renders the headline, insights, and suggestion on success", () => {
    render(
      <InsightsPanel
        status="success"
        data={{
          headline: "Spending is steady this month.",
          insights: ["Food is your top category.", "You're tracking 12 transactions."],
          suggestion: "Consider setting a soft cap on dining out.",
        }}
        errorMessage=""
        onGenerate={() => {}}
        hasData={true}
      />
    );

    expect(screen.getByText("Spending is steady this month.")).toBeInTheDocument();
    expect(screen.getByText("Food is your top category.")).toBeInTheDocument();
    expect(screen.getByText(/soft cap on dining out/i)).toBeInTheDocument();
  });
});
