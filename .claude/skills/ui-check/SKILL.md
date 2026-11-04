---
name: ui-check
description: Look at the real built site in Chrome after a visual or markup change. Takes screenshots at mobile/tablet/desktop widths in every language, reads console and CSP errors, and runs axe. Use after changing index.html, SCSS, or UI scripts, or when asked to check how something looks.
argument-hint: "[what changed / what to focus on]"
---

Focus: $ARGUMENTS

1. **Serve the production build.** CSP and the i18n build plugins only exist in the build, so don't use the dev server.
   - Run `npm run build`, then start `npm run preview -- --port 4173 --strictPort` with `run_in_background`.
   - Wait until http://localhost:4173 responds.
2. **Browser.** Load the claude-in-chrome skill and open a new tab at http://localhost:4173.
   - Resize to **375×812**, **768×1024** and **1440×900**. At each size, screenshot the area affected by the change (full page if unsure).
   - Switch language through the UI (EN → RU → SR) and confirm nothing shifts or overflows, especially near the focus area.
   - Read console messages and filter for `error|Refused|CSP|Uncaught`. Any CSP violation is a bug.
   - When the change involves motion or the canvas, check the `prefers-reduced-motion` behaviour (emulate it, or read the code path in `solarSystem.ts`).
   - For interactive changes, do a quick keyboard pass: Tab through the affected controls, check that focus is visible, and that Escape closes the modal.
3. **axe:** `npx @axe-core/cli http://localhost:4173 --exit`. Report any violations with their selectors.
4. **Report.** Include the screenshots as evidence, list issues with file:line where you can map them, and state plainly what wasn't checked.
5. Stop the preview server when done.

Don't edit code during this skill unless the user asked for fixes. Report first.
