'use client';

import { useEffect } from 'react';

export function DarkModeScript() {
  useEffect(() => {
    // This script runs on the client side to apply dark mode immediately
    const setDarkMode = () => {
      const isDarkMode = 
        localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Apply immediately
    setDarkMode();

    // Set up listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', setDarkMode);

    return () => mediaQuery.removeEventListener('change', setDarkMode);
  }, []);

  return null;
}

export default DarkModeScript;
