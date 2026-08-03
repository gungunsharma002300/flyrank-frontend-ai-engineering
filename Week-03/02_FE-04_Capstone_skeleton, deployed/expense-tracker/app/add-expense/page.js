"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addExpense } from "../../lib/storage";
import { CATEGORIES } from "../../lib/categories";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddExpensePage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    addExpense({ amount: numAmount, category, date, note: note.trim() });
    router.push("/expenses");
  };

  return (
    <section className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Add Expense</h1>
        <p className="text-ink/60 mt-1">Log a new transaction.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Amount (₹)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full border border-line rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.name}
                onClick={() => setCategory(c.name)}
                className={`flex flex-col items-center gap-1 rounded-xl border py-2.5 text-xs transition-colors ${
                  category === c.name
                    ? "border-accent bg-accentSoft"
                    : "border-line hover:bg-surface"
                }`}
              >
                <span className="text-lg">{c.emoji}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-line rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Groceries for the week"
            className="w-full border border-line rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>

        {error && <p className="text-danger text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Save Expense
        </button>
      </form>
    </section>
  );
}
