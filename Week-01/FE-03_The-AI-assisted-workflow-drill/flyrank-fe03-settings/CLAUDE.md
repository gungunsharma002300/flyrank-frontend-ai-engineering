# CLAUDE.md — Project Rules

These are the standing rules for any AI-assisted work on this repository. They exist to keep AI-generated
contributions consistent, accessible, and reviewable by a human engineer without a rewrite.

1. **Every form input must have a label.** No placeholder-only inputs. Use `<label htmlFor>` bound to a
   matching `id`, even for controls that are visually self-explanatory.

2. **Validate all user inputs.** Required fields must be checked for presence; typed fields (email, etc.)
   must be checked for format. Validation errors are shown inline, next to the field they belong to, and
   are announced via `role="alert"` or an equivalent live region.

3. **Prefer reusable components.** If a UI pattern appears twice, it belongs in `src/components/`, not
   copy-pasted. `InputField`, `Toggle`, and `Button` exist so new fields and actions are additions, not
   rewrites.

4. **Mobile-first development.** Write the unprefixed (mobile) styles first, then layer `sm:` / `md:` /
   `lg:` breakpoints on top. Never design for desktop and shrink down.

5. **Avoid duplicated UI.** Don't hand-roll a second button, input, or switch style inline. Extend the
   shared component with a prop instead of forking markup.

6. **Semantic HTML first.** Use `<form>`, `<fieldset>`, `<legend>`, `<label>`, `<button>`, and native
   `<select>` before reaching for a `<div>` with ARIA bolted on. ARIA supplements semantics; it doesn't
   replace them.

7. **Accessibility before styling.** A component should be usable with a keyboard and a screen reader
   before it gets a single Tailwind utility class. Visual polish never ships at the cost of a missing
   label, a broken focus order, or an unannounced error.

8. **Small, focused components.** A component does one job. If a file is doing form state, validation,
   and layout all at once, split it. `SettingsForm` orchestrates; `InputField`, `Toggle`, and `Button`
   render.
