/**
 * Local storage utilities for offline-first functionality
 * Handles claim data, user preferences, and sync management
 */

import { z } from 'zod';
import type {
  Claim,
  UserPreferences,
  SyncQueueItem,
  StorageMetadata,
  PhotoReference,
  Carrier
} from '@/types/claim';
import { schemas, storageKeySchema } from './schemas';

// Storage keys
const STORAGE_KEYS = {
  CLAIMS: 'snapscope_claims',
  PREFERENCES: 'snapscope_preferences',
  SYNC_QUEUE: 'snapscope_sync_queue',
  METADATA: 'snapscope_metadata',
  PHOTOS: 'snapscope_photos',
  CARRIER_SETTINGS: 'snapscope_carrier_settings',
} as const;

// Storage version for migration handling
const CURRENT_VERSION = '1.0.0';

// In-memory cache for performance optimization
const storageCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds cache TTL

/**
 * Clear expired cache entries
 */
function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, value] of storageCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      storageCache.delete(key);
    }
  }
}

/**
 * Get data from cache if valid, otherwise from storage
 */
function getCachedData<T>(key: string, fallback: T, schema?: z.ZodType<T>): T {
  clearExpiredCache();

  const cached = storageCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const data = localStorage.getItem(key);
  const parsed = safeParse(data, fallback, schema);

  // Cache the parsed data
  storageCache.set(key, { data: parsed, timestamp: Date.now() });
  return parsed;
}

/**
 * Set data in both cache and storage
 */
function setCachedData(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, safeStringify(data));
    storageCache.set(key, { data, timestamp: Date.now() });
  } catch (error) {
    // Clear cache on storage error
    storageCache.delete(key);
    throw error;
  }
}

/**
 * Invalidate cache for a specific key
 */
function invalidateCache(key: string): void {
  storageCache.delete(key);
}

/**
 * Generic storage error class
 */
export class StorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe JSON parse with error handling and schema validation
 */
function safeParse<T>(data: string | null, fallback: T, schema?: z.ZodType<T>): T {
  if (!data) return fallback;
  
  try {
    const parsed = JSON.parse(data);
    // Restore Date objects
    const withDates = reviveDates(parsed);
    
    // Validate against schema if provided
    if (schema) {
      const result = schema.safeParse(withDates);
      if (!result.success) {
        console.warn('Storage data validation failed:', result.error.issues);
        return fallback;
      }
      return result.data;
    }
    
    return withDates as T;
  } catch (error) {
    console.warn('Failed to parse storage data:', error);
    return fallback;
  }
}

/**
 * Recursively restore Date objects from parsed JSON
 */
function reviveDates(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(reviveDates);
  }
  
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
      const date = new Date(value);
      // Validate that the date is actually valid
      result[key] = isNaN(date.getTime()) ? value : date;
    } else if (typeof value === 'object') {
      result[key] = reviveDates(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Validates that a storage key is one of the allowed keys to prevent XSS attacks
 */
function isValidStorageKey(key: string): boolean {
  const result = storageKeySchema.safeParse(key);
  return result.success;
}

/**
 * Safe JSON stringify with error handling
 */
function safeStringify(data: unknown): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    throw new StorageError('Failed to serialize data', error as Error);
  }
}

/**
 * Get storage usage information
 */
export function getStorageUsage(): { used: number; available: number; total: number } {
  if (!isLocalStorageAvailable()) {
    return { used: 0, available: 0, total: 0 };
  }

  let used = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }

  // Rough estimate of localStorage limit (usually 5-10MB)
  const estimated_total = 5 * 1024 * 1024; // 5MB
  const available = Math.max(0, estimated_total - used);

  return { used, available, total: estimated_total };
}

/**
 * Check storage quota and warn if approaching limit
 */
export function checkStorageQuota(): { canStore: boolean; usage: number; warning?: string } {
  const { used, total } = getStorageUsage();
  const usage = (used / total) * 100;
  
  if (usage > 90) {
    return {
      canStore: false,
      usage,
      warning: 'Storage is nearly full. Please sync data to cloud or clear old claims.'
    };
  } else if (usage > 80) {
    return {
      canStore: true,
      usage,
      warning: 'Storage is getting full. Consider syncing data to cloud soon.'
    };
  }
  
  return { canStore: true, usage };
}

/**
 * Claims storage operations
 */
export const claimsStorage = {
  /**
   * Get all claims
   */
  getAll(): Claim[] {
    if (!isLocalStorageAvailable()) return [];
    
    return getCachedData(STORAGE_KEYS.CLAIMS, [], schemas.claims);
  },

  /**
   * Get claim by ID
   */
  getById(id: string): Claim | null {
    const claims = this.getAll();
    return claims.find(claim => claim.id === id) || null;
  },

  /**
   * Save claim (create or update)
   */
  save(claim: Claim): void {
    if (!isLocalStorageAvailable()) {
      throw new StorageError('localStorage is not available');
    }

    const { canStore, warning } = checkStorageQuota();
    if (!canStore) {
      throw new StorageError('Storage quota exceeded. Cannot save claim.');
    }

    if (warning) {
      console.warn(warning);
    }

    const claims = this.getAll();
    const existingIndex = claims.findIndex(c => c.id === claim.id);

    const updatedClaim = {
      ...claim,
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      claims[existingIndex] = updatedClaim;
    } else {
      claims.push(updatedClaim);
    }

    try {
      setCachedData(STORAGE_KEYS.CLAIMS, claims);
      this.updateMetadata();
    } catch (error) {
      // Invalidate cache on error
      invalidateCache(STORAGE_KEYS.CLAIMS);
      throw new StorageError('Failed to save claim to storage', error as Error);
    }
  },

  /**
   * Batch save multiple claims for better performance
   */
  saveBatch(claims: Claim[]): void {
    if (!isLocalStorageAvailable()) {
      throw new StorageError('localStorage is not available');
    }

    const { canStore, warning } = checkStorageQuota();
    if (!canStore) {
      throw new StorageError('Storage quota exceeded. Cannot save claims.');
    }

    if (warning) {
      console.warn(warning);
    }

    const existingClaims = this.getAll();
    const now = new Date();
    
    // Create a map for efficient lookup
    const existingClaimsMap = new Map(existingClaims.map(claim => [claim.id, claim]));
    
    // Update or add each claim
    claims.forEach(claim => {
      const updatedClaim = {
        ...claim,
        updatedAt: now,
        createdAt: existingClaimsMap.has(claim.id) ? 
          existingClaimsMap.get(claim.id)!.createdAt : 
          (claim.createdAt || now)
      };
      existingClaimsMap.set(claim.id, updatedClaim);
    });

    const finalClaims = Array.from(existingClaimsMap.values());

    try {
      setCachedData(STORAGE_KEYS.CLAIMS, finalClaims);
      this.updateMetadata();
    } catch (error) {
      invalidateCache(STORAGE_KEYS.CLAIMS);
      throw new StorageError('Failed to batch save claims to storage', error as Error);
    }
  },

  /**
   * Delete claim
   */
  delete(id: string): boolean {
    if (!isLocalStorageAvailable()) return false;

    const claims = this.getAll();
    const filteredClaims = claims.filter(claim => claim.id !== id);
    
    if (filteredClaims.length === claims.length) {
      return false; // Claim not found
    }

    try {
      localStorage.setItem(STORAGE_KEYS.CLAIMS, safeStringify(filteredClaims));
      this.updateMetadata();
      return true;
    } catch (error) {
      throw new StorageError('Failed to delete claim', error as Error);
    }
  },

  /**
   * Clear all claims
   */
  clear(): void {
    if (!isLocalStorageAvailable()) return;
    
    localStorage.removeItem(STORAGE_KEYS.CLAIMS);
    this.updateMetadata();
  },

  /**
   * Update storage metadata
   */
  updateMetadata(): void {
    const claims = this.getAll();
    const photos = photosStorage.getAll();
    const { used } = getStorageUsage();

    const metadata: StorageMetadata = {
      version: CURRENT_VERSION,
      lastSync: new Date(),
      totalClaims: claims.length,
      totalPhotos: photos.length,
      storageUsed: used,
      maxStorage: 5 * 1024 * 1024, // 5MB
    };

    try {
      localStorage.setItem(STORAGE_KEYS.METADATA, safeStringify(metadata));
    } catch (error) {
      console.warn('Failed to update storage metadata:', error);
    }
  }
};

/**
 * Photos storage operations
 */
export const photosStorage = {
  /**
   * Get all photo references
   */
  getAll(): PhotoReference[] {
    if (!isLocalStorageAvailable()) return [];
    
    return getCachedData(STORAGE_KEYS.PHOTOS, [], z.array(schemas.photoReference));
  },

  /**
   * Get photo by ID
   */
  getById(id: string): PhotoReference | null {
    const photos = this.getAll();
    return photos.find(photo => photo.id === id) || null;
  },

  /**
   * Save photo reference
   */
  save(photo: PhotoReference): void {
    if (!isLocalStorageAvailable()) {
      throw new StorageError('localStorage is not available');
    }

    const photos = this.getAll();
    const existingIndex = photos.findIndex(p => p.id === photo.id);
    
    if (existingIndex >= 0) {
      photos[existingIndex] = photo;
    } else {
      photos.push(photo);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, safeStringify(photos));
    } catch (error) {
      throw new StorageError('Failed to save photo reference', error as Error);
    }
  },

  /**
   * Delete photo reference
   */
  delete(id: string): boolean {
    if (!isLocalStorageAvailable()) return false;

    const photos = this.getAll();
    const filteredPhotos = photos.filter(photo => photo.id !== id);
    
    if (filteredPhotos.length === photos.length) {
      return false; // Photo not found
    }

    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, safeStringify(filteredPhotos));
      return true;
    } catch (error) {
      throw new StorageError('Failed to delete photo reference', error as Error);
    }
  }
};

/**
 * User preferences storage operations
 */
export const preferencesStorage = {
  /**
   * Get user preferences
   */
  get(): UserPreferences {
    if (!isLocalStorageAvailable()) return getDefaultPreferences();
    
    return getCachedData(STORAGE_KEYS.PREFERENCES, getDefaultPreferences(), schemas.userPreferences);
  },

  /**
   * Save user preferences
   */
  save(preferences: Partial<UserPreferences>): void {
    if (!isLocalStorageAvailable()) {
      throw new StorageError('localStorage is not available');
    }

    const currentPreferences = this.get();
    const updatedPreferences = { ...currentPreferences, ...preferences };

    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, safeStringify(updatedPreferences));
    } catch (error) {
      throw new StorageError('Failed to save preferences', error as Error);
    }
  },

  /**
   * Reset to default preferences
   */
  reset(): void {
    if (!isLocalStorageAvailable()) return;
    
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  }
};

/**
 * Sync queue storage operations
 */
export const syncQueueStorage = {
  /**
   * Get all sync queue items
   */
  getAll(): SyncQueueItem[] {
    if (!isLocalStorageAvailable()) return [];
    
    return getCachedData(STORAGE_KEYS.SYNC_QUEUE, [], schemas.syncQueue);
  },

  /**
   * Add item to sync queue
   */
  add(item: SyncQueueItem): void {
    if (!isLocalStorageAvailable()) {
      throw new StorageError('localStorage is not available');
    }

    const queue = this.getAll();
    queue.push(item);

    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, safeStringify(queue));
    } catch (error) {
      throw new StorageError('Failed to add item to sync queue', error as Error);
    }
  },

  /**
   * Remove item from sync queue
   */
  remove(id: string): boolean {
    if (!isLocalStorageAvailable()) return false;

    const queue = this.getAll();
    const filteredQueue = queue.filter(item => item.id !== id);
    
    if (filteredQueue.length === queue.length) {
      return false; // Item not found
    }

    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, safeStringify(filteredQueue));
      return true;
    } catch (error) {
      throw new StorageError('Failed to remove item from sync queue', error as Error);
    }
  },

  /**
   * Clear sync queue
   */
  clear(): void {
    if (!isLocalStorageAvailable()) return;
    
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
  }
};

/**
 * Get default user preferences
 */
function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'system',
    language: 'en',
    autoSave: true,
    syncFrequency: 'immediate',
    cameraQuality: 'high',
    offlineMode: false,
    notifications: {
      syncCompleted: true,
      syncFailed: true,
      reminderTasks: true,
    },
  };
}

/**
 * Carrier settings storage operations
 */
export const carrierStorage = {
  /**
   * Get all carriers
   */
  getAll(): Carrier[] {
    if (!isLocalStorageAvailable()) return [];

    return getCachedData(STORAGE_KEYS.CARRIER_SETTINGS, [], schemas.carriers);
  },

  /**
   * Get carrier by ID
   */
  getById(id: string): Carrier | null {
    const carriers = this.getAll();
    return carriers.find(carrier => carrier.id === id) ?? null;
  },

  /**
   * Save carrier (create or update)
   */
  save(carrier: Carrier): void {
    if (!isLocalStorageAvailable()) {
      throw new StorageError('localStorage is not available');
    }

    const { canStore, warning } = checkStorageQuota();
    if (!canStore) {
      throw new StorageError('Storage quota exceeded. Cannot save carrier.');
    }

    if (warning) {
      console.warn(warning);
    }

    const carriers = this.getAll();
    const existingIndex = carriers.findIndex(c => c.id === carrier.id);

    const updatedCarrier = {
      ...carrier,
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      carriers[existingIndex] = updatedCarrier;
    } else {
      carriers.push(updatedCarrier);
    }

    try {
      setCachedData(STORAGE_KEYS.CARRIER_SETTINGS, carriers);
    } catch (error) {
      invalidateCache(STORAGE_KEYS.CARRIER_SETTINGS);
      throw new StorageError('Failed to save carrier to storage', error as Error);
    }
  },

  /**
   * Delete carrier
   */
  delete(id: string): boolean {
    if (!isLocalStorageAvailable()) return false;

    const carriers = this.getAll();
    const filteredCarriers = carriers.filter(carrier => carrier.id !== id);

    if (filteredCarriers.length === carriers.length) {
      return false; // Carrier not found
    }

    try {
      setCachedData(STORAGE_KEYS.CARRIER_SETTINGS, filteredCarriers);
      invalidateCache(STORAGE_KEYS.CARRIER_SETTINGS);
      return true;
    } catch (error) {
      throw new StorageError('Failed to delete carrier', error as Error);
    }
  },

  /**
   * Clear all carriers
   */
  clear(): void {
    if (!isLocalStorageAvailable()) return;

    localStorage.removeItem(STORAGE_KEYS.CARRIER_SETTINGS);
    invalidateCache(STORAGE_KEYS.CARRIER_SETTINGS);
  },

  /**
   * Export carriers as JSON string
   */
  export(): string {
    const carriers = this.getAll();
    return safeStringify(carriers);
  },

  /**
   * Import carriers from JSON string
   */
  import(jsonData: string): { success: boolean; error?: string; imported: number } {
    try {
      const data = JSON.parse(jsonData);

      if (!Array.isArray(data)) {
        return { success: false, error: 'Invalid data format: expected array', imported: 0 };
      }

      let imported = 0;
      const carriers = this.getAll();

      for (const carrierData of data) {
        try {
          // Validate carrier data with schema
          const carrier = schemas.carrier.parse({
            ...carrierData,
            createdAt: new Date(carrierData.createdAt),
            updatedAt: new Date(carrierData.updatedAt),
          });

          // Check if carrier already exists
          const existingIndex = carriers.findIndex(c => c.id === carrier.id);
          if (existingIndex >= 0) {
            carriers[existingIndex] = carrier;
          } else {
            carriers.push(carrier);
          }
          imported++;
        } catch (error) {
          console.warn('Skipping invalid carrier:', error);
        }
      }

      if (imported > 0) {
        setCachedData(STORAGE_KEYS.CARRIER_SETTINGS, carriers);
      }

      return { success: true, imported };
    } catch (error) {
      return { success: false, error: `Import failed: ${error}`, imported: 0 };
    }
  },
};

/**
 * Cross-tab synchronization using storage events
 */
export function addStorageEventListener(callback: (key: string, newValue: unknown) => void): () => void {
  const storageValues = Object.values(STORAGE_KEYS) as string[];
  const handler = (event: StorageEvent) => {
    // Validate storage key to prevent XSS attacks
    if (event.key && storageValues.includes(event.key) && isValidStorageKey(event.key)) {
      const newValue = safeParse(event.newValue, null);
      callback(event.key, newValue);
    }
  };

  window.addEventListener('storage', handler);

  // Return cleanup function
  return () => window.removeEventListener('storage', handler);
}

/**
 * Export all data for backup purposes
 */
export function exportAllData(): string {
  const data = {
    version: CURRENT_VERSION,
    timestamp: new Date().toISOString(),
    claims: claimsStorage.getAll(),
    photos: photosStorage.getAll(),
    preferences: preferencesStorage.get(),
    syncQueue: syncQueueStorage.getAll(),
  };

  return safeStringify(data);
}

/**
 * Import data from backup
 */
export function importAllData(jsonData: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate data structure
    if (!data.version || !data.claims) {
      return { success: false, error: 'Invalid backup data format' };
    }

    // Clear existing data
    claimsStorage.clear();
    syncQueueStorage.clear();

    // Import data
    data.claims.forEach((claim: Claim) => claimsStorage.save(claim));
    if (data.photos) {
      data.photos.forEach((photo: PhotoReference) => photosStorage.save(photo));
    }
    if (data.preferences) {
      preferencesStorage.save(data.preferences);
    }
    if (data.syncQueue) {
      data.syncQueue.forEach((item: SyncQueueItem) => syncQueueStorage.add(item));
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Import failed: ${error}` };
  }
}