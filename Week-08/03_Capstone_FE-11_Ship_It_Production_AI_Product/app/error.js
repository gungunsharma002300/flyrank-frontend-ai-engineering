"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="max-w-lg mx-auto text-center py-20 space-y-4">
      <p className="text-4xl">⚠️</p>
      <h1 className="text-2xl font-display font-bold">Something went wrong</h1>
      <p className="text-ink/60">
        This page hit an unexpected error. Your data in local storage is untouched — it's safe to
        try again.
      </p>
      <button
        onClick={reset}
        className="bg-accent text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </section>
  );
}
