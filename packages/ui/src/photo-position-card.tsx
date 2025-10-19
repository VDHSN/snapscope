import React, { useState, useCallback } from 'react';
import { Typography } from './typography';
import { Button } from './button';
import { Card } from './card';
import { CameraIcon, CheckIcon } from './icon';
import type { PhotoPosition, CapturedPhoto } from './photo-guide-types';
import { isValidImageDataUrl } from './photo-utils';
import { createResponsiveStyles, injectResponsiveStyles, RESPONSIVE_SPACING } from './responsive-utils';

export interface PhotoPositionCardProps {
  position: PhotoPosition;
  photo?: CapturedPhoto;
  isSaving?: boolean;
  isLoading?: boolean;
  onTakePhoto: () => void;
  onRetakePhoto?: () => void;
  onSkip?: () => void;
  onImageError?: (error: Error) => void;
  'data-testid'?: string;
}

export const PhotoPositionCard = React.memo<PhotoPositionCardProps>(({
  position,
  photo,
  isSaving = false,
  isLoading = false,
  onTakePhoto,
  onRetakePhoto,
  onSkip,
  onImageError,
  'data-testid': testId
}) => {
  const cardTestId = testId || `photo-card-${position.id}`;
  const [imageError, setImageError] = useState(false);

  // Validate photo data URL
  const isValidPhoto = photo?.dataUrl && isValidImageDataUrl(photo.dataUrl);
  const safeDataUrl = isValidPhoto ? photo.dataUrl : null;

  // Handle image load errors
  const handleImageError = useCallback((_event: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn('Failed to load photo for position:', position.id);
    setImageError(true);
    
    const error = new Error(`Failed to load photo for position: ${position.name}`);
    if (onImageError) {
      onImageError(error);
    }
  }, [position.id, position.name, onImageError]);

  // Reset error state when photo changes
  React.useEffect(() => {
    if (safeDataUrl) {
      setImageError(false);
    }
  }, [safeDataUrl]);

  // Add keyframes for loading animation and responsive styles inline
  const loadingKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // Responsive styles using utility functions
  const responsiveStyles = [
    createResponsiveStyles('.photo-preview-area', {
      base: {
        width: '100%',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--border-radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--space-md)',
        overflow: 'hidden',
        position: 'relative',
        height: '200px', // Default mobile height
      },
      tablet: {
        height: '240px', // Larger preview for tablet and desktop
      },
    }),
    createResponsiveStyles('.photo-position-card-container', {
      base: {
        textAlign: 'center',
      },
      mobile: {
        padding: RESPONSIVE_SPACING.padding.mobile,
      },
      tablet: {
        padding: RESPONSIVE_SPACING.padding.tablet,
      },
    }),
    createResponsiveStyles('.photo-action-buttons', {
      base: {
        display: 'flex',
        gap: 'var(--space-md)',
      },
    }),
    // Additional responsive styles for very small screens
    `@media (max-width: 479px) {
      .photo-action-buttons {
        flex-direction: column;
        gap: var(--space-sm);
      }
    }`,
  ].join('\n\n');

  // Inject keyframes and responsive styles (only once)
  React.useEffect(() => {
    injectResponsiveStyles('spin-keyframes', loadingKeyframes);
    injectResponsiveStyles('photo-position-card-responsive', responsiveStyles);
  }, []);
  return (
    <Card elevation={2} padding="lg" data-testid={cardTestId}>
      <div className="photo-position-card-container">
        <Typography variant="h3" style={{ 
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-sm)',
          fontSize: 'var(--font-size-h3)'
        }}>
          {position.name}
        </Typography>
        
        <Typography variant="body" style={{ 
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-md)',
          fontSize: 'var(--font-size-small)'
        }}>
          {position.description}
        </Typography>
        
        {/* Photo Preview Area */}
        <div
          className="photo-preview-area"
          data-testid={`${cardTestId}-preview`}
          style={{
            border: safeDataUrl && !imageError ? '2px solid var(--color-success)' :
                   imageError || (!isValidPhoto && photo?.dataUrl) ? '2px solid var(--color-error)' :
                   '2px dashed var(--border-color)'
          }}
        >
          {isLoading ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid var(--border-color)',
                borderTop: '3px solid var(--primary-end)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: 'var(--space-sm)'
              }} />
              <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
                Processing...
              </Typography>
            </div>
          ) : safeDataUrl && !imageError ? (
            <>
              <img
                src={safeDataUrl}
                alt={position.name}
                onError={handleImageError}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {/* Success indicator overlay */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <CheckIcon size="sm" style={{ color: 'white' }} />
              </div>
            </>
          ) : imageError || (!isValidPhoto && photo?.dataUrl) ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                color: 'var(--color-error)',
                fontSize: '32px',
                marginBottom: 'var(--space-sm)'
              }}>
                ⚠️
              </div>
              <Typography variant="body" style={{ color: 'var(--color-error)' }}>
                Failed to load photo
              </Typography>
              <Typography variant="caption" style={{ 
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-xs)',
                marginTop: 'var(--space-xs)'
              }}>
                The photo data may be corrupted
              </Typography>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <CameraIcon size="lg" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }} />
              <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
                Ready to capture
              </Typography>
            </div>
          )}
        </div>
        
        {/* Guidance Text */}
        <Typography variant="caption" style={{ 
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-small)',
          fontStyle: 'italic',
          display: 'block',
          marginBottom: 'var(--space-lg)'
        }}>
          <span aria-hidden="true">💡 </span>{position.guidance}
        </Typography>

        {/* Action Buttons */}
        <div className="photo-action-buttons">
          {safeDataUrl && !imageError ? (
            <Button
              variant="secondary"
              size="lg"
              onClick={onRetakePhoto ?? onTakePhoto}
              disabled={isSaving || isLoading}
              style={{ flex: 1 }}
              data-testid={`${cardTestId}-retake-button`}
            >
              {isSaving ? 'Saving...' : isLoading ? 'Processing...' : 'Retake Photo'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={onTakePhoto}
              disabled={isSaving || isLoading}
              style={{ flex: 1 }}
              data-testid={`${cardTestId}-take-button`}
            >
              <CameraIcon size="sm" aria-hidden />
              {isSaving ? 'Saving...' : isLoading ? 'Processing...' : 'Take Photo'}
            </Button>
          )}

          {!position.required && !isSaving && !isLoading && onSkip && (
            <Button
              variant="secondary"
              size="lg"
              onClick={onSkip}
              data-testid={`${cardTestId}-skip-button`}
            >
              Skip
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
});