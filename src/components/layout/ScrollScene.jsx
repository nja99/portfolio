/**
 * =============================================================================
 * ScrollScene: the engine behind the Apple-style "pinned" animations
 * -----------------------------------------------------------------------------
 * HOW IT WORKS
 *   The scene renders a tall outer <section> (the "track", e.g. 250vh) with a
 *   `position: sticky` inner stage that is exactly one screen tall. While you
 *   scroll through the track, the stage stays pinned in place and only the
 *   things inside it animate. That is the "nothing else changes" effect.
 *
 *   ┌───────── track (tall) ─────────┐
 *   │ ┌────── stage (sticky) ──────┐ │  ← stays on screen
 *   │ │    children(progress)      │ │
 *   │ └────────────────────────────┘ │
 *   │                                │  ← you scroll through this space
 *   └────────────────────────────────┘
 *
 *   `progress` goes from 0 (track top reaches the top of the screen) to
 *   1 (track bottom reaches the bottom of the screen).
 *
 * HOW TO USE IT
 *   Pass a function as the child; it receives progress and returns the frame:
 *
 *   <ScrollScene id="about" label="About me" trackHeight="300vh">
 *     {(progress) => <div style={{ opacity: progress }}>...</div>}
 *   </ScrollScene>
 *
 * PROPS
 *   id, label     anchor id (#about) and accessible name of the <section>
 *   trackHeight   CSS height of the track; longer = slower animation
 *   isStatic      true = don't pin (e.g. the content doesn't fit the screen)
 *   renderStatic  what to show when not pinned (defaults to the final frame)
 *   onMeasure     called with the track element on every scroll frame, for
 *                 scenes that need to measure their own layout
 *
 * ACCESSIBILITY
 *   With reduced motion turned on, the scene is never pinned.
 * =============================================================================
 */
import { useEffect, useRef, useState } from 'react';
import { scrollService, ScrollService } from '../../services/ScrollService.js';
import useReducedMotion from '../../hooks/useReducedMotion.js';
import useScrollFrame from '../../hooks/useScrollFrame.js';

export default function ScrollScene({
  id,
  label,
  trackHeight = '200vh',
  isStatic = false,
  renderStatic,
  onMeasure,
  children,
}) {
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const pinned = !reduced && !isStatic;
  const [progress, setProgress] = useState(0);

  // Work out how far through the track we are (once per frame at most).
  useScrollFrame(() => {
    const track = trackRef.current;
    if (!track) return;
    onMeasure?.(track);
    if (!pinned) return;

    const rect = track.getBoundingClientRect();
    const scrollable = track.offsetHeight - window.innerHeight;
    const next = scrollable > 0 ? ScrollService.clamp(-rect.top / scrollable) : 0;
    // Only re-render when the value meaningfully changes (saves work).
    setProgress((prev) => (Math.abs(next - prev) > 0.0005 ? next : prev));
  });

  // Switching between pinned and static changes the layout: measure again.
  useEffect(() => scrollService.refresh(), [pinned, trackHeight]);

  if (!pinned) {
    return (
      <section ref={trackRef} id={id} aria-label={label} className="relative">
        {renderStatic ? renderStatic() : children(1)}
      </section>
    );
  }

  return (
    <section ref={trackRef} id={id} aria-label={label} className="relative" style={{ height: trackHeight }}>
      {/* h-svh = "small viewport height": avoids jumps when the mobile
          browser's address bar shows/hides. */}
      <div className="sticky top-0 h-svh overflow-hidden">{children(progress)}</div>
    </section>
  );
}
