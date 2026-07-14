# AI Workflow Comparison

## Introduction

This document compares two prompting approaches used to build the Settings feature with an AI coding
assistant. The goal is to show how prompt precision changes the quality, correctness, and reviewability
of the generated code, and to record one real mistake the AI made along the way.

## Feature Selected

The **Settings Form**: full name, email, preferred language, dark mode toggle, and a save action, with
inline validation and a success notification.

## Round 1 – Vague Prompt

**Prompt used:**
> "Make a settings page in React with name, email, language, dark mode, and a save button."

**Generated output:** A single `Settings.jsx` file with plain `<input>` elements, a hardcoded `<select>`,
a checkbox for dark mode, and a `console.log` on submit. No validation, no error states, minimal styling,
and no component decomposition.

**Shortcomings identified:**
- No validation of any kind — empty or malformed input submitted silently.
- Inputs had no associated `<label>` elements, only placeholder text.
- No keyboard or screen-reader consideration; the "toggle" was a bare checkbox with no visible state.
- Everything lived in one file, so nothing was reusable.
- No responsive behavior — the layout broke below ~500px.
- No success feedback after saving.

## Round 2 – Precise Prompt

**Prompt used:** A fully specified brief naming the tech stack (React 19, Vite, Tailwind, JavaScript),
exact features, required validation rules (required fields, email format), accessibility requirements
(label association, keyboard navigation, visible focus, semantic HTML, ARIA only where needed),
responsive breakpoints, an explicit component structure (`InputField`, `Toggle`, `Button`,
`SettingsForm`), and a defined visual direction (glassmorphism SaaS card).

**Improvements:** Four focused, reusable components instead of one monolith. Real validation with
inline, `role="alert"` error messages tied to inputs via `aria-describedby`. A custom `Toggle` built on
`role="switch"` with `aria-checked`, fully keyboard-operable. A live-region success message after save.
Mobile-first Tailwind classes scaling up through `sm:`. Dark mode implemented as real theme state, not a
cosmetic checkbox.

## Comparison

| Criterion | Round 1 | Round 2 |
|---|---|---|
| Correctness | Submits invalid data | Blocks save until valid |
| Validation | None | Required + email format, inline |
| Accessibility | Placeholder-only labels | Labeled, `aria-*`, focus-visible |
| Responsive Design | Breaks on mobile | Mobile-first, tested at 3 widths |
| Code Structure | One file | 4 focused components |
| Reusability | None | `InputField`/`Toggle`/`Button` shared |
| Edge Cases | Unhandled | Empty, malformed, re-submit handled |
| Maintainability | Low | High — clear file boundaries |
| Review Effort | High (rewrite needed) | Low (spot-check and merge) |

## AI Mistake & Correction

While building Round 2, the AI's first draft of `InputField` validated the email field's *format* but
left the `aria-describedby` link pointing at an id that didn't match the rendered error paragraph, and
omitted `aria-invalid` entirely. Visually the error text appeared correctly, so it was easy to miss.

**Why it was wrong:** a screen reader user tabbing into the email field would hear only the field's
label, not the error, because the description reference was broken — the exact kind of bug that passes a
quick visual review but fails a real accessibility audit.

**How it was corrected:** the `id`/`aria-describedby` pair was aligned to a single `errorId` constant
derived from the field's `id`, and `aria-invalid={hasError}` was added so assistive tech announces the
invalid state, not just the message.

**Why verification is necessary:** AI-generated code frequently *looks* correct while quietly missing
the wiring that makes it correct — mismatched ids, absent `aria-*` attributes, or validation that runs
but is never connected to the render output. Manual review, specifically keyboard-only and screen-reader
testing, is what catches these gaps before they reach production.
