# Expense Tracker — AI Insights Capstone

**FlyRank AI Internship — Frontend AI Engineering Track**
Capstone: *"Ship It — Your First Production AI Product"*

This is my existing Week 3 capstone (`expense-tracker`), extended for the capstone brief: a real
Claude-powered AI feature, automated tests, accessibility fixes, error handling, and production
documentation — rather than a new app built from scratch.

## 1. Project brief

A local-first expense tracker (Next.js App Router, Tailwind, Recharts, `localStorage`) that now
also generates short, AI-written spending insights from the user's own aggregated data.

## 2. Setup & run

```bash
npm install
cp .env.local.example .env.local   # then add your own ANTHROPIC_API_KEY
npm run dev                        # http://localhost:3000
```

Run the test suite:

```bash
npm test          # runs once
npm run test:watch
```

Build for production:

```bash
npm run build
npm start
```

## 3. Architecture overview

```
app/
  page.js                 Home — month summary, top categories, recent transactions
  add-expense/page.js     Add-expense form
  expenses/page.js        Filterable transaction list
  reports/page.js         Pie/bar charts (category + monthly trend)
  insights/page.js        NEW — AI spending insights page
  api/insights/route.js   NEW — server route that calls the Claude API
  health/page.js          Existing connectivity smoke-test page
  layout.js               Nav, skip-link, storage warning
  error.js / not-found.js NEW — error boundary + custom 404
lib/
  storage.js              localStorage CRUD + formatMoney + isStorageAvailable (NEW)
  categories.js           Category metadata
  insights.js             NEW — builds the privacy-safe summary sent to the AI
  rateLimit.js            NEW — in-memory per-IP rate limiter
components/
  InsightsPanel.jsx       NEW — presentational UI for the insights feature
  NavLinks.jsx            NEW — nav with active-link state
  StorageWarning.jsx      NEW — warns if localStorage is unavailable
tests/                    NEW — Vitest + Testing Library suite
```

Data flow for the AI feature: `getExpenses()` (localStorage) → `buildExpenseSummary()` (aggregates
by month/category) → POST `/api/insights` → Claude API → structured JSON → `InsightsPanel`.

## 4. The AI integration

**What it does:** on the new `/insights` page, the user clicks "Generate insights" and gets a short
AI-written headline, 2–3 observations, and one practical suggestion about their spending this month.

**Why this and not a chatbot:** the brief asks for AI that's "actually useful, not just because you
can." A generic chatbot bolted onto an expense tracker is a gimmick nobody would use twice. A
one-click summary that turns raw numbers into a sentence a person actually reads is the kind of
small, real utility AI is good at here.

**Prompt:** `buildPrompt()` in `app/api/insights/route.js` sends the aggregated summary as JSON and
asks for a strict JSON response (`headline`, `insights[]`, `suggestion`) — no markdown fences — so
the response can be parsed reliably instead of regex-scraped from free text.

**Privacy by design:** `buildExpenseSummary()` only ever includes category names, totals, and
counts — the free-text `note` field (which could contain anything the user typed) is never read or
sent. This is enforced by a test (`tests/insights.test.js`) that asserts a note's contents never
appear in the JSON sent to the model.

**Model:** `claude-haiku-4-5-20251001` by default (fast, cheap, plenty for a short structured
summary), overridable via `ANTHROPIC_MODEL`.

**Trade-offs:**
- The rate limiter (`lib/rateLimit.js`) is in-memory, so it resets per server instance/restart and
  isn't a real shared limiter across multiple serverless instances. Documented in the code; a real
  deployment would move this to Redis/Upstash or a platform-level rate limit.
- No caching — every click is a fresh API call. Fine for a personal tool used a few times a day;
  would need caching/debouncing at higher usage.

## 5. Accessibility

Audited against WCAG 2.1 AA and fixed:
- Skip-to-content link, proper heading hierarchy, `aria-current="page"` on the active nav link.
- Every form input has a real `<label htmlFor>`; the category picker is a `fieldset`/`legend` with
  `role="radiogroup"`; validation errors are `role="alert"`.
- Category/transaction filters use `aria-pressed`; the "Remove" button on each transaction is
  reachable by keyboard (`focus:opacity-100`, not just `hover:`) and has a full, descriptive
  `aria-label` instead of just "Delete expense."
- Recharts' pie/bar charts render to `<svg>`, which screen readers can't parse — each chart is
  wrapped in `role="img"` with a visually-hidden (`sr-only`) `<table>` holding the same data as text.
- Progress bars on the home page use `role="progressbar"` with `aria-valuenow/min/max`.
- The AI insights panel uses `aria-live="polite"` so screen-reader users hear the result land
  without having to go looking for it.

## 6. Error handling & failure modes

- **No API key set:** the route returns a clear 500 with "AI insights aren't configured yet," not a
  stack trace or a silent failure.
- **Network/upstream failure, rate limiting, malformed AI response:** each has its own distinct,
  human-readable error message surfaced in the UI (`InsightsPanel`'s error state), not a generic
  "something broke."
- **`localStorage` unavailable** (private browsing, locked-down machines): detected on load
  (`isStorageAvailable`) and surfaced as a dismissable-by-nature banner — the app still works for
  the session, it just won't persist.
- **Unhandled render errors:** caught by `app/error.js`, which reassures the user their saved data
  is untouched and offers a retry, instead of a blank white screen.
- **Unknown routes:** a custom `app/not-found.js` instead of the default 404.

## 7. Testing

11 tests across 3 files (Vitest + React Testing Library):
- `lib/insights.js` — aggregation correctness and the privacy guarantee (notes never leak into the
  AI payload).
- `lib/rateLimit.js` — allows up to the limit, blocks over it, tracks keys independently.
- `components/InsightsPanel.jsx` — every UI state (empty/disabled, loading, error, success) and the
  click-to-generate interaction.

## 8. Known limitations & future improvements

- Rate limiting is per-instance, not shared (see trade-offs above).
- No server-side persistence — everything lives in the browser's `localStorage`, so data doesn't
  sync across devices. Acceptable for a personal-use tool; a real product would need an account +
  database.
- The AI only looks at the current/previous month; a "spending over time" trend insight would need
  a longer-range prompt.
- `npm audit` still reports a handful of vulnerabilities in Next 14.2.35's own bundled `postcss`/
  `source-map-js` (source-map handling, not reachable by normal app traffic) and in dev-only tooling
  (`vitest`'s `tinypool`, `tailwindcss`'s transitive `postcss-selector-parser`). Fixing them fully
  means a Next 16 or Tailwind 4 major upgrade — out of scope to do safely without a full regression
  pass, so it's called out here rather than silently left unmentioned.

## 9. Deployment checklist

- [x] `npm run build` completes with no errors
- [x] `npm test` — 11/11 passing
- [x] Environment variables documented (`.env.local.example`)
- [x] Set `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`) in the hosting platform's
      environment variables (e.g. Vercel → Project → Settings → Environment Variables)
- [x] `.env*` is git-ignored — no secrets committed
- [ ] Deploy (`vercel --prod` from this folder, or connect the repo in the Vercel dashboard)
- [ ] Re-run Lighthouse (mobile) + WAVE against the deployed URL and record scores

## 10. Rollback & monitoring plan

- **Rollback:** deployed via Vercel, so rolling back is instant — redeploy the previous deployment
  from the Vercel dashboard ("Promote to Production" on an earlier build), no code changes needed.
- **Monitoring:** watch Vercel's function logs for the `/api/insights` route for repeated 500/502s
  (missing key, upstream outage) or 429s (rate-limit/abuse); the distinct error messages returned by
  the route make it straightforward to tell these apart from the logs alone.
- **Fails safely:** if the AI feature breaks entirely, the rest of the app (adding/viewing/filtering
  expenses, reports) is completely unaffected — the insights feature is additive, not load-bearing.

## 11. Reflection

*(Personal — not AI-generated. A few honest prompts to answer in my own words before submitting:)*
- What was the hardest part of adding AI to an app that didn't have it?
- Where did I have to make a judgment call on scope (e.g. what the rate limiter does/doesn't cover)?
- What would I do differently with more time?
