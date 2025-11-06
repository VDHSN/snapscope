'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Typography } from '@snapscope/ui/typography';
import { Logo } from '@snapscope/ui/logo';
import { Button } from '@snapscope/ui/button';
import { ThemeToggle } from '@snapscope/ui/theme-toggle';
import { ArrowLeftIcon } from '@snapscope/ui/icon';
import { CompletionSummary } from '@snapscope/ui/completion-summary';
import { ExportButton } from '@snapscope/ui/export-button';
import { useClaims } from '@/hooks/useStorage';
import { useAssessmentExport } from '@/hooks/useAssessmentExport';
import { generateExportFilename } from '@/lib/export-assessment';
import type { Claim } from '@/types/claim';

export default function ExportPage() {
  const router = useRouter();
  const params = useParams();
  const claimId = params.id as string;

  const { getClaim, saveClaim } = useClaims();
  const { exportAssessment, isExporting, error, clearError } = useAssessmentExport();

  const [claim, setClaim] = useState<Claim | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load claim data
  useEffect(() => {
    const loadedClaim = getClaim(claimId);

    if (loadedClaim) {
      // Mark as completed if not already
      if (loadedClaim.status !== 'completed') {
        const updatedClaim: Claim = {
          ...loadedClaim,
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date()
        };
        saveClaim(updatedClaim);
        setClaim(updatedClaim);
      } else {
        setClaim(loadedClaim);
      }
    }

    setLoading(false);
  }, [claimId, getClaim, saveClaim]);

  const handleBack = () => {
    router.back();
  };

  const handleLogoClick = () => {
    router.push('/assessments');
  };

  const handleExport = async () => {
    if (!claim) return;

    clearError();

    try {
      await exportAssessment(claim.id);
      setExportSuccess(true);

      // Redirect to assessments list after successful export
      setTimeout(() => {
        router.push('/assessments');
      }, 2000);
    } catch (err) {
      console.error('Export failed:', err);
      // Error is handled by the hook
    }
  };

  const handleBackToAssessments = () => {
    router.push('/assessments');
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body">Loading...</Typography>
      </div>
    );
  }

  if (!claim) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body">Assessment not found</Typography>
      </div>
    );
  }

  const photoCount = claim.photos ? Object.keys(claim.photos).length : 0;
  const fileName = generateExportFilename(claim);
  const completedDate = claim.completedAt ?? new Date();

  return (
    <div
      data-testid="page-export-assessment"
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Theme Toggle */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--space-md)',
          right: 'var(--space-md)',
          zIndex: 10,
        }}
      >
        <ThemeToggle />
      </div>

      {/* Header with purple gradient */}
      <div
        style={{
          background:
            'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
          padding: 'var(--space-sm) var(--space-md)',
          paddingRight: 'calc(var(--space-md) + 40px + var(--space-md))',
          color: 'white',
          position: 'relative'
        }}
      >
        {/* Logo in top left */}
        <div
          onClick={handleLogoClick}
          style={{
            cursor: 'pointer',
            position: 'absolute',
            top: 'var(--space-sm)',
            left: 'var(--space-md)'
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
          <Logo size="sm" variant="icon" theme="dark" style={{ color: 'white' }} />
        </div>

        {/* Title centered */}
        <Typography
          variant="h2"
          style={{
            color: 'white',
            marginBottom: 'var(--space-xs)',
            fontSize: 'var(--font-size-h3)',
            textAlign: 'center',
          }}
        >
          Export Assessment
        </Typography>

        <Typography variant="body" style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 'var(--font-size-caption)',
          textAlign: 'center',
          marginBottom: 'var(--space-sm)'
        }}>
          Download your completed assessment
        </Typography>

        {/* Back button at bottom */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBack}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              backdropFilter: 'blur(10px)',
            }}
          >
            <ArrowLeftIcon size="sm" aria-hidden />
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          maxWidth: '480px',
          margin: '0 auto',
          padding: 'var(--space-lg) var(--space-md)',
          width: '100%',
        }}
      >
        {/* Error Message */}
        {error && (
          <div
            style={{
              background: 'var(--color-error-bg)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--space-md)',
              marginBottom: 'var(--space-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
            }}
          >
            <div style={{ flex: 1 }}>
              <Typography
                variant="body"
                style={{
                  color: 'var(--color-error)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {error}
              </Typography>
            </div>
            <button
              onClick={clearError}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-error)',
                cursor: 'pointer',
                padding: 'var(--space-xs)',
                fontSize: '16px',
              }}
              title="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success Message */}
        {exportSuccess && (
          <div
            style={{
              background: 'var(--color-success-bg)',
              border: '1px solid var(--color-success)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--space-md)',
              marginBottom: 'var(--space-lg)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body"
              style={{
                color: 'var(--color-success)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              Export successful! Redirecting to assessments...
            </Typography>
          </div>
        )}

        {/* Completion Summary */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <CompletionSummary
            vin={claim.vehicle.vin}
            photoCount={photoCount}
            completedDate={completedDate}
            fileName={fileName}
          />
        </div>

        {/* Export Instructions */}
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-xl)',
          }}
        >
          <Typography
            variant="body"
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--font-size-small)',
              lineHeight: '1.6',
            }}
          >
            Click the button below to export your assessment as a ZIP file. The file will
            include all captured photos with their damage notes and assessment metadata.
          </Typography>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <ExportButton
            onClick={handleExport}
            loading={isExporting}
            disabled={isExporting || exportSuccess}
            size="lg"
            style={{ width: '100%' }}
          />

          <Button
            variant="secondary"
            size="lg"
            onClick={handleBackToAssessments}
            disabled={isExporting}
            style={{ width: '100%' }}
          >
            Back to Assessments
          </Button>
        </div>
      </div>
    </div>
  );
}
