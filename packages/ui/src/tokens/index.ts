// SnapScope Design System Tokens

export const colors = {
  // Light Mode Colors  
  light: {
    bgPrimary: '#F5E6D3',
    bgSurface: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    borderColor: '#E5E7EB',
    dividerColor: '#D1D5DB',
  },
  // Dark Mode Colors
  dark: {
    bgPrimary: '#1A1A1A',
    bgSurface: '#2A2A2A',
    textPrimary: '#F5F5F5',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    borderColor: '#374151',
    dividerColor: '#4B5563',
  },
  // Brand Colors
  brand: {
    primaryStart: '#8B5CF6',
    primaryEnd: '#6366F1',
    primaryStartDark: '#7C3AED',
    primaryEndDark: '#4F46E5',
  },
  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#F43F5E',
    info: '#6366F1',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

export const typography = {
  fontSize: {
    h1: '24px',
    h2: '20px', 
    h3: '18px',
    body: '16px',
    small: '14px',
    caption: '12px',
  },
  fontWeight: {
    normal: 400,
    semibold: 600,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
} as const;

export const shadows = {
  light: {
    1: '0 2px 4px rgba(0,0,0,0.1)',
    2: '0 4px 8px rgba(0,0,0,0.15)',
    3: '0 6px 12px rgba(0,0,0,0.2)',
  },
  dark: {
    1: '0 2px 4px rgba(0,0,0,0.3)',
    2: '0 4px 8px rgba(0,0,0,0.4)',
    3: '0 6px 12px rgba(0,0,0,0.5)',
  },
} as const;

export const transitions = {
  default: '300ms ease-in-out',
  quick: '150ms ease-out',
  complex: '400ms ease-in-out',
} as const;

// Theme type
export type Theme = 'light' | 'dark';

// CSS Variables mapping
export const cssVars = {
  bgPrimary: 'var(--bg-primary)',
  bgSurface: 'var(--bg-surface)',
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textTertiary: 'var(--text-tertiary)',
  borderColor: 'var(--border-color)',
  dividerColor: 'var(--divider-color)',
  primaryStart: 'var(--primary-start)',
  primaryEnd: 'var(--primary-end)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  info: 'var(--info)',
  shadow1: 'var(--shadow-1)',
  shadow2: 'var(--shadow-2)',
  shadow3: 'var(--shadow-3)',
  spaceXs: 'var(--space-xs)',
  spaceSm: 'var(--space-sm)',
  spaceMd: 'var(--space-md)',
  spaceLg: 'var(--space-lg)',
  spaceXl: 'var(--space-xl)',
  space2xl: 'var(--space-2xl)',
  space3xl: 'var(--space-3xl)',
  transitionDefault: 'var(--transition-default)',
  transitionQuick: 'var(--transition-quick)',
  borderRadiusSm: 'var(--border-radius-sm)',
  borderRadiusMd: 'var(--border-radius-md)',
  borderRadiusLg: 'var(--border-radius-lg)',
  borderRadiusXl: 'var(--border-radius-xl)',
} as const;