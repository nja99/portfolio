/**
 * =============================================================================
 * BackgroundFX: subtle, slowly animated background behind the whole page
 * -----------------------------------------------------------------------------
 * Change VARIANT (below) to switch:
 *   'network'    drifting nodes that link up when close (NetworkCanvas.jsx)  ← current
 *   'none'       just the faint drifting glow
 *   'dots'       dot grid + slow signal sweep + mouse spotlight (described below)
 *   'blueprint'  fine line grid + the same slow signal sweep + mouse spotlight
 * All of them share the faint drifting glow.
 *
 * AFTER_HERO: when true, the background stays hidden on the first screen (the
 * hero has its own globe) and fades in as you scroll past it.
 *
 * The 'dots' style is four quiet layers, fixed behind all content (pointer-events: none, so they
 * never block clicks, and aria-hidden, so screen readers ignore them):
 *
 *   1. Dot grid: faint "nodes" in the muted colour, fading towards the bottom.
 *   2. Signal sweep: a soft diagonal band that lights the dots in the accent
 *      colour as it slowly passes across the screen, like a packet moving
 *      through a network. (CSS animation `bg-sweep` in index.css.)
 *   3. Spotlight: accent dots in a small soft circle around the mouse
 *      (desktop only).
 *   4. Glow: one very faint accent glow that drifts slowly near the top-right.
 *      (CSS animation `bg-drift` in index.css.)
 *
 * The pointer position and fade are written straight to the DOM (CSS variables
 * and style.opacity) at most once per frame, so React never re-renders while
 * the mouse moves or the page scrolls.
 * With reduced motion: no sweep, no drift, no spotlight; just the still grid.
 *
 * Tune strength with the constants below, speed in index.css.
 * =============================================================================
 */
import { useEffect, useRef } from 'react';
import { MotionPreference, ScrollService } from '../../services/ScrollService.js';
import useScrollFrame from '../../hooks/useScrollFrame.js';
import NetworkCanvas from './NetworkCanvas.jsx';

/** ← Change this to switch the background: 'none' | 'network' | 'dots' | 'blueprint' */
const VARIANT = 'network';

/** ← true = hide the background on the first screen, fade it in after. */
const AFTER_HERO = true;

/** Fade-in window, in screen heights scrolled: starts at FROM, fully in by TO. */
const FADE = { from: 0.35, to: 1.0 };

/** Distance between dots (px). */
const GRID = 26;
/** Radius of the pointer spotlight (px). */
const SPOT_RADIUS = 160;
/** Opacity of each layer: lower = subtler. */
const STRENGTH = { grid: 0.32, sweep: 0.35, spot: 0.4, glow: 0.06 };

/** A line grid ("blueprint") drawn with CSS only. */
function lines(color, size = GRID * 2) {
  return {
    backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
    backgroundSize: `${size}px ${size}px`,
  };
}

/** A dot pattern drawn with CSS only (no image files). */
function dots(color) {
  return {
    backgroundImage: `radial-gradient(circle at center, ${color} 1px, transparent 1.6px)`,
    backgroundSize: `${GRID}px ${GRID}px`,
  };
}

/** Pattern for the current variant, in a given colour. */
function pattern(color) {
  return VARIANT === 'blueprint' ? lines(color) : dots(color);
}

export default function BackgroundFX() {
  const rootRef = useRef(null);
  const patternRef = useRef(null);

  // Fade the background in as the hero scrolls away.
  useScrollFrame(() => {
    const el = patternRef.current;
    if (!el || !AFTER_HERO) return;
    const screens = window.scrollY / window.innerHeight;
    el.style.opacity = String(ScrollService.clamp((screens - FADE.from) / (FADE.to - FADE.from)));
  });

  // Pointer spotlight: only on devices with a real mouse, and only if motion is welcome.
  useEffect(() => {
    const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasPointer || MotionPreference.reduced) return;

    const root = rootRef.current;
    let frame = 0;
    let pointer = { x: -9999, y: -9999 };

    const onMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        root.style.setProperty('--mx', `${pointer.x}px`);
        root.style.setProperty('--my', `${pointer.y}px`);
      });
    };
    // Move the spotlight off-screen when the pointer leaves the window.
    const onLeave = () => {
      root.style.setProperty('--mx', '-9999px');
      root.style.setProperty('--my', '-9999px');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ '--mx': '-9999px', '--my': '-9999px' }}
    >
      <div ref={patternRef} className="absolute inset-0" style={{ opacity: AFTER_HERO ? 0 : 1 }}>
        {VARIANT === 'network' && <NetworkCanvas />}
        {(VARIANT === 'dots' || VARIANT === 'blueprint') && <PatternLayers />}
      </div>

      {/* Shared: one very faint glow, drifting slowly */}
      <div
        className="bg-drift absolute -top-[35vh] -right-[25vw] h-[90vh] w-[80vw]"
        style={{ opacity: STRENGTH.glow, background: 'radial-gradient(closest-side, var(--accent), transparent)' }}
      />
    </div>
  );
}

/** Static pattern + sweep + spotlight (used by 'dots' and 'blueprint'). */
function PatternLayers() {
  const fade = 'linear-gradient(to bottom, black 0%, black 30%, transparent 90%)';
  const strength = VARIANT === 'blueprint' ? 0.5 : 1; // lines are heavier than dots
  const spotMask = `radial-gradient(${SPOT_RADIUS}px circle at var(--mx) var(--my), black, transparent)`;
  return (
    <>
      {/* Faint pattern, fading towards the bottom */}
      <div
        className="absolute inset-0"
        style={{ ...pattern('var(--muted)'), opacity: STRENGTH.grid * strength, maskImage: fade, WebkitMaskImage: fade }}
      />
      {/* Signal sweep: accent pattern revealed by a moving diagonal band */}
      <div className="bg-sweep absolute inset-0" style={{ ...pattern('var(--accent)'), opacity: STRENGTH.sweep * strength }} />
      {/* Accent spotlight around the pointer */}
      <div
        className="absolute inset-0"
        style={{ ...pattern('var(--accent)'), opacity: STRENGTH.spot * strength, maskImage: spotMask, WebkitMaskImage: spotMask }}
      />
    </>
  );
}
