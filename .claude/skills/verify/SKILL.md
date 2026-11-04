---
name: verify
description: Fast pre-commit gate for this project. Runs typecheck, ESLint (TS + index.html), Stylelint, Vitest and a production build, and reports the results. Use before committing or when asked to verify changes. Does not open a browser; use /ui-check for that.
allowed-tools: Bash(npm run validate), Bash(npm run typecheck), Bash(npm run build), Bash(npx vitest run *)
---

Run these from the project root, in order, and stop at the first failure:

1. `npm run typecheck`
2. `npm run validate` (ESLint + Stylelint in parallel, then Vitest)
3. `npm run build` (this also runs the i18n-reserve, i18n-group and CSP plugins, so it catches missing translation keys)

Report each command with pass/fail. On failure, show only the relevant error lines, fix the cause (never relax a lint rule or edit a test just to make it pass), and rerun from the failing step.

If the change touched `index.html`, `src/styles/**` or anything visual, say that `/ui-check` should run before committing.
