/**
 * Tests for useAssessmentExport hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAssessmentExport } from './useAssessmentExport';
import * as exportLib from '@/lib/export-assessment';
import * as storageHooks from './useStorage';
import {
  createMockClaim,
  createMockPhotoBlob,
} from '../__tests__/helpers/export-test-utils';

// Mock dependencies
vi.mock('@/lib/export-assessment');
vi.mock('./useStorage');

describe('useAssessmentExport', () => {
  // Mock functions
  const mockShare = vi.fn();
  const mockCanShare = vi.fn();
  const mockGetClaim = vi.fn();
  const mockSaveClaim = vi.fn();
  const originalNavigator = global.navigator;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup navigator mocks
    Object.defineProperty(global, 'navigator', {
      writable: true,
      configurable: true,
      value: {
        ...originalNavigator,
        share: mockShare,
        canShare: mockCanShare,
      },
    });

    // Setup useClaims mock with default implementations
    vi.mocked(storageHooks.useClaims).mockReturnValue({
      getClaim: mockGetClaim,
      saveClaim: mockSaveClaim,
      claims: [],
      loading: false,
      error: null,
      deleteClaim: vi.fn(),
      clearAllClaims: vi.fn(),
      getClaimsByStatus: vi.fn(),
      createClaimWithVIN: vi.fn(),
    });

    // Setup export utility mocks
    vi.mocked(exportLib.generateAssessmentZip).mockResolvedValue(
      createMockPhotoBlob()
    );
    vi.mocked(exportLib.generateExportFilename).mockReturnValue(
      'Assessment_ABC123_20250101.zip'
    );

    // Mock DOM APIs for download testing
    document.createElement = vi.fn().mockReturnValue({
      href: '',
      download: '',
      click: vi.fn(),
      remove: vi.fn(),
    }) as any;
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
    global.requestAnimationFrame = vi.fn((cb) => {
      cb(0);
      return 0;
    }) as any;
  });

  afterEach(() => {
    // Restore navigator
    Object.defineProperty(global, 'navigator', {
      writable: true,
      configurable: true,
      value: originalNavigator,
    });
  });

  describe('Initial State', () => {
    it('should start with isExporting=false and error=null', () => {
      const { result } = renderHook(() => useAssessmentExport());

      expect(result.current.isExporting).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should provide exportAssessment and clearError functions', () => {
      const { result } = renderHook(() => useAssessmentExport());

      expect(typeof result.current.exportAssessment).toBe('function');
      expect(typeof result.current.clearError).toBe('function');
    });
  });

  describe('Happy Path - Desktop Flow', () => {
    it('should export assessment successfully with download fallback', async () => {
      const mockClaim = createMockClaim();
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false); // Force desktop download

      const { result } = renderHook(() => useAssessmentExport());

      expect(result.current.isExporting).toBe(false);

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      expect(result.current.isExporting).toBe(false);
      expect(result.current.error).toBe(null);
      expect(mockGetClaim).toHaveBeenCalledWith('test-claim-id');
      expect(exportLib.generateAssessmentZip).toHaveBeenCalledWith('test-claim-id');
      expect(mockSaveClaim).toHaveBeenCalled();
    });

    it('should set isExporting=true during export', async () => {
      const mockClaim = createMockClaim();
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false);

      let isExportingDuringExport = false;

      vi.mocked(exportLib.generateAssessmentZip).mockImplementation(async () => {
        // Capture state during export
        isExportingDuringExport = true;
        return createMockPhotoBlob();
      });

      const { result } = renderHook(() => useAssessmentExport());

      const exportPromise = act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      // Check state during export
      await waitFor(() => {
        if (result.current.isExporting) {
          isExportingDuringExport = result.current.isExporting;
        }
      });

      await exportPromise;

      expect(isExportingDuringExport).toBe(true);
      expect(result.current.isExporting).toBe(false);
    });

    it('should trigger download with correct filename', async () => {
      const mockClaim = createMockClaim({ vehicle: { id: 'v1', vin: 'ABC123', year: 2020 } });
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };

      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false);
      document.createElement = vi.fn().mockReturnValue(mockLink) as any;

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      expect(mockLink.download).toBe('Assessment_ABC123_20250101.zip');
      expect(mockLink.click).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('Happy Path - Web Share API', () => {
    it('should use Web Share API when available and supported', async () => {
      const mockClaim = createMockClaim({ vehicle: { id: 'v1', vin: 'ABC123', year: 2020 } });
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(true);
      mockShare.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      expect(mockCanShare).toHaveBeenCalled();
      expect(mockShare).toHaveBeenCalled();
      expect(result.current.error).toBe(null);
      expect(mockSaveClaim).toHaveBeenCalled();
    });

    it('should share with correct data structure', async () => {
      const mockClaim = createMockClaim({
        vehicle: { id: 'v1', vin: '1G1ZD5ST1LF051419', year: 2020 }
      });
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(true);
      mockShare.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      const shareCall = mockShare.mock.calls[0][0] as ShareData;
      expect(shareCall.files).toHaveLength(1);
      expect(shareCall.files![0]).toBeInstanceOf(File);
      expect(shareCall.title).toBe('Vehicle Assessment Export');
      expect(shareCall.text).toContain('1G1ZD5ST1LF051419');
    });

    it('should fall back to download when share is not supported', async () => {
      const mockClaim = createMockClaim();
      const mockLink = { href: '', download: '', click: vi.fn() };

      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false); // Share not supported
      document.createElement = vi.fn().mockReturnValue(mockLink) as any;

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      expect(mockShare).not.toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should fall back to download when canShare returns false for data', async () => {
      const mockClaim = createMockClaim();
      const mockLink = { href: '', download: '', click: vi.fn() };

      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);

      // navigator.share exists but canShare returns false for this specific data
      mockCanShare.mockReturnValue(false);
      document.createElement = vi.fn().mockReturnValue(mockLink) as any;

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      expect(mockCanShare).toHaveBeenCalled();
      expect(mockShare).not.toHaveBeenCalled();
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing claim gracefully', async () => {
      mockGetClaim.mockReturnValue(null);

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('nonexistent-claim-id');
      });

      expect(result.current.isExporting).toBe(false);
      expect(result.current.error).toBe('Assessment not found');
    });

    it('should handle ZIP generation failure', async () => {
      const mockClaim = createMockClaim();
      mockGetClaim.mockReturnValue(mockClaim);
      vi.mocked(exportLib.generateAssessmentZip).mockRejectedValue(
        new Error('ZIP generation failed')
      );

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      expect(result.current.isExporting).toBe(false);
      expect(result.current.error).toBe('ZIP generation failed');
    });

    it('should handle unknown errors', async () => {
      const mockClaim = createMockClaim();
      mockGetClaim.mockReturnValue(mockClaim);
      vi.mocked(exportLib.generateAssessmentZip).mockRejectedValue('Unknown error');

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      expect(result.current.isExporting).toBe(false);
      expect(result.current.error).toBe('Failed to export assessment');
    });

    it('should handle share cancellation (AbortError) without setting error', async () => {
      const mockClaim = createMockClaim();
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(true);

      const abortError = new Error('User cancelled');
      abortError.name = 'AbortError';
      mockShare.mockRejectedValue(abortError);

      // Setup download fallback
      const mockLink = { href: '', download: '', click: vi.fn() };
      document.createElement = vi.fn().mockReturnValue(mockLink) as any;

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      // Should fall back to download without error
      expect(result.current.error).toBe(null);
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockSaveClaim).toHaveBeenCalled();
    });

    it('should handle share API errors (non-abort)', async () => {
      const mockClaim = createMockClaim();
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(true);

      const shareError = new Error('Share failed');
      shareError.name = 'NotAllowedError';
      mockShare.mockRejectedValue(shareError);

      // Setup download fallback
      const mockLink = { href: '', download: '', click: vi.fn() };
      document.createElement = vi.fn().mockReturnValue(mockLink) as any;

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      // Should fall back to download without showing error to user
      expect(result.current.error).toBe(null);
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should set isExporting=false after error', async () => {
      mockGetClaim.mockReturnValue(null);

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('nonexistent-claim-id');
      });

      expect(result.current.isExporting).toBe(false);
      expect(result.current.error).not.toBe(null);
    });
  });

  describe('Error Management', () => {
    it('should clear error when clearError is called', async () => {
      mockGetClaim.mockReturnValue(null);

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('nonexistent-claim-id');
      });

      expect(result.current.error).not.toBe(null);

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });

    it('should clear previous error when starting new export', async () => {
      // First export fails
      mockGetClaim.mockReturnValue(null);
      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('nonexistent-claim-id');
      });

      expect(result.current.error).not.toBe(null);

      // Second export succeeds
      const mockClaim = createMockClaim();
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false);

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('Timestamp Updates', () => {
    it('should set exportedAt timestamp', async () => {
      const mockClaim = createMockClaim();
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false);

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      const saveCall = mockSaveClaim.mock.calls[0][0];
      expect(saveCall.exportedAt).toBeInstanceOf(Date);
    });

    it('should set updatedAt timestamp', async () => {
      const mockClaim = createMockClaim();
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false);

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      const saveCall = mockSaveClaim.mock.calls[0][0];
      expect(saveCall.updatedAt).toBeInstanceOf(Date);
    });

    it('should set completedAt if not already set and status is completed', async () => {
      const mockClaim = createMockClaim({
        status: 'completed',
        completedAt: undefined,
      });
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false);

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      const saveCall = mockSaveClaim.mock.calls[0][0];
      expect(saveCall.completedAt).toBeInstanceOf(Date);
    });

    it('should preserve existing completedAt timestamp', async () => {
      const existingCompletedAt = new Date('2025-01-01T10:00:00Z');
      const mockClaim = createMockClaim({
        status: 'completed',
        completedAt: existingCompletedAt,
      });
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false);

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      const saveCall = mockSaveClaim.mock.calls[0][0];
      expect(saveCall.completedAt).toBe(existingCompletedAt);
    });

    it('should not set completedAt if status is not completed', async () => {
      const mockClaim = createMockClaim({
        status: 'in_progress',
        completedAt: undefined,
      });
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false);

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      const saveCall = mockSaveClaim.mock.calls[0][0];
      expect(saveCall.completedAt).toBeUndefined();
    });

    it('should update timestamps even after share success', async () => {
      const mockClaim = createMockClaim();
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(true);
      mockShare.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      expect(mockSaveClaim).toHaveBeenCalled();
      const saveCall = mockSaveClaim.mock.calls[0][0];
      expect(saveCall.exportedAt).toBeInstanceOf(Date);
      expect(saveCall.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full export flow with Web Share API', async () => {
      const mockClaim = createMockClaim({
        status: 'completed',
        completedAt: undefined,
      });
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(true);
      mockShare.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAssessmentExport());

      expect(result.current.isExporting).toBe(false);
      expect(result.current.error).toBe(null);

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      // Verify final state
      expect(result.current.isExporting).toBe(false);
      expect(result.current.error).toBe(null);

      // Verify all steps were called
      expect(mockGetClaim).toHaveBeenCalledWith('test-claim-id');
      expect(exportLib.generateAssessmentZip).toHaveBeenCalledWith('test-claim-id');
      expect(exportLib.generateExportFilename).toHaveBeenCalledWith(mockClaim);
      expect(mockCanShare).toHaveBeenCalled();
      expect(mockShare).toHaveBeenCalled();
      expect(mockSaveClaim).toHaveBeenCalled();

      // Verify timestamps were set
      const saveCall = mockSaveClaim.mock.calls[0][0];
      expect(saveCall.exportedAt).toBeInstanceOf(Date);
      expect(saveCall.updatedAt).toBeInstanceOf(Date);
      expect(saveCall.completedAt).toBeInstanceOf(Date);
    });

    it('should complete full export flow with download fallback', async () => {
      const mockClaim = createMockClaim();
      const mockLink = { href: '', download: '', click: vi.fn() };

      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false);
      document.createElement = vi.fn().mockReturnValue(mockLink) as any;

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      // Verify final state
      expect(result.current.isExporting).toBe(false);
      expect(result.current.error).toBe(null);

      // Verify download flow
      expect(mockLink.click).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();

      // Verify timestamps
      expect(mockSaveClaim).toHaveBeenCalled();
      const saveCall = mockSaveClaim.mock.calls[0][0];
      expect(saveCall.exportedAt).toBeInstanceOf(Date);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple concurrent export attempts', async () => {
      const mockClaim = createMockClaim();
      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      mockCanShare.mockReturnValue(false);

      const { result } = renderHook(() => useAssessmentExport());

      // Start two exports concurrently
      const export1 = act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });
      const export2 = act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      await Promise.all([export1, export2]);

      // Should handle both without crashing
      expect(result.current.isExporting).toBe(false);
      expect(mockSaveClaim).toHaveBeenCalled();
    });

    it('should handle navigator.share not defined', async () => {
      // Remove share API
      Object.defineProperty(global, 'navigator', {
        writable: true,
        configurable: true,
        value: {
          ...originalNavigator,
          share: undefined,
          canShare: undefined,
        },
      });

      const mockClaim = createMockClaim();
      const mockLink = { href: '', download: '', click: vi.fn() };

      mockGetClaim.mockReturnValue(mockClaim);
      mockSaveClaim.mockResolvedValue(undefined);
      document.createElement = vi.fn().mockReturnValue(mockLink) as any;

      const { result } = renderHook(() => useAssessmentExport());

      await act(async () => {
        await result.current.exportAssessment('test-claim-id');
      });

      // Should fall back to download
      expect(mockLink.click).toHaveBeenCalled();
      expect(result.current.error).toBe(null);
    });
  });
});
