# FE-11 — Production Deployment and README

A production-oriented Next.js AI chat demo. It demonstrates server-side provider credentials, request validation, distributed rate limiting, bounded streaming, responsive UI, and deployment documentation.

> **Important:** This is a standalone reference implementation, not a modification of your existing internship repository. Replace or merge it into the assigned project only after comparing its stack and existing features. A successful grade cannot be guaranteed by a ZIP alone; the production URL must be deployed and verified.

## Features

- Responsive chat UI with loading, error, and empty states.
- OpenAI API key remains server-side; it is never exposed through `NEXT_PUBLIC_*`.
- Upstash Redis sliding-window rate limit: 10 requests per IP per minute.
- Request body limit (24 KB), maximum 12 messages, and 4,000 characters per message.
- Streaming response route with a 30-second Vercel function duration setting and provider timeout.
- Generic client-facing errors to avoid leaking provider internals.
- Security headers, environment-variable example, and cross-browser test checklist.

## Requirements

- Node.js 20 or newer
- npm
- An OpenAI API key with API access and billing enabled
- An Upstash Redis database (REST URL and token)
- A Vercel account for production deployment

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env.local`.

3. Add `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` to `.env.local`. Optionally set `OPENAI_MODEL`; the default is `gpt-4o-mini`. Never commit `.env.local`.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000.

## Environment variables

| Name | Required | Purpose | Where to configure |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes | Authenticates server-side AI requests | Local `.env.local`; Vercel project environment |
| `OPENAI_MODEL` | No | Model name; defaults to `gpt-4o-mini` | Local/Vercel |
| `UPSTASH_REDIS_REST_URL` | Yes | Upstash Redis REST endpoint used by rate limiter | Local/Vercel |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Secret token for Upstash Redis | Local/Vercel |

All variables must be set for the **Production** environment in Vercel, and Preview/Development too if those environments are used. Redeploy after changing environment variables.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, select **Add New → Project**, import the repository, and keep the detected Next.js framework settings.
3. In project **Settings → Environment Variables**, add the variables listed above for Production. Do not paste secrets into source code or README.
4. Deploy. Wait for the build to finish, then open the assigned production domain.
5. Test a normal prompt, an empty prompt, a very long prompt, and repeated requests. Confirm the browser Network tab shows the `/api/chat` request and that no provider key is exposed.
6. Save the public production URL in your submission. Do not submit a preview URL unless the assignment explicitly accepts it.
7. For a rollback, open Vercel **Deployments**, choose the last known-good deployment, and select **Promote to Production** (the exact label may vary by dashboard version).

## Architecture overview

```text
Browser (Next.js UI)
  └── POST /api/chat
       ├── Validate request size and message schema
       ├── Check Upstash Redis rate limit (10/minute/IP)
       ├── Call OpenAI from the server using OPENAI_API_KEY
       └── Stream text back to browser
```

The browser never receives the OpenAI key. Rate limiting uses Upstash so it works across serverless instances; the route fails closed with HTTP 503 if rate-limiting configuration is missing. The IP-based limit is a baseline control, not a complete identity system; production applications may also require authentication, spend limits, abuse monitoring, and stronger proxy/IP handling.

## Production safeguards and known limitations

- **Rate limiting:** 10 requests per minute per IP through Upstash Redis. Shared IPs can share a quota; an authenticated per-user quota may be preferable for a larger product.
- **Input caps:** Maximum request body 24 KB, 12 messages, and 4,000 characters per message.
- **Streaming:** `maxDuration = 30`; OpenAI client timeout is 25 seconds. Confirm limits against the Vercel plan and current platform settings.
- **Error handling:** Client receives generic error messages. Server-side provider details are not returned.
- **Secrets:** API credentials are server-only and excluded from Git.
- **Headers:** Adds `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and a restrictive `Permissions-Policy`.
- **Not included:** Authentication, persistent chat history, billing quotas, automated browser tests, and a custom domain. Add these if required by the actual product or evaluator.

## Verification checklist

Run:

```bash
npm run build
npm run lint
```

Then verify manually:

- [ ] Production URL opens without login or build errors.
- [ ] A valid prompt returns streamed AI text.
- [ ] Empty input cannot be submitted from the UI.
- [ ] Invalid JSON / wrong schema returns HTTP 400.
- [ ] Oversized payload returns HTTP 413.
- [ ] Repeated requests return HTTP 429 after the configured limit.
- [ ] Missing production secrets do not expose stack traces or provider details.
- [ ] Mobile layout works at narrow viewport widths.
- [ ] Keyboard focus is visible and the chat region announces updates.
- [ ] No API key appears in client source, browser storage, or Git history.

### Cross-browser test matrix

| Browser/device | Test | Result |
|---|---|---|
| Chrome desktop | Chat, streaming, errors, responsive layout | To be tested |
| Firefox desktop | Chat, streaming, keyboard navigation | To be tested |
| Safari macOS | Chat, streaming, layout | To be tested |
| Safari iOS | Mobile layout, keyboard, textarea, streaming | To be tested |
| Chrome Android | Mobile layout and streaming | To be tested |

Do not mark a browser as passed until it has actually been tested. Attach screenshots of the deployed application and relevant tests before submission.

## Design and implementation decisions

- Used a Next.js App Router route so provider credentials stay server-side.
- Used Upstash Redis rather than in-memory rate limiting because serverless instances do not share reliable in-memory state.
- Bounded message count, text size, provider timeout, and response token count to reduce accidental cost and abuse.
- Kept the interface responsive and included reduced-motion and keyboard-focus support.
- Used generic error responses to avoid leaking internal provider details.

## How AI tools were used

This starter was prepared with AI assistance. AI was used to draft the initial UI, route validation, rate-limiting integration, deployment notes, and README structure. A developer must still inspect the code, run the build and tests, verify current provider/platform settings, test browsers, and confirm deployment behavior before claiming production readiness. Do not claim checks passed until you have run them.

## Screenshots

Add real screenshots from your deployed application here before submitting:

- `docs/screenshots/desktop.png`
- `docs/screenshots/mobile.png`

Do not use the assignment page screenshot as evidence of the running application.

## Submission

- **Production URL:** _Add your deployed Vercel URL after deployment._
- **Repository URL:** _Add your GitHub repository URL._
- **README:** This file.
- **Evidence:** Add desktop/mobile screenshots and actual test results.
