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
    width: '96px',
    height: '96px',
    fontSize: 'var(--font-size-h3)',
  },
};

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-sm)',
  color: 'var(--text-primary)',
};

// Placeholder SVG logo - replace with actual Snapscope logo
const LogoIcon: React.FC<{ size: string; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="url(#gradient)"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M35 50L45 60L70 35"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--primary-start)" />
        <stop offset="100%" stopColor="var(--primary-end)" />
      </linearGradient>
    </defs>
  </svg>
);

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