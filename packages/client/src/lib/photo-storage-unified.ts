/**
 * Unified photo storage interface that handles migration and provides consistent API
 * Automatically migrates from localStorage to IndexedDB on first use
 */

import { photoBlobStorage as legacyStorage } from './photo-storage';
import { indexedDBPhotoStorage } from './photo-storage-indexeddb';
import { photoStorageMigration } from './photo-storage-migration';
import type { PhotoReference } from '@/types/claim';

// Storage preferences
const STORAGE_PREFERENCE_KEY = 'snapscope_photo_storage_preference';
type StorageBackend = 'localStorage' | 'indexeddb';

interface UnifiedStorageConfig {
  preferredBackend: StorageBackend;
  autoMigrate: boolean;
  migrationCompleted: boolean;
}

class UnifiedPhotoStorage {
  private config: UnifiedStorageConfig;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    // Load configuration
    this.config = this.loadConfig();
  }

  private loadConfig(): UnifiedStorageConfig {
    const defaultConfig: UnifiedStorageConfig = {
      preferredBackend: 'indexeddb', // Prefer IndexedDB by default
      autoMigrate: true,
      migrationCompleted: false,
    };

    try {
      const stored = localStorage.getItem(STORAGE_PREFERENCE_KEY);
      if (stored) {
        return { ...defaultConfig, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load storage config:', error);
    }

    return defaultConfig;
  }

  private saveConfig(): void {
    try {
      localStorage.setItem(STORAGE_PREFERENCE_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save storage config:', error);
    }
  }

  /**
   * Initialize the storage system and handle migration if needed
   */
  async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initialize();
    return this.initializationPromise;
  }

  private async _initialize(): Promise<void> {
    try {
      // Always try to initialize IndexedDB if it's preferred
      if (this.config.preferredBackend === 'indexeddb') {
        try {
          await indexedDBPhotoStorage.initialize();
          console.log('IndexedDB photo storage initialized');
        } catch (error) {
          console.warn('Failed to initialize IndexedDB, falling back to localStorage:', error);
          this.config.preferredBackend = 'localStorage';
          this.saveConfig();
        }
      }

      // Handle migration if needed and enabled
      if (this.config.autoMigrate && !this.config.migrationCompleted) {
        const migrationNeeded = await photoStorageMigration.isMigrationNeeded();
        
        if (migrationNeeded) {
          console.log('Photo migration needed, starting migration...');
          
          // Set up progress tracking
          photoStorageMigration.onProgress((progress) => {
            console.log(`Migration progress: ${progress.progress}% (${progress.current}/${progress.total})`);
            
            if (progress.status === 'completed') {
              this.config.migrationCompleted = true;
              this.saveConfig();
              console.log('Photo migration completed successfully');
            } else if (progress.status === 'failed') {
              console.error('Photo migration failed:', progress.errors);
            }
          });

          // Perform migration
          await photoStorageMigration.migrate();
          
          // Clean up after successful migration
          await photoStorageMigration.cleanupAfterMigration();
        } else {
          // No migration needed
          this.config.migrationCompleted = true;
          this.saveConfig();
        }
      }
    } catch (error) {
      console.error('Failed to initialize unified photo storage:', error);
      // Fall back to localStorage if everything else fails
      this.config.preferredBackend = 'localStorage';
      this.saveConfig();
    }
  }

  /**
   * Get the currently active storage backend
   */
  private getActiveStorage() {
    return this.config.preferredBackend === 'indexeddb' ? indexedDBPhotoStorage : legacyStorage;
  }

  /**
   * Save photo using the active storage backend
   */
  async savePhoto(
    photoBlob: Blob,
    metadata: Omit<PhotoReference, 'id' | 'localPath' | 'metadata'>
  ): Promise<PhotoReference> {
    await this.initialize();

    if (this.config.preferredBackend === 'indexeddb') {
      return indexedDBPhotoStorage.savePhoto(photoBlob, metadata);
    } else {
      return legacyStorage.savePhoto(photoBlob, metadata);
    }
  }

  /**
   * Get photo blob by ID
   */
  async getPhotoBlob(photoId: string): Promise<Blob | null> {
    await this.initialize();

    if (this.config.preferredBackend === 'indexeddb') {
      return indexedDBPhotoStorage.getPhotoBlob(photoId);
    } else {
      return legacyStorage.getPhotoBlob(photoId);
    }
  }

  /**
   * Get photo as object URL with optional cache busting
   */
  async getPhotoObjectUrl(photoId: string, cacheBust?: boolean): Promise<string | null> {
    await this.initialize();

    if (this.config.preferredBackend === 'indexeddb') {
      return indexedDBPhotoStorage.getPhotoObjectUrl(photoId, cacheBust);
    } else {
      return legacyStorage.getPhotoObjectUrl(photoId);
    }
  }

  /**
   * Get photo as data URL with optional cache busting (fallback for localStorage compatibility)
   */
  async getPhotoDataUrl(photoId: string, cacheBust?: boolean): Promise<string | null> {
    await this.initialize();

    if (this.config.preferredBackend === 'indexeddb') {
      // Convert blob to data URL
      const blob = await indexedDBPhotoStorage.getPhotoBlob(photoId);
      if (!blob) return null;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          let dataUrl = reader.result as string;
          // Add cache busting parameter if requested
          if (cacheBust) {
            dataUrl += `#t=${Date.now()}`;
          }
          resolve(dataUrl);
        };
        reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
        reader.readAsDataURL(blob);
      });
    } else {
      return legacyStorage.getPhotoDataUrl(photoId);
    }
  }

  /**
   * Clear photo cache for retakes
   */
  async clearPhotoCache(photoId: string): Promise<void> {
    await this.initialize();

    if (this.config.preferredBackend === 'indexeddb') {
      return indexedDBPhotoStorage.clearPhotoCache(photoId);
    }
    // Legacy storage doesn't have caching, so this is a no-op
  }

  /**
   * Delete photo
   */
  async deletePhoto(photoId: string): Promise<boolean> {
    await this.initialize();

    if (this.config.preferredBackend === 'indexeddb') {
      return indexedDBPhotoStorage.deletePhoto(photoId);
    } else {
      return legacyStorage.deletePhoto(photoId);
    }
  }

  /**
   * Get storage usage statistics
   */
  async getPhotosStorageUsage(): Promise<{ count: number; totalSize: number }> {
    await this.initialize();

    if (this.config.preferredBackend === 'indexeddb') {
      return indexedDBPhotoStorage.getPhotosStorageUsage();
    } else {
      return legacyStorage.getPhotosStorageUsage();
    }
  }

  /**
   * Check storage capacity
   */
  async checkStorageCapacity(): Promise<{
    available: boolean;
    usedPercentage: number;
    warning?: string;
  }> {
    await this.initialize();

    if (this.config.preferredBackend === 'indexeddb') {
      return indexedDBPhotoStorage.checkStorageCapacity();
    } else {
      return legacyStorage.checkStorageCapacity();
    }
  }

  /**
   * Clean up storage
   */
  async cleanupStorage(): Promise<number> {
    await this.initialize();

    if (this.config.preferredBackend === 'indexeddb') {
      return indexedDBPhotoStorage.cleanupStorage();
    } else {
      return legacyStorage.cleanupOrphanedBlobs();
    }
  }

  /**
   * Get storage configuration
   */
  getConfig(): UnifiedStorageConfig {
    return { ...this.config };
  }

  /**
   * Update storage configuration
   */
  updateConfig(updates: Partial<UnifiedStorageConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  /**
   * Force migration to IndexedDB
   */
  async migateToIndexedDB(): Promise<void> {
    if (this.config.preferredBackend === 'indexeddb' && this.config.migrationCompleted) {
      return; // Already migrated
    }

    try {
      await indexedDBPhotoStorage.initialize();
      
      const migrationStatus = await photoStorageMigration.migrate();
      
      if (migrationStatus.completed) {
        this.config.preferredBackend = 'indexeddb';
        this.config.migrationCompleted = true;
        this.saveConfig();
        
        await photoStorageMigration.cleanupAfterMigration();
        console.log('Successfully migrated to IndexedDB');
      }
    } catch (error) {
      console.error('Failed to migrate to IndexedDB:', error);
      throw error;
    }
  }

  /**
   * Get migration status
   */
  getMigrationStatus() {
    return photoStorageMigration.getMigrationStatus();
  }

  /**
   * Get storage backend info
   */
  async getStorageInfo(): Promise<{
    backend: StorageBackend;
    migrationCompleted: boolean;
    supportsEncryption: boolean;
    quotaInfo?: {
      usage: number;
      quota: number;
      available: number;
      percentUsed: number;
    };
  }> {
    await this.initialize();

    const info = {
      backend: this.config.preferredBackend,
      migrationCompleted: this.config.migrationCompleted,
      supportsEncryption: this.config.preferredBackend === 'indexeddb',
    };

    if (this.config.preferredBackend === 'indexeddb') {
      try {
        const quotaInfo = await indexedDBPhotoStorage.getStorageQuota();
        return { ...info, quotaInfo };
      } catch (error) {
        console.warn('Failed to get quota info:', error);
      }
    }

    return info;
  }

  /**
   * Test storage performance
   */
  async testStoragePerformance(): Promise<{
    backend: StorageBackend;
    writeTime: number;
    readTime: number;
    deleteTime: number;
  }> {
    await this.initialize();

    // Create a test blob
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);

    const testBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8);
    });

    const testMetadata = {
      filename: `test_${Date.now()}.jpg`,
      timestamp: new Date(),
    };

    // Test write performance
    const writeStart = performance.now();
    const photoRef = await this.savePhoto(testBlob, testMetadata);
    const writeTime = performance.now() - writeStart;

    // Test read performance
    const readStart = performance.now();
    await this.getPhotoBlob(photoRef.id);
    const readTime = performance.now() - readStart;

    // Test delete performance
    const deleteStart = performance.now();
    await this.deletePhoto(photoRef.id);
    const deleteTime = performance.now() - deleteStart;

    return {
      backend: this.config.preferredBackend,
      writeTime,
      readTime,
      deleteTime,
    };
  }
}

// Export the class for manual instantiation
export { UnifiedPhotoStorage };

// Export type
export type { PhotoReference } from '@/types/claim';