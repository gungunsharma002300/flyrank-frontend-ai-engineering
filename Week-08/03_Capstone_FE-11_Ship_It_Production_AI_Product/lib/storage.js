const KEY = "expense-tracker-transactions";

export function getExpenses() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveExpenses(list) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (e) {
    // storage unavailable, ignore
  }
}

export function addExpense(expense) {
  const list = getExpenses();
  const withId = { ...expense, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) };
  const updated = [withId, ...list];
  saveExpenses(updated);
  return updated;
}

export function deleteExpense(id) {
  const updated = getExpenses().filter((e) => e.id !== id);
  saveExpenses(updated);
  return updated;
}

// Probes whether localStorage actually works in this browser. Safari private
// browsing (and some locked-down/managed machines) expose `window.localStorage`
// but throw on every write, so a simple typeof-check isn't enough.
export function isStorageAvailable() {
  if (typeof window === "undefined") return false;
  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function formatMoney(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}
