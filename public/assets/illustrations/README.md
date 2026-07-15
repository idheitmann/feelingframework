# Illustration Conventions

The contract for element illustrations — followed identically whether the
art is LLM-generated or human-drawn. The card renderer
(`src/components/ElementCard.js`) inlines these files into the card SVG;
it never cares which kind it is.

## File rules

- **Name:** `<Symbol>.svg` (e.g. `Jy.svg` for Joy), matching the element's
  `symbol` in `elements.yaml`. The element's `illustration.file` field points
  here.
- **ViewBox:** `0 0 120 120` (square). The renderer places it in the card's
  illustration slot; anything outside the viewBox is clipped.
- **Self-contained:** no external references — no `<image href>`, no webfonts,
  no CSS classes, no `<style>` blocks that depend on the page. Presentation
  attributes only. No raster data.
- **Transparent background.** The card supplies the paper.

## Aesthetic rules

- **Engraved-line style:** stroke-based, `stroke-linecap="round"`,
  stroke-width ~2–3 in viewBox units. Think letterpress plate, woodcut,
  field-guide diagram — not emoji, not flat-icon.
- **Color:** primarily the element's group color from `public/data/groups.yaml`
  (terracotta `#E07A5F`, ochre `#F2CC8F`, sage `#81B29A`, deep blue `#3D405B`,
  weathered brown `#8A6D4B`, olive `#6B705C`). Ink `#3D405B` for secondary
  lines. If a group color ever changes, illustrations using it must be
  recolored to match — check `groups.yaml` before drawing.
  Fills sparing and low-opacity (≤ 0.4); the motif should read at 40px wide.
- **Motif:** abstract or symbolic, drawn from the element's `somatic` field
  where possible (Joy = rising sun / upward expansion; Fear = contraction;
  Longing = reaching). Avoid faces and literal scenes.

## Metadata (lives in elements.yaml, not here)

```yaml
illustration:
  file: "assets/illustrations/Jy.svg"
  source: generated | human | hybrid
  version: 1
  prompt: >          # kept for regeneration — even human art keeps a brief here
    ...
```

Iterating on a generated illustration = edit the prompt, regenerate, bump
`version`. Replacing with human art = drop in the file, set `source: human`.
An element with no `illustration` block renders a quiet fallback glyph —
missing art is never an error.
