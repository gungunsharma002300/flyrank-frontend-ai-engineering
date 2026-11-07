"use client";

export default function InsightsPanel({ status, data, errorMessage, onGenerate, hasData }) {
  const buttonDisabled = !hasData || status === "loading";

  return (
    <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display font-semibold">AI spending insights</p>
          <p className="text-sm text-ink/60 mt-0.5">
            A quick, AI-generated read on this month's spending. Only aggregated totals are sent —
            never your notes.
          </p>
        </div>
        <button
          onClick={onGenerate}
          disabled={buttonDisabled}
          aria-busy={status === "loading"}
          className="bg-accent text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {status === "loading" ? "Generating…" : "Generate insights"}
        </button>
      </div>

      <div aria-live="polite">
        {status === "idle" && !hasData && (
          <p data-testid="insights-empty" className="text-ink/50 text-sm">
            Add a few expenses this month to generate insights.
          </p>
        )}

        {status === "idle" && hasData && (
          <p data-testid="insights-empty" className="text-ink/50 text-sm">
            Click "Generate insights" to see an AI summary of this month's spending.
          </p>
        )}

        {status === "loading" && (
          <p data-testid="insights-loading" className="text-ink/50 text-sm">
            Reading your spending summary and asking the AI for a read on it…
          </p>
        )}

        {status === "error" && (
          <p data-testid="insights-error" role="alert" className="text-danger text-sm">
            {errorMessage || "Something went wrong. Please try again."}
          </p>
        )}

        {status === "success" && data && (
          <div data-testid="insights-success" className="space-y-3">
            <p className="font-semibold">{data.headline}</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-ink/80">
              {data.insights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
            <p className="text-sm bg-accentSoft text-accent rounded-xl px-4 py-3">
              💡 {data.suggestion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
