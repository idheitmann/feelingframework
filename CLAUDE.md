# FeelingFrame.work — Claude Code Directive

## Project Overview

Read `LLM.md` first for the full vision and spec. This file supplements it with
architectural decisions, current state, and near-term direction.

**Core idea:** emotional "elements" (like chemical elements) that combine into
compound emotions. Chemistry metaphor with somatic integration (body location of
each emotion).

## Current State (July 2026)

Phase 1 periodic table is **working** on `main`:
- 26 starter elements defined in YAML (`public/data/elements.yaml`)
- 6 groups with color palette (`public/data/groups.yaml`)
- Valence×arousal CSS grid layout (10×10 grid)
- Click-to-inspect detail overlay (description, somatic experience, stats)
- Pub/sub store pattern (`src/store.js`)
- Vite dev server, js-yaml for data loading
- Earth-tone design system (terracotta, ochre, sage, cream, olive, deep blue)
- Serif typography (Source Serif Pro)

Compounds scaffold exists but is empty (Phase 2).

## Architecture Decisions

### YAML-Driven Data
All content lives in YAML files under `public/data/`. The UI is fully decoupled
from content — no hardcoded element names, symbols, groups, or descriptions.
Adding or changing elements means editing YAML, not touching components.

### SVG+JS Card Layout (Dual Web/Print)
Cards are **LLM-generated SVG** assets. A JS layout library arranges them for
web display. The same SVG assets export to print-ready output because SVG is
resolution-independent.

**This means:**
- Each element card should eventually be an SVG (not a DOM div)
- A layout engine (e.g., dagre, cytoscape.js, or a custom grid) positions SVGs
- The same layout algorithm can render to screen (HTML/SVG) and to print (PDF)
- Print output targets: poster, card deck, and potentially a PDF "lab" export

### Art Insertion Infrastructure
The framework needs to support per-element illustrations (visual symbols,
icons, or abstract art). Current cards show symbol + name only. The
infrastructure should:

- Define an `illustration` field in elements.yaml (path to SVG or generation prompt)
- Render illustrations inline in the card SVG
- Support both generated (LLM) and hand-crafted illustration assets
- Keep illustrations in `public/assets/illustrations/` named by element symbol
- Fall back gracefully if no illustration is present

### Compound Lab (Phase 2 - Design For, Don't Build Yet)
The codebase should be structured so the compound lab can be added without
significant refactoring. Compounds are already in `compounds.yaml` (commented
out). The store already has a `compounds` array and `selectedCompoundId`.

## Code Conventions

### File Structure
```
feelingframework/
├── CLAUDE.md              # This file
├── LLM.md                 # Full project spec (read this first)
├── index.html             # Vite entry point
├── package.json
├── public/
│   ├── data/
│   │   ├── elements.yaml  # Element definitions
│   │   ├── groups.yaml    # Group/color definitions
│   │   └── compounds.yaml # Compound formulas (Phase 2)
│   └── assets/
│       └── illustrations/ # Per-element SVG art (to be added)
└── src/
    ├── main.js            # App init
    ├── store.js           # Pub/sub state store
    ├── components/
    │   ├── PeriodicTable.js  # Grid layout
    │   ├── DetailView.js     # Element overlay
    │   └── Legend.js         # Group legend
    ├── utils/
    │   └── dataLoader.js     # YAML fetcher
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
- Elements: symbol (large), name (small), number, group color accent, illustration
- Colors reference the group palette from `groups.yaml`
- Keep SVGs self-contained (no external font dependencies in the SVG itself)
- Use `<defs>` for reusable patterns

### Print Considerations
- Print CSS should use `@media print` for poster/card layout
- Print layout uses the same SVG assets but arranges them differently
- Poster: 26 elements in a grid that fits a standard poster size
- Card deck: individual card SVGs laid out for print-and-cut sheets
- All print styles go in `src/assets/styles/print.css`

## Tools & Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production (static site)
npm run preview  # Preview production build
```

## Near-Term Build Order

1. **Add illustration field to elements.yaml** — define illustration paths/prompts
2. **Create illustration directory** — seed with LLM-generated SVG art for each
   element (or placeholder SVGs)
3. **Refactor PeriodicTable to render SVGs** — transition from DOM divs to SVG
   card elements, keeping the same layout algorithm
4. **Add print CSS** — `@media print` styles for poster and card-deck layouts
5. **Add print export button** — trigger print layout via JS or CSS
6. **Compound lab data structures** — uncomment and expand compounds.yaml,
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