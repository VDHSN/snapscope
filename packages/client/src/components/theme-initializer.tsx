'use client';

import { useEffect } from 'react';

function getStoredTheme(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('snapscope-theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): string {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme: string): void {
  if (typeof window === 'undefined') return;
  
  if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  } else {
    document.body.removeAttribute('data-theme');
  }
  
  try {
    localStorage.setItem('snapscope-theme', theme);
  } catch {
    // Ignore storage errors
  }
}

export function ThemeInitializer() {
  useEffect(() => {
    // Initialize theme on client side only
    const stored = getStoredTheme();
    const theme = stored || getSystemTheme();
    setTheme(theme);
    
    // Set up system theme change listener
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only update if no stored preference exists
        const currentStored = getStoredTheme();
        if (!currentStored) {
          const newTheme = e.matches ? 'dark' : 'light';
          setTheme(newTheme);
        }
      };
      
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, []);

  return null;
}