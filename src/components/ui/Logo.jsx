/**
 * =============================================================================
 * Logo
 * -----------------------------------------------------------------------------
 * The cursive "JA." mark (Yellowtail lettering with a tail off the A, and a
 * blue full stop). Two designs; `DESIGN` (below) picks the one used across the
 * site:
 *
 *   'script'      the mark on its own, no background                ← current
 *   'scriptTile'  the same mark centred on a rounded tile
 *
 * The letter shapes live in logoPaths.js as plain SVG paths, so no font has
 * to load. Colours:
 *   currentColor  → the text colour (follows light/dark mode)
 *   var(--bg)     → the page background (letters cut out of the tile)
 *   var(--accent) → the full stop, class "logo-accent", which gives a small
 *                   bounce when the parent link is hovered (see index.css)
 *
 * Props: size (px height, default 36), title (accessible name; omit when the
 * parent link already has one), design (override DESIGN for one instance).
 * =============================================================================
 */
import { SCRIPT_MARK } from './logoPaths.js';

/** ← Change this to switch the logo everywhere: 'script' | 'scriptTile' */
const DESIGN = 'script';

/** Draws the letter shapes (and the tail) in one colour. */
function drawLetters(ink) {
  const m = SCRIPT_MARK;
  return (
    <>
      <path d={m.d} fill={ink} />
      {m.d2 && <path d={m.d2} fill={ink} stroke={ink} strokeWidth={m.stroke2 || 0} strokeLinejoin="round" />}
    </>
  );
}

/** The blue full stop. */
function drawDot() {
  const [cx, cy, r] = SCRIPT_MARK.dot;
  return <circle className="logo-accent" cx={cx} cy={cy} r={r} fill="var(--accent)" />;
}

const DESIGNS = {
  // The mark on its own. Uses its own tight viewBox (see Logo below).
  script: () => (
    <>
      {drawLetters('currentColor')}
      {drawDot()}
    </>
  ),
  // The same mark, scaled and centred on a 48×48 tile.
  scriptTile: () => {
    const [x, y, w, h] = SCRIPT_MARK.viewBox;
    const k = 34 / Math.max(w, h * 1.3); // fit inside the tile with padding
    const tx = 24 - (x + w / 2) * k;
    const ty = 24 - (y + h / 2) * k;
    return (
      <>
        <rect x="2" y="2" width="44" height="44" rx="11" fill="currentColor" />
        <g transform={`translate(${tx} ${ty}) scale(${k})`}>
          {drawLetters('var(--bg)')}
          {drawDot()}
        </g>
      </>
    );
  },
};

export default function Logo({ size = 36, title = null, design = null }) {
  const name = design ?? DESIGN;
  const draw = DESIGNS[name] ?? DESIGNS.script;

  // The bare mark is wider than tall: `size` sets its height.
  const isBare = name !== 'scriptTile';
  const vb = isBare ? SCRIPT_MARK.viewBox : [0, 0, 48, 48];
  const width = isBare ? (size * vb[2]) / vb[3] : size;
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': 'true' };

  return (
    <svg
      width={width}
      height={size}
      viewBox={vb.join(' ')}
      fill="none"
      className="shrink-0 overflow-visible"
      {...a11y}
    >
      {draw()}
    </svg>
  );
}