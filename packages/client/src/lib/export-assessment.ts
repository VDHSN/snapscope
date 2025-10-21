/**
 * Assessment export utility
 * Generates ZIP files containing photos and metadata for completed assessments
 */

import JSZip from 'jszip';
import { claimsStorage } from './storage';
import { indexedDBPhotoStorage } from './photo-storage-indexeddb';
import { getPositionById } from './photo-positions';
import type { Claim } from '@/types/claim';

export interface ExportOptions {
  includeMetadata?: boolean;
  includeNotes?: boolean;
}

/**
 * Generate a ZIP file containing assessment photos and metadata
 * @param claimId - The ID of the claim to export
 * @param options - Export options
 * @returns Promise<Blob> - ZIP file as a Blob
 */
export async function generateAssessmentZip(
  claimId: string,
  options: ExportOptions = { includeMetadata: true, includeNotes: true }
): Promise<Blob> {
  // Fetch claim from storage
  const claim = claimsStorage.getById(claimId);

  if (!claim) {
    throw new Error(`Claim with ID ${claimId} not found`);
  }

  if (!claim.photos || Object.keys(claim.photos).length === 0) {
    throw new Error('No photos found for this assessment');
  }

  // Initialize JSZip
  const zip = new JSZip();

  // Counter for exported photos
  let photoCount = 0;

  // Iterate through photos and add them to ZIP
  for (const [damageAreaId, photoRef] of Object.entries(claim.photos)) {
    try {
      // Get position metadata for filename
      const position = getPositionById(damageAreaId, claim.carrierId);
      const positionLabel = position?.name ?? damageAreaId;

      // Sanitize filename (remove special characters)
      const sanitizedLabel = positionLabel.replace(/[^a-zA-Z0-9_-]/g, '_');

      // Fetch photo blob from IndexedDB
      const photoBlob = await indexedDBPhotoStorage.getPhotoBlob(photoRef.id);

      if (!photoBlob) {
        console.warn(`Photo blob not found for ${photoRef.id}, skipping`);
        continue;
      }

      // Add photo to ZIP with position-based filename
      const extension = photoRef.filename.split('.').pop() ?? 'jpg';
      const photoFilename = `${sanitizedLabel}.${extension}`;
      zip.file(photoFilename, photoBlob);
      photoCount++;

      // Add notes if they exist and option is enabled
      if (options.includeNotes && photoRef.notes) {
        const notesFilename = `${sanitizedLabel}_notes.txt`;
        zip.file(notesFilename, photoRef.notes);
      }
    } catch (error) {
      console.error(`Error processing photo ${photoRef.id}:`, error);
      // Continue with other photos even if one fails
    }
  }

  if (photoCount === 0) {
    throw new Error('Failed to export any photos. Please try again.');
  }

  // Add assessment metadata file if option is enabled
  if (options.includeMetadata) {
    const metadata = generateMetadataText(claim, photoCount);
    zip.file('assessment_info.txt', metadata);
  }

  // Generate and return ZIP as Blob
  try {
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6 // Balanced compression
      }
    });

    return zipBlob;
  } catch (error) {
    console.error('Error generating ZIP file:', error);
    throw new Error('Failed to generate ZIP file. Please try again.');
  }
}

/**
 * Generate assessment metadata text
 */
function generateMetadataText(claim: Claim, photoCount: number): string {
  const lines: string[] = [
    '='.repeat(50),
    'VEHICLE DAMAGE ASSESSMENT EXPORT',
    '='.repeat(50),
    '',
    'VEHICLE INFORMATION',
    '-'.repeat(50),
    `VIN: ${claim.vehicle.vin}`,
  ];

  if (claim.vehicle.make) {
    lines.push(`Make: ${claim.vehicle.make}`);
  }

  if (claim.vehicle.model) {
    lines.push(`Model: ${claim.vehicle.model}`);
  }

  if (claim.vehicle.year) {
    lines.push(`Year: ${claim.vehicle.year}`);
  }

  lines.push('');
  lines.push('ASSESSMENT INFORMATION');
  lines.push('-'.repeat(50));

  if (claim.claimNumber) {
    lines.push(`Claim Number: ${claim.claimNumber}`);
  }

  lines.push(`Status: ${claim.status.toUpperCase()}`);
  lines.push(`Photo Count: ${photoCount}`);
  lines.push(`Created: ${formatDate(claim.createdAt)}`);

  if (claim.completedAt) {
    lines.push(`Completed: ${formatDate(claim.completedAt)}`);
  }

  lines.push(`Exported: ${formatDate(new Date())}`);

  if (claim.carrierId) {
    lines.push('');
    lines.push(`Carrier Workflow ID: ${claim.carrierId}`);
  }

  if (claim.notes) {
    lines.push('');
    lines.push('NOTES');
    lines.push('-'.repeat(50));
    lines.push(claim.notes);
  }

  lines.push('');
  lines.push('='.repeat(50));
  lines.push('End of Assessment Export');
  lines.push('='.repeat(50));

  return lines.join('\n');
}

/**
 * Format date for metadata
 */
function formatDate(date: Date): string {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

/**
 * Generate filename for export
 */
export function generateExportFilename(claim: Claim): string {
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const vinStr = claim.vehicle.vin.replace(/[^a-zA-Z0-9]/g, '');
  return `Assessment_${vinStr}_${dateStr}.zip`;
}
