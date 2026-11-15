/**
 * useTheme: the current theme, kept in sync with ThemeService.
 *
 *   const { isDark, toggle } = useTheme();
 *
 * Also exports readThemeColors(), which canvas animations use to read the
 * muted and accent colours from the CSS variables in index.css.
 */
import { useEffect, useState } from 'react';
import { themeService } from '../services/ThemeService.js';

export default function useTheme() {
  const [isDark, setIsDark] = useState(themeService.isDark);

  useEffect(() => themeService.subscribe(() => setIsDark(themeService.isDark)), []);

  return { isDark, toggle: () => themeService.toggle() };
}

/** The theme's muted and accent colours, read from the CSS variables. */
export function readThemeColors() {
  const css = getComputedStyle(document.documentElement);
  return {
    muted: css.getPropertyValue('--muted').trim() || '#888',
    accent: css.getPropertyValue('--accent').trim() || '#55f',
  };
}
