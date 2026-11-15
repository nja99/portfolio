/**
 * =============================================================================
 * ThemeService
 * -----------------------------------------------------------------------------
 * Owns light/dark mode. It:
 *   1. reads #dark / #light in the URL, else the visitor's saved choice
 *      (localStorage), else their OS preference
 *   2. toggles the `.dark` class on <html> (CSS variables in index.css react)
 *   3. notifies subscribers (e.g. the toggle button) when the theme changes
 *
 * It is a *singleton*: one shared instance, exported at the bottom of the file.
 * The inline script in index.html applies the theme before React loads so the
 * page never flashes the wrong colours. Keep STORAGE_KEY in sync with it.
 * =============================================================================
 */
export class ThemeService {
  static STORAGE_KEY = 'theme';
  static LIGHT = 'light';
  static DARK = 'dark';

  /** @type {Set<(theme: string) => void>} */
  #listeners = new Set();
  #theme;

  constructor() {
    this.#theme = this.#readInitialTheme();
    this.#apply(this.#theme);
    this.#watchSystemPreference();
  }

  /** Current theme: 'light' or 'dark'. */
  get theme() {
    return this.#theme;
  }

  get isDark() {
    return this.#theme === ThemeService.DARK;
  }

  /** Switch between light and dark, and remember the choice. */
  toggle() {
    this.set(this.isDark ? ThemeService.LIGHT : ThemeService.DARK);
  }

  /** @param {'light' | 'dark'} theme */
  set(theme) {
    this.#theme = theme;
    this.#apply(theme);
    try {
      localStorage.setItem(ThemeService.STORAGE_KEY, theme);
    } catch {
      /* storage can be blocked (private mode); the theme still applies */
    }
    this.#listeners.forEach((fn) => fn(theme));
  }

  /**
   * Listen for theme changes.
   * @returns {() => void} call it to stop listening (do this on unmount)
   */
  subscribe(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  // ---- private helpers ------------------------------------------------------

  /** '#dark' or '#light' at the end of the URL forces that theme. */
  #themeFromHash() {
    const h = window.location.hash.toLowerCase();
    if (h === '#dark') return ThemeService.DARK;
    if (h === '#light') return ThemeService.LIGHT;
    return null;
  }

  #readInitialTheme() {
    if (typeof window === 'undefined') return ThemeService.LIGHT;
    const fromHash = this.#themeFromHash();
    if (fromHash) return fromHash;
    // <html data-start-theme="dark"> sets the starting theme (used for previews)
    const start = document.documentElement.dataset.startTheme;
    if (start === ThemeService.DARK || start === ThemeService.LIGHT) return start;
    let saved = null;
    try {
      saved = localStorage.getItem(ThemeService.STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (saved === ThemeService.LIGHT || saved === ThemeService.DARK) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? ThemeService.DARK : ThemeService.LIGHT;
  }

  #apply(theme) {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === ThemeService.DARK);
  }

  /** If the visitor never chose a theme, follow their OS when it changes. */
  #watchSystemPreference() {
    if (typeof window === 'undefined') return;
    // Changing the URL to ...#dark or ...#light switches the theme live.
    window.addEventListener('hashchange', () => {
      const fromHash = this.#themeFromHash();
      if (fromHash) this.set(fromHash);
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      let saved = null;
      try {
        saved = localStorage.getItem(ThemeService.STORAGE_KEY);
      } catch {
        /* ignore */
      }
      if (!saved) {
        this.#theme = e.matches ? ThemeService.DARK : ThemeService.LIGHT;
        this.#apply(this.#theme);
        this.#listeners.forEach((fn) => fn(this.#theme));
      }
    });
  }
}

/** The one shared instance used across the app. */
export const themeService = new ThemeService();
