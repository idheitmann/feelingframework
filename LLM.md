# Project Specification

---

**Project: FeelingFrame.work - Periodic Table of Emotions**

**Vision**

A framework that treats human emotions like chemical elements - fundamental building blocks that combine into compound feelings. The goal is accessibility over academic authority: helping people develop emotional vocabulary and recognize that complex feelings (nostalgia, ambivalence, awe) emerge from simpler components.

The project sits at the intersection of emotion science research (Plutchik, Russell, Ekman, Barrett) and practical self-understanding. It should feel like a tool for reflection, not a clinical reference chart.

**Soft Objectives**

- *Approachable sophistication*: Grounded in research but never intimidating. The periodic table metaphor should invite curiosity, not trigger science-class anxiety.
- *Tactile warmth*: Even as a digital product, it should evoke physical objects - cards you'd hold, a poster you'd frame. Texture over gloss.
- *Discovery over instruction*: Users should feel like they're exploring and noticing patterns, not being lectured about emotions.
- *Respect for complexity*: Emotions aren't simple. The interface should acknowledge that these are starting points for understanding, not definitive boxes.

**Data Architecture**

All element content lives in YAML files. The UI must be fully decoupled from content - no hardcoded element names, symbols, descriptions, or group assignments. Elements may be renamed, regrouped, or redescribed as the framework evolves.

```yaml
# elements.yaml
- symbol: "Jo"
  name: "Joy"
  number: 1
  group: "core"
  valence: "positive"
  arousal: "high"
  description: "..."
  somatic: "chest expansion, upward energy"
  
# groups.yaml  
- id: "core"
  name: "Core Emotional Elements"
  color: "#..."
  position: 1
```

**Phase 1 (Build Now)**

- Grid view: periodic table layout, elements positioned by group, colored by group
- Element detail view: click/tap element to see full info (name, symbol, number, description, somatic notes)
- Responsive design

**Phase 2 (Design For, Don't Build)**

- Compound lab: users combine 2-3 elements to explore compound emotions (e.g., Joy + Sadness + Longing = Nostalgia)
- Compound formulas defined in YAML
- Structure the codebase so this feature can be added without significant refactoring

**Aesthetic Direction**

Earth tones, warm palette - ochre, sage, terracotta, cream, deep brown. The feeling of weathered tarot cards, letterpress printing, natural linen, well-handled objects. Serif typography that reads as scholarly but human - old library, not laboratory.

Keep it minimal for this phase. Sophistication through restraint: generous whitespace, considered typography, subtle texture. Avoid ornamentation.

**Deployment**

Static site for Netlify, GitHub repository.

**Deliverables**

- Working static site with sample element data (5-6 elements across 2 groups, enough to prove the pattern)
- README with deployment instructions
- Clear file structure showing where to add/edit element YAML

---