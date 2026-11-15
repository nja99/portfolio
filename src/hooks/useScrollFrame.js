/**
 * useScrollFrame: run a function on every scroll or resize, at most once per
 * animation frame. All components share ONE listener (ScrollService), which is
 * much smoother than each adding its own.
 *
 *   useScrollFrame(() => {
 *     const top = ref.current.getBoundingClientRect().top;
 *     ...
 *   });
 *
 * The latest version of `callback` is always used, so it can read current
 * props and state without re-subscribing every render. It also runs once
 * straight away, so the component starts in the right state.
 */
import { useEffect, useLayoutEffect, useRef } from 'react';
import { scrollService } from '../services/ScrollService.js';

export default function useScrollFrame(callback) {
  const latest = useRef(callback);

  // Keep the ref pointing at the newest callback (after every render).
  useLayoutEffect(() => {
    latest.current = callback;
  });

  useEffect(() => scrollService.subscribe(() => latest.current()), []);
}
