import { vi, expect } from 'vitest';
import type { Claim, PhotoReference, Vehicle, ClaimContact, DamageAssessment } from '@/types/claim';

/**
 * Create a mock vehicle for testing
 */
export function createMockVehicle(overrides?: Partial<Vehicle>): Vehicle {
  return {
    id: 'test-vehicle-id',
    vin: '1G1ZD5ST1LF051419',
    make: 'Chevrolet',
    model: 'Malibu',
    year: 2020,
    ...overrides
  };
}

/**
 * Create a mock claim contact for testing
 */
export function createMockContact(overrides?: Partial<ClaimContact>): ClaimContact {
  return {
    id: 'test-contact-id',
    name: 'John Doe',
    role: 'claimant',
    ...overrides
  };
}

/**
 * Create a mock damage assessment for testing
 */
export function createMockDamage(overrides?: Partial<DamageAssessment>): DamageAssessment {
  return {
    id: 'test-damage-id',
    area: 'front-bumper',
    description: 'Dented bumper with scratches',
    severity: 'moderate',
    createdAt: new Date('2025-01-01T10:00:00Z'),
    updatedAt: new Date('2025-01-01T10:00:00Z'),
    ...overrides
  };
}

/**
 * Create a mock claim for testing
 */
export function createMockClaim(overrides?: Partial<Claim>): Claim {
  return {
    id: 'test-claim-id',
    vehicle: createMockVehicle(),
    contacts: [],
    damages: [],
    dateOfLoss: new Date('2025-01-01T10:00:00Z'),
    location: {},
    carrierId: 'standard',
    status: 'in_progress',
    priority: 'normal',
    syncStatus: 'local_only',
    photos: {},
    createdAt: new Date('2025-01-01T10:00:00Z'),
    updatedAt: new Date('2025-01-01T10:00:00Z'),
    ...overrides
  };
}

/**
 * Create a mock photo reference
 */
export function createMockPhotoRef(overrides?: Partial<PhotoReference>): PhotoReference {
  return {
    id: 'photo-123',
    filename: 'test-photo.jpg',
    damageAreaId: 'front',
    timestamp: new Date('2025-01-01T10:00:00Z'),
    ...overrides
  };
}

/**
 * Create a mock photo blob
 */
export function createMockPhotoBlob(content = 'mock-photo-data'): Blob {
  return new Blob([content], { type: 'image/jpeg' });
}

/**
 * Create a claim with photos
 */
export function createMockClaimWithPhotos(photoCount = 3): Claim {
  const photos: Record<string, PhotoReference> = {};

  for (let i = 0; i < photoCount; i++) {
    const position = `position-${i}`;
    photos[position] = createMockPhotoRef({
      id: `photo-${i}`,
      filename: `photo-${i}.jpg`,
      damageAreaId: position,
      notes: i % 2 === 0 ? `Notes for photo ${i}` : undefined
    });
  }

  return createMockClaim({ photos });
}

/**
 * Mock progress callback for testing
 */
export function createMockProgressCallback() {
  const calls: Array<{ progress: number; current: number; total: number }> = [];

  const callback = vi.fn((progress: number, current: number, total: number) => {
    calls.push({ progress, current, total });
  });

  return {
    callback,
    calls,
    getLastCall: () => calls[calls.length - 1],
    wasCalledWith: (progress: number, current: number, total: number) => {
      return calls.some(call =>
        call.progress === progress &&
        call.current === current &&
        call.total === total
      );
    }
  };
}

/**
 * Assert that a ZIP blob contains expected files
 * Note: This verifies the blob is valid without unpacking
 */
export function assertValidZipBlob(blob: Blob) {
  expect(blob).toBeInstanceOf(Blob);
  expect(blob.type).toBe('application/zip');
  expect(blob.size).toBeGreaterThan(0);
}
