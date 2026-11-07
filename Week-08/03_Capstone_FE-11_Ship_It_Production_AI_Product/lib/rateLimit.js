// A simple, in-memory sliding-window rate limiter.
//
// NOTE: this is intentionally lightweight and only safe as a basic abuse guard
// on a single long-lived server process. It is NOT safe as the sole protection
// across multiple serverless instances (each instance gets its own Map, so a
// client could get up to MAX_REQUESTS per instance). For real production
// traffic, back this with a shared store (Redis/Upstash) or a platform-level
// rate limiter (e.g. Vercel Edge Config / WAF rules).
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

const hits = new Map();

export function isRateLimited(key) {
  const now = Date.now();
  const existing = hits.get(key) || [];
  const recent = existing.filter((ts) => now - ts < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);
  return false;
}
