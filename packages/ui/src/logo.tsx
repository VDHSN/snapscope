/**
 * Logo component for Snapscope branding
 */

import * as React from 'react';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  showText?: boolean;
}

const sizeStyles = {
  sm: {
    width: '32px',
    height: '32px',
    fontSize: 'var(--font-size-small)',
  },
  md: {
    width: '48px',
    height: '48px',
    fontSize: 'var(--font-size-body)',
  },
  lg: {
    width: '64px',
    height: '64px',
    fontSize: 'var(--font-size-h4)',
  },
  xl: {
    width: '120px',
    height: '120px',
    fontSize: 'var(--font-size-h3)',
  },
};

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-sm)',
  color: 'var(--text-primary)',
};

// Snapscope logo using actual image asset
const LogoIcon: React.FC<{ size: string; className?: string }> = ({ size, className }) => {
  // Simplified approach - just show the image directly
  return (
    <img
      src="/app-logo.png"
      alt="SnapScope Logo"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
      }}
      className={className}
      onError={(e) => {
        console.error('Logo failed to load:', e);
        // Fallback to a simple div if image fails
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
};

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ size = 'md', variant = 'full', showText = true, className = '', style, ...props }, ref) => {
    const sizeStyle = sizeStyles[size];
    
    const combinedStyle: React.CSSProperties = {
      ...baseStyle,
      ...style,
    };

    if (variant === 'icon') {
      return (
        <div
          ref={ref}
          className={className}
          style={combinedStyle}
          {...props}
        >
          <LogoIcon size={sizeStyle.width} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={className}
        style={combinedStyle}
        {...props}
      >
        <LogoIcon size={sizeStyle.width} />
        {showText && (
          <span
            style={{
              fontSize: sizeStyle.fontSize,
              fontWeight: 'var(--font-weight-bold)',
              background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SnapScope
          </span>
        )}
      </div>
    );
  }
);

Logo.displayName = 'Logo';