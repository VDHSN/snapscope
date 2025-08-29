import React from 'react';
import { Typography } from './typography';
import { Card } from './card';
import { CameraIcon, CheckIcon } from './icon';
import type { PhotoPosition, CapturedPhoto } from './photo-guide-types';

export interface PhotoProgressGridProps {
  positions: PhotoPosition[];
  photos: CapturedPhoto[];
  currentPositionId: string;
  onPositionSelect: (positionId: string) => void;
}

export const PhotoProgressGrid: React.FC<PhotoProgressGridProps> = ({ 
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
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 'var(--space-sm)'
      }}>
        {positions.slice(0, 8).map((position) => {
          const photo = photos.find(p => p.positionId === position.id);
          
          return (
            <button
              key={position.id}
              onClick={() => onPositionSelect(position.id)}
              style={{
                aspectRatio: '1',
                border: currentPositionId === position.id 
                  ? '2px solid var(--primary-end)' 
                  : photo
                  ? '2px solid var(--color-success)'
                  : '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                background: photo?.dataUrl 
                  ? `url(${photo.dataUrl}) center/cover`
                  : currentPositionId === position.id
                  ? 'var(--primary-start)'
                  : 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                position: 'relative',
                transform: currentPositionId === position.id ? 'scale(1.05)' : 'scale(1)',
              }}
              title={`${position.name ?? 'Position ' + position.order}${position.required ? ' (Required)' : ' (Optional)'}`}
              aria-label={`${position.name ?? 'Position ' + position.order}, step ${position.order}, ${position.required ? 'required' : 'optional'}${photo ? ', completed' : ', not completed'}${currentPositionId === position.id ? ', currently selected' : ''}`}
            >
              {photo ? (
                // Success indicator for completed photos
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
                }}>
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
          );
        })}
      </div>
    </Card>
  );
};