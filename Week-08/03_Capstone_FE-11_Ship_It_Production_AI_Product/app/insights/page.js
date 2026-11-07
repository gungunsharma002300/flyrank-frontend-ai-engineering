"use client";

import { useEffect, useState } from "react";
import { getExpenses } from "../../lib/storage";
import { buildExpenseSummary } from "../../lib/insights";
import InsightsPanel from "../../components/InsightsPanel";

export default function InsightsPage() {
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const expenses = getExpenses();
    setSummary(buildExpenseSummary(expenses));
  }, []);

  const handleGenerate = async () => {
    if (!summary) return;
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ summary }),
      });

      const body = await res.json();

      if (!res.ok) {
        setErrorMessage(body.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setData(body);
      setStatus("success");
    } catch {
      setErrorMessage("Couldn't reach the AI service. Check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <section className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold">Insights</h1>
        <p className="text-ink/60 mt-1">
          AI-generated observations about this month's spending, built from your own data.
        </p>
      </div>

      <InsightsPanel
        status={status}
        data={data}
        errorMessage={errorMessage}
        onGenerate={handleGenerate}
        hasData={!!summary}
      />
    </section>
  );
}
