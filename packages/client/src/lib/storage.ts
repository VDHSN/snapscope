/**
 * Local storage utilities for offline-first functionality
 * Handles claim data, user preferences, and sync management
 */

import type {
  Claim,
  UserPreferences,
  SyncQueueItem,
  StorageMetadata,
  PhotoReference
} from '@/types/claim';

// Storage keys
const STORAGE_KEYS = {
  CLAIMS: 'snapscope_claims',
  PREFERENCES: 'snapscope_preferences',
  SYNC_QUEUE: 'snapscope_sync_queue',
  METADATA: 'snapscope_metadata',
  PHOTOS: 'snapscope_photos',
} as const;

// Storage version for migration handling
const CURRENT_VERSION = '1.0.0';

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
 * Safe JSON parse with error handling
 */
function safeParse<T>(data: string | null, fallback: T): T {
  if (!data) return fallback;
  
  try {
    const parsed = JSON.parse(data);
    // Restore Date objects
    return reviveDates(parsed) as T;
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
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
      result[key] = new Date(value);
    } else if (typeof value === 'object') {
      result[key] = reviveDates(value);
    } else {
      result[key] = value;
    }
  }
  return result;
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
    
    const data = localStorage.getItem(STORAGE_KEYS.CLAIMS);
    return safeParse(data, []);
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
      localStorage.setItem(STORAGE_KEYS.CLAIMS, safeStringify(claims));
      this.updateMetadata();
    } catch (error) {
      throw new StorageError('Failed to save claim to storage', error as Error);
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
    
    const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    return safeParse(data, []);
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
    
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return safeParse(data, getDefaultPreferences());
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
    
    const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return safeParse(data, []);
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
 * Cross-tab synchronization using storage events
 */
export function addStorageEventListener(callback: (key: string, newValue: unknown) => void): () => void {
  const storageValues = Object.values(STORAGE_KEYS) as string[];
  const handler = (event: StorageEvent) => {
    if (event.key && storageValues.includes(event.key)) {
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