# Design tokens

Every style value comes from here. Components get all tokens through `@use '../vars' as *;`
(`_vars.scss` forwards this folder).

| File                | API                                                         | Unit      |
| ------------------- | ----------------------------------------------------------- | --------- |
| `_space.scss`       | `space($n)`: 4px grid                                       | rem       |
| `_breakpoints.scss` | `@include md` / `lg` / `xl` (48 / 64 / 90em)                | em        |
| `_border.scss`      | `$border-width`, `$border-width-accent`, `$focus-ring-width`, `$focus-ring-offset` | px (only place) |
| `_color.scss`       | `color(name)` → `var(--color-name)`                         | —         |
| `_typography.scss`  | `font-size()`, `font-weight()`, `line-height()`, `$font-family-sans`, `$measure` | rem / ch |
| `_radius.scss`      | `radius(sm \| md \| lg \| pill)`                            | rem       |
| `_shadow.scss`      | `shadow(header)`                                            | —         |
| `_z-index.scss`     | `z(behind \| raised \| header \| modal)`                    | —         |
| `_motion.scss`      | `duration(fast \| base \| slow)`, `ease(out \| in-out)`     | ms        |

## Rules

- **Units.** rem for anything that should follow the visitor's font-size setting, em for breakpoints,
  px only for hairlines (a 1px line should stay crisp, not become 1.25px).
- **Colors have two layers.** Primitives (`$-navy-800`, …) are private to `_color.scss`. Components
  only see semantic names (`surface`, `accent`, `text-inverse-muted`, …), which are emitted as CSS
  custom properties on `:root`. A theme overrides those properties in one block, and TS can read
  them with `getComputedStyle`.
- **Unknown names fail the build.** Every accessor goes through `token()` in `_functions.scss`,
  which raises `@error` listing the valid names.
- **Lint-enforced.** Stylelint rejects raw px, hex, named colors and color functions everywhere
  except this folder.
