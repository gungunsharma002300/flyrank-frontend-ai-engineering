import { getCategory } from "./categories";

function monthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("default", { month: "long", year: "numeric" });
}

function shiftMonthKey(key, delta) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function summarizeMonth(expenses, key) {
  const inMonth = expenses.filter((e) => monthKey(e.date) === key);
  if (inMonth.length === 0) return null;

  const totals = {};
  inMonth.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
  });

  const categories = Object.entries(totals)
    .map(([name, total]) => ({ name, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => b.total - a.total);

  const total = Math.round(inMonth.reduce((sum, e) => sum + Number(e.amount), 0) * 100) / 100;

  return {
    label: monthLabel(inMonth[0].date),
    total,
    categories,
  };
}

export function getTopCategory(month) {
  if (!month || !month.categories || month.categories.length === 0) return null;
  return month.categories[0];
}

// Builds a privacy-conscious aggregate summary of a person's expenses to send to the AI.
// Deliberately excludes free-text `note` fields — only amounts, categories and dates are used.
export function buildExpenseSummary(expenses) {
  if (!expenses || expenses.length === 0) return null;

  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const previousKey = shiftMonthKey(currentKey, -1);

  const currentMonth = summarizeMonth(expenses, currentKey);
  const previousMonth = summarizeMonth(expenses, previousKey);

  if (!currentMonth) return null;

  const topCategoryRaw = getTopCategory(currentMonth);
  const topCategory = topCategoryRaw
    ? { name: topCategoryRaw.name, emoji: getCategory(topCategoryRaw.name).emoji }
    : null;

  return {
    currentMonth,
    previousMonth,
    transactionCount: expenses.filter((e) => monthKey(e.date) === currentKey).length,
    topCategory,
  };
}
