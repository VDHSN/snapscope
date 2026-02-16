import React from 'react';
import { Typography } from './typography';
import { Icon } from './icon';

export interface PhotoPosition {
  id: string;
  name: string;
  order: number;
  required: boolean;
}

export interface PhotoPreview {
  positionId: string;
  url: string;
  thumbnail?: string;
}

export interface PhotoPreviewGridProps {
  positions: PhotoPosition[];
  photos: PhotoPreview[];
  currentPositionId?: string;
  onPositionSelect?: (positionId: string) => void;
  columns?: number;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const PhotoPreviewGrid: React.FC<PhotoPreviewGridProps> = ({
  positions,
  photos,
  currentPositionId,
  onPositionSelect,
  columns = 4,
  showLabels = false,
  size = 'md',
  className,
  style,
}) => {
  const photoMap = new Map(photos.map(photo => [photo.positionId, photo]));
  
  const sizeStyles = {
    sm: {
      gridSize: '60px',
      fontSize: 'var(--font-size-xs)',
      iconSize: 'sm' as const,
      gap: 'var(--space-xs)',
    },
    md: {
      gridSize: '80px',
      fontSize: 'var(--font-size-small)',
      iconSize: 'md' as const,
      gap: 'var(--space-sm)',
    },
    lg: {
      gridSize: '100px',
      fontSize: 'var(--font-size-small)',
      iconSize: 'lg' as const,
      gap: 'var(--space-md)',
    },
  };

  const currentSizeStyle = sizeStyles[size];

  return (
    <div className={className} style={style}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: currentSizeStyle.gap,
      }}>
        {positions.map((position) => {
          const photo = photoMap.get(position.id);
          const isCompleted = !!photo;
          const isCurrent = currentPositionId === position.id;
          const isRequired = position.required;

          return (
            <div key={position.id} style={{ textAlign: 'center' }}>
              {/* Photo Grid Item */}
              <button
                onClick={() => onPositionSelect?.(position.id)}
                disabled={!onPositionSelect}
                style={{
                  width: currentSizeStyle.gridSize,
                  height: currentSizeStyle.gridSize,
                  border: isCurrent 
                    ? '2px solid var(--primary-end)' 
                    : isCompleted
                    ? '2px solid var(--color-success)'
                    : isRequired
                    ? '1px solid var(--border-color)'
                    : '1px dashed var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  background: isCompleted && photo
                    ? `url(${photo.thumbnail || photo.url}) center/cover`
                    : isCurrent
                    ? 'var(--primary-start)'
                    : 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: onPositionSelect ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isCurrent 
                    ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                    : isCompleted
                    ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                    : 'none',
                }}
                title={`${position.name}${isRequired ? ' (Required)' : ' (Optional)'}`}
                aria-label={`Photo position: ${position.name}. ${
                  isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Pending'
                }`}
              >
                {/* Content based on state */}
                {isCompleted ? (
                  <>
                    {/* Success indicator overlay */}
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: 'var(--color-success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon 
                        name="check" 
                        size="sm" 
                        style={{ 
                          color: 'white',
                          fontSize: '10px'
                        }} 
                      />
                    </div>
                  </>
                ) : isCurrent ? (
                  <Icon 
                    name="camera" 
                    size={currentSizeStyle.iconSize} 
                    style={{ color: 'white' }} 
                  />
                ) : (
                  <Typography 
                    variant="caption" 
                    style={{ 
                      color: 'var(--text-secondary)',
                      fontSize: currentSizeStyle.fontSize,
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {position.order}
                  </Typography>
                )}

                {/* Required indicator */}
                {!isCompleted && isRequired && (
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--color-warning)',
                  }} />
                )}
              </button>

              {/* Position Label */}
              {showLabels && (
                <Typography 
                  variant="caption" 
                  style={{ 
                    marginTop: 'var(--space-xs)',
                    color: isCurrent ? 'var(--primary-end)' : 'var(--text-secondary)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: isCurrent ? 'var(--font-weight-medium)' : 'normal',
                    display: 'block',
                    lineHeight: 1.2,
                  }}
                >
                  {position.name.length > 10 
                    ? `${position.name.substring(0, 8)}...`
                    : position.name
                  }
                </Typography>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};