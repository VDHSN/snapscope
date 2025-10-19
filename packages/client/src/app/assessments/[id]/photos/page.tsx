'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Typography } from '@snapscope/ui/typography';
import { Logo } from '@snapscope/ui/logo';
import { Button } from '@snapscope/ui/button';
import { Card } from '@snapscope/ui/card';
import { Progress } from '@snapscope/ui/progress';
import { ThemeToggle } from '@snapscope/ui/theme-toggle';
import { ArrowLeftIcon, CameraIcon, CheckIcon } from '@snapscope/ui/icon';
import { PhotoCaptureScreen } from '@snapscope/ui/photo-capture-screen';
import { PhotoNotesDisplay } from '@snapscope/ui/photo-notes-display';
import { useClaims } from '@/hooks/useStorage';
import { usePhotoStorage } from '@/hooks/usePhotoStorage';
import { useCarrierSettings } from '@/hooks/useCarrierSettings';
import {
  getPhotoPositionsForCarrier,
  getPositionById,
  areAllRequiredPhotosCompleted,
  getPhotoMetadataForCarrier
} from '@/lib/photo-positions';
import type { Claim, PhotoReference } from '@/types/claim';

export default function PhotoGuidePage() {
  const router = useRouter();
  const params = useParams();
  const { getClaim, saveClaim } = useClaims();
  const { getCarrier } = useCarrierSettings();
  const { photoStorage, isReady: storageReady, initializationError } = usePhotoStorage();
  const claimId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [claim, setClaim] = useState<Claim | null>(null);
  const [currentPositionId, setCurrentPositionId] = useState('');
  const [completedPositions, setCompletedPositions] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [blurWarning, setBlurWarning] = useState<string | null>(null);

  // Get carrier-specific photo positions
  const photoPositions = getPhotoPositionsForCarrier(claim?.carrierId);
  const carrierName = claim?.carrierId ? getCarrier(claim.carrierId)?.name : null;

  // Load claim data and initialize photo state
  useEffect(() => {
    const loadedClaim = getClaim(claimId);
    if (loadedClaim) {
      setClaim(loadedClaim);

      // Update status to in_progress if it's still in draft
      if (loadedClaim.status === 'draft') {
        const updatedClaim = {
          ...loadedClaim,
          status: 'in_progress' as const,
          updatedAt: new Date()
        };
        saveClaim(updatedClaim);
        setClaim(updatedClaim);
      }

      // Initialize completed positions from existing photos
      const existingPhotos = loadedClaim.photos || {};
      const completed = Object.keys(existingPhotos); // Keys are now damageAreaIds

      setCompletedPositions(completed);

      // Get carrier-specific positions
      const positions = getPhotoPositionsForCarrier(loadedClaim.carrierId);

      // Set current position to first incomplete required position
      const nextIncomplete = positions.find(pos =>
        pos.required && !completed.includes(pos.id)
      );
      if (nextIncomplete) {
        setCurrentPositionId(nextIncomplete.id);
      } else if (positions.length > 0) {
        setCurrentPositionId(positions[0].id);
      }
    }
    setLoading(false);
  }, [claimId, getClaim, saveClaim]);

  const currentPosition = getPositionById(currentPositionId, claim?.carrierId);
  const allRequiredComplete = areAllRequiredPhotosCompleted(completedPositions, claim?.carrierId);

  // State for current position photo
  const [currentPositionPhoto, setCurrentPositionPhoto] = useState<(PhotoReference & { dataUrl: string }) | null>(null);
  // State for storing photo data URLs for the progress grid
  const [photoDataUrls, setPhotoDataUrls] = useState<Record<string, string>>({});

  // Get current position photo for display
  useEffect(() => {
    const loadCurrentPositionPhoto = async () => {
      if (!claim || !currentPosition || !photoStorage || !storageReady) {
        setCurrentPositionPhoto(null);
        return;
      }
      
      const photo = claim.photos ? claim.photos[currentPosition.id] : undefined;
      if (!photo) {
        setCurrentPositionPhoto(null);
        return;
      }
      
      try {
        // Get photo data URL for display with cache busting for retakes
        const isRetake = completedPositions.includes(currentPosition.id);
        const dataUrl = await photoStorage.getPhotoDataUrl(photo.id, isRetake);
        setCurrentPositionPhoto(dataUrl ? { ...photo, dataUrl } : null);
      } catch (error) {
        console.warn('Failed to load current position photo:', error);
        // Retry once without cache busting
        try {
          const retryDataUrl = await photoStorage.getPhotoDataUrl(photo.id);
          setCurrentPositionPhoto(retryDataUrl ? { ...photo, dataUrl: retryDataUrl } : null);
        } catch (retryError) {
          console.warn('Retry failed for current position photo:', retryError);
          setCurrentPositionPhoto(null);
        }
      }
    };

    loadCurrentPositionPhoto();
  }, [claim, currentPosition, photoStorage, storageReady, completedPositions]);

  // Load photo data URLs for progress grid
  useEffect(() => {
    const loadPhotoDataUrls = async () => {
      if (!claim?.photos || !photoStorage || !storageReady) return;

      const urlMap: Record<string, string> = {};
      
      // Load data URLs for all photos (photos are now keyed by damageAreaId)
      await Promise.all(
        Object.values(claim.photos).map(async (photo) => {
          try {
            // Use cache busting for recently completed positions that might be retakes
            const isRecentlyCompleted = photo.damageAreaId ? completedPositions.includes(photo.damageAreaId) : false;
            const dataUrl = await photoStorage.getPhotoDataUrl(photo.id, isRecentlyCompleted);
            if (dataUrl) {
              urlMap[photo.id] = dataUrl;
            }
          } catch (error) {
            console.warn(`Failed to load photo ${photo.id}:`, error);
            // Retry without cache busting
            try {
              const retryDataUrl = await photoStorage.getPhotoDataUrl(photo.id);
              if (retryDataUrl) {
                urlMap[photo.id] = retryDataUrl;
              }
            } catch (retryError) {
              console.warn(`Retry failed for photo ${photo.id}:`, retryError);
            }
          }
        })
      );

      setPhotoDataUrls(urlMap);
    };

    loadPhotoDataUrls();
  }, [claim?.photos, photoStorage, storageReady, completedPositions]);

  // Check storage capacity on load
  useEffect(() => {
    const checkStorageCapacity = async () => {
      if (!photoStorage || !storageReady) return;
      
      try {
        const storageCheck = await photoStorage.checkStorageCapacity();
        if (storageCheck.warning) {
          setStorageWarning(storageCheck.warning);
        }
      } catch (error) {
        console.warn('Failed to check storage capacity:', error);
      }
    };

    checkStorageCapacity();
  }, [photoStorage, storageReady]);

  const handleBack = () => {
    router.back();
  };

  const handleLogoClick = () => {
    router.push('/assessments');
  };

  const handleTakePhoto = async () => {
    if (!photoStorage || !storageReady) {
      setError('Photo storage not ready. Please wait a moment and try again.');
      return;
    }
    
    try {
      // Check storage capacity before opening camera
      const storageCheck = await photoStorage.checkStorageCapacity();
      if (!storageCheck.available) {
        setError(storageCheck.warning || 'Storage full. Unable to take more photos.');
        return;
      }
      
      setError(null);
      setShowCamera(true);
    } catch (error) {
      console.error('Failed to check storage capacity:', error);
      setError('Unable to check storage capacity. Please try again.');
    }
  };

  const handleBlurDetected = (isBlurry: boolean) => {
    if (isBlurry) {
      setBlurWarning('The photo appears blurry. You can retake it or continue with this photo.');
    } else {
      setBlurWarning(null);
    }
  };

  const handlePhotoCapture = async (photoBlob: Blob, isBlurry?: boolean) => {
    if (!claim || !currentPosition || !photoStorage || !storageReady) {
      setError('Unable to save photo. Storage not ready.');
      return;
    }

    setSaving(true);
    setError(null);
    setBlurWarning(null); // Clear blur warning when capturing

    // Log blur detection result for debugging
    if (isBlurry !== undefined) {
      console.debug('[PhotoCapture] Blur detection result:', isBlurry);
    }

    try {
      // Check storage capacity before saving
      const storageCheck = await photoStorage.checkStorageCapacity();
      if (!storageCheck.available) {
        throw new Error('Storage full. Unable to save photo.');
      }

      const timestamp = new Date();
      const filename = `${currentPosition.id}_${timestamp.getTime()}.jpg`;

      // Save photo using photoStorage
      const photoReference = await photoStorage.savePhoto(photoBlob, {
        filename,
        caption: currentPosition.name,
        damageAreaId: currentPosition.id,
        timestamp,
        cloudUrl: undefined,
      });

      // Clear cache for retakes to ensure immediate UI updates
      if (completedPositions.includes(currentPosition.id)) {
        await photoStorage.clearPhotoCache(photoReference.id);
      }

      // Create updated photos record - now keyed by damageAreaId for O(1) access
      const updatedPhotos = { ...claim.photos || {} };
      
      // Simple assignment - replaces existing photo if it exists (retake scenario)
      updatedPhotos[currentPosition.id] = photoReference;
      
      // Update completed positions
      const newCompleted = [...new Set([...completedPositions, currentPosition.id])];
      setCompletedPositions(newCompleted);
      
      // Check if all required photos are completed
      const allRequired = areAllRequiredPhotosCompleted(newCompleted);
      
      // Update claim with new photo and potentially new status
      const updatedClaim: Claim = {
        ...claim,
        photos: updatedPhotos,
        status: allRequired ? 'completed' : claim.status,
        updatedAt: timestamp,
      };

      await saveClaim(updatedClaim);
      setClaim(updatedClaim);

      setShowCamera(false);

      // Navigate to damage notes page
      router.push(`/assessments/${claimId}/photos/notes?photoId=${photoReference.id}&positionId=${currentPosition.id}`);
      
      // Check storage after saving
      try {
        const postSaveCheck = await photoStorage.checkStorageCapacity();
        if (postSaveCheck.warning) {
          setStorageWarning(postSaveCheck.warning);
        }
      } catch (error) {
        console.warn('Failed to check storage capacity after saving:', error);
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
    const nextRequired = photoPositions.find(pos =>
      pos.required && !completedPositions.includes(pos.id) && pos.order > (currentPosition?.order || 0)
    );

    if (nextRequired) {
      setCurrentPositionId(nextRequired.id);
    } else if (allRequiredComplete) {
      handleContinue();
    }
  };


  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, positionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePositionSelect(positionId);
    }
  };

  // Handle notes save with auto-save
  const handleNotesSave = useCallback(async (newNotes: string) => {
    if (!claim || !currentPosition) {
      console.warn('Cannot save notes: claim or currentPosition not available');
      return;
    }

    try {
      // Get current photo for this position
      const currentPhoto = claim.photos ? claim.photos[currentPosition.id] : undefined;

      if (!currentPhoto) {
        console.warn('No photo found for current position');
        return;
      }

      // Update photo with new notes
      const updatedPhoto = {
        ...currentPhoto,
        notes: newNotes.trim() || undefined,
      };

      // Update claim with modified photo
      const updatedPhotos = { ...claim.photos || {} };
      updatedPhotos[currentPosition.id] = updatedPhoto;

      const updatedClaim = {
        ...claim,
        photos: updatedPhotos,
        updatedAt: new Date(),
      };

      await saveClaim(updatedClaim);
      setClaim(updatedClaim);
    } catch (error) {
      console.error('Failed to save notes:', error);
      throw error; // Re-throw to let PhotoNotesDisplay handle error state
    }
  }, [claim, currentPosition, saveClaim]);

  if (loading || !storageReady) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="body">
          {loading ? 'Loading...' : initializationError ? `Storage Error: ${initializationError.message}` : 'Initializing photo storage...'}
        </Typography>
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
          {completedPositions.length} of {getPhotoMetadataForCarrier(claim?.carrierId).totalRequired} required photos completed
          {carrierName && ` - Following ${carrierName} Workflow`}
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

        {/* Blur Warning */}
        {blurWarning && !error && !storageWarning && (
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
            <div style={{ color: 'var(--color-warning)', fontSize: '20px' }}>📸</div>
            <div style={{ flex: 1 }}>
              <Typography variant="body" style={{ color: 'var(--color-warning)', fontWeight: 'var(--font-weight-medium)' }}>
                {blurWarning}
              </Typography>
            </div>
            <button
              onClick={() => setBlurWarning(null)}
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

              {/* Damage Notes - Only show if photo exists */}
              {currentPositionPhoto && (
                <PhotoNotesDisplay
                  notes={currentPositionPhoto.notes}
                  onSave={handleNotesSave}
                  isSaving={saving}
                />
              )}

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
            {photoPositions.map((position) => {
              const positionPhoto = claim?.photos ? claim.photos[position.id] : undefined;
              const photoDataUrl = positionPhoto ? photoDataUrls[positionPhoto.id] : null;
              
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

      {/* Photo Capture Screen */}
      <PhotoCaptureScreen
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handlePhotoCapture}
        onError={(error) => {
          console.error('Camera error:', error);
          setError(`Camera error: ${error}`);
        }}
        headerText={currentPosition?.name}
        footerText={currentPosition?.name}
        progressText={`${completedPositions.length}/${getPhotoMetadataForCarrier(claim?.carrierId).totalRequired} photos complete`}
        overlayColor="rgba(123, 97, 255, 0.3)" // Match existing purple gradient
        enableBlurDetection={true}
        blurThreshold={15} // Good threshold for vehicle photos
        onBlurDetected={handleBlurDetected}
        facingMode="environment" // Rear camera for vehicle photos
        quality={0.8}
        maxWidth={1920}
        maxHeight={1080}
      />
    </div>
  );
}