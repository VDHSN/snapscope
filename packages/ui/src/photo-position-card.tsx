import React from 'react';
import { Typography } from './typography';
import { Button } from './button';
import { Card } from './card';
import { CameraIcon, CheckIcon } from './icon';
import type { PhotoPosition, CapturedPhoto } from './photo-guide-types';

export interface PhotoPositionCardProps {
  position: PhotoPosition;
  photo?: CapturedPhoto;
  isSaving?: boolean;
  onTakePhoto: () => void;
  onRetakePhoto?: () => void;
  onSkip?: () => void;
}

export const PhotoPositionCard: React.FC<PhotoPositionCardProps> = ({ 
  position, 
  photo, 
  isSaving = false, 
  onTakePhoto, 
  onRetakePhoto, 
  onSkip 
}) => {
  return (
    <Card elevation={2} padding="lg">
      <div style={{ textAlign: 'center' }}>
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
        <div style={{
          width: '100%',
          height: '240px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--border-radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-md)',
          border: photo ? '2px solid var(--color-success)' : '2px dashed var(--border-color)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {photo?.dataUrl ? (
            <>
              <img
                src={photo.dataUrl}
                alt={position.name}
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
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          {photo ? (
            <Button
              variant="secondary"
              size="lg"
              onClick={onRetakePhoto ?? onTakePhoto}
              disabled={isSaving}
              style={{ flex: 1 }}
            >
              {isSaving ? 'Saving...' : 'Retake Photo'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={onTakePhoto}
              disabled={isSaving}
              style={{ flex: 1 }}
            >
              <CameraIcon size="sm" aria-hidden />
              {isSaving ? 'Saving...' : 'Take Photo'}
            </Button>
          )}

          {!position.required && !isSaving && onSkip && (
            <Button
              variant="secondary"
              size="lg"
              onClick={onSkip}
            >
              Skip
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};