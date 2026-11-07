import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-lg mx-auto text-center py-20 space-y-4">
      <p className="text-4xl">🧾</p>
      <h1 className="text-2xl font-display font-bold">Page not found</h1>
      <p className="text-ink/60">The page you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="inline-block bg-accent text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </section>
  );
}
