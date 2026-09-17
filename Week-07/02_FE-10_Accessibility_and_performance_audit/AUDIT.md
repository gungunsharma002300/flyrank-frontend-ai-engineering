# Accessibility & Performance Audit — FE-10

**Site audited:** [3D Hero Scene](https://my-first-3d-experience.vercel.app/)
**Author:** Gungun Sharma — BCA, AI Engineering Intern

## Before scores

_Run Lighthouse (mobile preset) against the deployed URL and paste your
numbers + screenshot here:_

| Metric | Score |
|---|---|
| Performance | _fill in_ |
| Accessibility | _fill in_ |
| Best Practices | _fill in_ |
| SEO | _fill in_ |

**WAVE errors found:** _fill in count + list_

![Before Lighthouse screenshot](./before.png)

## Changes made

- **Fixed stale page title/description** — `<title>` and meta description
  still referenced an earlier "3D Product Configurator" version of the
  project; updated to accurately describe the current 3D hero scene.
- **Added a keyboard-operable theme control** — the "click the core to
  change color" interaction only worked via a pointer/touch click on the
  3D canvas, which is unreachable by keyboard and invisible to screen
  readers. Replaced the decorative hint text with a real `<button>` that
  does the same thing, is `Tab`-reachable, and has a descriptive
  `aria-label` ("Currently in {theme} mode. Activate to change the color
  theme.").
- **Gave the WebGL canvas an accessible description** — a `<canvas>`
  element is opaque to screen readers by default. Added
  `role="img"` and a live `aria-label` on the canvas wrapper describing
  the current scene, so assistive tech announces something meaningful
  instead of nothing.
- **Fixed heading hierarchy** — the page skipped from `<h1>` straight to
  `<h3>` (the interaction-guide cards), which breaks screen-reader
  heading navigation. Added a visually-hidden `<h2>` section heading
  ("How to interact with the scene") so the outline is `h1 → h2 → h3`.
- **Verified keyboard reachability** of every interactive element
  (theme button, "enable 3D" fallback button) and that focus outlines
  are visible (`:focus-visible` styles, nothing sets `outline: none`
  globally).
- **Reduced-motion path already existed** and was re-verified: visitors
  with `prefers-reduced-motion` get a static, non-animated card by
  default with an explicit opt-in to load the animated scene.

## After scores

_Re-run Lighthouse + WAVE after redeploying and paste the new numbers +
screenshot here:_

| Metric | Score |
|---|---|
| Performance | _fill in_ |
| Accessibility | _fill in_ |
| Best Practices | _fill in_ |
| SEO | _fill in_ |

**WAVE errors found:** _fill in_

![After Lighthouse screenshot](./after.png)

## What I'd still improve with more time

- Run a full screen-reader pass (NVDA/VoiceOver), not just automated
  tools — automated scanners catch maybe half of real accessibility
  issues.
- Add a visible, non-JS-dependent skip link if more page sections are
  added later.
- Profile the R3F chunk (~261 KB gzip) for further splitting if the
  Performance score needs more headroom on slower mobile connections —
  e.g. deferring `@react-three/postprocessing` behind a `requestIdleCallback`
  so first paint doesn't wait on it.
