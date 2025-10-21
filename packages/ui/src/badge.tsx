import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  'data-testid'?: string;
}

const baseStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: 'var(--border-radius-sm)',
  fontSize: 'var(--font-size-caption)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'white',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  lineHeight: 1,
  fontFamily: 'inherit',
};

const variants = {
  success: {
    background: 'var(--success)',
  },
  warning: {
    background: 'var(--warning)',
  },
  error: {
    background: 'var(--error)',
  },
  info: {
    background: 'var(--info)',
  },
  neutral: {
    background: 'var(--text-secondary)',
  },
};

const sizes = {
  sm: {
    padding: '2px 6px',
    fontSize: 'var(--font-size-caption)',
  },
  md: {
    padding: '4px 8px',
    fontSize: 'var(--font-size-caption)',
  },
  lg: {
    padding: '6px 12px',
    fontSize: 'var(--font-size-small)',
  },
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', size = 'md', style, ...props }, ref) => {
    const variantStyle = variants[variant];
    const sizeStyle = sizes[size];

    const combinedStyle: React.CSSProperties = {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      ...style,
    };

    return (
      <span
        ref={ref}
        style={combinedStyle}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';