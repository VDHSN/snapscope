import React from 'react';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';
export type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant: TypographyVariant;
  as?: TypographyElement;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const variantStyles: Record<TypographyVariant, React.CSSProperties> = {
  h1: {
    fontSize: 'var(--font-size-h1)',
    fontWeight: 'var(--font-weight-semibold)',
    lineHeight: 'var(--line-height-tight)',
    margin: 0,
  },
  h2: {
    fontSize: 'var(--font-size-h2)',
    fontWeight: 'var(--font-weight-semibold)',
    lineHeight: 'var(--line-height-tight)',
    margin: 0,
  },
  h3: {
    fontSize: 'var(--font-size-h3)',
    fontWeight: 'var(--font-weight-semibold)',
    lineHeight: 'var(--line-height-tight)',
    margin: 0,
  },
  body: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 'var(--font-weight-normal)',
    lineHeight: 'var(--line-height-normal)',
    margin: 0,
  },
  small: {
    fontSize: 'var(--font-size-small)',
    fontWeight: 'var(--font-weight-normal)',
    lineHeight: 'var(--line-height-normal)',
    margin: 0,
  },
  caption: {
    fontSize: 'var(--font-size-caption)',
    fontWeight: 'var(--font-weight-normal)',
    lineHeight: 'var(--line-height-relaxed)',
    margin: 0,
  },
};

const defaultElements: Record<TypographyVariant, TypographyElement> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  small: 'span',
  caption: 'span',
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant, as, className = '', style, children, ...props }, ref) => {
    const Element = as || defaultElements[variant];
    const variantStyle = variantStyles[variant];
    
    const combinedStyle: React.CSSProperties = {
      ...variantStyle,
      color: 'var(--text-primary)',
      ...style,
    };

    return React.createElement(
      Element,
      {
        ref,
        className,
        style: combinedStyle,
        ...props,
      },
      children
    );
  }
);

Typography.displayName = 'Typography';