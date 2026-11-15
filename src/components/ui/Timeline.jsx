/**
 * =============================================================================
 * Timeline: scroll-drawn vertical timeline (used by Experience & Education)
 * -----------------------------------------------------------------------------
 * As you scroll, a line "draws" down the left edge. When the line reaches an
 * entry's dot, the dot fills in and that entry's content rises into place,
 * with its details following one after another (a stagger).
 *
 *     ●  Entry 1   ← active: dot filled, content visible
 *     ┃
 *     ┃ (drawn part of the line follows your scroll position)
 *     │
 *     ○  Entry 2   ← waiting: hollow dot, content hidden below
 *
 * The "drawing point" sits at TRIGGER (65%) of the screen height. Lower it to
 * reveal entries later, raise it to reveal them sooner.
 *
 * USAGE
 *   <Timeline
 *     items={jobs}
 *     marker={(job) => (job.compact ? 'small' : 'dot')}
 *     renderItem={(job, active) => (
 *       <p style={reveal(active, 0)}>{job.role}</p>
 *     )}
 *   />
 *
 * `reveal(active, i)` (exported below) returns the inline style for the i-th
 * element of an entry, so elements can fade in one after another.
 *
 * With reduced motion turned on, everything shows straight away.
 * =============================================================================
 */
import { useRef, useState } from 'react';
import { ScrollService } from '../../services/ScrollService.js';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import useScrollFrame from '../../hooks/useScrollFrame.js';

/** Where the line's tip sits, as a fraction of screen height from the top. */
const TRIGGER = 0.65;

/** Delay between staggered elements inside one entry (ms). */
const STAGGER_MS = 70;

/**
 * Style for the i-th staggered element of an entry.
 * Inactive: invisible and 24px lower. Active: in place, delayed by i steps.
 */
export function reveal(active, i = 0) {
  return {
    opacity: active ? 1 : 0,
    transform: active ? 'none' : 'translateY(24px)',
    transition: 'opacity 600ms ease, transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1)',
    transitionDelay: active ? `${i * STAGGER_MS}ms` : '0ms',
  };
}

export default function Timeline({ items, renderItem, marker = () => 'dot' }) {
  const containerRef = useRef(null);
  const itemEls = useRef([]); // DOM nodes of each <li>, filled in by callback refs
  const reduced = useReducedMotion();
  const [state, setState] = useState({ drawn: 0, active: [] }); // drawn = px of line so far

  // Runs once per frame on scroll/resize (batched by ScrollService).
  useScrollFrame(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const tip = window.innerHeight * TRIGGER - rect.top; // tip position inside the timeline
    const drawn = ScrollService.clamp(tip, 0, rect.height);

    setState((prev) => {
      // An item turns on when the tip passes its dot (≈ 10px below its top).
      // Once on, it stays on, so content never disappears when scrolling back up.
      const active = items.map((_, i) => {
        const item = itemEls.current[i];
        return Boolean(prev.active[i]) || (item ? drawn >= item.offsetTop + 10 : false);
      });
      const changed = Math.abs(drawn - prev.drawn) > 0.5 || active.some((a, i) => a !== prev.active[i]);
      return changed ? { drawn, active } : prev;
    });
  });

  return (
    <ol ref={containerRef} className="relative">
      {/* Track (faint) and the drawn part (solid) */}
      <div aria-hidden="true" className="absolute top-2 bottom-2 left-[5.5px] w-px bg-muted/25">
        <div className="w-full bg-fg" style={{ height: reduced ? '100%' : `${state.drawn}px` }} />
      </div>

      {items.map((item, i) => {
        const active = reduced || Boolean(state.active[i]);
        return (
          <li
            key={item.id}
            ref={(node) => {
              itemEls.current[i] = node;
            }}
            className="relative pb-16 pl-9 last:pb-0 sm:pl-12"
          >
            <Marker type={marker(item)} active={active} />
            {renderItem(item, active)}
          </li>
        );
      })}
    </ol>
  );
}

/** The dot on the line: 'dot' for full entries, 'small' for minor ones. */
function Marker({ type, active }) {
  if (type === 'small') {
    return (
      <span
        aria-hidden="true"
        className={`absolute top-[0.45rem] left-[2.5px] h-2 w-2 rounded-full transition-colors duration-500 ${
          active ? 'bg-fg' : 'bg-muted/40'
        }`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`absolute top-1.5 left-0 h-3 w-3 rounded-full border-2 transition-all duration-500 ${
        active ? 'scale-110 border-fg bg-fg' : 'border-muted/50 bg-bg'
      }`}
    />
  );
}
