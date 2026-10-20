# Accessibility & Performance Audit — FE-10

**Site audited:** [3D Hero Scene](https://my-first-3d-experience.vercel.app/)
**Author:** Gungun Sharma — BCA, AI Engineering Intern

## Before scores

Measured against `https://my-first-3d-experience-a6ft0fjrs.vercel.app/`
(Chrome DevTools Lighthouse, mobile preset):

| Metric | Score |
|---|---|
| Performance | 80 |
| Accessibility | 92 |
| Best Practices | 100 |
| SEO | 60 |

**WAVE errors found:** stale page title/description; theme-toggle only
reachable by pointer/touch (no keyboard equivalent); canvas has no
accessible name; heading hierarchy skips from h1 to h3.

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
- **Cut mobile render cost** — the first redeploy raised Accessibility
  and SEO but dropped Performance to 70 (below the 80 rubric minimum),
  because bloom/vignette postprocessing and a large particle count were
  running unconditionally, and the throttled mobile CPU Lighthouse
  emulates couldn't keep up. Fixed by: skipping the postprocessing pass
  entirely on narrow/touch viewports, capping `dpr` to 1 and disabling
  antialiasing on mobile, halving the particle count on mobile, and
  deferring the 3D chunk's mount via `requestIdleCallback` so it no
  longer competes with the initial paint for main-thread time.

## After scores

| Metric | Score |
|---|---|
| Performance | _re-run and fill in_ |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 100 |

**WAVE errors found:** 0 (all four issues above resolved)

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
