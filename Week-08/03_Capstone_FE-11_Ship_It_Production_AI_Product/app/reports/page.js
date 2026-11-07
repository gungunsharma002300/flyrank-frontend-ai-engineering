"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getExpenses, formatMoney } from "../../lib/storage";
import { getCategory } from "../../lib/categories";

function monthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
}

export default function ReportsPage() {
  const [expenses, setExpenses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setExpenses(getExpenses());
    setLoaded(true);
  }, []);

  const categoryData = useMemo(() => {
    const totals = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
      color: getCategory(name).color,
    }));
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const totals = {};
    expenses.forEach((e) => {
      const key = monthKey(e.date);
      totals[key] = (totals[key] || 0) + Number(e.amount);
    });
    return Object.entries(totals)
      .map(([month, total]) => ({ month, total }))
      .slice(-6);
  }, [expenses]);

  const grandTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  if (!loaded) {
    return <p className="text-ink/40 text-sm">Loading...</p>;
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Reports</h1>
        <p className="text-ink/60 mt-1">
          {expenses.length === 0
            ? "Add a few expenses to see your spending breakdown."
            : `Total tracked: ${formatMoney(grandTotal)}`}
        </p>
      </div>

      {expenses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-card p-16 text-center text-ink/40">
          No data yet — add some expenses first.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-line bg-card p-6">
            <p id="category-chart-title" className="font-display font-semibold mb-4">
              By category
            </p>
            <div
              role="img"
              aria-labelledby="category-chart-title"
              aria-describedby="category-chart-data"
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatMoney(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-3 justify-center">
              {categoryData.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                    aria-hidden="true"
                  />
                  {c.name}
                </div>
              ))}
            </div>
            <table id="category-chart-data" className="sr-only">
              <caption>Total spending by category</caption>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((c) => (
                  <tr key={c.name}>
                    <td>{c.name}</td>
                    <td>{formatMoney(c.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-line bg-card p-6">
            <p id="monthly-chart-title" className="font-display font-semibold mb-4">
              Monthly trend
            </p>
            <div
              role="img"
              aria-labelledby="monthly-chart-title"
              aria-describedby="monthly-chart-data"
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E3DB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => formatMoney(v)} />
                  <Bar dataKey="total" fill="#2F6F4F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table id="monthly-chart-data" className="sr-only">
              <caption>Total spending by month</caption>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((m) => (
                  <tr key={m.month}>
                    <td>{m.month}</td>
                    <td>{formatMoney(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
