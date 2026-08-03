# Settings Form — FlyRank FE-03

A modern, accessible account Settings page built with React 19, Vite, and Tailwind CSS, delivered as part
of the FlyRank Frontend AI Engineering Internship Assignment (FE-03).

![status](https://img.shields.io/badge/status-complete-2ea44f)
![stack](https://img.shields.io/badge/stack-React%2019%20%7C%20Vite%20%7C%20Tailwind-6552f5)

## Project Overview

The app renders a single Settings form covering profile and appearance preferences: full name, email
address, preferred language, and dark mode, with client-side validation, inline error messaging, and a
success notification on save. It's built as a small set of focused, reusable components rather than one
monolithic form, so new fields or actions can be added without duplicating markup.

## Features

- Full Name field
- Email Address field
- Preferred Language dropdown
- Dark Mode toggle (drives a real `class`-based theme, not a cosmetic switch)
- Save Settings button with a loading and success state
- Inline validation with field-level error messages
- Accessible by default: labeled inputs, keyboard support, visible focus rings, semantic HTML

## Tech Stack

| Layer | Choice |
|---|---|
| UI Library | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Language | JavaScript (no TypeScript) |
| Routing/Framework | None (no Next.js — plain SPA) |

## Installation

```bash
npm install
npm run dev
```

The dev server starts on `http://localhost:5173` and opens automatically.

Other available scripts:

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build locally
npm run lint      # run ESLint across the project
```

## Folder Structure

```
project/
├── README.md
├── WORKFLOW.md
├── CLAUDE.md
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── public/
│   └── favicon.svg
└── src/
    ├── components/
    │   ├── SettingsForm.jsx
    │   ├── InputField.jsx
    │   ├── Toggle.jsx
    │   └── Button.jsx
    ├── styles/
    │   └── main.css
    ├── App.jsx
    └── main.jsx
```

## Validation

| Field | Rule |
|---|---|
| Full Name | Required, minimum 2 characters |
| Email | Required, must match a valid email pattern |

- Errors appear inline beneath the relevant field the moment it's blurred (or on submit).
- The form will not save while any required field is invalid.
- A success notification appears after a valid save.

## Accessibility

- Every input has a real `<label htmlFor>` bound to its `id` — no placeholder-only labeling.
- The dark mode control is a `role="switch"` button with `aria-checked`, fully operable by keyboard
  (`Tab` + `Enter`/`Space`).
- Invalid fields set `aria-invalid` and are described by an `aria-describedby` error message rendered
  with `role="alert"`.
- Focus is always visible (`focus-visible` ring) and never removed with `outline: none` alone.
- Semantic elements (`form`, `fieldset`, `legend`, `label`, `select`, `button`) are used before any ARIA
  attribute is added.

## Responsive Design

Built mobile-first with Tailwind's default breakpoints:

- **Mobile (< 640px):** single-column stacked layout, full-width controls.
- **Tablet (`sm:` and up):** header and status text align horizontally, form retains a comfortable
  max width.
- **Desktop (`sm:`+ centered container):** the card is capped at `max-w-2xl` and centered, so it stays
  readable rather than stretching edge-to-edge.

## Learning Outcomes

- Structuring an AI-assisted feature build around small, single-responsibility components.
- Writing validation logic that's both testable and correctly wired into ARIA attributes.
- Comparing a vague prompt against a fully specified one and measuring the concrete difference in output
  quality (see `WORKFLOW.md`).
- Practicing the discipline of verifying AI-generated code rather than accepting it on sight.

## Git Branches

| Branch | Purpose |
|---|---|
| `main` | Stable, reviewed, deployable code |
| `feature/settings-form` | Development of the Settings form and its components |
| `docs/workflow-writeup` | README, WORKFLOW.md, and CLAUDE.md authoring |

## Future Improvements

- Persist settings to a backend/API instead of the current simulated save.
- Add a password/security section as a second settings tab.
- Add unit tests (Vitest + React Testing Library) for validation logic and component behavior.
- Add optimistic UI and offline-aware save queuing.
- Internationalize the UI copy itself once a language is selected, not just store the preference.
