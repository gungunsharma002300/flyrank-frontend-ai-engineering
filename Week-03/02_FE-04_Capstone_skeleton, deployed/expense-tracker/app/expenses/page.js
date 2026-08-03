"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getExpenses, deleteExpense, formatMoney } from "../../lib/storage";
import { CATEGORIES, getCategory } from "../../lib/categories";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setExpenses(getExpenses());
    setLoaded(true);
  }, []);

  const handleDelete = (id) => {
    setExpenses(deleteExpense(id));
  };

  const filtered = expenses
    .filter((e) => filter === "All" || e.category === filter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">All Expenses</h1>
          <p className="text-ink/60 mt-1">{filtered.length} transactions · {formatMoney(total)}</p>
        </div>
        <Link
          href="/add-expense"
          className="bg-accent text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          + Add Expense
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("All")}
          className={`px-3 py-1.5 rounded-full text-sm border ${
            filter === "All" ? "border-accent bg-accentSoft text-accent" : "border-line"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.name}
            onClick={() => setFilter(c.name)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              filter === c.name ? "border-accent bg-accentSoft text-accent" : "border-line"
            }`}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-card overflow-hidden">
        {!loaded ? (
          <p className="text-ink/40 text-sm p-6">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-2">🧾</p>
            <p className="text-ink/60">No expenses match this filter yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {filtered.map((e) => {
              const cat = getCategory(e.category);
              return (
                <div key={e.id} className="flex items-center justify-between px-6 py-4 group">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                      style={{ backgroundColor: cat.color + "22" }}
                    >
                      {cat.emoji}
                    </span>
                    <div>
                      <p className="font-medium">{e.note || e.category}</p>
                      <p className="text-xs text-ink/50">{e.category} · {e.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">{formatMoney(e.amount)}</p>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-ink/30 hover:text-danger transition-colors text-sm opacity-0 group-hover:opacity-100"
                      aria-label="Delete expense"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
