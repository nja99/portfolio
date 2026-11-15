/**
 * ThemeToggle: the light/dark switch in the nav.
 * It does not store the theme itself; the useTheme hook reads it from
 * ThemeService and re-renders when it changes, so any other part of the app
 * could change the theme too.
 */
import useTheme from '../../hooks/useTheme.js';

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-11 w-11 place-items-center rounded-full text-accent transition-colors hover:bg-accent/10"
    >
      {/* Shows the mode you will switch TO: moon in light, sun in dark */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
          </>
        ) : (
          <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7Z" />
        )}
      </svg>
    </button>
  );
}
