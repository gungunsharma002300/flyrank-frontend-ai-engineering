# FE-06 — StreamMate Streaming AI Chat

## Final setup

The default UI uses **Gemini 2.5 Flash** through the AI SDK. Google currently lists Gemini API free-tier input/output for eligible models, including Gemini 2.5 Flash, so this is the recommended ₹0 setup for a student demo, subject to Google's current free-tier limits.

The original **Claude + `streamText`** implementation is preserved separately at `/api/chat` so the FE-06 requirement is not removed.

## 1. Install

```bash
npm install
```

## 2. Create a free Gemini API key

Open Google AI Studio, create/view an API key, and copy it. Do not put the key in client-side code or commit it to GitHub.

Create a local `.env.local` file in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=YOUR_GEMINI_KEY
```

The AI SDK Google provider reads this environment variable server-side.

## 3. Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## 4. Features

- Real Gemini AI responses
- Token/chunk streaming with `streamText`
- Stop generation
- Multi-turn conversation
- LocalStorage persistence
- Auto-scroll and Jump to latest
- Responsive dark UI
- Assignment-required Claude route preserved

## Claude mode

The original Claude route is `/api/chat` and uses `@ai-sdk/anthropic` + `streamText`. It requires `ANTHROPIC_API_KEY` and Anthropic API credits. The default frontend intentionally uses `/api/chat-free` so the project can be demonstrated without paying Anthropic.

## Vercel

In Vercel Project Settings → Environment Variables, add:

`GOOGLE_GENERATIVE_AI_API_KEY`

Then redeploy. Keep the key server-side and never commit `.env.local`.
