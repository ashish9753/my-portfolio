import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

// Controlled day/night switch for the portfolio navbar. Parent (Portfolio in
// App.jsx) owns the theme state so there is a single source of truth.
const ThemeToggle = ({ theme, onToggle, className = '' }) => {
  const isLight = theme === 'light';

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 text-gray-300 hover:text-white hover:border-white transition-colors duration-200 ${className}`}
    >
      {isLight ? <FiMoon size={18} /> : <FiSun size={18} />}
    </motion.button>
  );
};

export default ThemeToggle;
