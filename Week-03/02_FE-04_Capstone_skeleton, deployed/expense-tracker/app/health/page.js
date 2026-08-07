async function getStatus() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export default async function HealthPage() {
  const status = await getStatus();

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Health Check</h1>
      <p className="text-black/70 max-w-2xl">
        Confirms the app can fetch data at build/request time.
      </p>
      <div className="rounded-xl border border-black/10 bg-white p-6 max-w-xl">
        <p className="text-sm text-black/50 mb-2">Fetch status</p>
        <p className="font-semibold mb-4">
          {status.ok ? "✅ Data fetched successfully" : "❌ Fetch failed"}
        </p>
        <pre className="text-xs bg-surface rounded-lg p-4 overflow-auto">
          {JSON.stringify(status.data ?? status.error, null, 2)}
        </pre>
      </div>
    </section>
  );
}
