import React from 'react';
import { Typography } from './typography';
import { Card } from './card';
import { CameraIcon, CheckIcon } from './icon';
import type { PhotoPosition, CapturedPhoto } from './photo-guide-types';

// Static styles that don't change based on props
const GRID_STYLES = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 'var(--space-sm)'
} as const;

const SUCCESS_INDICATOR_STYLES = {
  position: 'absolute' as const,
  top: '2px',
  right: '2px',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  background: 'var(--color-success)',
  display: 'flex',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
} as const;

const REQUIRED_INDICATOR_STYLES = {
  position: 'absolute' as const,
  top: '2px',
  left: '2px',
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: 'var(--color-warning)',
} as const;

const BASE_BUTTON_STYLES = {
  aspectRatio: '1',
  borderRadius: 'var(--border-radius-sm)',
  display: 'flex',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  cursor: 'pointer' as const,
  transition: 'all 0.2s ease',
  overflow: 'hidden' as const,
  position: 'relative' as const,
} as const;

export interface PhotoProgressGridProps {
  positions: PhotoPosition[];
  photos: CapturedPhoto[];
  currentPositionId: string;
  onPositionSelect: (positionId: string) => void;
}

export const PhotoProgressGrid = React.memo<PhotoProgressGridProps>(({ 
  positions, 
  photos, 
  currentPositionId, 
  onPositionSelect 
}) => {
  return (
    <Card elevation={1} padding="md">
      <Typography variant="h3" style={{ 
        color: 'var(--text-primary)',
        marginBottom: 'var(--space-md)',
        fontSize: 'var(--font-size-h3)'
      }}>
        Photo Progress
      </Typography>
      
      <div style={GRID_STYLES}>
        {positions.slice(0, 8).map((position) => {
          const photo = photos.find(p => p.positionId === position.id);
          
          return (
            <button
              key={position.id}
              onClick={() => onPositionSelect(position.id)}
              style={{
                ...BASE_BUTTON_STYLES,
                border: currentPositionId === position.id 
                  ? '2px solid var(--primary-end)' 
                  : photo
                  ? '2px solid var(--color-success)'
                  : '1px solid var(--border-color)',
                background: photo?.dataUrl 
                  ? `url(${photo.dataUrl}) center/cover`
                  : currentPositionId === position.id
                  ? 'var(--primary-start)'
                  : 'var(--bg-secondary)',
                transform: currentPositionId === position.id ? 'scale(1.05)' : 'scale(1)',
              }}
              title={`${position.name ?? 'Position ' + position.order}${position.required ? ' (Required)' : ' (Optional)'}`}
              aria-label={`${position.name ?? 'Position ' + position.order}, step ${position.order}, ${position.required ? 'required' : 'optional'}${photo ? ', completed' : ', not completed'}${currentPositionId === position.id ? ', currently selected' : ''}`}
            >
              {photo ? (
                // Success indicator for completed photos
                <div style={SUCCESS_INDICATOR_STYLES}>
                  <CheckIcon size="sm" style={{ color: 'white', fontSize: '10px' }} />
                </div>
              ) : currentPositionId === position.id ? (
                <CameraIcon size="sm" style={{ color: 'white' }} />
              ) : (
                <Typography variant="caption" style={{ 
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  {position.order}
                </Typography>
              )}

              {/* Required indicator */}
              {!photo && position.required && (
                <div style={REQUIRED_INDICATOR_STYLES} />
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
});