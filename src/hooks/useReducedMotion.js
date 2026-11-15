/**
 * useReducedMotion: true when the visitor has asked their device to reduce
 * motion (an accessibility setting). Re-renders the component if the setting
 * changes while the page is open.
 *
 *   const reduced = useReducedMotion();
 *   if (reduced) return <StillVersion />;
 */
import { useEffect, useState } from 'react';
import { MotionPreference } from '../services/ScrollService.js';

export default function useReducedMotion() {
  const [reduced, setReduced] = useState(MotionPreference.reduced);

  useEffect(() => MotionPreference.subscribe(() => setReduced(MotionPreference.reduced)), []);

  return reduced;
}
