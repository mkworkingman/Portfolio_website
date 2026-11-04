---
paths:
  - "src/scripts/**"
  - "index.html"
  - "tests/**"
---

# Scripts and markup

## Click handling

- **Every click interaction** uses event delegation through the single `document` click listener in `src/scripts/clickHandler.ts`.
- Never call `addEventListener('click', ...)` on individual elements, and never use inline `onclick`. (ESLint enforces both.)
- To add a click action:
  1. Write a handler function inside `initClickHandler()`, with the signature `(match: HTMLElement) => void`.
  2. Add a `{ selector, fn }` entry to the `handlers` array.
- The selector is matched with `target.closest(selector)`, and the first matching entry wins, so order matters.

## Text and i18n

- User-facing text lives in `src/scripts/translations.ts` for **every** language in `LANGUAGES` (`values.ts`). In markup, use `data-i18n="key"` (text) or `data-i18n-label="key"` (aria-label). Don't hard-code English in TS.
- When adding or removing a key, update `translations.ts`, `values.ts` and `index.html` together. `tests/index.test.ts` checks they agree.
