import type { AppTheme } from '@oblifield/shared';

export { type AppTheme };

const STORAGE_KEY = 'of-theme';

/** Every theme id this app renders (one [data-theme] block each in index.css). */
const KNOWN_THEMES: readonly AppTheme[] = ['obli-operator', 'obli-dim', 'modern', 'neon'];

/** True when `theme` is an id this app can render. Obligate may push ids this
 *  app does not ship (e.g. 'obli-daylight'): those must fall back, never stick. */
export function isKnownTheme(theme: unknown): theme is AppTheme {
  return typeof theme === 'string' && (KNOWN_THEMES as readonly string[]).includes(theme);
}

/** Apply a theme by setting data-theme on <html> and persisting it. Unknown
 *  ids collapse to obli-operator. */
export function applyTheme(theme: string): void {
  const safe: AppTheme = isKnownTheme(theme) ? theme : 'obli-operator';
  document.documentElement.dataset.theme = safe;
  try {
    localStorage.setItem(STORAGE_KEY, safe);
  } catch {
    // localStorage unavailable
  }
}

/** Load the theme from localStorage (used before session check to avoid flash). */
export function loadSavedTheme(): AppTheme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isKnownTheme(saved)) return saved;
  } catch {
    // ignore
  }
  return 'obli-operator';
}

/** Called once on app boot in main.tsx to prevent flash of wrong theme. */
export function initTheme(): void {
  applyTheme(loadSavedTheme());
}
