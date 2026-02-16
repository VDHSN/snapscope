/**
 * Migration utility to move photos from localStorage to IndexedDB
 * Handles backward compatibility and data migration
 */

import { photosStorage } from './storage';
import { indexedDBPhotoStorage } from './photo-storage-indexeddb';
import type { PhotoReference } from '@/types/claim';

const MIGRATION_KEY = 'snapscope_photo_migration_status';
const PHOTO_BLOB_PREFIX = 'snapscope_photo_blob_';

interface MigrationStatus {
  completed: boolean;
  startedAt?: number;
  completedAt?: number;
  totalPhotos: number;
  migratedPhotos: number;
  failedPhotos: string[];
  version: string;
}

interface MigrationProgress {
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0-100
  current: number;
  total: number;
  errors: string[];
}

/**
 * Convert data URL back to blob (copied from original photo-storage.ts)
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binaryString = window.atob(parts[1]);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: mime });
}

class PhotoStorageMigration {
  private migrationCallbacks: ((progress: MigrationProgress) => void)[] = [];

  /**
   * Subscribe to migration progress updates
   */
  onProgress(callback: (progress: MigrationProgress) => void): () => void {
    this.migrationCallbacks.push(callback);
    return () => {
      const index = this.migrationCallbacks.indexOf(callback);
      if (index > -1) {
        this.migrationCallbacks.splice(index, 1);
      }
    };
  }

  private notifyProgress(progress: MigrationProgress): void {
    this.migrationCallbacks.forEach(callback => {
      try {
        callback(progress);
      } catch (error) {
        console.warn('Migration progress callback error:', error);
      }
    });
  }

  /**
   * Check if migration is needed
   */
  async isMigrationNeeded(): Promise<boolean> {
    const status = this.getMigrationStatus();
    if (status.completed) {
      return false;
    }

    // Check if there are any localStorage photos to migrate
    const photosToMigrate = this.findLocalStoragePhotos();
    return photosToMigrate.length > 0;
  }

  /**
   * Get current migration status
   */
  getMigrationStatus(): MigrationStatus {
    try {
      const stored = localStorage.getItem(MIGRATION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to get migration status:', error);
    }

    return {
      completed: false,
      totalPhotos: 0,
      migratedPhotos: 0,
      failedPhotos: [],
      version: '1.0.0',
    };
  }

  private setMigrationStatus(status: MigrationStatus): void {
    try {
      localStorage.setItem(MIGRATION_KEY, JSON.stringify(status));
    } catch (error) {
      console.warn('Failed to save migration status:', error);
    }
  }

  /**
   * Find all photos stored in localStorage
   */
  private findLocalStoragePhotos(): { photoRef: PhotoReference; dataUrl: string }[] {
    const photos: { photoRef: PhotoReference; dataUrl: string }[] = [];
    const photoReferences = photosStorage.getAll();

    photoReferences.forEach(photoRef => {
      // Only migrate photos that have localStorage paths
      if (photoRef.localPath && photoRef.localPath.startsWith(PHOTO_BLOB_PREFIX)) {
        const dataUrl = localStorage.getItem(photoRef.localPath);
        if (dataUrl) {
          photos.push({ photoRef, dataUrl });
        }
      }
    });

    return photos;
  }

  /**
   * Perform the migration from localStorage to IndexedDB
   */
  async migrate(): Promise<MigrationStatus> {
    const existingStatus = this.getMigrationStatus();
    if (existingStatus.completed) {
      return existingStatus;
    }

    const photosToMigrate = this.findLocalStoragePhotos();
    if (photosToMigrate.length === 0) {
      const completedStatus: MigrationStatus = {
        completed: true,
        completedAt: Date.now(),
        totalPhotos: 0,
        migratedPhotos: 0,
        failedPhotos: [],
        version: '1.0.0',
      };
      this.setMigrationStatus(completedStatus);
      return completedStatus;
    }

    // Initialize migration
    const migrationStatus: MigrationStatus = {
      completed: false,
      startedAt: Date.now(),
      totalPhotos: photosToMigrate.length,
      migratedPhotos: 0,
      failedPhotos: [],
      version: '1.0.0',
    };

    this.setMigrationStatus(migrationStatus);
    this.notifyProgress({
      status: 'in_progress',
      progress: 0,
      current: 0,
      total: photosToMigrate.length,
      errors: [],
    });

    // Migrate photos one by one
    for (let i = 0; i < photosToMigrate.length; i++) {
      const { photoRef, dataUrl } = photosToMigrate[i];
      
      try {
        // Convert data URL back to blob
        const blob = dataUrlToBlob(dataUrl);

        // Save to IndexedDB using the new storage system
        // We'll update the photo reference to use the new IndexedDB path
        const updatedPhotoRef = await indexedDBPhotoStorage.savePhoto(blob, {
          filename: photoRef.filename,
          caption: photoRef.caption,
          damageAreaId: photoRef.damageAreaId,
          timestamp: photoRef.timestamp,
          cloudUrl: photoRef.cloudUrl,
        });

        // Update the photo reference in the main storage
        // Replace the old reference with the new one
        photosStorage.delete(photoRef.id);
        photosStorage.save(updatedPhotoRef);

        // Clean up the old localStorage entry
        localStorage.removeItem(photoRef.localPath!);

        migrationStatus.migratedPhotos++;
        
        // Update progress
        const progress = Math.round((migrationStatus.migratedPhotos / migrationStatus.totalPhotos) * 100);
        this.notifyProgress({
          status: 'in_progress',
          progress,
          current: migrationStatus.migratedPhotos,
          total: migrationStatus.totalPhotos,
          errors: migrationStatus.failedPhotos,
        });

      } catch (error) {
        console.error(`Failed to migrate photo ${photoRef.id}:`, error);
        migrationStatus.failedPhotos.push(photoRef.id);
      }

      // Update status periodically
      this.setMigrationStatus(migrationStatus);

      // Add a small delay to prevent blocking the UI
      if (i % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    // Mark migration as completed
    migrationStatus.completed = true;
    migrationStatus.completedAt = Date.now();
    this.setMigrationStatus(migrationStatus);

    const finalStatus: 'completed' | 'failed' = migrationStatus.failedPhotos.length === 0 ? 'completed' : 'failed';
    this.notifyProgress({
      status: finalStatus,
      progress: 100,
      current: migrationStatus.migratedPhotos,
      total: migrationStatus.totalPhotos,
      errors: migrationStatus.failedPhotos,
    });

    return migrationStatus;
  }

  /**
   * Clean up migration artifacts
   */
  async cleanupAfterMigration(): Promise<void> {
    const status = this.getMigrationStatus();
    if (!status.completed) {
      return;
    }

    // Clean up any remaining localStorage photo blobs
    const keysToRemove: string[] = [];
    for (const key in localStorage) {
      if (key.startsWith(PHOTO_BLOB_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove localStorage key ${key}:`, error);
      }
    });

    console.log(`Cleaned up ${keysToRemove.length} localStorage photo entries`);
  }

  /**
   * Reset migration status (for testing or re-migration)
   */
  resetMigrationStatus(): void {
    localStorage.removeItem(MIGRATION_KEY);
  }

  /**
   * Get migration summary for UI display
   */
  getMigrationSummary(): {
    needed: boolean;
    status: MigrationStatus;
    photosToMigrate: number;
  } {
    const status = this.getMigrationStatus();
    const photosToMigrate = this.findLocalStoragePhotos();

    return {
      needed: !status.completed && photosToMigrate.length > 0,
      status,
      photosToMigrate: photosToMigrate.length,
    };
  }

  /**
   * Perform a test migration (dry run)
   */
  async testMigration(): Promise<{
    photosFound: number;
    estimatedSize: number;
    issues: string[];
  }> {
    const photosToMigrate = this.findLocalStoragePhotos();
    let estimatedSize = 0;
    const issues: string[] = [];

    photosToMigrate.forEach(({ photoRef, dataUrl }) => {
      try {
        // Estimate size
        estimatedSize += dataUrl.length;

        // Check for potential issues
        if (!photoRef.filename) {
          issues.push(`Photo ${photoRef.id} has no filename`);
        }

        if (dataUrl.length > 5 * 1024 * 1024) { // 5MB
          issues.push(`Photo ${photoRef.id} is very large (${Math.round(dataUrl.length / 1024 / 1024)}MB)`);
        }

        // Try to parse the data URL
        const blob = dataUrlToBlob(dataUrl);
        if (blob.size === 0) {
          issues.push(`Photo ${photoRef.id} appears to be empty`);
        }

      } catch (error) {
        issues.push(`Photo ${photoRef.id} has invalid data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    return {
      photosFound: photosToMigrate.length,
      estimatedSize,
      issues,
    };
  }
}

// Export singleton instance
export const photoStorageMigration = new PhotoStorageMigration();

/**
 * Get migration status for non-React usage
 */
export function getMigrationProgressStatus(): MigrationProgress {
  const status = photoStorageMigration.getMigrationStatus();
  const summary = photoStorageMigration.getMigrationSummary();
  
  return {
    status: summary.needed ? 'not_started' : status.completed ? 'completed' : 'in_progress',
    progress: status.totalPhotos > 0 ? (status.migratedPhotos / status.totalPhotos) * 100 : 0,
    current: status.migratedPhotos,
    total: status.totalPhotos,
    errors: status.failedPhotos,
  };
}