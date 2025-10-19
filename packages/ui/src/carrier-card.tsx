import * as React from 'react';

export interface CarrierCardProps {
  name: string;
  photoCount: number;
  isTemplate?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  className?: string;
}

const baseStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  borderRadius: 'var(--border-radius-lg)',
  border: '1px solid var(--border-color)',
  padding: 'var(--space-lg)',
  transition: 'var(--transition-default)',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 'var(--space-sm)',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-lg)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--text-primary)',
  margin: 0,
};

const badgeStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-small)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--primary-start)',
  background: 'var(--primary-light)',
  padding: '4px 8px',
  borderRadius: 'var(--border-radius-sm)',
};

const photoCountStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-body)',
  color: 'var(--text-secondary)',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-sm)',
  marginTop: 'auto',
};

const buttonBaseStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 'var(--border-radius-md)',
  fontSize: 'var(--font-size-small)',
  fontWeight: 'var(--font-weight-medium)',
  cursor: 'pointer',
  border: 'none',
  transition: 'var(--transition-default)',
  fontFamily: 'inherit',
};

const editButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  background: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)',
};

const deleteButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  background: 'var(--error)',
  color: 'white',
};

const hoverStyle: React.CSSProperties = {
  transform: 'translateY(-2px)',
  boxShadow: 'var(--shadow-2)',
};

const focusStyle: React.CSSProperties = {
  outline: '2px solid var(--primary-start)',
  outlineOffset: '2px',
};

export const CarrierCard = React.forwardRef<HTMLDivElement, CarrierCardProps>(
  ({ name, photoCount, isTemplate = false, onEdit, onDelete, onSelect, className }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const combinedStyle: React.CSSProperties = {
      ...baseStyle,
      ...(isHovered ? hoverStyle : {}),
      ...(isFocused ? focusStyle : {}),
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.();
      }
    };

    return (
      <div
        ref={ref}
        className={className}
        style={combinedStyle}
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${name} carrier`}
      >
        <div style={headerStyle}>
          <div>
            <h3 style={titleStyle}>{name}</h3>
            {isTemplate && <span style={badgeStyle}>Template</span>}
          </div>
        </div>

        <p style={photoCountStyle}>
          {photoCount} {photoCount === 1 ? 'photo' : 'photos'} required
        </p>

        {(onEdit || onDelete) && (
          <div style={actionsStyle}>
            {onEdit && (
              <button
                type="button"
                style={editButtonStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                aria-label="Edit carrier"
              >
                Edit
              </button>
            )}
            {onDelete && !isTemplate && (
              <button
                type="button"
                style={deleteButtonStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                aria-label="Delete carrier"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

CarrierCard.displayName = 'CarrierCard';
