/**
 * Color constants for SnapScope design system
 * Based on the design system specification
 */

export const Colors = {
  // Primary colors
  primary: {
    purple: '#8B5CF6',
    blue: '#6366F1',
    gradient: ['#8B5CF6', '#6366F1'], // For linear gradients
  },

  // Gradients for design mockup
  gradients: {
    header: {
      light: ['#8B5CF6', '#6366F1'],
      dark: ['#7C3AED', '#4F46E5'],
    },
    fab: {
      light: ['#8B5CF6', '#6366F1'],
      dark: ['#7C3AED', '#4F46E5'],
    },
  },

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#F43F5E',
  info: '#3B82F6',

  // Light theme
  light: {
    background: '#F5E6D3',
    surface: '#FFFFFF',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
  },

  // Dark theme
  dark: {
    background: '#1A1A1A',
    surface: '#2A2A2A',
    text: {
      primary: '#F5F5F5',
      secondary: '#9CA3AF',
    },
  },

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

export type ColorTheme = 'light' | 'dark';
