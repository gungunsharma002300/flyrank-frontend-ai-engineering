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

Uses `gemini-2.0-flash` via `@ai-sdk/google` — chosen because Google's
free tier requires no billing setup. To use a different provider
(OpenAI, Anthropic, etc.), swap the model import in
`src/app/api/chat/route.ts` and install the matching `@ai-sdk/*`
package — the tool definition and UI don't need to change.
