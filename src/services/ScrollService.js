/**
 * =============================================================================
 * ScrollService + MotionPreference
 * -----------------------------------------------------------------------------
 * ScrollService runs ONE requestAnimationFrame loop for the whole page and
 * tells every registered scene to update. This is much smoother than each
 * component attaching its own scroll listener.
 *
 * MotionPreference reports whether the visitor asked their OS to reduce
 * motion. Scroll scenes use it to skip animation and show their final state.
 * =============================================================================
 */

export class MotionPreference {
  static #query =
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  /** true when the visitor prefers reduced motion */
  static get reduced() {
    return MotionPreference.#query?.matches ?? false;
  }

  /** Re-render when the setting changes. Returns an unsubscribe function. */
  static subscribe(fn) {
    const q = MotionPreference.#query;
    if (!q) return () => {};
    q.addEventListener('change', fn);
    return () => q.removeEventListener('change', fn);
  }
}

export class ScrollService {
  /** @type {Set<() => void>} */
  #subscribers = new Set();
  #ticking = false;

  constructor() {
    if (typeof window === 'undefined') return;
    // `passive: true` tells the browser we never call preventDefault,
    // so scrolling stays smooth on phones.
    window.addEventListener('scroll', this.#requestTick, { passive: true });
    window.addEventListener('resize', this.#requestTick, { passive: true });
  }

  /**
   * Register a callback that runs (at most once per frame) on scroll/resize.
   * @returns {() => void} unsubscribe function
   */
  subscribe(fn) {
    this.#subscribers.add(fn);
    fn(); // run once immediately so the scene starts in the right state
    return () => this.#subscribers.delete(fn);
  }

  /** Force every scene to recalculate (e.g. after fonts load). */
  refresh() {
    this.#requestTick();
  }

  // Arrow function so `this` stays bound when used as an event listener.
  #requestTick = () => {
    if (this.#ticking) return;
    this.#ticking = true;
    requestAnimationFrame(() => {
      this.#subscribers.forEach((fn) => fn());
      this.#ticking = false;
    });
  };

  // ---- static maths helpers used by the scenes ------------------------------

  /** Keep a number between min and max. */
  static clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }

  /**
   * Map overall progress (0..1) onto a sub-range. Example: range(p, 0.2, 0.6)
   * returns 0 until p hits 0.2, rises to 1 by 0.6, then stays at 1.
   * This is how one scroll distance drives several staggered animations.
   */
  static range(progress, start, end) {
    return ScrollService.clamp((progress - start) / (end - start));
  }

  /** Linear interpolation: lerp(10, 20, 0.5) === 15 */
  static lerp(from, to, t) {
    return from + (to - from) * t;
  }

  /** Ease-out curve, feels more natural than linear motion. */
  static easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }
}

/** Shared instance. */
export const scrollService = new ScrollService();
