import { describe, it, expect } from "vitest";
import { buildExpenseSummary } from "../lib/insights";

describe("buildExpenseSummary", () => {
  it("returns null when there are no expenses", () => {
    expect(buildExpenseSummary([])).toBeNull();
    expect(buildExpenseSummary(null)).toBeNull();
  });

  it("aggregates the current month's totals by category", () => {
    const now = new Date();
    const thisMonthISO = (day) =>
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const expenses = [
      { amount: 100, category: "Food", date: thisMonthISO(1) },
      { amount: 50, category: "Food", date: thisMonthISO(2) },
      { amount: 200, category: "Transport", date: thisMonthISO(3) },
    ];

    const summary = buildExpenseSummary(expenses);

    expect(summary.currentMonth.total).toBe(350);
    expect(summary.transactionCount).toBe(3);
    expect(summary.topCategory.name).toBe("Transport");

    const food = summary.currentMonth.categories.find((c) => c.name === "Food");
    expect(food.total).toBe(150);
  });

  it("excludes free-text notes from the summary sent to the AI", () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const summary = buildExpenseSummary([
      { amount: 10, category: "Food", date: dateStr, note: "secret diary entry" },
    ]);

    expect(JSON.stringify(summary)).not.toContain("secret diary entry");
  });
});
