# NOTES — scratch components vs shadcn/ui

I built a Modal, Tabs, and Disclosure from scratch, then installed
`shadcn/ui` (`npx shadcn@latest add dialog tabs`) and compared its
generated source (Radix UI under the hood) against my own. Concrete
gaps I found:

## 1. Focus trap robustness (Modal)

My scratch modal traps focus by manually querying focusable elements
and wrapping Tab/Shift+Tab at the first/last one. This works for the
common case but has edge cases I hadn't handled:

- It doesn't account for elements that become focusable/unfocusable
  dynamically after the initial query (e.g. content that changes while
  the modal is open).
- It doesn't handle `contenteditable` elements or custom widgets with
  roving `tabindex` correctly — my `FOCUSABLE_SELECTOR` only checks a
  fixed list of tags/attributes.

Radix's `Dialog` uses a dedicated `FocusScope` that tracks the DOM
live (via a `MutationObserver`) and handles these cases generically,
not just for a snapshot of focusable elements taken on open.

## 2. Portal rendering + scroll lock (Modal / Dialog)

shadcn's `DialogContent` renders through `DialogPrimitive.Portal`, so
the dialog markup is appended at the end of `document.body`, outside
the normal DOM hierarchy. This avoids z-index/stacking-context and
`overflow: hidden` clipping issues if the trigger is nested inside a
container with its own stacking context.

My scratch modal renders in place in the React tree. It happens to
work here because there's no ancestor with `overflow: hidden` or a
competing `z-index`, but it isn't guaranteed to work in every layout.
I did add a manual `document.body.style.overflow = "hidden"` for
scroll locking, which Radix also does, but Radix's version also
accounts for scrollbar-width compensation (to avoid layout shift when
the scrollbar disappears) — mine does not.

## 3. Tab activation mode (Tabs)

My scratch `Tabs` only implements "automatic activation" — moving
focus with the arrow keys also immediately activates the tab. The
ARIA APG pattern allows this, but also documents "manual activation"
(arrow keys move focus only; the tab is activated with Enter/Space)
as an acceptable alternative for panels that are expensive to render.
shadcn/Radix's `Tabs` supports both via an `activationMode` prop
(`"automatic"` default, `"manual"` optional) — my version has no way
to opt into manual mode without rewriting the keydown handler.

## 4. ID generation (Tabs / Dialog)

I used React's `useId()` for `aria-controls`/`aria-labelledby` pairs
in my scratch Tabs, which is correct and SSR-safe. Radix does the
same internally, but also lets consumers override IDs via `id` props
on individual primitives when they need stable, predictable IDs for
things like E2E test selectors — my components only expose one fixed
ID scheme with no override.

## Summary

Functionally, both versions pass the keyboard/ARIA requirements in
this assignment (roles, `aria-selected`, `aria-expanded`, Escape,
focus trap, focus return). The shadcn/Radix versions are more robust
around dynamic content, layout edge cases, and configurability —
things that only show up once a component is reused across a real
app rather than a single playground page.
