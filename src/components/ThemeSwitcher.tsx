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
      className={`w-12 h-6 rounded-full bg-white flex items-center transition duration-300 focus:outline-none shadow`}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <div
        className={`w-7 h-7 relative rounded-full transition duration-500 transform bg-gray-600 -translate-x-1`}
      ></div>
    </button>
  );
};

export default ThemeSwitcher;
