import React from 'react';
import { Typography } from './typography';
import { Card } from './card';
import { CameraIcon, CheckIcon } from './icon';
import type { PhotoPosition, CapturedPhoto } from './photo-guide-types';
import { createSafeBackgroundImage, isValidImageDataUrl } from './photo-utils';
import { createResponsiveStyles, injectResponsiveStyles, RESPONSIVE_GRIDS, TOUCH_TARGET_SIZE } from './responsive-utils';

// Responsive grid styles using utility functions
const RESPONSIVE_GRID_STYLES = createResponsiveStyles('.photo-progress-grid', {
  base: {
    display: 'grid',
    gap: 'var(--space-sm)',
  },
  mobile: {
    gridTemplateColumns: RESPONSIVE_GRIDS.photoProgress.mobile,
  },
  tablet: {
    gridTemplateColumns: RESPONSIVE_GRIDS.photoProgress.tablet,
  },
});

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
  minHeight: TOUCH_TARGET_SIZE.minHeight, // Ensure touch targets meet accessibility standards
  minWidth: TOUCH_TARGET_SIZE.minWidth,
} as const;

export interface PhotoProgressGridProps {
  positions: PhotoPosition[];
  photos: CapturedPhoto[];
  currentPositionId: string;
  onPositionSelect: (positionId: string) => void;
  isLoading?: boolean;
  onPhotoError?: (positionId: string, error: Error) => void;
}

export const PhotoProgressGrid = React.memo<PhotoProgressGridProps>(({ 
  positions, 
  photos, 
  currentPositionId, 
  onPositionSelect,
  isLoading = false,
  onPhotoError
}) => {
  // Inject responsive styles (only once)
  React.useEffect(() => {
    injectResponsiveStyles('photo-progress-grid-styles', RESPONSIVE_GRID_STYLES);
  }, []);

  return (
    <Card elevation={1} padding="md">
      <Typography variant="h3" style={{ 
        color: 'var(--text-primary)',
        marginBottom: 'var(--space-md)',
        fontSize: 'var(--font-size-h3)'
      }}>
        Photo Progress
      </Typography>
      
      <div className="photo-progress-grid">
        {positions.slice(0, 8).map((position) => {
          const photo = photos.find(p => p.positionId === position.id);
          const isValidPhoto = photo?.dataUrl && isValidImageDataUrl(photo.dataUrl);
          const hasPhotoError = photo?.dataUrl && !isValidPhoto;
          
          // Safely create background image
          let backgroundStyle: string;
          try {
            backgroundStyle = isValidPhoto 
              ? createSafeBackgroundImage(photo.dataUrl)
              : currentPositionId === position.id
              ? 'var(--primary-start)'
              : 'var(--bg-secondary)';
          } catch (error) {
            console.warn('Error creating background image for position:', position.id, error);
            backgroundStyle = currentPositionId === position.id
              ? 'var(--primary-start)'
              : 'var(--bg-secondary)';
            
            if (onPhotoError) {
              onPhotoError(position.id, new Error(`Failed to render photo for position: ${position.name}`));
            }
          }
          
          return (
            <button
              key={position.id}
              onClick={() => onPositionSelect(position.id)}
              disabled={isLoading}
              style={{
                ...BASE_BUTTON_STYLES,
                border: currentPositionId === position.id 
                  ? '2px solid var(--primary-end)' 
                  : isValidPhoto
                  ? '2px solid var(--color-success)'
                  : hasPhotoError
                  ? '2px solid var(--color-error)'
                  : '1px solid var(--border-color)',
                background: backgroundStyle,
                transform: currentPositionId === position.id ? 'scale(1.05)' : 'scale(1)',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              title={`${position.name ?? 'Position ' + position.order}${position.required ? ' (Required)' : ' (Optional)'}${hasPhotoError ? ' (Photo Error)' : ''}`}
              aria-label={`${position.name ?? 'Position ' + position.order}, step ${position.order}, ${position.required ? 'required' : 'optional'}${isValidPhoto ? ', completed' : hasPhotoError ? ', photo error' : ', not completed'}${currentPositionId === position.id ? ', currently selected' : ''}`}
            >
              {isValidPhoto ? (
                // Success indicator for completed photos
                <div style={SUCCESS_INDICATOR_STYLES}>
                  <CheckIcon size="sm" style={{ color: 'white', fontSize: '10px' }} />
                </div>
              ) : hasPhotoError ? (
                // Error indicator for corrupted photos
                <div style={{
                  ...SUCCESS_INDICATOR_STYLES,
                  background: 'var(--color-error)',
                }}>
                  <Typography variant="caption" style={{ 
                    color: 'white',
                    fontSize: '8px',
                    lineHeight: 1
                  }}>
                    ⚠️
                  </Typography>
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
              {!isValidPhoto && position.required && (
                <div style={REQUIRED_INDICATOR_STYLES} />
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
});