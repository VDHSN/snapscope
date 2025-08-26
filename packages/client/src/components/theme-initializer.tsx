'use client';

import { useEffect } from 'react';
import { initializeTheme } from '@snapscope/ui/theme';

export function ThemeInitializer() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return null;
}