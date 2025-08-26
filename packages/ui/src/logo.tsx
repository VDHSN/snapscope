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

// Get the appropriate logo asset based on size
const getLogoSrc = (targetSize: string): string => {
  const sizeNum = parseInt(targetSize);
  
  if (sizeNum <= 32) return '/logo-32.png';
  if (sizeNum <= 48) return '/logo-48.png';
  if (sizeNum <= 64) return '/logo-64.png';
  if (sizeNum <= 120) return '/logo-120.png';
  return '/app-logo.png'; // Original for larger sizes
};

// Snapscope logo using appropriately sized assets with SVG fallback
const LogoIcon: React.FC<{ size: string; className?: string }> = ({ size, className }) => {
  const [hasError, setHasError] = React.useState(false);
  
  if (hasError) {
    // SVG fallback logo
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="SnapScope Logo"
        style={{
          width: size,
          height: size,
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="url(#logo-gradient)"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M8 12h8M12 8v8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-start)" />
            <stop offset="100%" stopColor="var(--primary-end)" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  const logoSrc = getLogoSrc(size);

  return (
    <img
      src={logoSrc}
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
        console.warn(`Logo image failed to load (${logoSrc}), switching to SVG fallback`);
        setHasError(true);
      }}
      onLoad={() => {
        setHasError(false);
      }}
      loading="eager"
      decoding="async"
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