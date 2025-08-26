import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'error';
}

const baseStyle: React.CSSProperties = {
  padding: '12px',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--border-radius-md)',
  background: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  fontSize: 'var(--font-size-body)',
  transition: 'var(--transition-default)',
  width: '100%',
  fontFamily: 'inherit',
  outline: 'none',
};

const variants = {
  default: {
    borderColor: 'var(--border-color)',
  },
  error: {
    borderColor: 'var(--error)',
  },
};

const sizes = {
  sm: {
    padding: '8px',
    fontSize: 'var(--font-size-small)',
  },
  md: {
    padding: '12px',
    fontSize: 'var(--font-size-body)',
  },
  lg: {
    padding: '16px',
    fontSize: 'var(--font-size-body)',
  },
};

const focusStyle: React.CSSProperties = {
  borderColor: 'var(--primary-end)',
  boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', variant = 'default', style, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const variantStyle = variants[variant];
    const sizeStyle = sizes[size];

    const combinedStyle: React.CSSProperties = {
      ...baseStyle,
      ...variantStyle,
      ...sizeStyle,
      ...(isFocused ? focusStyle : {}),
      ...style,
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <input
        ref={ref}
        style={combinedStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';