// Theme utilities for SnapScope Design System

export type Theme = 'light' | 'dark';

export const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export const setTheme = (theme: Theme): void => {
  if (typeof window !== 'undefined') {
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
    localStorage.setItem('snapscope-theme', theme);
  }
};

export const getStoredTheme = (): Theme | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('snapscope-theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  }
  return null;
};

export const toggleTheme = (): Theme => {
  const current = getCurrentTheme();
  const newTheme = current === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
};

export const getCurrentTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    return document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  return 'light';
};

export const initializeTheme = (): void => {
  const stored = getStoredTheme();
  const theme = stored || getSystemTheme();
  setTheme(theme);
  
  // Listen for system theme changes
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!getStoredTheme()) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
};