# Project rules

Vanilla TypeScript + Vite single-page site (`index.html`, `src/scripts/`, `src/styles/`). No framework.
Path-scoped rules load from `.claude/rules/` (styles, scripts). Lint and hooks enforce them; a failing hook means fix the code, not the rule.

## Commands

- Dev server: `npm run dev` (http://localhost:5173). Production preview: `npm run build && npm run preview` (http://localhost:4173)
- Typecheck: `npm run typecheck`
- Tests: `npx vitest run`, or one file: `npx vitest run tests/index.test.ts`
- Lint one file: `npx eslint <file>` (TS + `index.html`), `npx stylelint <file.scss>`
- Everything (CI equivalent): `npm run validate && npm run build`
- Visual / a11y check in the browser: `/ui-check`. Perf: the `perf-auditor` agent. A11y review: the `a11y-reviewer` agent.

## Stack versions

Vite 8, Vitest 4 (jsdom), TypeScript 6, ESLint 10 (flat config, with `@html-eslint` for `index.html`), Stylelint 17, Sass (`sass-embedded`).
Look up config/APIs with context7 before writing them; don't rely on memory for these versions.

## Gotchas

- `vite.config.js` rewrites `index.html` at build time:
  - `<!-- i18n-reserve:key -->` and `<!-- i18n-group-ghosts -->` expand into invisible copies per language. The key must exist in `translations.ts` for every language in `LANGUAGES` (`values.ts`), or the build throws.
  - A CSP `<meta>` is added on **build only**: inline `<script>`/`<style>` blocks are hash-allowed, but `style="…"` and `on*="…"` attributes are blocked. A CSP problem shows up in `preview`, never in `dev`.
- `tests/index.test.ts` loads the raw `index.html` into jsdom, so markup changes can break tests.
- Every `<button>` outside the form needs `type="button"`.

## Reference docs

- `src/styles/tokens/README.md`: token API

## Open design decisions

- Hero visual: the canvas still orbits planets around a framework logo (TODO in `index.html`). Options: a live data-dense UI demo, or the `<MKalinin />` monogram at the centre with tech logos in orbit.
- Typeface: whether Montserrat stays. A replacement needs latin, latin-ext and Cyrillic (e.g. Onest, Golos Text, Commissioner); the subset/preload pipeline in `_base.scss` and `index.html` works for any face.
