# 3D Hero Scene — FlyRank Internship (FE-AA2)

An animated, full-viewport 3D hero built with **React Three Fiber** — the
"3D hero scene for a landing page / portfolio" direction from the
assignment brief.

**Author:** Gungun Sharma — BCA, AI Engineering Intern

## What I built

A distorted, glowing core floats center-stage and responds to the visitor
in three distinct ways:

- **Pointer parallax** — the whole scene tilts gently toward the cursor
  (or a finger, on touch devices), giving it depth without needing
  `OrbitControls`.
- **Click to change mood** — clicking the core cycles through four
  curated color themes (Nebula → Aurora → Ember → Rosé), with the color,
  ambient light and background glow all cross-fading smoothly.
- **Scroll-reactive** — scrolling pulls the camera back and turns up the
  core's surface distortion, so the hero visibly "reacts" as you move
  down the page rather than sitting static behind the text.

Below the hero, a short "how to interact" guide spells out the three
gestures explicitly, followed by a scroll-revealed notes card explaining
the performance choices.

## Why this direction

Of the five options in the brief, a hero scene is the one where the 3D
*is* the first impression rather than a utility panel someone has to dig
into — it reads as a polished landing page rather than a dev tool, while
still satisfying every technical requirement (real 3D scene, a real
interaction beyond orbiting, responsible loading, mobile support).

## Ships responsibly

- The three.js / R3F / postprocessing stack is `React.lazy`-imported
  into its own chunk (code-split from the app shell), so the main bundle
  never pays for it.
- The core shape is **procedural geometry** (`icosahedronGeometry` +
  `MeshDistortMaterial`) — zero network request, zero decode time.
- `prefers-reduced-motion` and low-core-count devices get a **static
  fallback card** instead of an auto-started WebGL scene, with an
  explicit "enable it anyway" opt-in.
- `dpr` capped at 1.5x, postprocessing runs without multisampling, and
  the particle field (`<Sparkles>`) is capped at 90 points — all tuned
  to stay smooth on mid-range laptops and phones.
- Pointer/scroll listeners are rAF-throttled; nothing runs on every
  native scroll/mousemove event tick.

## Works on mobile

Pointer parallax and the click-to-change interaction both work
identically with touch — there's no drag-to-orbit gesture competing with
the page's own scroll, so nothing feels janky on a phone.

## Stack

React 19 · Vite · `@react-three/fiber` · `@react-three/drei` ·
`@react-three/postprocessing` · `three.js`

## Run it locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

## Deploy (Vercel — recommended, zero config)

```bash
npm install -g vercel   # if you don't have it
vercel                  # from inside this project folder, follow the prompts
```

Or without the CLI: push this folder to a GitHub repo, go to
[vercel.com/new](https://vercel.com/new), import the repo — Vercel
auto-detects Vite (`npm run build`, output dir `dist`). Netlify works the
same way (build command `npm run build`, publish directory `dist`).

## Perf note

- Production build splits into two chunks: the app shell (~199 KB /
  ~63 KB gzip) and the R3F/postprocessing chunk (~986 KB / ~261 KB
  gzip). The heavy chunk is requested immediately since the hero is the
  first thing on the page, but it's still isolated from the app shell
  so React/routing code never waits on three.js to parse.
- The core adds **0 bytes** of asset weight — no textures, no imported
  model, everything is generated geometry and a procedural distort
  shader.
- What I'd tune further with more time: swap the single `Bloom` +
  `Vignette` pass for a cheaper hand-rolled glow sprite on very low-end
  GPUs (detected via `navigator.hardwareConcurrency` or a quick FPS
  probe), and lazy-mount the hero itself behind an `IntersectionObserver`
  the way I did in an earlier version of this project, for pages where
  the hero isn't the very first thing in the viewport (e.g. embedded
  further down a page).

## What I'd add with more time

- A subtle audio-reactive option (Web Audio API) so the distortion
  pulses with ambient sound, fully optional and off by default.
- Swap the theme cycle for a full color picker, with the four curated
  themes kept as quick presets.
- A "share this mood" URL param so a specific theme can be linked
  directly.

## Optional flex

`HeroScene.jsx`, `SceneRig.jsx`, `HeroBlob.jsx` and `OrbitRings.jsx` are
self-contained and drop cleanly into a portfolio or landing page capstone
with only the `THEMES` palette needing a re-skin.
