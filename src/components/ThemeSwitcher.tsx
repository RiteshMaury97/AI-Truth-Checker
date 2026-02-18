'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      className={`
        w-12 h-6 rounded-full flex items-center p-0.5
        transition-colors duration-300
        ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}
      `}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <div
        className={`
          w-5 h-5 bg-white rounded-full
          transform transition-transform duration-300
          ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}
        `}
      />
    </button>
  );
};

export default ThemeSwitcher;
