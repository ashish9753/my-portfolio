import { useEffect, useState } from 'react';
import { getStoredTheme, toggleTheme, THEME_CHANGED_EVENT } from '../utils/theme';

// Sun/moon toggle. Reads/writes the shared theme controller so it can be
// dropped into any header without prop drilling; all instances stay in sync
// via the THEME_CHANGED_EVENT.
function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    const sync = () => setTheme(getStoredTheme());
    window.addEventListener(THEME_CHANGED_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGED_EVENT, sync);
  }, []);

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={() => setTheme(toggleTheme())}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] text-gray-300 hover:text-white hover:border-gray-500 transition-colors ${className}`}
    >
      {isLight ? (
        // Moon (click to go dark)
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        // Sun (click to go light)
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
