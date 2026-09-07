# Design Review

Review of the portfolio site against the `frontend-design` skill
(`frontend-design@claude-plugins-official`). Reviewed from source: `index.html`,
`src/styles/**`, `src/scripts/**`.

**Summary:** structure and engineering are careful — font subsetting with
`unicode-range`, `inert` on siblings while the modal is open, the canvas pausing
via `IntersectionObserver` and freezing under `prefers-reduced-motion`. What is
missing is a design system: no palette, no type scale, no layout container.
Every color is a one-off decided at the moment it was needed. This document is
about making those choices deliberately before the defaults make them.

---

## Priority order

1. [ ] Palette as tokens — touching six files today, only gets more expensive
2. [ ] Type scale + measure cap — ~30 lines, stops the unstyled sections looking unstyled
3. [ ] Kill "Hello, I am" and decide the hero direction
4. [ ] Resolve the i18n promise (translate body content, or ship EN-only)

Items 1 and 2 are mechanical and independent of the hero decision.

---

## 1. The hero

Currently a text block — "Hello, I am / Maksim Kalinin / Senior
Fullstack/Frontend Developer" — beside a dark square canvas.

### "Hello, I am" has to go

The most templated opening in this genre. It spends the most valuable line on
the page saying nothing. Lead with the claim.

### The canvas has a mixed metaphor

Six planets in literal solar-system colors (`#b8b0a8` Mercury, `#e0a86a` Venus,
`#4f8fd8` Earth, `#c05a3a` Mars) orbiting a crossfading React/Vue logo — a solar
system with a JavaScript framework as its sun. The existing TODO ("swap the
planets for technology logos") resolves this, but the direction is worth
pushing harder.

The differentiator, per the About copy, is **data-intensive UIs: large tables,
real-time WebSocket/SSE data, complex state**. Far more specific than "I know
React."

Options, in order of strength:

1. **Live data-intensive UI as the hero** — a table streaming rows, sorting and
   virtualizing in front of the viewer. Demonstrates the specialty instead of
   describing it. Highest effort, genuinely distinctive.
2. **Keep the orbit, change what it means** — `<MKalinin />` monogram at the
   center, tech logos in orbit. Coherent metaphor, and the center becomes *you*
   rather than React. Note an orbiting logo ring is itself a mild trope: a clear
   improvement on the greeting, not a knockout.

Either way, the canvas should stop being a pasted `#05060a` square on an
`#a9a9a9` page — there is a hard rectangular seam there now.

- [ ] Remove "Hello, I am"
- [ ] Pick a hero direction
- [ ] Dissolve the canvas into the page background

---

## 2. Color — commit to one ground

Current values, spread across six files:

| Value | Where | Note |
|---|---|---|
| `#a9a9a9` | body background | literally CSS `darkgray` |
| `#1e1e1e` | header, footer, nav, lang list | |
| `#111` | body text | tinted near-black |
| `#05060a` | hero canvas | third distinct near-black |
| `#304dc0` | logo | |
| `#e8e8e8` / `#d0d0d0` | logo span / footer text | |
| `rgb(141 140 140)` | modal card | |
| `darkred` / `darkgreen` | nav toggle states, banner | debug placeholders |

The mid-gray page background is the core problem: neither light nor dark, so the
dark header floats as a disconnected bar and the near-black canvas cuts a hole
in it. Contrast is fine (`#111` on `#a9a9a9` is roughly 8:1) — this is
aesthetic, not an accessibility failure.

Three different near-blacks all read as "I needed something dark here." The
skill flags tinted near-black standing in for black as template chrome.

**Go dark throughout.** The canvas already wants it. Starting palette, derived
from colors already in the canvas — a specific origin rather than a default:

```scss
--ground:  #0B1220;  // deep navy, carries actual chroma
--surface: #151E33;  // header, footer, modal
--ink:     #E6EBF5;
--muted:   #8792A8;
--signal:  #4F8FD8;  // the "Earth" planet, already on the canvas
--warm:    #E0A86A;  // the "Venus" planet — counterweight, used rarely
```

- [ ] Define the palette as tokens in one place
- [ ] Replace all hardcoded hex values with tokens
- [ ] Remove `darkred` / `darkgreen` placeholders

---

## 3. Typography

`grep` for `font-size`, `line-height`, `max-width`, `ch` across `src/styles/`
returns **zero matches**. Consequences:

- The About paragraph runs the full viewport width, well past the 80-character
  measure the skill calls for.
- Every heading sits at browser default size.

Montserrat is also one of the most-deployed faces on the web. The loading
pipeline (subsets, `unicode-range`, `font-display: optional`, preload) is better
than most production sites — and it works for any face, so switching is nearly
free.

The real constraint: **latin + latin-ext (č, š, ž) + Cyrillic** in one family.
Faces with native Cyrillic and actual personality: **Unbounded**, **Onest**,
**Golos Text**, **Commissioner**.

Pair one display face with a mono for moments that are literally code — the
`<MKalinin />` logo is code, so mono there is justified by content rather than
decoration. **JetBrains Mono** and **IBM Plex Mono** both ship Cyrillic. Cap at
two families to preserve the byte discipline.

- [ ] Set a type scale (Elements of Typographic Style defaults are a fine start)
- [ ] Cap measure at ~65–70ch on body copy
- [ ] Decide whether Montserrat stays; if not, swap and re-subset
- [ ] Add a container max-width and vertical rhythm

---

## 4. The language switcher breaks its promise

`TEXT_KEYS` in `src/scripts/values.ts` holds five entries — all nav labels. The
hero, About, and Skills content is hardcoded English in `index.html`.

A Russian visitor clicks **RU** and gets Главная / Обо мне / Навыки over an
entirely English page. That reads as broken, which is worse than having no
switcher.

Either translate the body content or ship EN-only until the content exists. This
is a design-integrity call, not a TODO.

- [ ] Translate body content, **or** hide the switcher until it is real

---

## 5. Skills is a resume dump

Three headings, twelve bullets, several of them keyword strings:

> React 19 (Lifecycles, Hooks, React Router, Reconciliation, Fiber, Concurrent mode)

Written for an ATS parser, not a person. It also dilutes the positioning —
listing **jQuery** and **SVN** beside React 19 and TanStack signals padding.

The skill's principle: structure encodes information. If these are three coequal
buckets they should not look like a ranked list; if Frontend is the point, the
other two should visibly recede.

- [ ] Cut to what you want to be hired for
- [ ] Drop the parenthetical keyword lists
- [ ] Decide the real hierarchy between Frontend / Backend / Other

---

## 6. Copy

- [ ] **"Contact Me"** (header button + `navContact` in all three locales) vs
      **"Contact me"** (modal `<h3>`) — sentence case, one name per action
      through the whole flow
- [ ] `"I also have an experience with"` → `"I also have experience with"`
- [ ] `"...under fixed deadlines and solving problems."` — "and solving
      problems" is filler; every developer solves problems
- [ ] Footer `MK - 2026` wants an en dash

---

## 7. Quality floor

- [ ] **No `:focus-visible` anywhere.** UA defaults cover you today, but they
      vanish the moment those header buttons get a background.
- [ ] **`X` as literal text** for the nav toggle and modal close, with no
      `aria-label`.
- [ ] `.header-nav-toggle` and `.lang__switcher` have no `aria-expanded` /
      `aria-controls`.
- [ ] **The modal** is a plain `div` — no `role="dialog"`, no `aria-modal`, and
      focus never moves into it on open. (Credit: `inert` on header/main/footer,
      Escape handling, and returning focus to the trigger is a better foundation
      than most hand-rolled modals.)
- [ ] Remove the two `<div style="margin-bottom: 1000px">` spacers
- [ ] Remove `.under-construction` from `index.scss` and the markup

### Motion

One page-load `fade-slide-down` on `.hello` is fine — the skill explicitly
allows a single orchestrated moment. It becomes a tell the moment it is copied
onto each section during styling. Worth deciding now that it will not be.

---

## What is already right

Not everything needs changing:

- Font subsetting with `unicode-range` per script, `font-display: optional`,
  and a preload for the critical file
- `space()` spacing scale — a real token system already exists for one axis
- Semantic sections with `aria-labelledby` on the hero
- Global `prefers-reduced-motion` block, plus the canvas honoring it properly by
  freezing at its starting positions rather than disappearing
- `IntersectionObserver` pausing the animation loop off-screen, `ResizeObserver`
  handling DPR correctly
- `inert` + Escape + focus restoration on the modal
