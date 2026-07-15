# FeelingFrame.work — Roadmap

Three goals drive everything below:

1. **A beautiful website and beautiful printable cards** from one set of assets.
2. **An iterable content pipeline** where AI-generated SVG art and human-drawn
   art coexist and can be swapped, regenerated, and refined per element.
3. **Research defensibility** — grounding every element in evolutionary
   psychology and affective science, so the framework survives scrutiny.

These map to three tracks that can proceed in parallel, plus a print track
that depends on the art track.

---

## Track R — Research Grounding (evolutionary psychology)

The content is currently dictionary definitions. The goal is that every
element can answer: *what adaptive problem did this emotion evolve to solve?*

**R1. Extend the element schema.** Add research fields to `elements.yaml`:

```yaml
- symbol: "Fr"
  name: "Fear"
  # ...existing fields...
  adaptive_function: >
    Rapid threat detection and response; mobilizes fight/flight/freeze
    before conscious appraisal completes.
  evolutionary_note: >
    One of the most conserved affect programs; homologs across mammals
    (LeDoux's defensive survival circuits).
  sources:
    - key: ledoux-2012
    - key: nesse-1990
```

**R2. Bibliography file.** `public/data/sources.yaml` — one entry per source
(author, year, title, DOI/URL, one-line relevance note). Elements reference
sources by key. The DetailView can then render citations; the printed cards
can carry a compact "further reading" line.

**R3. Research pass per element.** For each element on the roster, a deep-research
pass answering: adaptive function, evolutionary evidence quality (strong /
contested / speculative), cross-cultural universality (Ekman-style evidence
vs. constructed-emotion critiques), and honest uncertainty. Key anchors:
Nesse (evolutionary functions of emotions), Tooby & Cosmides (emotions as
superordinate programs), Ekman (basic emotions), Panksepp (affective
neuroscience primary systems), Barrett (constructionist counterpoint —
worth representing rather than ignoring), Sznycer (shame/pride/envy as
social-valuation adaptations), Keltner & Haidt (awe).

**R4. Defensibility audit of the taxonomy itself.** The current 6 groups and
26 elements are a first draft — the count is arbitrary and the roster should
grow or shrink to whatever the evidence supports. Questions to resolve with
research in hand: Is "energy" a group of emotions or of states? Is Interest
distinct from Curiosity? Should the roster align with Panksepp's seven primary
systems, Ekman's basics, or Plutchik's eight — or be honest about being a
synthesis? How many elements does a defensible synthesis actually yield?
Output: a `RESEARCH.md` that documents the framework's stance, what it
borrows from whom, and where it knowingly simplifies. This is what makes
the project defensible: not claiming more than the evidence supports.

**R5. Rewrite descriptions and somatic notes** against the research —
somatic fields should reference actual interoception findings (e.g.
Nummenmaa's body-mapping studies) rather than intuition.

## Track A — Art Pipeline (AI-generated + human-drawn, iterable)

**A1. Schema + manifest.** Add to each element:

```yaml
  illustration:
    file: "assets/illustrations/Fr.svg"   # omit → graceful fallback
    source: generated | human | hybrid
    prompt: >                              # kept even for human art, as brief
      A minimal engraving-style motif of ...
    version: 3
```

Keeping the prompt in YAML is what makes AI art *iterable*: regenerating an
illustration means editing the prompt and re-running, not archaeology.
Human-drawn art drops into the same slot by symbol name and simply sets
`source: human` — the renderer never cares which it is.

**A2. Illustration conventions doc** (`public/assets/illustrations/README.md`):
viewBox (square, e.g. `0 0 120 120`, sits inside the 200×280 card), stroke/fill
rules tied to the group palette, no embedded fonts, no raster data, engraved/
letterpress aesthetic guidance. This is the contract both the LLM generator
and human artists draw against.

**A3. Seed the full roster with generated art.** First pass: LLM-generated SVG
per element following A2. These are placeholders-with-dignity — good enough to
ship, individually replaceable forever after. The generator should be a script
driven by `elements.yaml`, so a roster change (elements added, renamed,
removed) regenerates exactly the missing art with no manual bookkeeping.

**A4. Iteration workflow.** A tiny gallery page (dev-only route or plain HTML)
showing every illustration side by side at card scale and print scale, so
each art review pass sees the whole set's coherence, not one card at a time.

## Track C — SVG Card Renderer (the web/print hinge)

**C1. `src/components/ElementCard.js`** — a pure function
`(element, group) → SVGElement`, viewBox `0 0 200 280`, rendering number,
symbol, name, group accent, and the illustration (inlined, not `<img>`, so
print export stays self-contained). Fallback when no illustration: a subtle
group-colored glyph or texture.

**C2. Refactor PeriodicTable** to place these SVG cards in the existing
valence×arousal CSS grid. Same layout logic, same store, same click handling.
DetailView can reuse the card SVG at large scale as its header.

**C3. Keep the renderer output-agnostic.** No CSS-class-dependent styling
inside the SVG — all colors/fonts resolved at generation time — so the same
node serializes cleanly into a print sheet or a downloaded file.

## Track P — Print (depends on C, benefits from A)

**P1. `print.css`** — `@media print` base: hide chrome (header, legend,
overlay), set page size, exact-color printing hints.

**P2. Card-deck sheets.** A print route/mode that lays out all cards at a
fixed physical size (e.g. 63.5×88.9mm poker standard) with cut marks and
bleed, N-up per page. Card backs (group-colored, shared motif) as a second
sheet for duplex printing.

**P3. Poster mode.** The full roster in the family-column table at poster scale
(A2/A1), with title, legend, and the research one-liners as fine print —
this is where Track R content becomes visible ornament.

**P4. Export affordance.** A print/export button that toggles the mode and
invokes the browser print dialog; later, optionally headless-Chrome PDF
generation in CI for downloadable "lab sheets."

## Track W — Website polish (ongoing)

- Replace Vite favicon with a project mark; add OG/meta tags.
- Texture and typography passes per the LLM.md aesthetic (letterpress,
  weathered linen — subtle, not skeuomorphic).
- Hover/keyboard affordances, reduced-motion support, mobile layout for the
  10×10 grid (it will need a strategy — scroll, scale, or reflow).
- Netlify deploy (static build already works).

---

## Suggested sequence

| Step | What | Why first |
|------|------|-----------|
| 1 | A1 + C1 + C2 (schema, card renderer, grid refactor) | Everything else hangs off SVG cards |
| 2 | A2 + A3 (conventions + generated illustrations for the roster) | Makes the site beautiful; unblocks print |
| 3 | P1 + P2 (print CSS + card sheets) | First physical deliverable |
| 4 | R1–R3 (schema, sources, research passes) | Content refinement is iterative; start early, land continuously |
| 5 | P3 + R4–R5 (poster + taxonomy audit + rewrites) | Poster wants final-ish content |
| 6 | Phase 2 compound lab | After the element layer is solid |

Research (Track R) is deliberately interleaved rather than last: the taxonomy
audit (R4) may rename, regroup, or replace elements, and the YAML-driven
architecture means that's cheap — but art (A3) keyed to element symbols is
the one asset that a taxonomy change invalidates. So: settle the *roster*
(which elements, and how many — R4) before investing heavily in per-element
art refinement, while letting first-pass generated art proceed in parallel.
A YAML-driven art generator (A3) softens even this: adding element 27 or
retiring element 12 is a regeneration, not a redesign.
