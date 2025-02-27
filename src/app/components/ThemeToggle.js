'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Force a document class update when theme changes
  useEffect(() => {
    if (mounted) {
      const isDark = resolvedTheme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-200"
        aria-label="Toggle theme"
      >
        <FaMoon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
    </button>
  );
}
