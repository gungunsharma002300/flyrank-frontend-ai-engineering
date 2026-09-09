import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ToolResult from "../src/components/ToolResult.jsx";

describe("ToolResult", () => {
  it("announces a running tool as a status region", () => {
    render(<ToolResult name="search_docs" status="loading" />);
    expect(screen.getByRole("status")).toHaveTextContent(/running search_docs/i);
  });

  it("surfaces a failed tool call as an alert with the error message", () => {
    render(<ToolResult name="search_docs" status="error" error="timed out" />);
    expect(screen.getByRole("alert")).toHaveTextContent(/timed out/i);
  });

  it("renders each key/value pair of a successful result", () => {
    render(
      <ToolResult
        name="get_weather"
        status="success"
        result={{ city: "Pilibhit", condition: "Clear", tempC: 29 }}
      />
    );

    const group = screen.getByRole("group", { name: /get_weather result/i });
    expect(group).toHaveTextContent("Pilibhit");
    expect(group).toHaveTextContent("Clear");
    expect(group).toHaveTextContent("29");
  });
});
