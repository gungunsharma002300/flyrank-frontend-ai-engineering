"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary (FE-08 requirement).
 * Catches anything that throws during render/rendering lifecycle
 * that isn't already handled by useChat's own error state — e.g. a
 * genuinely broken render, not just a failed API call.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where you'd log to an error reporting service.
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6" style={{ background: "var(--bg)" }}>
      <div
        className="max-w-sm rounded-2xl border p-6 text-center"
        style={{ borderColor: "#F3C7B8", background: "#FDF1EC" }}
      >
        <div
          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: "var(--accent)" }}
        >
          !
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          Something went wrong
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          The page hit an unexpected error. You can try again below.
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded-full px-5 py-2 text-sm font-medium text-white"
          style={{ background: "var(--main)" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
