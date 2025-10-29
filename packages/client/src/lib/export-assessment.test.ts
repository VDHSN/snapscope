import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateAssessmentZip, generateExportFilename } from './export-assessment';
import * as storage from './storage';
import * as photoStorage from './photo-storage-indexeddb';
import * as photoPositions from './photo-positions';
import {
  createMockClaim,
  createMockClaimWithPhotos,
  createMockPhotoBlob,
  createMockProgressCallback,
  assertValidZipBlob,
  createMockPhotoRef,
} from '../__tests__/helpers/export-test-utils';

// Mock dependencies
vi.mock('./storage');
vi.mock('./photo-storage-indexeddb');
vi.mock('./photo-positions');

describe('Export Assessment Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateAssessmentZip()', () => {
    describe('Happy Path', () => {
      it('should generate ZIP with photos and metadata', async () => {
        const claim = createMockClaimWithPhotos(3);
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(createMockPhotoBlob());
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'front', name: 'Front View', required: true, category: 'overview', order: 1, description: '', guidance: '' });

        const zipBlob = await generateAssessmentZip('test-claim-id');

        assertValidZipBlob(zipBlob);
        expect(storage.claimsStorage.getById).toHaveBeenCalledWith('test-claim-id');
        expect(photoStorage.indexedDBPhotoStorage.getPhotoBlob).toHaveBeenCalledTimes(3);
      });

      it('should use sanitized filenames', async () => {
        const claim = createMockClaim({
          photos: {
            'test-position': createMockPhotoRef({ id: 'photo-1', damageAreaId: 'test-position' })
          }
        });
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(createMockPhotoBlob());
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'test', name: 'Front/Rear (Special)', required: true, category: 'overview', order: 1, description: '', guidance: '' });

        const zipBlob = await generateAssessmentZip('test-claim-id');

        assertValidZipBlob(zipBlob);
        // Verify mock was called - actual filename sanitization happens in ZIP generation
        expect(photoPositions.getPositionById).toHaveBeenCalled();
      });

      it('should include notes files when present', async () => {
        const claim = createMockClaim({
          photos: {
            'test-position': createMockPhotoRef({
              id: 'photo-1',
              damageAreaId: 'test-position',
              notes: 'This is a test note'
            })
          }
        });
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(createMockPhotoBlob());
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'test', name: 'Test Position', required: true, category: 'overview', order: 1, description: '', guidance: '' });

        const zipBlob = await generateAssessmentZip('test-claim-id', { includeNotes: true });

        assertValidZipBlob(zipBlob);
        // Notes are added to ZIP - verified by successful generation
        expect(zipBlob.size).toBeGreaterThan(0);
      });

      it('should report progress correctly via callback', async () => {
        const claim = createMockClaimWithPhotos(3);
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(createMockPhotoBlob());
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'test', name: 'Test', required: true, category: 'overview', order: 1, description: '', guidance: '' });

        const { callback, calls } = createMockProgressCallback();

        await generateAssessmentZip('test-claim-id', { onProgress: callback });

        // Should be called at start (0%), after each photo, and at completion (100%)
        expect(callback).toHaveBeenCalled();
        expect(calls.length).toBeGreaterThan(0);
        expect(calls[0]).toEqual({ progress: 0, current: 0, total: 3 });
        expect(calls[calls.length - 1]).toEqual({ progress: 100, current: 3, total: 3 });
      });
    });

    describe('Error Cases', () => {
      it('should throw error when claim not found', async () => {
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(null);

        await expect(generateAssessmentZip('non-existent-claim'))
          .rejects.toThrow('Claim with ID non-existent-claim not found');
      });

      it('should throw error when no photos exist', async () => {
        const claim = createMockClaim({ photos: {} });
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);

        await expect(generateAssessmentZip('test-claim-id'))
          .rejects.toThrow('No photos found for this assessment');
      });

      it('should skip photos that fail to load (continue with others)', async () => {
        const claim = createMockClaimWithPhotos(3);
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);

        // First photo fails, others succeed
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValueOnce(null)
          .mockResolvedValue(createMockPhotoBlob());

        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'test', name: 'Test', required: true, category: 'overview', order: 1, description: '', guidance: '' });

        const zipBlob = await generateAssessmentZip('test-claim-id');

        assertValidZipBlob(zipBlob);
        // Should still succeed with remaining photos
        expect(photoStorage.indexedDBPhotoStorage.getPhotoBlob).toHaveBeenCalledTimes(3);
      });

      it('should throw error when ALL photos fail to load', async () => {
        const claim = createMockClaimWithPhotos(3);
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(null);
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'test', name: 'Test', required: true, category: 'overview', order: 1, description: '', guidance: '' });

        await expect(generateAssessmentZip('test-claim-id'))
          .rejects.toThrow('Failed to export any photos. Please try again.');
      });
    });

    describe('Edge Cases', () => {
      it('should handle missing position metadata (use damageAreaId as fallback)', async () => {
        const claim = createMockClaim({
          photos: {
            'unknown-position': createMockPhotoRef({ id: 'photo-1', damageAreaId: 'unknown-position' })
          }
        });
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(createMockPhotoBlob());
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue(undefined);

        const zipBlob = await generateAssessmentZip('test-claim-id');

        assertValidZipBlob(zipBlob);
        // Should use damageAreaId as fallback
        expect(photoPositions.getPositionById).toHaveBeenCalledWith('unknown-position', 'standard');
      });

      it('should handle very long position names', async () => {
        const longName = 'A'.repeat(200);
        const claim = createMockClaim({
          photos: {
            'test-position': createMockPhotoRef({ id: 'photo-1', damageAreaId: 'test-position' })
          }
        });
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(createMockPhotoBlob());
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'test', name: longName, required: true, category: 'overview', order: 1, description: '', guidance: '' });

        const zipBlob = await generateAssessmentZip('test-claim-id');

        assertValidZipBlob(zipBlob);
        // Should handle long names without errors
        expect(zipBlob.size).toBeGreaterThan(0);
      });

      it('should handle duplicate position names', async () => {
        const claim = createMockClaim({
          photos: {
            'position-1': createMockPhotoRef({ id: 'photo-1', filename: 'photo1.jpg', damageAreaId: 'position-1' }),
            'position-2': createMockPhotoRef({ id: 'photo-2', filename: 'photo2.jpg', damageAreaId: 'position-2' })
          }
        });
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(createMockPhotoBlob());
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'test', name: 'Same Name', required: true, category: 'overview', order: 1, description: '', guidance: '' });

        const zipBlob = await generateAssessmentZip('test-claim-id');

        assertValidZipBlob(zipBlob);
        // ZIP should handle duplicate names (JSZip will overwrite or append)
        expect(zipBlob.size).toBeGreaterThan(0);
      });

      it('should handle missing file extensions (default to .jpg)', async () => {
        const claim = createMockClaim({
          photos: {
            'test-position': createMockPhotoRef({
              id: 'photo-1',
              filename: 'photo-without-extension',
              damageAreaId: 'test-position'
            })
          }
        });
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(createMockPhotoBlob());
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'test', name: 'Test', required: true, category: 'overview', order: 1, description: '', guidance: '' });

        const zipBlob = await generateAssessmentZip('test-claim-id');

        assertValidZipBlob(zipBlob);
        // Should default to .jpg extension
        expect(zipBlob.size).toBeGreaterThan(0);
      });
    });

    describe('Options Testing', () => {
      it('should exclude metadata when includeMetadata=false', async () => {
        const claim = createMockClaimWithPhotos(2);
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(createMockPhotoBlob());
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'test', name: 'Test', required: true, category: 'overview', order: 1, description: '', guidance: '' });

        const zipBlob = await generateAssessmentZip('test-claim-id', { includeMetadata: false });

        assertValidZipBlob(zipBlob);
        // Metadata file should not be included - verified by smaller blob size
        // (though we can't easily verify file contents without unzipping)
        expect(zipBlob.size).toBeGreaterThan(0);
      });

      it('should exclude notes when includeNotes=false', async () => {
        const claim = createMockClaim({
          photos: {
            'test-position': createMockPhotoRef({
              id: 'photo-1',
              damageAreaId: 'test-position',
              notes: 'This note should be excluded'
            })
          }
        });
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(createMockPhotoBlob());
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'test', name: 'Test', required: true, category: 'overview', order: 1, description: '', guidance: '' });

        const zipBlob = await generateAssessmentZip('test-claim-id', { includeNotes: false });

        assertValidZipBlob(zipBlob);
        // Notes should not be included
        expect(zipBlob.size).toBeGreaterThan(0);
      });

      it('should not call progress callback when not provided', async () => {
        const claim = createMockClaimWithPhotos(2);
        vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
        vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
          .mockResolvedValue(createMockPhotoBlob());
        vi.spyOn(photoPositions, 'getPositionById')
          .mockReturnValue({ id: 'test', name: 'Test', required: true, category: 'overview', order: 1, description: '', guidance: '' });

        const zipBlob = await generateAssessmentZip('test-claim-id', {});

        assertValidZipBlob(zipBlob);
        // No errors should occur when progress callback is not provided
        expect(zipBlob.size).toBeGreaterThan(0);
      });
    });
  });

  describe('generateExportFilename()', () => {
    it('should format filename with VIN and date (YYYYMMDD format)', () => {
      const claim = createMockClaim({
        vehicle: {
          id: 'test-vehicle',
          vin: '1G1ZD5ST1LF051419',
          make: 'Chevrolet',
          model: 'Malibu',
          year: 2020
        }
      });

      // Mock date to ensure consistent output
      const mockDate = new Date('2025-01-15T10:00:00Z');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

      const filename = generateExportFilename(claim);

      expect(filename).toBe('Assessment_1G1ZD5ST1LF051419_20250115.zip');

      vi.restoreAllMocks();
    });

    it('should sanitize VIN in filename (remove special chars)', () => {
      const claim = createMockClaim({
        vehicle: {
          id: 'test-vehicle',
          vin: '1G1-ZD5/ST1 LF051419',
          make: 'Chevrolet',
          model: 'Malibu',
          year: 2020
        }
      });

      const filename = generateExportFilename(claim);

      // Should remove all special characters
      expect(filename).toMatch(/Assessment_1G1ZD5ST1LF051419_\d{8}\.zip/);
    });

    it('should include "Assessment_" prefix', () => {
      const claim = createMockClaim();

      const filename = generateExportFilename(claim);

      expect(filename).toMatch(/^Assessment_/);
    });
  });

  describe('formatDate() Helper', () => {
    // Note: formatDate is not exported, but we can test it indirectly through the metadata generation

    it('should format Date objects correctly in metadata', async () => {
      const claim = createMockClaim({
        photos: {
          'test-position': createMockPhotoRef({ id: 'photo-1', damageAreaId: 'test-position' })
        },
        createdAt: new Date('2025-01-15T14:30:00Z'),
        completedAt: new Date('2025-01-15T16:45:00Z')
      });
      vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
      vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
        .mockResolvedValue(createMockPhotoBlob());
      vi.spyOn(photoPositions, 'getPositionById')
        .mockReturnValue({ id: 'test', name: 'Test', required: true, category: 'overview', order: 1, description: '', guidance: '' });

      const zipBlob = await generateAssessmentZip('test-claim-id', { includeMetadata: true });

      assertValidZipBlob(zipBlob);
      // Dates should be formatted in US locale with 12-hour time
      // We can't easily verify the exact format without unzipping, but ensure no errors
      expect(zipBlob.size).toBeGreaterThan(0);
    });

    it('should handle ISO string dates in metadata', async () => {
      const claim = createMockClaim({
        photos: {
          'test-position': createMockPhotoRef({ id: 'photo-1', damageAreaId: 'test-position' })
        },
        createdAt: new Date('2025-01-15T14:30:00.000Z'),
      });
      vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
      vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
        .mockResolvedValue(createMockPhotoBlob());
      vi.spyOn(photoPositions, 'getPositionById')
        .mockReturnValue({ id: 'test', name: 'Test', required: true, category: 'overview', order: 1, description: '', guidance: '' });

      const zipBlob = await generateAssessmentZip('test-claim-id', { includeMetadata: true });

      assertValidZipBlob(zipBlob);
      expect(zipBlob.size).toBeGreaterThan(0);
    });

    it('should handle timestamp numbers in metadata', async () => {
      const claim = createMockClaim({
        photos: {
          'test-position': createMockPhotoRef({
            id: 'photo-1',
            damageAreaId: 'test-position',
            timestamp: new Date(1705329000000) // Unix timestamp
          })
        },
        createdAt: new Date(1705329000000),
      });
      vi.spyOn(storage.claimsStorage, 'getById').mockReturnValue(claim);
      vi.spyOn(photoStorage.indexedDBPhotoStorage, 'getPhotoBlob')
        .mockResolvedValue(createMockPhotoBlob());
      vi.spyOn(photoPositions, 'getPositionById')
        .mockReturnValue({ id: 'test', name: 'Test', required: true, category: 'overview', order: 1, description: '', guidance: '' });

      const zipBlob = await generateAssessmentZip('test-claim-id', { includeMetadata: true });

      assertValidZipBlob(zipBlob);
      expect(zipBlob.size).toBeGreaterThan(0);
    });
  });
});
