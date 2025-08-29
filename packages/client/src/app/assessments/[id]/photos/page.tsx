'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Typography } from '@snapscope/ui/typography';
import { Logo } from '@snapscope/ui/logo';
import { Button } from '@snapscope/ui/button';
import { Card } from '@snapscope/ui/card';
import { Progress } from '@snapscope/ui/progress';
import { ThemeToggle } from '@snapscope/ui/theme-toggle';
import { ArrowLeftIcon, CameraIcon, CheckIcon } from '@snapscope/ui/icon';
import { CameraCapture } from '@snapscope/ui/camera-capture';
import { useClaims } from '@/hooks/useStorage';
import { photoBlobStorage } from '@/lib/photo-storage';
import { 
  PHOTO_POSITIONS, 
  getPositionById, 
  getNextPosition,
  calculateProgress,
  areAllRequiredPhotosCompleted,
  PHOTO_GUIDE_METADATA 
} from '@/lib/photo-positions';
import type { Claim } from '@/types/claim';

export default function PhotoGuidePage() {
  const router = useRouter();
  const params = useParams();
  const { getClaim, saveClaim } = useClaims();
  const claimId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [claim, setClaim] = useState<Claim | null>(null);
  const [currentPositionId, setCurrentPositionId] = useState(PHOTO_POSITIONS[0].id);
  const [completedPositions, setCompletedPositions] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  // Load claim data and initialize photo state
  useEffect(() => {
    const loadedClaim = getClaim(claimId);
    if (loadedClaim) {
      setClaim(loadedClaim);
      
      // Initialize completed positions from existing photos
      const existingPhotos = loadedClaim.photos || [];
      const completed = existingPhotos
        .filter(photo => photo.damageAreaId) // Photos associated with positions
        .map(photo => photo.damageAreaId!)
        .filter(Boolean);
      
      setCompletedPositions(completed);
      
      // Set current position to first incomplete required position
      const nextIncomplete = PHOTO_POSITIONS.find(pos => 
        pos.required && !completed.includes(pos.id)
      );
      if (nextIncomplete) {
        setCurrentPositionId(nextIncomplete.id);
      }
    }
    setLoading(false);
  }, [claimId, getClaim]);

  // Get current position photo for display
  const getCurrentPositionPhoto = () => {
    if (!claim || !currentPosition) return null;
    
    const photo = claim.photos?.find(p => p.damageAreaId === currentPosition.id);
    if (!photo) return null;
    
    // Get photo data URL for display
    const dataUrl = photoBlobStorage.getPhotoDataUrl(photo.id);
    return dataUrl ? { ...photo, dataUrl } : null;
  };

  const currentPositionPhoto = getCurrentPositionPhoto();

  const currentPosition = getPositionById(currentPositionId);
  const allRequiredComplete = areAllRequiredPhotosCompleted(completedPositions);

  // Check storage capacity on load
  useEffect(() => {
    const storageCheck = photoBlobStorage.checkStorageCapacity();
    if (storageCheck.warning) {
      setStorageWarning(storageCheck.warning);
    }
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleLogoClick = () => {
    router.push('/assessments');
  };

  const handleTakePhoto = () => {
    // Check storage capacity before opening camera
    const storageCheck = photoBlobStorage.checkStorageCapacity();
    if (!storageCheck.available) {
      setError(storageCheck.warning || 'Storage full. Unable to take more photos.');
      return;
    }
    
    setError(null);
    setShowCamera(true);
  };

  const handlePhotoCapture = async (photoBlob: Blob) => {
    if (!claim || !currentPosition) return;

    setSaving(true);
    setError(null);

    try {
      // Check storage capacity before saving
      const storageCheck = photoBlobStorage.checkStorageCapacity();
      if (!storageCheck.available) {
        throw new Error('Storage full. Unable to save photo.');
      }

      const timestamp = new Date();
      const photoId = `photo_${timestamp.getTime()}_${Math.random().toString(36).substring(2, 15)}`;
      const filename = `${currentPosition.id}_${photoId}.jpg`;

      // Save photo using photoBlobStorage
      const photoReference = await photoBlobStorage.savePhoto(photoBlob, {
        filename,
        caption: currentPosition.name,
        damageAreaId: currentPosition.id,
        timestamp,
        cloudUrl: undefined,
      });

      // Update claim with new photo
      const updatedClaim: Claim = {
        ...claim,
        photos: [...(claim.photos || []), photoReference],
        updatedAt: timestamp,
      };

      await saveClaim(updatedClaim);
      setClaim(updatedClaim);
      
      // Update completed positions
      const newCompleted = [...completedPositions, currentPosition.id];
      setCompletedPositions(newCompleted);
      
      // Move to next position if available
      const nextPosition = getNextPosition(currentPosition.id);
      if (nextPosition) {
        setCurrentPositionId(nextPosition.id);
      }
      
      setShowCamera(false);
      
      // Check storage after saving
      const postSaveCheck = photoBlobStorage.checkStorageCapacity();
      if (postSaveCheck.warning) {
        setStorageWarning(postSaveCheck.warning);
      }
      
    } catch (error) {
      console.error('Error saving photo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save photo. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handlePositionSelect = (positionId: string) => {
    setCurrentPositionId(positionId);
  };

  const handleContinue = () => {
    // Navigate to next step (assessment review - to be implemented)
    router.push(`/assessments/${claimId}/review`);
  };

  const handleSkipOptional = () => {
    // Skip to next required position or continue if all required are done
    const nextRequired = PHOTO_POSITIONS.find(pos => 
      pos.required && !completedPositions.includes(pos.id) && pos.order > (currentPosition?.order || 0)
    );
    
    if (nextRequired) {
      setCurrentPositionId(nextRequired.id);
    } else if (allRequiredComplete) {
      handleContinue();
    }
  };

  const handleDeletePhoto = async (positionId: string) => {
    if (!claim) return;

    try {
      // Find the photo to delete
      const photoToDelete = claim.photos?.find(p => p.damageAreaId === positionId);
      if (!photoToDelete) return;

      // Delete photo blob and reference
      photoBlobStorage.deletePhoto(photoToDelete.id);

      // Update claim
      const updatedClaim: Claim = {
        ...claim,
        photos: claim.photos?.filter(p => p.id !== photoToDelete.id) || [],
        updatedAt: new Date(),
      };

      await saveClaim(updatedClaim);
      setClaim(updatedClaim);

      // Update completed positions
      const newCompleted = completedPositions.filter(id => id !== positionId);
      setCompletedPositions(newCompleted);

      setError(null);
    } catch (error) {
      console.error('Error deleting photo:', error);
      setError('Failed to delete photo. Please try again.');
    }
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, positionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePositionSelect(positionId);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="body">Loading...</Typography>
      </div>
    );
  }

  if (!claim) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="body">Assessment not found</Typography>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Theme Toggle */}
      <div style={{ 
        position: 'absolute', 
        top: 'var(--space-md)', 
        right: 'var(--space-md)',
        zIndex: 10
      }}>
        <ThemeToggle />
      </div>

      {/* Header with purple gradient */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
        padding: 'var(--space-md)',
        paddingRight: 'calc(var(--space-md) + 40px + var(--space-md))',
        color: 'white'
      }}>
        {/* Back button and progress */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-sm)'
        }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBack}
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              backdropFilter: 'blur(10px)'
            }}
          >
            <ArrowLeftIcon size="sm" aria-hidden />
            Back
          </Button>

          <Typography variant="caption" style={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 'var(--font-weight-semibold)',
            marginRight: 'var(--space-sm)'
          }}>
            Step 3 of 9
          </Typography>
        </div>

        {/* Progress bar */}
        <Progress 
          value={33.33} // 3/9 steps
          size="sm"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            marginBottom: 'var(--space-md)'
          }}
        />

        {/* Logo */}
        <div 
          onClick={handleLogoClick}
          style={{ 
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--space-md)'
          }}
          role="button"
          tabIndex={0}
          aria-label="Go to home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLogoClick();
            }
          }}
        >
          <Logo 
            size="md" 
            variant="full" 
            style={{ color: 'white' }}
          />
        </div>

        {/* Title and current position */}
        <Typography variant="h2" style={{ 
          color: 'white',
          marginBottom: 'var(--space-xs)',
          fontSize: 'var(--font-size-h2)'
        }}>
          Photo Guide
        </Typography>
        
        <Typography variant="body" style={{ 
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 'var(--font-size-small)'
        }}>
          {completedPositions.length} of {PHOTO_GUIDE_METADATA.totalRequired} required photos completed
        </Typography>
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1,
        maxWidth: '480px',
        margin: '0 auto',
        padding: 'var(--space-lg) var(--space-md)',
        width: '100%'
      }}>
        {/* Error Message */}
        {error && (
          <div style={{
            background: 'var(--color-error-bg)',
            border: '1px solid var(--color-error)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)'
          }}>
            <div style={{ color: 'var(--color-error)', fontSize: '20px' }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <Typography variant="body" style={{ color: 'var(--color-error)', fontWeight: 'var(--font-weight-medium)' }}>
                {error}
              </Typography>
            </div>
            <button
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-error)',
                cursor: 'pointer',
                padding: 'var(--space-xs)',
                fontSize: '16px'
              }}
              title="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Storage Warning */}
        {storageWarning && !error && (
          <div style={{
            background: 'var(--color-warning-bg)',
            border: '1px solid var(--color-warning)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)'
          }}>
            <div style={{ color: 'var(--color-warning)', fontSize: '20px' }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <Typography variant="body" style={{ color: 'var(--color-warning)', fontWeight: 'var(--font-weight-medium)' }}>
                {storageWarning}
              </Typography>
            </div>
            <button
              onClick={() => setStorageWarning(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-warning)',
                cursor: 'pointer',
                padding: 'var(--space-xs)',
                fontSize: '16px'
              }}
              title="Dismiss warning"
            >
              ✕
            </button>
          </div>
        )}
        {/* Current Position Card */}
        {currentPosition && (
          <Card
            elevation={2}
            padding="lg"
            style={{ marginBottom: 'var(--space-xl)' }}
          >
            <div style={{ textAlign: 'center' }}>
              <Typography variant="h3" style={{ 
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-sm)',
                fontSize: 'var(--font-size-h3)'
              }}>
                {currentPosition.name}
              </Typography>
              
              <Typography variant="body" style={{ 
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-md)',
                fontSize: 'var(--font-size-small)'
              }}>
                {currentPosition.description}
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
                border: currentPositionPhoto ? '2px solid var(--color-success)' : '2px dashed var(--border-color)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {currentPositionPhoto?.dataUrl ? (
                  <>
                    <img
                      src={currentPositionPhoto.dataUrl}
                      alt={currentPosition.name}
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
                💡 {currentPosition.guidance}
              </Typography>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                {completedPositions.includes(currentPosition.id) ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleTakePhoto}
                    disabled={saving}
                    style={{ flex: 1 }}
                    aria-label={`Retake photo for ${currentPosition.name}`}
                  >
                    {saving ? 'Saving...' : 'Retake Photo'}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleTakePhoto}
                    disabled={saving}
                    style={{ flex: 1 }}
                    aria-label={`Take photo for ${currentPosition.name}`}
                  >
                    <CameraIcon size="sm" aria-hidden />
                    {saving ? 'Saving...' : 'Take Photo'}
                  </Button>
                )}

                {!currentPosition.required && !saving && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleSkipOptional}
                    aria-label={`Skip optional photo for ${currentPosition.name}`}
                  >
                    Skip
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Photo Progress Grid */}
        <Card
          elevation={1}
          padding="md"
          style={{ marginBottom: 'var(--space-xl)' }}
        >
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
            {PHOTO_POSITIONS.slice(0, 8).map((position) => {
              const positionPhoto = claim?.photos?.find(p => p.damageAreaId === position.id);
              const photoDataUrl = positionPhoto ? photoBlobStorage.getPhotoDataUrl(positionPhoto.id) : null;
              
              return (
                <button
                  key={position.id}
                  onClick={() => handlePositionSelect(position.id)}
                  onKeyDown={(e) => handleKeyDown(e, position.id)}
                  style={{
                    aspectRatio: '1',
                    border: currentPositionId === position.id 
                      ? '2px solid var(--primary-end)' 
                      : completedPositions.includes(position.id)
                      ? '2px solid var(--color-success)'
                      : '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)',
                    background: photoDataUrl 
                      ? `url(${photoDataUrl}) center/cover`
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
                  title={`${position.name}${position.required ? ' (Required)' : ' (Optional)'} - ${
                    photoDataUrl ? 'Photo captured' : currentPositionId === position.id ? 'Current position' : 'Not captured'
                  }`}
                  aria-label={`Photo position ${position.order}: ${position.name}. ${
                    photoDataUrl ? 'Photo captured' : currentPositionId === position.id ? 'Current position' : 'Not captured yet'
                  }. ${position.required ? 'Required' : 'Optional'}.`}
                  tabIndex={0}
                >
                  {photoDataUrl ? (
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
                  {!photoDataUrl && position.required && (
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

        {/* Continue Button */}
        {allRequiredComplete && (
          <div style={{ 
            position: 'sticky',
            bottom: 'var(--space-md)',
            marginTop: 'auto'
          }}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              style={{ width: '100%' }}
            >
              Continue to Review
            </Button>
          </div>
        )}
      </div>

      {/* Camera Capture */}
      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handlePhotoCapture}
        onError={(error) => {
          console.error('Camera error:', error);
          alert(`Camera error: ${error}`);
        }}
        facingMode="environment" // Rear camera for vehicle photos
        quality={0.8}
        maxWidth={1920}
        maxHeight={1080}
      />
    </div>
  );
}