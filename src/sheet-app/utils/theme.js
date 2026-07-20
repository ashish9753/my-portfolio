// Lightweight theme controller for the DSA sheet app.
//
// Dark mode is the untouched default (every page hardcodes dark colors), so we
// only ever add/remove a single `sheet-light` class on <html>. When present,
// the override layer in index.css remaps the app's dark color tokens to a
// light "Codolio-style" palette. Nothing about dark mode changes.

const STORAGE_KEY = 'sheet-theme';
export const THEME_CHANGED_EVENT = 'sheetThemeChanged';
const LIGHT_CLASS = 'sheet-light';

export const getStoredTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

export const applyTheme = (theme) => {
  const isLight = theme === 'light';
  const root = document.documentElement;
  root.classList.toggle(LIGHT_CLASS, isLight);
  try {
    localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
  } catch {
    // Ignore storage failures (private mode etc.) — the class still applies.
  }
  window.dispatchEvent(new CustomEvent(THEME_CHANGED_EVENT, { detail: { theme: isLight ? 'light' : 'dark' } }));
};

export const toggleTheme = () => {
  const next = getStoredTheme() === 'light' ? 'dark' : 'light';
  applyTheme(next);
  return next;
};

// Apply the saved theme immediately on import so there is no flash of the wrong
// theme before React mounts.
applyTheme(getStoredTheme());
