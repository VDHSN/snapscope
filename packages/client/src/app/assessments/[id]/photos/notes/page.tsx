'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Typography } from '@snapscope/ui/typography';
import { Logo } from '@snapscope/ui/logo';
import { Button } from '@snapscope/ui/button';
import { Card } from '@snapscope/ui/card';
import { TextArea } from '@snapscope/ui/textarea';
import { Progress } from '@snapscope/ui/progress';
import { ThemeToggle } from '@snapscope/ui/theme-toggle';
import { ArrowLeftIcon } from '@snapscope/ui/icon';
import { useClaims } from '@/hooks/useStorage';
import { usePhotoStorage } from '@/hooks/usePhotoStorage';
import {
  getPhotoPositionsForCarrier,
  getPositionById,
  areAllRequiredPhotosCompleted,
} from '@/lib/photo-positions';
import type { Claim, PhotoReference } from '@/types/claim';

export default function DamageNotesPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { claims, loading: claimsLoading, saveClaim } = useClaims();
  const { photoStorage, isReady: storageReady } = usePhotoStorage();
  const claimId = params.id as string;
  const photoId = searchParams.get('photoId');
  const positionId = searchParams.get('positionId');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [claim, setClaim] = useState<Claim | null>(null);
  const [photo, setPhoto] = useState<PhotoReference | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const photoPositions = getPhotoPositionsForCarrier(claim?.carrierId);
  const currentPosition = positionId ? getPositionById(positionId, claim?.carrierId) : null;

  const totalPhotos = photoPositions.filter(p => p.required).length;
  const completedPhotos = claim?.photos ? Object.keys(claim.photos).length : 0;
  const progressPercentage = totalPhotos > 0 ? (completedPhotos / totalPhotos) * 100 : 0;

  // Load claim and photo data
  useEffect(() => {
    // Wait for claims to load from storage before trying to access them
    if (claimsLoading) return;

    const loadedClaim = claims.find(c => c.id === claimId);
    if (loadedClaim) {
      setClaim(loadedClaim);

      // Find the photo by ID or position ID
      if (photoId && loadedClaim.photos) {
        const foundPhoto = Object.values(loadedClaim.photos).find(p => p.id === photoId);
        if (foundPhoto) {
          setPhoto(foundPhoto);
          setNotes(foundPhoto.notes || '');
        } else if (positionId) {
          // Fallback to position ID if photo ID lookup failed
          const fallbackPhoto = loadedClaim.photos[positionId];
          if (fallbackPhoto) {
            setPhoto(fallbackPhoto);
            setNotes(fallbackPhoto.notes || '');
          }
        }
      } else if (positionId && loadedClaim.photos) {
        const foundPhoto = loadedClaim.photos[positionId];
        if (foundPhoto) {
          setPhoto(foundPhoto);
          setNotes(foundPhoto.notes || '');
        }
      }
    }
    setLoading(false);
  }, [claimId, photoId, positionId, claims, claimsLoading]);

  // Load photo thumbnail
  useEffect(() => {
    const loadPhotoDataUrl = async () => {
      if (!photo || !photoStorage || !storageReady) return;

      try {
        const dataUrl = await photoStorage.getPhotoDataUrl(photo.id);
        if (dataUrl) {
          setPhotoDataUrl(dataUrl);
        }
      } catch (err) {
        console.warn('Failed to load photo thumbnail:', err);
      }
    };

    loadPhotoDataUrl();
  }, [photo, photoStorage, storageReady]);

  const handleBack = () => {
    router.back();
  };

  const handleLogoClick = () => {
    router.push('/assessments');
  };

  const navigateToNextStep = () => {
    if (!claim) return;

    // Check if all required photos are completed
    const completedPositionIds = claim.photos ? Object.keys(claim.photos) : [];
    const allRequired = areAllRequiredPhotosCompleted(completedPositionIds, claim.carrierId);

    if (allRequired) {
      // Navigate to review page
      router.push(`/assessments/${claimId}/review`);
    } else {
      // Navigate back to photo guide
      router.push(`/assessments/${claimId}/photos`);
    }
  };

  const handleSkip = () => {
    navigateToNextStep();
  };

  const handleSave = async () => {
    if (!claim || !photo) {
      setError('Unable to save notes. Photo or claim not found.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Update photo reference with notes
      const updatedPhoto: PhotoReference = {
        ...photo,
        notes: notes.trim() || undefined,
      };

      // Update claim with modified photo
      const updatedPhotos = { ...claim.photos || {} };
      if (photo.damageAreaId) {
        updatedPhotos[photo.damageAreaId] = updatedPhoto;
      }

      const updatedClaim: Claim = {
        ...claim,
        photos: updatedPhotos,
        updatedAt: new Date(),
      };

      await saveClaim(updatedClaim);
      setClaim(updatedClaim);

      // Navigate to next step
      navigateToNextStep();
    } catch (err) {
      console.error('Error saving damage notes:', err);
      setError('Failed to save notes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || claimsLoading) {
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

  if (!claim || !photo || !currentPosition) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="body">Photo not found</Typography>
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
        paddingRight: 'calc(var(--space-md) + 40px + var(--space-md))', // Space for theme toggle
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
            {completedPhotos} of {totalPhotos} photos
          </Typography>
        </div>

        {/* Progress bar */}
        <Progress
          value={progressPercentage}
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

        {/* Title */}
        <Typography variant="h2" style={{
          color: 'white',
          marginBottom: 'var(--space-xs)',
          fontSize: 'var(--font-size-h2)'
        }}>
          {currentPosition.name}
        </Typography>

        <Typography variant="body" style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 'var(--font-size-small)'
        }}>
          Add damage notes (optional)
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
        {/* Photo Preview */}
        {photoDataUrl && (
          <Card
            elevation={1}
            padding="md"
            style={{ marginBottom: 'var(--space-lg)' }}
          >
            <img
              src={photoDataUrl}
              alt={currentPosition.name}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 'var(--border-radius-md)',
                display: 'block'
              }}
            />
          </Card>
        )}

        {/* Notes Input */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <Typography variant="body" style={{
            marginBottom: 'var(--space-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            display: 'block'
          }}>
            Add damage notes (optional):
          </Typography>

          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., Front bumper has deep scratches and dents on driver side..."
            rows={4}
            size="lg"
          />

          <Typography variant="caption" style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-small)',
            marginTop: 'var(--space-xs)',
            display: 'block'
          }}>
            Describe any visible damage, estimated severity, or important details.
          </Typography>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'var(--error-light)',
            border: '1px solid var(--error)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-md)'
          }}>
            <Typography variant="body" style={{ color: 'var(--error)' }}>
              {error}
            </Typography>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-md)',
          position: 'sticky',
          bottom: 'var(--space-md)',
          marginTop: 'auto'
        }}>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleSkip}
            disabled={saving}
            style={{
              flex: 1
            }}
          >
            Skip
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2
            }}
          >
            {saving ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
