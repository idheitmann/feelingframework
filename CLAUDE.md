# FeelingFrame.work — Claude Code Directive

## Project Overview

Read `LLM.md` first for the full vision and spec, and `ROADMAP.md` for the
tracked plan (research grounding, art pipeline, print). This file supplements
them with architectural decisions, current state, and conventions.

**Core idea:** emotional "elements" (like chemical elements) that combine into
compound emotions. Chemistry metaphor with somatic integration (body location of
each emotion).

## Current State (July 2026)

Phase 1 periodic table is **working**; active work is on
`feature/art-print-infrastructure`:
- 26 starter elements defined in YAML (`public/data/elements.yaml`) — the
  count is a draft, not a commitment; the roster is an open research question
- 6 groups with color palette (`public/data/groups.yaml`)
- Elements render as self-contained SVG cards (`src/components/ElementCard.js`)
- All 26 elements have generated engraved-line illustrations, with
  regeneration prompts and versions tracked in elements.yaml
- Family-column layout: one column per group (ordered by `position`),
  elements sorted top-down by descending valence (arousal as tie-break),
  group-name column headers (no separate legend)
- Art-review gallery at `/gallery.html` (second Vite page): every card and
  motif at two scales
- Click-to-inspect detail overlay (description, somatic experience, stats)
- Pub/sub store pattern (`src/store.js`)
- Vite dev server, js-yaml for data loading
- Earth-tone design system (terracotta, ochre, sage, weathered brown, olive,
  deep blue on cream paper)
- Serif typography (Source Serif Pro)

Compounds scaffold exists but is empty (Phase 2).

## Architecture Decisions

### YAML-Driven Data
All content lives in YAML files under `public/data/`. The UI is fully decoupled
from content — no hardcoded element names, symbols, groups, or descriptions.
Adding or changing elements means editing YAML, not touching components.

### SVG Card Rendering (Dual Web/Print) — implemented
`ElementCard.js` is a pure `(element, group) → SVGElement` function. All
colors/fonts are resolved as presentation attributes (no CSS classes inside
the SVG), so the same node renders in the grid, the detail view, and — later —
serializes into print sheets unchanged. A plain CSS grid positions the cards
(no layout library needed). Print output targets: poster, card deck, and
potentially a PDF "lab" export.

### Art Insertion Infrastructure — implemented
Per-element illustrations live in `public/assets/illustrations/<Symbol>.svg`
(conventions contract in that directory's README.md). Each element's
`illustration` block in elements.yaml records `file`, `source`
(generated | human | hybrid), `version`, and the regeneration `prompt` —
kept even for human art. The data loader fetches declared SVGs and inlines
them into the card; a missing illustration falls back to a quiet glyph, never
an error. Iterating on generated art = edit prompt, regenerate, bump version.
Human art = drop in the file, set `source: human`. Review the whole set at
`/gallery.html`.

### Compound Lab (Phase 2 - Design For, Don't Build Yet)
The codebase should be structured so the compound lab can be added without
significant refactoring. Compounds are already in `compounds.yaml` (commented
out). The store already has a `compounds` array and `selectedCompoundId`.

## Code Conventions

### File Structure
```
feelingframework/
├── CLAUDE.md              # This file
├── LLM.md                 # Founding spec (vision; historical)
├── ROADMAP.md             # Tracked plan and status
├── index.html             # Vite entry point (main table)
├── gallery.html           # Art-review gallery page
├── vite.config.js         # Two-page build (main + gallery)
├── package.json
├── public/
│   ├── data/
│   │   ├── elements.yaml  # Element definitions + illustration metadata
│   │   ├── groups.yaml    # Group/color definitions
│   │   └── compounds.yaml # Compound formulas (Phase 2)
│   └── assets/
│       └── illustrations/ # Per-element SVG art (<Symbol>.svg + README contract)
└── src/
    ├── main.js            # App init
    ├── gallery.js         # Gallery page init
    ├── store.js           # Pub/sub state store
    ├── components/
    │   ├── ElementCard.js    # SVG card renderer
    │   ├── PeriodicTable.js  # Family-column table layout
    │   └── DetailView.js     # Element overlay
    ├── utils/
    │   └── dataLoader.js     # YAML + illustration fetcher
    └── assets/
        └── styles/
            ├── variables.css # Design tokens
            └── main.css      # Global styles
```

### Adding a New Element
1. Add entry to `public/data/elements.yaml`
2. Optionally add illustration to `public/assets/illustrations/<symbol>.svg`
3. No component changes needed — data-driven rendering

### SVG Convention
When generating card SVGs:
- ViewBox: 0 0 200 280 (standard card aspect ratio ~5:7)
- Elements: symbol (large), name (small), group color accent, illustration.
  Atomic numbers are NOT displayed — `number` in elements.yaml is an internal
  stable ID only (selection keys off it); the roster isn't final so the
  numbering conveys nothing
- Colors reference the group palette from `groups.yaml`
- Keep SVGs self-contained (no external font dependencies in the SVG itself)
- Use `<defs>` for reusable patterns

### Print Considerations
- Print CSS should use `@media print` for poster/card layout
- Print layout uses the same SVG assets but arranges them differently
- Poster: the full element roster in a grid that fits a standard poster size
  (roster size is not fixed — print layouts must adapt to element count)
- Card deck: individual card SVGs laid out for print-and-cut sheets
- All print styles go in `src/assets/styles/print.css`

## Tools & Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production (static site)
npm run preview  # Preview production build
```

## Near-Term Build Order

See ROADMAP.md for the full tracked plan. Immediate queue:

1. **Add print CSS** — `@media print` styles for poster and card-deck layouts
2. **Add print export button** — trigger print layout via JS or CSS
3. **Research grounding (Track R)** — adaptive-function fields, sources.yaml
   bibliography, taxonomy audit (roster size/membership is open)
4. **Compound lab data structures** — uncomment and expand compounds.yaml,
   add compound detail view (Phase 2)

## Design Aesthetic

From LLM.md: earth tones, warm palette — ochre, sage, terracotta, cream, deep
brown. The feeling of weathered tarot cards, letterpress printing, natural
linen. Serif typography that reads as scholarly but human — old library, not
laboratory. Generous whitespace, considered typography, subtle texture.

## Git Conventions

- Branch from `feature/art-print-infrastructure` for incremental work
- Commit messages: `feat:`, `fix:`, `refactor:`, `style:`, `docs:` prefixes
- Push to `origin` after each working increment