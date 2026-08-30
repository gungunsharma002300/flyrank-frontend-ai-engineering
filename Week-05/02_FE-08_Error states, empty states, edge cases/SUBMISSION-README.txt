FE-07 SUBMISSION — READ THIS FIRST
"Tool Results and Structured Output in the UI"

WHAT'S BUILT:
A working Next.js app, styled with your identity kit theme (Space
Grotesk + Inter, #0C447C/#1A1A18/#FAFAF8/#D85A30), where the AI can call
a real tool (fetchMetaTags — fetches a URL server-side and returns its
meta tags), and the UI renders all four tool lifecycle states distinctly:
input-streaming, input-available, output-available, output-error.
The success state renders a real link-preview card component, not JSON.
The error state is a designed card in the accent color, not a crash.

WHAT I COULDN'T DO FOR YOU:
- I can't create an API key on your behalf — you need your own
- I can't deploy to a live URL myself — no hosting access on my end
Both take a few minutes below.

===========================================
STEP 1 — Get a FREE Gemini API key (2 minutes)
===========================================
This version uses Google Gemini instead of OpenAI, because Gemini's
free tier works with no credit card and no billing setup.

1. Go to https://aistudio.google.com/apikey
2. Sign in with any Google account
3. Click "Create API key" — it's free, no card required
4. Copy it

===========================================
STEP 2 — Run it locally to test (5 minutes)
===========================================
1. Open this folder in VS Code
2. In the terminal:
   npm install
   cp .env.local.example .env.local
3. Open .env.local and paste your key:
   GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
4. npm run dev
5. Open http://localhost:3000 and try: "Preview https://vercel.com for me"
6. You should see: streaming state → fetching state → a real preview
   card. Try a broken URL too, to see the error state.

===========================================
STEP 3 — Deploy to get your Preview URL (5 minutes)
===========================================
1. Push this folder to a GitHub repo (or add it to your existing
   flyrank-frontend-ai-engineering repo under Week-05/)
2. Go to https://vercel.com/new and import that repo
3. In Vercel's project settings, add an environment variable:
     Name:  GOOGLE_GENERATIVE_AI_API_KEY
     Value: your key from Step 1
4. Click Deploy — Vercel gives you a live URL in about a minute
5. Open that URL and confirm the tool call works end to end (same test
   as Step 2)

===========================================
STEP 4 — Submit on the FlyRank portal
===========================================
- Deliverable links → your Vercel Preview URL
- Files → src/lib/tools/fetch-meta-tags.ts (the tool definition file)
          + README.md (documents the tool contract)
- Notes → paste this:

  "Built a fetchMetaTags server-side tool (Zod-typed input: a URL,
  output: title/description/image/siteName or a typed error) wired into
  an AI SDK chat route. The UI renders all four tool part states with
  distinct visual treatment: input-streaming (pulsing placeholder),
  input-available (spinner + fetching label), output-available (a real
  link-preview card component), and output-error (a designed red error
  card, not a crash). Tool contract documented in README.md."

===========================================
WHAT'S INSIDE
===========================================
- src/lib/tools/fetch-meta-tags.ts   → Zod schema + execute() + tool def
- src/app/api/chat/route.ts          → AI route wiring model + tool
- src/app/page.tsx                    → chat UI
- src/components/tool-part-renderer.tsx → the 4 distinct states
- src/components/link-preview-card.tsx  → the real result component
- README.md                          → full tool contract documentation
- .env.local.example                 → template for your API key

Already verified: npx tsc --noEmit passes clean, npm run build succeeds.
