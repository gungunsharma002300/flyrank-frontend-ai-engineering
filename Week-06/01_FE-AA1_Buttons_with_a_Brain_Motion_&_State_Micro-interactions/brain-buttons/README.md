# Buttons with a Brain — Motion & State Micro-interactions

Assignment FE-AA1 · Frontend AI Engineering · Week 6

## What this is

One reusable button component with a full lifecycle — **idle → hover/focus → loading → success/error → back to idle** — implemented twice ("Send message" for a chat, "Save" for an editor) to prove it's a shared system, not a one-off animation. Plain HTML/CSS/JS, no build step, no dependencies.

## How to run it

Open `index.html` directly in any browser. That's it — no server, no npm install.

## What it does

- Click **Send message** or **Save** to fire a fake async call (random 600–1450ms delay).
- By default the outcome is random with a 20% failure rate, matching the brief's example. Use the **Force outcome** chips to pin it to always-succeed or always-fail while testing.
- **Disable buttons** shows the bonus disabled state.
- **Simulate reduced motion** applies the same rules the site already respects automatically via the `prefers-reduced-motion` media query, so you can preview it without changing your OS setting.

## States implemented

`idle` · `hover/focus` · `active (pressed)` · `loading` · `success` · `error` · `disabled` (bonus)

## Duration & easing notes

- **Content swap** (idle ↔ loading ↔ success ↔ error): 200ms, `cubic-bezier(0.4, 0, 0.2, 1)`. A quick, decisive ease-out — states shouldn't linger mid-fade, since the button should always read as clearly *being* something or *becoming* the next thing.
- **Width reflow**: 260ms on the same curve, measured with a FLIP (measure old width → apply new content → measure natural new width → animate between them) so the pill resizes to fit new labels without ever clipping text.
- **Loading spinner**: 800ms linear, infinite. Linear, deliberately not eased — an eased spinner reads as slowing down, which contradicts "still working."
- **Success checkmark**: a 260ms stroke-draw (`stroke-dashoffset`) on `cubic-bezier(0.65, 0, 0.35, 1)`, so the mark looks drawn rather than switched on. Replayed from scratch on every success, not just the first.
- **Error shake**: 380ms, four-keyframe horizontal displacement, then settles — short and physical, like a door that won't open.
- **Reduced motion**: every transition above collapses to a 90ms opacity crossfade. The spinner stops rotating and becomes a static dimmed dot; the shake is dropped entirely; the width still resizes but without an animated tween. The *state itself* — icon, label, and color — always still changes, so no feedback is ever lost, only the choreography around it.

## Interruption handling

Clicking mid-transition (e.g. spam-clicking, or clicking again while a request is already loading) is a no-op — the button ignores it rather than stacking a second request or corrupting the visible state. Each click is tagged with a run id; if a click supersedes an in-flight one, the stale timer's callback is dropped silently instead of finishing into a state the user didn't ask for anymore. Hovering during a transition is handled by CSS alone and never touches layout, so it can't desync the animation either.

## Accessibility

- Real `<button>` elements throughout — full keyboard operability (Tab, Enter, Space) for free.
- A visible two-layer focus ring (`:focus-visible`) on every interactive element, including the demo's toggle chips and switches.
- `aria-label` is updated per state ("Working", "Done", "Failed, retry") so screen reader users get the same status a sighted user gets from the icon/color change.
- Animated properties are `transform`, `opacity`, and `stroke-dashoffset` — compositor-friendly, no layout thrash on every frame. The one intentional width change per transition is a single, deliberate reflow, not a per-frame one.

## Optional flex

Both buttons (`#send-btn`, `#save-btn`) run through the exact same `setButtonState()` / FLIP / shake / draw logic in `script.js` — same durations, same easing, same interruption handling — which is the proof this is a system rather than two hand-tuned one-offs.
