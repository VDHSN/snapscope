import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 1 | 2 | 3;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const baseStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  borderRadius: 'var(--border-radius-xl)',
  border: '1px solid var(--border-color)',
  transition: 'var(--transition-default)',
  fontFamily: 'inherit',
};

const elevations = {
  1: {
    boxShadow: 'var(--shadow-1)',
  },
  2: {
    boxShadow: 'var(--shadow-2)',
  },
  3: {
    boxShadow: 'var(--shadow-3)',
  },
};

const paddings = {
  sm: {
    padding: 'var(--space-sm)',
  },
  md: {
    padding: 'var(--space-md)',
  },
  lg: {
    padding: 'var(--space-lg)',
  },
  xl: {
    padding: 'var(--space-xl)',
  },
};

const hoverStyle: React.CSSProperties = {
  transform: 'translateY(-2px)',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ elevation = 1, padding = 'lg', style, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const elevationStyle = elevations[elevation];
    const paddingStyle = paddings[padding];

    const combinedStyle: React.CSSProperties = {
      ...baseStyle,
      ...elevationStyle,
      ...paddingStyle,
      ...(isHovered ? hoverStyle : {}),
      ...style,
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
      onMouseLeave?.(e);
    };

    return (
      <div
        ref={ref}
        style={combinedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';