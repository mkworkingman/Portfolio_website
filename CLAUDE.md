# Project rules

Read this before making any changes.

## Styles

- Write all styles in **SCSS** (`src/styles/`). No plain CSS files, inline styles, or CSS-in-JS.
  - Exception: critical CSS may be inlined (e.g. a `<style>` block in `index.html`) when it's genuinely needed for first paint.
- New component partials go in `src/styles/components/_name.scss`, start with `@use '../vars' as *;`, and get registered in `src/styles/index.scss`.
- **All sizes** (padding, margin, gap, width/height, offsets, etc.) use the `space()` function from `src/styles/_vars.scss`:
  - `space()` = 4px, `space(2)` = 8px, `space(4)` = 16px, `space(0.5)` = 2px
  - Do: `padding: space(2) space(4);`
  - Don't: `padding: 8px 16px;`
- Use the breakpoint mixins from `_vars.scss` (`@include md`, `lg`, `xl`) rather than raw media queries.

## Click handling

- **Every click interaction** uses event delegation through the single `document` click listener in `src/scripts/clickHandler.ts`.
- Never call `addEventListener('click', ...)` on individual elements, and never use inline `onclick`.
- To add a click action:
  1. Write a handler function inside `initClickHandler()`, with the signature `(match: HTMLElement) => void`.
  2. Add a `{ selector, fn }` entry to the `handlers` array.
- The selector is matched with `target.closest(selector)`, and the first matching entry wins, so order matters.
