import * as React from 'react';
import { Badge } from './badge';
import { Button } from './button';

export interface PhotoStepCardProps {
  order: number;
  label: string;
  description?: string;
  category: 'exterior' | 'interior' | 'vin' | 'damage';
  required: boolean;
  onToggleRequired?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  draggable?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  className?: string;
}

const baseStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  borderRadius: 'var(--border-radius-md)',
  border: '1px solid var(--border-color)',
  padding: 'var(--space-md)',
  display: 'flex',
  gap: 'var(--space-md)',
  alignItems: 'flex-start',
  transition: 'var(--transition-default)',
};

const dragHandleStyle: React.CSSProperties = {
  cursor: 'grab',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  color: 'var(--text-secondary)',
  fontSize: '18px',
  flexShrink: 0,
};

const orderBadgeStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'var(--primary-light)',
  color: 'var(--primary-start)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-small)',
  flexShrink: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-xs)',
  minWidth: 0,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 'var(--space-sm)',
  flexWrap: 'wrap',
};

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-body)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--text-primary)',
  margin: 0,
};

const descriptionStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-small)',
  color: 'var(--text-secondary)',
  margin: 0,
};

const badgesContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-xs)',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-xs)',
  flexShrink: 0,
};

const iconButtonStyle: React.CSSProperties = {
  padding: '6px',
  borderRadius: 'var(--border-radius-sm)',
  fontSize: 'var(--font-size-small)',
  cursor: 'pointer',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  transition: 'var(--transition-default)',
  fontFamily: 'inherit',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const toggleButtonStyle: React.CSSProperties = {
  ...iconButtonStyle,
  fontSize: 'var(--font-size-caption)',
  padding: '4px 8px',
  width: 'auto',
  whiteSpace: 'nowrap',
};

const categoryVariants: Record<string, 'info' | 'success' | 'warning' | 'neutral'> = {
  exterior: 'info',
  interior: 'success',
  vin: 'warning',
  damage: 'neutral',
};

const draggingStyle: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'grabbing',
};

export const PhotoStepCard = React.forwardRef<HTMLDivElement, PhotoStepCardProps>(
  (
    {
      order,
      label,
      description,
      category,
      required,
      onToggleRequired,
      onEdit,
      onDelete,
      draggable = false,
      dragHandleProps,
      className,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);

    const combinedStyle: React.CSSProperties = {
      ...baseStyle,
      ...(isDragging ? draggingStyle : {}),
    };

    return (
      <div
        ref={ref}
        className={className}
        style={combinedStyle}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {draggable && (
          <div style={dragHandleStyle} {...dragHandleProps}>
            ⋮⋮
          </div>
        )}

        <div style={orderBadgeStyle}>{order}</div>

        <div style={contentStyle}>
          <div style={headerStyle}>
            <h4 style={labelStyle}>{label}</h4>
            <div style={badgesContainerStyle}>
              <Badge variant={categoryVariants[category]} size="sm">
                {category}
              </Badge>
              {required && (
                <Badge variant="error" size="sm">
                  Required
                </Badge>
              )}
            </div>
          </div>

          {description && <p style={descriptionStyle}>{description}</p>}
        </div>

        <div style={actionsStyle}>
          {onToggleRequired && (
            <button
              type="button"
              style={toggleButtonStyle}
              onClick={onToggleRequired}
              aria-label={required ? 'Mark as optional' : 'Mark as required'}
            >
              {required ? 'Optional' : 'Required'}
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              style={iconButtonStyle}
              onClick={onEdit}
              aria-label="Edit photo step"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              style={{ ...iconButtonStyle, color: 'var(--error)' }}
              onClick={onDelete}
              aria-label="Delete photo step"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }
);

PhotoStepCard.displayName = 'PhotoStepCard';
