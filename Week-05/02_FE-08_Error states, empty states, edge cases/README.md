# FE-07 — Tool Results and Structured Output in the UI

A minimal AI chat interface where the model can call a real server-side
tool (`fetchMetaTags`) and the UI renders that tool's full lifecycle as
distinct, typed states instead of dumping JSON.

## Try it

Ask things like:
- "Preview https://vercel.com for me"
- "What is https://this-domain-does-not-exist-xyz123.com about?" (to see
  the designed error state)

## Tool contract

**Name:** `fetchMetaTags`

**Input schema** (Zod):
```ts
z.object({
  url: z.string().url(),
})
```

**Return shape:**
```ts
// success
{
  status: "success",
  url: string,
  title: string,
  description: string,
  image: string | null,
  siteName: string | null,
}

// failure
{
  status: "error",
  url: string,
  reason: string,
}
```

**What it does:** given a public URL, fetches that page server-side and
extracts its `og:title` / `<title>`, `og:description` / meta description,
`og:image`, and `og:site_name` tags, with an 8-second timeout and a
descriptive error if the page can't be read.

**Why this shape:** the schema only asks for fields we can verify by
actually fetching the page — nothing here is a field the model could
plausibly hallucinate instead of calling the tool.

## The four tool states, rendered distinctly

| State | What it means | Visual treatment |
|---|---|---|
| `input-streaming` | Model is still deciding/streaming the URL argument | Dashed border, pulsing dot, "Working out which link…" |
| `input-available` | Full input ready, tool is executing | Blue card, spinner, "Fetching {url}…" |
| `output-available` | Tool succeeded | The real `LinkPreviewCard` component — image, title, description, source domain |
| `output-error` | Tool failed | Red card with a plain-language reason, not a stack trace or crash |

See `src/components/tool-part-renderer.tsx` for the state switch and
`src/components/link-preview-card.tsx` for the result component.

## Project structure

```
src/
  app/
    api/chat/route.ts       — AI route wiring the model + tool together
    page.tsx                 — chat UI
  components/
    tool-part-renderer.tsx  — renders all four tool states distinctly
    link-preview-card.tsx   — the real component for a successful result
  lib/
    tools/fetch-meta-tags.ts — Zod schema + execute() + tool definition
```

## Running locally

```bash
npm install
cp .env.local.example .env.local
# add your GOOGLE_GENERATIVE_AI_API_KEY to .env.local
# get a free key at https://aistudio.google.com/apikey
npm run dev
```

## Deploying (Vercel)

1. Push this folder to a GitHub repo
2. Import it at vercel.com/new
3. Add the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable in
   Vercel's project settings
4. Deploy — Vercel gives you a live Preview URL

## Note on model choice

Uses Gemini via `@ai-sdk/google` — chosen because Google's free tier
requires no billing setup. The model name is set via the `GEMINI_MODEL`
env var (defaults to `gemini-3.6-flash` in `api/chat/route.ts`) since
Gemini model availability changes over time — if you hit a "model not
found" error, check https://aistudio.google.com for currently available
model names and set `GEMINI_MODEL` in `.env.local` accordingly. To use a
different provider entirely (OpenAI, Anthropic, etc.), swap the model
import in `src/app/api/chat/route.ts` and install the matching
`@ai-sdk/*` package — the tool definition and UI don't need to change.

Failure and edge cases inventoried and handled for this flow:

| Case | Where it's handled | How |
|---|---|---|
| Network failure (tool fetch) | `fetch-meta-tags.ts` | 8s timeout, caught and returned as a typed error, not thrown |
| API error / rate limit (model call) | `api/chat/route.ts` | try/catch around `streamText`, returns a clean 500 with a message instead of crashing |
| Mid-stream failure | `page.tsx` | `useChat`'s `error` state renders a designed error card with a **working Retry** (`regenerate()`) and Dismiss (`clearError()`) |
| Empty input | `page.tsx` | Send button disabled while input is empty/whitespace-only; inline guidance text, not a blocking alert |
| Malformed request body | `api/chat/route.ts` | Caught JSON parse failure, returns 400 instead of crashing |
| No messages sent | `api/chat/route.ts` | Explicit check, returns 400 |
| First-run empty state | `page.tsx` | "No conversations yet" with a **click-to-fill example**, not a dead end |
| Slow / pending response | `tool-part-renderer.tsx` | `LinkPreviewSkeleton` sized to match the real card (no layout shift) instead of a generic spinner |
| Route-level render crash | `app/error.tsx` | Next.js error boundary with a "Try again" reset button |
| Tool-level failure | `link-preview-card.tsx` | Existing designed error card (from FE-07), not a crash |

### Testing by sabotage

To verify these, deliberately break things in this order:
1. Kill your network connection before sending a message → network failure
2. Kill the connection mid-stream (DevTools → Network → offline mid-request) → mid-stream failure + retry
3. Temporarily return a 429 from `api/chat/route.ts` to test the rate-limit copy
4. Try sending a broken/unreachable URL → tool-level designed error
5. Clear all messages and reload → first-run empty state
6. Try to send with an empty input box → button stays disabled

### Mobile / Safari

- Uses `100dvh` (dynamic viewport height) instead of `100vh` so the layout
  doesn't jump when Safari's address bar shows/hides
- Input bar respects `env(safe-area-inset-bottom)` for the home indicator
- Long text wraps (`break-words`) instead of overflowing horizontally

