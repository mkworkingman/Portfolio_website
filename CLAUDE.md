# Project rules

Read this before making any changes.

## Styles

- Write all styles in **SCSS** (`src/styles/`). No plain CSS files, inline styles, or CSS-in-JS.
  - Exception: critical CSS may be inlined (e.g. a `<style>` block in `index.html`) when it's genuinely needed for first paint.
- New component partials go in `src/styles/components/_name.scss`, start with `@use '../tokens' as *;`, and get registered in `src/styles/index.scss`.
- **Every value comes from a design token** in `src/styles/tokens/` (see its `README.md`). `@use '../tokens' as *;` exposes them all. Stylelint rejects raw px, hex, named colors and `rgb()`/`hsl()` outside `tokens/`.
- **Sizes** (padding, margin, gap, width/height, offsets, etc.) use `space()`, which returns rem on a 4px grid:
  - `space()` = 0.25rem (4px), `space(2)` = 0.5rem, `space(4)` = 1rem, `space(0.5)` = 0.125rem
  - Do: `padding: space(2) space(4);`
  - Don't: `padding: 8px 16px;` or `padding: 0.5rem 1rem;`
  - Never change the root font size (no `html { font-size: 62.5% }`).
- **px only for hairlines**, and only through tokens: `$border-width`, `$border-width-accent`, `$focus-ring-width`, `$focus-ring-offset`.
- **Colors:** `color(surface)`, `color(text-inverse-muted)`, … These are semantic names that compile to CSS custom properties. Raw palette values stay private inside `tokens/_color.scss`.
- **Typography:** `font-size(lg)`, `font-weight(bold)`, `line-height(tight)`, `$font-family-sans`, `$measure`. Font sizes never use `space()`.
- **Other tokens:** `radius(sm)`, `shadow(header)`, `z(modal)`, `duration(slow)`, `ease(out)`.
- An unknown token name (e.g. `color(surfce)`) fails the build. Add a new token to the matching `tokens/` file instead of inlining a value.
- Use the breakpoint mixins (`@include md`, `lg`, `xl`; em-based) rather than raw media queries.

## Click handling

- **Every click interaction** uses event delegation through the single `document` click listener in `src/scripts/clickHandler.ts`.
- Never call `addEventListener('click', ...)` on individual elements, and never use inline `onclick`.
- To add a click action:
  1. Write a handler function inside `initClickHandler()`, with the signature `(match: HTMLElement) => void`.
  2. Add a `{ selector, fn }` entry to the `handlers` array.
- The selector is matched with `target.closest(selector)`, and the first matching entry wins, so order matters.
