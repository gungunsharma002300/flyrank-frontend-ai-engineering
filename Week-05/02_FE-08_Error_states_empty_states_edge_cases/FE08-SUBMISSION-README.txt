FE-08 SUBMISSION — READ THIS FIRST
"Error states, empty states, edge cases" (built on top of your FE-07 tool)

WHAT'S BUILT (all verified — tsc clean, npm run build clean):
- Route-level error boundary (app/error.tsx) with a "Try again" reset
- useChat's error state rendered as a designed card with a working
  Retry button (regenerate()) and Dismiss (clearError())
- Empty-input validation: Send button disabled on empty/whitespace,
  quiet inline guidance instead of a blocking alert
- API route validates the request body and message array before
  calling the model — malformed/empty requests get a clean 400,
  not a crash
- API route wraps the model call in try/catch — network issues, rate
  limits, or invalid keys return a clean 500 with a message instead
  of an unhandled exception
- First-run empty state redesigned: "No conversations yet" + a
  click-to-fill example button, not a dead end
- Loading skeleton (LinkPreviewSkeleton) sized to match the real card
  so there's no layout shift when content arrives
- Mobile/Safari fixes: 100dvh instead of 100vh, safe-area-inset for
  the input bar, text wrapping instead of horizontal overflow

Full table of every failure case and where it's handled is in README.md
under "FE-08 — Error states, empty states, edge cases".

===========================================
STEP 1 — Run it locally (reuse your FE-07 key)
===========================================
If you already have this project running from FE-07:
1. Replace your project files with this updated version
2. Your existing .env.local with your Gemini key still works —
   no new key needed
3. npm install (in case anything changed)
4. npm run dev

If starting fresh:
1. npm install
2. cp .env.local.example .env.local
3. Add your free Gemini key (https://aistudio.google.com/apikey)
4. npm run dev

===========================================
STEP 2 — Test by sabotage (do this before submitting)
===========================================
The assignment specifically wants proof you broke things on purpose:

1. Open DevTools → Network → set to "Offline", then try sending a
   message → you should see the error card with a Retry button
2. Go back online, click Retry → it should recover
3. Try sending a broken URL (e.g. "Preview https://this-does-not-
   exist-xyz.com") → tool-level designed error card, not a crash
4. Clear the page / open in a new incognito tab → first-run empty
   state with the click-to-fill example
5. Try clicking Send with an empty input → button stays disabled
6. Open on your phone (or DevTools device mode) → check the input
   bar doesn't jump when the keyboard opens

Take screenshots of at least 2 of these (the assignment's minimum) —
recommended: the mid-stream failure + retry, and the empty-input state.

===========================================
STEP 3 — Deploy (same as FE-07)
===========================================
1. Push to GitHub
2. Import at vercel.com/new (or redeploy if already connected)
3. Confirm GOOGLE_GENERATIVE_AI_API_KEY is still set in Vercel's
   environment variables
4. Deploy — same live URL updates, or a new one if it's a new project

===========================================
STEP 4 — Submit on the FlyRank portal (Checkpoint 1)
===========================================
- Deliverable → your live preview URL
- Files → the 2+ screenshots from Step 2, plus README.md
- Notes → paste this:

  "Inventoried failure/edge cases for the link-preview tool: network
  failure, mid-stream API error, rate limits, empty input, first-run
  empty state, and slow responses. Added a route-level error boundary,
  a useChat error banner with a working retry, empty-input validation,
  API-side request validation, a layout-matched loading skeleton, and
  a redesigned first-run empty state with a click-to-fill example.
  Tested by sabotage: offline network, broken URLs, and empty
  submissions. Fixed mobile/Safari viewport issues (100dvh, safe-area
  insets). Full case-by-case table in README.md."
