"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getExpenses, formatMoney } from "../lib/storage";
import { getCategory } from "../lib/categories";

function isThisMonth(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function HomePage() {
  const [expenses, setExpenses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setExpenses(getExpenses());
    setLoaded(true);
  }, []);

  const thisMonth = expenses.filter((e) => isThisMonth(e.date));
  const monthTotal = thisMonth.reduce((sum, e) => sum + Number(e.amount), 0);
  const recent = expenses.slice(0, 5);

  const categoryTotals = {};
  thisMonth.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome back</h1>
          <p className="text-ink/60 mt-1">Here's how this month is looking.</p>
        </div>
        <Link
          href="/add-expense"
          className="bg-accent text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          + Add Expense
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p className="text-sm text-ink/50">This month</p>
          <p className="text-3xl font-display font-bold mt-1">{formatMoney(monthTotal)}</p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-6">
          <p className="text-sm text-ink/50">Transactions</p>
          <p className="text-3xl font-display font-bold mt-1">{thisMonth.length}</p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-6">
          <p className="text-sm text-ink/50">Total tracked (all time)</p>
          <p className="text-3xl font-display font-bold mt-1">{expenses.length}</p>
        </div>
      </div>

      {topCategories.length > 0 && (
        <div className="rounded-2xl border border-line bg-card p-6">
          <p className="font-display font-semibold mb-4">Top categories this month</p>
          <div className="space-y-3">
            {topCategories.map(([name, total]) => {
              const cat = getCategory(name);
              const pct = Math.round((total / monthTotal) * 100);
              return (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat.emoji} {name}</span>
                    <span className="text-ink/60">{formatMoney(total)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-semibold">Recent transactions</p>
          <Link href="/expenses" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        {!loaded ? (
          <p className="text-ink/40 text-sm">Loading...</p>
        ) : recent.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-2">🧾</p>
            <p className="text-ink/60">No expenses yet. Add your first one to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {recent.map((e) => {
              const cat = getCategory(e.category);
              return (
                <div key={e.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-base"
                      style={{ backgroundColor: cat.color + "22" }}
                    >
                      {cat.emoji}
                    </span>
                    <div>
                      <p className="font-medium">{e.note || e.category}</p>
                      <p className="text-xs text-ink/50">{e.date}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatMoney(e.amount)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
