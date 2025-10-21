import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  'data-testid'?: string;
}

const baseStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 'var(--border-radius-md)',
  fontWeight: 'var(--font-weight-semibold)',
  cursor: 'pointer',
  transition: 'var(--transition-default)',
  border: 'none',
  fontSize: 'var(--font-size-body)',
  fontFamily: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-xs)',
  textDecoration: 'none',
};

const variants = {
  primary: {
    background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
    color: 'white',
  },
  secondary: {
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
  },
  destructive: {
    background: 'var(--error)',
    color: 'white',
  },
};

const sizes = {
  sm: {
    padding: '8px 12px',
    fontSize: 'var(--font-size-small)',
  },
  md: {
    padding: '12px 16px',
    fontSize: 'var(--font-size-body)',
  },
  lg: {
    padding: '16px 24px',
    fontSize: 'var(--font-size-body)',
  },
};

// Focus style for accessibility
const focusVisibleStyle: React.CSSProperties = {
  outline: '2px solid var(--primary-start)',
  outlineOffset: '2px',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', style, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const variantStyle = variants[variant];
    const sizeStyle = sizes[size];

    const hoverStyle: React.CSSProperties = React.useMemo(() => {
      switch (variant) {
        case 'primary':
          return {
            filter: 'brightness(1.1)',
            transform: 'scale(0.98)',
          };
        case 'secondary':
          return {
            background: 'var(--text-secondary)',
            color: 'white',
          };
        case 'destructive':
          return {
            filter: 'brightness(1.1)',
            transform: 'scale(0.98)',
          };
        default:
          return {};
      }
    }, [variant]);

    const combinedStyle: React.CSSProperties = {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      ...(isHovered ? hoverStyle : {}),
      ...(isFocused ? focusVisibleStyle : {}),
      ...style,
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(true);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      onMouseLeave?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <button
        ref={ref}
        style={combinedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';