/**
 * =============================================================================
 * Logo
 * -----------------------------------------------------------------------------
 * Several designs live here; `DESIGN` (below) picks the one used across the site.
 * Switch by changing ONE word:
 *
 *   'script'     cursive "JA." with no background                ← current
 *                (choose the lettering with SCRIPT_FONT below)
 *   'scriptTile' the same cursive "JA." on a rounded tile
 *   'jaTile'     hand-drawn "ja" on a tile, blue dot on the j
 *   'jaMark'     the same "ja" without the tile
 *   'JAtile'     uppercase "JA" on a tile, blue node inside the A
 *   'ja'         "ja." typed in Archivo on a tile
 *   'JA'         "JA." uppercase version of the same tile
 *   'nja'        "nja." on a rounded tile (your GitHub handle)
 *   'ring'       "JA" inside a circle
 *   'cluster'    three connected nodes (distributed systems)
 *   'parallel'   three bars, middle one in accent (parallel computing)
 *   'interlock'  two brackets around a node (systems + interface)
 *   'split'      "J | A" on a tile with an accent divider
 *
 * Every design is drawn on a 48×48 grid with:
 *   currentColor → the text colour (follows light/dark mode)
 *   var(--bg)    → the page background (for letters cut out of a tile)
 *   var(--accent)→ the accent, on the element with class "logo-accent",
 *                  which gives a small bounce when the parent link is hovered
 *                  (see `.logo-accent` in index.css).
 *
 * Props: size (px height, default 36), title (accessible name; omit when the parent
 * link already has one), design (override DESIGN for one instance).
 * =============================================================================
 */
import { SCRIPT_MARKS } from './logoPaths.js';

/** Same typeface as the site, so lettered designs match the headings. */
const FONT = "'Archivo Variable', system-ui, sans-serif";

/** ← Change this to switch the logo everywhere. */
const DESIGN = 'script';

/** Lettering for 'script' / 'scriptTile':
 *    'yellowtail-tail' (current: Yellowtail JA + tail sweeping right off the A)
 *  Mixed (J from Yellowtail, swash A from another font):
 *    'yellowtail-parisienne' | 'yellowtail-arizonia' | 'yellowtail-marck-script'
 *  Single typeface:
 *    'yellowtail' | 'satisfy' | 'kaushan-script' | 'dancing-script' | 'pacifico' */
const SCRIPT_FONT = 'yellowtail-tail';

/** Draws the letter shapes of a script mark in one colour. */
function drawLetters(m, ink) {
  return (
    <>
      <path d={m.d} fill={ink} />
      {m.d2 && <path d={m.d2} fill={ink} stroke={ink} strokeWidth={m.stroke2 || 0} strokeLinejoin="round" />}
    </>
  );
}

/**
 * Hand-drawn "ja" (no font needed, so it stays crisp at any size).
 * j = stem + hook, a = ring + stem, and the j's dot is the accent.
 * @param {string} ink  colour of the letters
 */
function drawJa(ink) {
  return (
    <>
      <path
        d="M18.5 21 V33 a5.5 5.5 0 0 1 -5.5 5.5 H11.5"
        stroke={ink}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="29.5" cy="28" r="6.3" stroke={ink} strokeWidth="5" fill="none" />
      <path d="M35.8 21.5 V34.3" stroke={ink} strokeWidth="5" strokeLinecap="round" />
      <circle className="logo-accent" cx="18.5" cy="13" r="3.4" fill="var(--accent)" />
    </>
  );
}

const DESIGNS = {
  // Cursive "JA." with no background. Uses its own tight viewBox (see below).
  script: () => {
    const m = SCRIPT_MARKS[SCRIPT_FONT];
    return (
      <>
        {drawLetters(m, 'currentColor')}
        <circle className="logo-accent" cx={m.dot[0]} cy={m.dot[1]} r={m.dot[2]} fill="var(--accent)" />
      </>
    );
  },
  // Same lettering, scaled and centred on a 48×48 tile.
  scriptTile: () => {
    const m = SCRIPT_MARKS[SCRIPT_FONT];
    const [x, y, w, h] = m.viewBox;
    const k = 34 / Math.max(w, h * 1.3); // fit inside the tile with padding
    const tx = 24 - (x + w / 2) * k;
    const ty = 24 - (y + h / 2) * k;
    return (
      <>
        <rect x="2" y="2" width="44" height="44" rx="11" fill="currentColor" />
        <g transform={`translate(${tx} ${ty}) scale(${k})`}>
          {drawLetters(m, 'var(--bg)')}
          <circle className="logo-accent" cx={m.dot[0]} cy={m.dot[1]} r={m.dot[2]} fill="var(--accent)" />
        </g>
      </>
    );
  },
  jaTile: () => (
    <>
      <rect x="2" y="2" width="44" height="44" rx="11" fill="currentColor" />
      {drawJa('var(--bg)')}
    </>
  ),
  jaMark: () => drawJa('currentColor'),
  JAtile: () => (
    <>
      <rect x="2" y="2" width="44" height="44" rx="11" fill="currentColor" />
      <path
        d="M17 12 V29 a6 6 0 0 1 -6 6 H10"
        stroke="var(--bg)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M22.5 36 L30 12 L37.5 36"
        stroke="var(--bg)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle className="logo-accent" cx="30" cy="28" r="3" fill="var(--accent)" />
    </>
  ),
  ja: () => (
    <>
      <rect x="2" y="2" width="44" height="44" rx="11" fill="currentColor" />
      <text
        x="22"
        y="31"
        textAnchor="middle"
        fontSize="21"
        fontWeight="800"
        fontFamily={FONT}
        style={{ fontStretch: '90%' }}
        fill="var(--bg)"
      >
        ja
      </text>
      <circle className="logo-accent" cx="35.6" cy="28.8" r="2.2" fill="var(--accent)" />
    </>
  ),
  JA: () => (
    <>
      <rect x="2" y="2" width="44" height="44" rx="11" fill="currentColor" />
      <text
        x="21"
        y="31.6"
        textAnchor="middle"
        fontSize="19.5"
        fontWeight="800"
        fontFamily={FONT}
        style={{ fontStretch: '92%' }}
        fill="var(--bg)"
      >
        JA
      </text>
      <circle className="logo-accent" cx="37" cy="29.4" r="2.2" fill="var(--accent)" />
    </>
  ),
  nja: () => (
    <>
      <rect x="2" y="2" width="44" height="44" rx="11" fill="currentColor" />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fontSize="19"
        fontWeight="800"
        fontFamily={FONT}
        style={{ fontStretch: '88%' }}
        fill="var(--bg)"
      >
        nja
      </text>
      <circle className="logo-accent" cx="39.8" cy="29.2" r="2" fill="var(--accent)" />
    </>
  ),
  ring: () => (
    <>
      <circle className="logo-accent" cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="3" />
      <text
        x="24"
        y="31.5"
        textAnchor="middle"
        fontSize="20"
        fontWeight="850"
        fontFamily={FONT}
        style={{ fontStretch: '110%' }}
        fill="currentColor"
      >
        JA
      </text>
    </>
  ),
  cluster: () => (
    <>
      <path d="M12 34 L24 12 L36 34 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <circle className="logo-accent" cx="24" cy="12" r="6" fill="var(--accent)" />
      <circle cx="12" cy="34" r="6" fill="currentColor" />
      <circle cx="36" cy="34" r="6" fill="currentColor" />
    </>
  ),
  parallel: () => (
    <>
      <rect x="9" y="16" width="7" height="22" rx="3.5" fill="currentColor" />
      <rect className="logo-accent" x="20.5" y="8" width="7" height="30" rx="3.5" fill="var(--accent)" />
      <rect x="32" y="20" width="7" height="18" rx="3.5" fill="currentColor" />
    </>
  ),
  interlock: () => (
    <>
      <path
        d="M8 22 V12 a4 4 0 0 1 4 -4 H30"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M40 26 V36 a4 4 0 0 1 -4 4 H18"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle className="logo-accent" cx="24" cy="24" r="4.5" fill="var(--accent)" />
    </>
  ),
  split: () => (
    <>
      <rect x="2" y="2" width="44" height="44" rx="11" fill="currentColor" />
      <text
        x="15.5"
        y="32"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fontFamily={FONT}
        style={{ fontStretch: '80%' }}
        fill="var(--bg)"
      >
        J
      </text>
      <rect className="logo-accent" x="23" y="13" width="2.5" height="22" rx="1.25" fill="var(--accent)" />
      <text
        x="33.5"
        y="32"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fontFamily={FONT}
        style={{ fontStretch: '80%' }}
        fill="var(--bg)"
      >
        A
      </text>
    </>
  ),
};

export default function Logo({ size = 36, title = null, design = null }) {
  const name = design ?? DESIGN;
  const draw = DESIGNS[name] ?? DESIGNS.script;

  // The bare cursive mark is wider than tall: `size` sets its height.
  const isBareScript = name === 'script';
  const vb = isBareScript ? SCRIPT_MARKS[SCRIPT_FONT].viewBox : [0, 0, 48, 48];
  const width = isBareScript ? (size * vb[2]) / vb[3] : size;
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
