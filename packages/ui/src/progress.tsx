import React from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
}

const baseStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--border-color)',
  borderRadius: '4px',
  overflow: 'hidden',
  position: 'relative',
};

const barBaseStyle: React.CSSProperties = {
  height: '100%',
  transition: 'var(--transition-default)',
  borderRadius: 'inherit',
};

const variants = {
  primary: {
    background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
  },
  success: {
    background: 'var(--success)',
  },
  warning: {
    background: 'var(--warning)',
  },
  error: {
    background: 'var(--error)',
  },
};

const sizes = {
  sm: {
    height: '4px',
  },
  md: {
    height: '8px',
  },
  lg: {
    height: '12px',
  },
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    value, 
    size = 'md', 
    variant = 'primary', 
    showLabel = false,
    label,
    style,
    className = '',
    ...props 
  }, ref) => {
    // Clamp value between 0 and 100
    const clampedValue = Math.max(0, Math.min(100, value));
    
    const sizeStyle = sizes[size];
    const variantStyle = variants[variant];

    const containerStyle: React.CSSProperties = {
      ...baseStyle,
      ...sizeStyle,
      ...style,
    };

    const barStyle: React.CSSProperties = {
      ...barBaseStyle,
      ...variantStyle,
      width: `${clampedValue}%`,
    };

    const displayLabel = label || `${Math.round(clampedValue)}%`;

    return (
      <div className={className} {...props}>
        {showLabel && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 'var(--space-xs)' 
          }}>
            <span style={{ 
              fontSize: 'var(--font-size-small)', 
              color: 'var(--text-primary)',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              Progress
            </span>
            <span style={{ 
              fontSize: 'var(--font-size-small)', 
              color: 'var(--text-secondary)' 
            }}>
              {displayLabel}
            </span>
          </div>
        )}
        <div ref={ref} style={containerStyle}>
          <div style={barStyle} />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';