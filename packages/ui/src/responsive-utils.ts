/**
 * Responsive utility functions and constants for consistent breakpoint handling
 */

export const BREAKPOINTS = {
  mobile: 639, // max-width for mobile
  tablet: 640, // min-width for tablet
  desktop: 1024, // min-width for desktop
} as const;

/**
 * Media query strings for consistent responsive design
 */
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  tabletAndUp: `(min-width: ${BREAKPOINTS.tablet}px)`,
} as const;

/**
 * Creates responsive CSS styles that can be injected into the document head
 */
export function createResponsiveStyles(
  selector: string, 
  styles: {
    mobile?: Record<string, string | number>;
    tablet?: Record<string, string | number>;
    desktop?: Record<string, string | number>;
    base?: Record<string, string | number>;
  }
): string {
  const styleStrings: string[] = [];
  
  // Base styles (apply to all sizes)
  if (styles.base) {
    const baseProps = Object.entries(styles.base)
      .map(([prop, value]) => `${kebabCase(prop)}: ${value};`)
      .join('\n    ');
    styleStrings.push(`${selector} {\n    ${baseProps}\n  }`);
  }
  
  // Mobile styles
  if (styles.mobile) {
    const mobileProps = Object.entries(styles.mobile)
      .map(([prop, value]) => `${kebabCase(prop)}: ${value};`)
      .join('\n      ');
    styleStrings.push(`@media ${MEDIA_QUERIES.mobile} {\n    ${selector} {\n      ${mobileProps}\n    }\n  }`);
  }
  
  // Tablet and up styles
  if (styles.tablet) {
    const tabletProps = Object.entries(styles.tablet)
      .map(([prop, value]) => `${kebabCase(prop)}: ${value};`)
      .join('\n      ');
    styleStrings.push(`@media ${MEDIA_QUERIES.tablet} {\n    ${selector} {\n      ${tabletProps}\n    }\n  }`);
  }
  
  // Desktop styles
  if (styles.desktop) {
    const desktopProps = Object.entries(styles.desktop)
      .map(([prop, value]) => `${kebabCase(prop)}: ${value};`)
      .join('\n      ');
    styleStrings.push(`@media ${MEDIA_QUERIES.desktop} {\n    ${selector} {\n      ${desktopProps}\n    }\n  }`);
  }
  
  return styleStrings.join('\n\n  ');
}

/**
 * Injects responsive styles into the document head
 */
export function injectResponsiveStyles(id: string, css: string): void {
  if (typeof document === 'undefined') return; // SSR guard
  
  if (!document.head.querySelector(`#${id}`)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }
}

/**
 * Convert camelCase to kebab-case for CSS properties
 */
function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Get responsive spacing values
 */
export const RESPONSIVE_SPACING = {
  padding: {
    mobile: 'var(--space-sm)',
    tablet: 'var(--space-md)',
    desktop: 'var(--space-lg)',
  },
  margin: {
    mobile: 'var(--space-xs)',
    tablet: 'var(--space-sm)', 
    desktop: 'var(--space-md)',
  },
  gap: {
    mobile: 'var(--space-xs)',
    tablet: 'var(--space-sm)',
    desktop: 'var(--space-md)',
  },
} as const;

/**
 * Get responsive grid configurations
 */
export const RESPONSIVE_GRIDS = {
  photoProgress: {
    mobile: 'repeat(3, 1fr)',
    tablet: 'repeat(4, 1fr)',
    desktop: 'repeat(4, 1fr)',
  },
} as const;

/**
 * Minimum touch target size for accessibility
 */
export const TOUCH_TARGET_SIZE = {
  minWidth: '44px',
  minHeight: '44px',
} as const;