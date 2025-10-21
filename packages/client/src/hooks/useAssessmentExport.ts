/**
 * Hook for exporting assessments as ZIP files
 * Handles Web Share API on mobile and fallback downloads on desktop
 */

import { useState, useCallback } from 'react';
import { generateAssessmentZip, generateExportFilename } from '@/lib/export-assessment';
import { useClaims } from './useStorage';

export interface UseAssessmentExportReturn {
  exportAssessment: (claimId: string) => Promise<void>;
  isExporting: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook for exporting assessments
 */
export function useAssessmentExport(): UseAssessmentExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getClaim, saveClaim } = useClaims();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const exportAssessment = useCallback(async (claimId: string) => {
    setIsExporting(true);
    setError(null);

    try {
      // Get the claim
      const claim = getClaim(claimId);

      if (!claim) {
        throw new Error('Assessment not found');
      }

      // Generate ZIP file
      const zipBlob = await generateAssessmentZip(claimId);

      // Generate filename
      const filename = generateExportFilename(claim);

      // Try to use Web Share API (mobile devices)
      const hasShareApi = typeof navigator.share !== 'undefined' && typeof navigator.canShare !== 'undefined';

      if (hasShareApi) {
        try {
          // Create File from Blob for sharing
          const file = new File([zipBlob], filename, {
            type: 'application/zip'
          });

          // Check if we can share this file
          const shareData: ShareData = {
            files: [file],
            title: 'Vehicle Assessment Export',
            text: `Assessment for vehicle VIN: ${claim.vehicle.vin}`
          };

          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);

            // Update claim with export timestamp
            await updateExportTimestamp(claimId);

            return; // Successfully shared
          }
        } catch (shareError) {
          // If sharing fails or is cancelled, fall through to download
          console.warn('Web Share API failed, falling back to download:', shareError);

          // Only set error if it's not a user cancellation
          if (shareError instanceof Error && shareError.name !== 'AbortError') {
            console.error('Share error:', shareError);
          }
        }
      }

      // Fallback: Download the file (desktop or if sharing failed)
      downloadFile(zipBlob, filename);

      // Update claim with export timestamp
      await updateExportTimestamp(claimId);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export assessment';
      setError(errorMessage);
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  }, [getClaim, saveClaim, updateExportTimestamp]);

  /**
   * Update claim with export timestamp
   */
  const updateExportTimestamp = useCallback(async (claimId: string) => {
    const claim = getClaim(claimId);
    if (claim) {
      const updatedClaim = {
        ...claim,
        exportedAt: new Date(),
        updatedAt: new Date()
      };

      // Set completedAt if not already set
      if (!claim.completedAt && claim.status === 'completed') {
        updatedClaim.completedAt = new Date();
      }

      await saveClaim(updatedClaim);
    }
  }, [getClaim, saveClaim]);

  return {
    exportAssessment,
    isExporting,
    error,
    clearError
  };
}

/**
 * Download a file using browser download
 */
function downloadFile(blob: Blob, filename: string): void {
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up URL after a delay
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
