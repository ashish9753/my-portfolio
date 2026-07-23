// Theme helpers for the main portfolio (separate from the DSA sheet app).
//
// The portfolio is dark-first: every component hardcodes dark Tailwind
// utilities. Light mode is implemented as an override layer in index.css that
// activates when <html> carries the `portfolio-light` class. We only store the
// user's preference here; App.jsx owns applying/removing the class so it is
// scoped to the portfolio route and never leaks into the sheet app.

const STORAGE_KEY = 'portfolio-theme';

export const getStoredPortfolioTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

export const storePortfolioTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme === 'light' ? 'light' : 'dark');
  } catch {
    // Ignore storage failures (private mode etc.) — the class still applies.
  }
};
