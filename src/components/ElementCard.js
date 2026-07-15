const SVG_NS = 'http://www.w3.org/2000/svg';
const FONT_STACK = "'Source Serif Pro', Georgia, serif";

/**
 * Render one element as a self-contained SVG card.
 *
 * Pure function: (element, group) → SVGElement. All colors and fonts are
 * resolved here as presentation attributes — no CSS classes inside the SVG —
 * so the same node can be displayed in the grid, reused in the detail view,
 * or serialized into a print sheet unchanged.
 *
 * ViewBox is 0 0 200 280 (~5:7 card aspect ratio) per the SVG convention
 * in CLAUDE.md.
 */
export function createElementCard(element, group) {
    const color = group ? group.color : '#ccc';
    const ink = '#3D405B';

    const svg = svgFromString(`
    <svg xmlns="${SVG_NS}" viewBox="0 0 200 280" role="img"
         aria-label="${escapeXml(element.name)}">
      <rect x="1" y="1" width="198" height="278" rx="6"
            fill="#FFFFFF" stroke="rgba(61, 64, 91, 0.15)" stroke-width="1"/>
      <path d="M 7 1.5 H 193 A 5.5 5.5 0 0 1 198.5 7 V 9 H 1.5 V 7 A 5.5 5.5 0 0 1 7 1.5 Z"
            fill="${color}"/>
      <text x="16" y="32" font-family="${FONT_STACK}" font-size="14"
            fill="${ink}" opacity="0.55">${element.number}</text>
      <text x="100" y="218" text-anchor="middle" font-family="${FONT_STACK}"
            font-size="44" font-weight="600" fill="${color}">${escapeXml(element.symbol)}</text>
      <text x="100" y="248" text-anchor="middle" font-family="${FONT_STACK}"
            font-size="13" letter-spacing="1" fill="${ink}"
            style="text-transform: uppercase">${escapeXml(element.name.toUpperCase())}</text>
    </svg>
  `);

    const art = illustrationNode(element) || fallbackGlyph(color);
    svg.appendChild(art);

    return svg;
}

/**
 * Inline a pre-fetched illustration (element.illustration.svg holds the raw
 * SVG text, attached by the data loader) as a nested <svg> positioned in the
 * card's illustration slot. Returns null if absent or unparseable.
 */
function illustrationNode(element) {
    const svgText = element.illustration?.svg;
    if (!svgText) return null;

    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const root = doc.documentElement;
    if (root.nodeName !== 'svg' || !root.getAttribute('viewBox')) {
        console.warn(`Illustration for ${element.symbol} is not a valid SVG with a viewBox; using fallback.`);
        return null;
    }

    const node = document.importNode(root, true);
    node.setAttribute('x', 40);
    node.setAttribute('y', 52);
    node.setAttribute('width', 120);
    node.setAttribute('height', 120);
    return node;
}

/**
 * Graceful fallback when an element has no illustration: a quiet
 * group-colored ring, so unillustrated cards read as intentional.
 */
function fallbackGlyph(color) {
    return svgFromString(`
    <svg xmlns="${SVG_NS}" viewBox="0 0 200 280">
      <circle cx="100" cy="112" r="42" fill="none"
              stroke="${color}" stroke-width="2" opacity="0.3"/>
      <circle cx="100" cy="112" r="4" fill="${color}" opacity="0.3"/>
    </svg>
  `);
}

function svgFromString(str) {
    const doc = new DOMParser().parseFromString(str.trim(), 'image/svg+xml');
    return document.importNode(doc.documentElement, true);
}

function escapeXml(str) {
    return String(str).replace(/[<>&"']/g, c => ({
        '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;'
    }[c]));
}
