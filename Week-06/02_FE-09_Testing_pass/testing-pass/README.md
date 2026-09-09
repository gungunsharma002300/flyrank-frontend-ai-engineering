# Testing Pass — FE-09

Assignment FE-09 · Frontend AI Engineering · Week 6

## What's in this repo

A tiny React app (Vite) with three pieces of UI, fully covered by tests:

- **`ChatWindow` / `ChatMessage`** — the chat message renderer, the highest-risk UI: it handles text, code, tool-call, and tool-result parts, plus `pending`, `streaming`, `complete`, and `error` message states.
- **`ToolResult`** — renders a tool's output (loading / success / error), nested inside chat messages.
- **`FeedbackForm`** — a validated form (required name, valid email, min-length message) with inline, accessible error messages.

The only place that talks to a real backend is `src/api/aiRoute.js` (`sendMessage`). Every test mocks that module — nothing in this suite makes a real network call.

## Run it yourself

```bash
npm install
npm run dev          # http://localhost:5173

npm run test         # Vitest — component tests
npm run test:e2e     # Playwright — end-to-end (builds + serves the app itself)
```

## Test suite (13 component tests, `tests/`)

| File | Covers |
|---|---|
| `ChatMessage.test.jsx` | text parts, `pending` state, `streaming` (aria-live), `error` + retry button, nested tool-call/tool-result |
| `ToolResult.test.jsx` | `loading`, `error`, `success` (renders every key/value) |
| `FeedbackForm.test.jsx` | all-fields-empty validation, malformed email, full valid submission |
| `ChatWindow.test.jsx` | mocked `sendMessage` success path, mocked rejection → error → retry → recovery |

All queries use `getByRole` / `getByLabelText` — nothing depends on a CSS class or test id, so a class rename can't break the suite.

**Local run, all green:**
```
✓ tests/ChatMessage.test.jsx (5 tests)
✓ tests/FeedbackForm.test.jsx (3 tests)
✓ tests/ChatWindow.test.jsx (2 tests)
✓ tests/ToolResult.test.jsx (3 tests)

Test Files  4 passed (4)
     Tests  13 passed (13)
```

## End-to-end test (`e2e/primary-flow.spec.js`)

Walks the primary flow — type a message, hit Send, see the assistant's reply — against a real built-and-served copy of the app (`playwright.config.js` starts `vite build && vite preview` automatically). The `/api/chat` call is intercepted with `page.route(...)`, so this test never depends on, or hits, a real backend either.

## CI (`.github/workflows/ci.yml`)

On every push and pull request: installs deps → runs Vitest → installs the Playwright browser → runs the e2e test. If either suite fails, the workflow fails.

**To make this actually block merges** (so a red suite can't be merged): in the GitHub repo go to **Settings → Branches → Branch protection rules**, add a rule for `main`, and check **"Require status checks to pass before merging"**, selecting the `test` job from this workflow.

## Deliverable note

Push this repo to GitHub, open the **Actions** tab after a push, and screenshot the green run — that's the "suite passing in CI" screenshot the assignment asks for. (Playwright's browser binary can't be downloaded from this sandbox's restricted network, so the e2e test could only be syntax/config-verified locally, not executed here — it will run for real in GitHub Actions, which has open network access.)
