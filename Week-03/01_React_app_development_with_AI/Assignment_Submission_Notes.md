# React App Development with AI — Submission Notes

## App: Habitat (Habit Streak Tracker with Visual Garden)

A React app where each habit is represented by a plant that grows through
six stages (Seed → Sprout → Sapling → Young Tree → Blooming → Flourishing)
based on the user's daily streak.

---

## Prompts used during development

1. "isme kya krna h" — asked what the assignment required
2. "tum complete bana skte ho" — asked if AI could help build the full app
3. Asked for app ideas, then picked between suggestions ("koi best aur unique", "sbse best h")
4. "ek hi bar me final aur workng with premium animations krke cojmplte do 100%" —
   requested a complete, polished, single-pass build with premium animations
5. "run kese kru" — asked how to run the React app locally
6. "command do" — asked for exact terminal commands
7. Reported terminal errors and screenshots when `npm install`/`npm start`
   were run in the wrong folder (nested `habitat-app` directory issue)
8. "tum mujhe direct complete zip do 100%" — asked for a ready-to-run
   zipped project instead of a single file
9. Reported a build error: `Identifier 'Leaf' has already been declared`
   and asked for a fix
10. "assignment ki requirement complete ho gyi?" — asked to verify against
    the assignment checklist

## How AI assisted

AI (Claude) was used as the primary development assistant for this project.
It suggested the app concept (habit tracker with a growing-plant metaphor),
generated the full React component — including the growth-stage logic,
custom SVG plant illustrations, animation keyframes, and layout — and set
up the supporting project files (`package.json`, `index.js`, `index.html`)
needed to run it locally. When the app failed to compile due to a naming
conflict between an imported icon and a locally defined component (both
named `Leaf`), AI diagnosed the exact error from the terminal output and
corrected it. AI also walked through the terminal commands and folder
navigation needed to install dependencies and start the dev server,
troubleshooting a nested-folder issue that came up during extraction.

## What I did

- Reviewed the generated code and ran it locally
- Debugged folder/path issues in the terminal myself based on AI's guidance
- Reviewed the `EMOJI_OPTIONS` array in `App.js` and manually added two new
  emoji options — ✍🏻 (writing) and 🎤 (microphone/speaking) — to cover more
  habit types like journaling and public speaking practice that weren't in
  the AI-generated default set
