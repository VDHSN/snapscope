/**
 * Enhanced photo storage using IndexedDB with encryption
 * Replaces localStorage-based photo storage for better performance and security
 */

import { StorageError } from './storage';
import type { PhotoReference } from '@/types/claim';

// Database configuration
const DB_NAME = 'SnapScopePhotos';
const DB_VERSION = 1;
const PHOTO_STORE = 'photos';
const METADATA_STORE = 'metadata';
const ENCRYPTION_KEY_STORE = 'keys';

// Storage limits
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB per photo
const COMPRESSION_QUALITY = 0.85;

// Encryption configuration
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM

interface EncryptedPhotoData {
  encryptedBlob: ArrayBuffer;
  iv: Uint8Array;
  metadata: {
    originalSize: number;
    compressedSize: number;
    mimeType: string;
    timestamp: number;
  };
}

interface PhotoStorageMetadata {
  totalPhotos: number;
  totalSize: number;
  lastCleanup: number;
  version: string;
}

interface StorageQuota {
  usage: number;
  quota: number;
  available: number;
  percentUsed: number;
}

class IndexedDBPhotoStorage {
  private db: IDBDatabase | null = null;
  private encryptionKey: CryptoKey | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize the database and encryption
   */
  async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._initialize();
    return this.initPromise;
  }

  private async _initialize(): Promise<void> {
    try {
      // Initialize IndexedDB
      await this.initDatabase();
      
      // Initialize or retrieve encryption key
      await this.initEncryption();
      
      console.log('IndexedDB photo storage initialized successfully');
    } catch (error) {
      console.error('Failed to initialize IndexedDB photo storage:', error);
      throw new StorageError('Failed to initialize photo storage', error as Error);
    }
  }

  private async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create photos store
        if (!db.objectStoreNames.contains(PHOTO_STORE)) {
          const photoStore = db.createObjectStore(PHOTO_STORE, { keyPath: 'id' });
          photoStore.createIndex('timestamp', 'metadata.timestamp', { unique: false });
        }

        // Create metadata store
        if (!db.objectStoreNames.contains(METADATA_STORE)) {
          db.createObjectStore(METADATA_STORE, { keyPath: 'key' });
        }

        // Create encryption keys store
        if (!db.objectStoreNames.contains(ENCRYPTION_KEY_STORE)) {
          db.createObjectStore(ENCRYPTION_KEY_STORE, { keyPath: 'id' });
        }
      };
    });
  }

  private async initEncryption(): Promise<void> {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Web Crypto API not supported');
    }

    // Try to retrieve existing key
    const storedKey = await this.getStoredEncryptionKey();
    
    if (storedKey) {
      this.encryptionKey = storedKey;
    } else {
      // Generate new key
      this.encryptionKey = await window.crypto.subtle.generateKey(
        {
          name: ALGORITHM,
          length: KEY_LENGTH,
        },
        true, // extractable
        ['encrypt', 'decrypt']
      );

      // Store the key
      await this.storeEncryptionKey(this.encryptionKey);
    }
  }

  private async getStoredEncryptionKey(): Promise<CryptoKey | null> {
    if (!this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([ENCRYPTION_KEY_STORE], 'readonly');
      const store = transaction.objectStore(ENCRYPTION_KEY_STORE);
      const request = store.get('main');

      request.onsuccess = async () => {
        if (request.result) {
          try {
            const key = await window.crypto.subtle.importKey(
              'raw',
              request.result.keyData,
              { name: ALGORITHM },
              true,
              ['encrypt', 'decrypt']
            );
            resolve(key);
          } catch {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  }

  private async storeEncryptionKey(key: CryptoKey): Promise<void> {
    if (!this.db) return;

    const keyData = await window.crypto.subtle.exportKey('raw', key);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([ENCRYPTION_KEY_STORE], 'readwrite');
      const store = transaction.objectStore(ENCRYPTION_KEY_STORE);
      
      const request = store.put({
        id: 'main',
        keyData: keyData,
        created: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to store encryption key'));
    });
  }

  /**
   * Encrypt blob data
   */
  private async encryptBlob(blob: Blob): Promise<EncryptedPhotoData> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const arrayBuffer = await blob.arrayBuffer();
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      this.encryptionKey,
      arrayBuffer
    );

    return {
      encryptedBlob: encryptedBuffer,
      iv: iv,
      metadata: {
        originalSize: arrayBuffer.byteLength,
        compressedSize: encryptedBuffer.byteLength,
        mimeType: blob.type,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Decrypt blob data
   */
  private async decryptBlob(encryptedData: EncryptedPhotoData): Promise<Blob> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: encryptedData.iv as BufferSource,
      },
      this.encryptionKey,
      encryptedData.encryptedBlob
    );

    return new Blob([decryptedBuffer], { type: encryptedData.metadata.mimeType });
  }

  /**
   * Compress image blob if needed
   */
  private async compressImage(blob: Blob): Promise<Blob> {
    if (blob.size <= MAX_PHOTO_SIZE || !blob.type.startsWith('image/')) {
      return blob;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      img.onload = () => {
        // Calculate compression ratio
        const ratio = Math.sqrt(MAX_PHOTO_SIZE / blob.size);
        let { width, height } = img;

        if (ratio < 1) {
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (compressedBlob) => {
            resolve(compressedBlob || blob);
          },
          'image/jpeg',
          COMPRESSION_QUALITY
        );
      };

      img.onerror = () => resolve(blob); // Return original on error
      img.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Save photo with encryption
   */
  async savePhoto(
    photoBlob: Blob,
    metadata: Omit<PhotoReference, 'id' | 'localPath' | 'metadata'>
  ): Promise<PhotoReference> {
    await this.initialize();

    if (!this.db) {
      throw new StorageError('Database not initialized');
    }

    try {
      // Check storage quota before saving
      const quota = await this.getStorageQuota();
      if (quota.percentUsed > 90) {
        throw new StorageError('Storage quota exceeded');
      }

      // Compress image if needed
      const compressedBlob = await this.compressImage(photoBlob);

      // Encrypt the blob
      const encryptedData = await this.encryptBlob(compressedBlob);

      // Generate position-based photo ID for atomic retakes
      const photoId = metadata.damageAreaId ? `${metadata.damageAreaId}_photo` : crypto.randomUUID();

      // Create photo reference
      const photoReference: PhotoReference = {
        ...metadata,
        id: photoId,
        localPath: `indexeddb://${photoId}`,
        metadata: {
          fileSize: encryptedData.metadata.compressedSize,
          dimensions: await this.getImageDimensions(compressedBlob),
        },
      };

      // Store encrypted photo data
      await this.storeEncryptedPhoto(photoId, encryptedData);

      // Update metadata
      await this.updateStorageMetadata(1, encryptedData.metadata.compressedSize);

      return photoReference;
    } catch (error) {
      throw new StorageError('Failed to save photo', error as Error);
    }
  }

  private async getImageDimensions(blob: Blob): Promise<{ width: number; height: number } | undefined> {
    if (!blob.type.startsWith('image/')) return undefined;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => resolve(undefined);
      img.src = URL.createObjectURL(blob);
    });
  }

  private async storeEncryptedPhoto(photoId: string, encryptedData: EncryptedPhotoData): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PHOTO_STORE], 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE);

      const request = store.put({
        id: photoId,
        ...encryptedData,
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to store photo'));
    });
  }

  /**
   * Get photo blob by ID
   */
  async getPhotoBlob(photoId: string): Promise<Blob | null> {
    await this.initialize();

    if (!this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([PHOTO_STORE], 'readonly');
      const store = transaction.objectStore(PHOTO_STORE);
      const request = store.get(photoId);

      request.onsuccess = async () => {
        if (request.result) {
          try {
            const encryptedData: EncryptedPhotoData = {
              encryptedBlob: request.result.encryptedBlob,
              iv: new Uint8Array(request.result.iv),
              metadata: request.result.metadata,
            };
            const blob = await this.decryptBlob(encryptedData);
            resolve(blob);
          } catch (error) {
            console.error('Failed to decrypt photo:', error);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  }

  /**
   * Get photo as object URL with cache busting for retakes
   */
  async getPhotoObjectUrl(photoId: string, cacheBust?: boolean): Promise<string | null> {
    const blob = await this.getPhotoBlob(photoId);
    if (!blob) return null;
    
    const objectUrl = URL.createObjectURL(blob);
    
    // Add cache busting parameter if requested (for retakes)
    if (cacheBust) {
      return `${objectUrl}#t=${Date.now()}`;
    }
    
    return objectUrl;
  }

  /**
   * Clear any cached references for a photo ID (useful for retakes)
   */
  async clearPhotoCache(photoId: string): Promise<void> {
    // For IndexedDB, we don't have external caching, but this method
    // provides interface compatibility for cache invalidation
    console.log(`Cache cleared for photo ID: ${photoId}`);
  }

  /**
   * Delete photo
   */
  async deletePhoto(photoId: string): Promise<boolean> {
    await this.initialize();

    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([PHOTO_STORE], 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE);
      const request = store.delete(photoId);

      request.onsuccess = async () => {
        // Update metadata
        try {
          await this.updateStorageMetadata(-1, 0);
        } catch (error) {
          console.warn('Failed to update metadata after deletion:', error);
        }
        resolve(true);
      };

      request.onerror = () => resolve(false);
    });
  }

  /**
   * Get storage quota information
   */
  async getStorageQuota(): Promise<StorageQuota> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage ?? 0;
      const quota = estimate.quota ?? 0;
      
      return {
        usage,
        quota,
        available: quota - usage,
        percentUsed: quota > 0 ? (usage / quota) * 100 : 0,
      };
    }

    // Fallback for browsers without storage API
    return {
      usage: 0,
      quota: 50 * 1024 * 1024, // 50MB estimate
      available: 50 * 1024 * 1024,
      percentUsed: 0,
    };
  }

  /**
   * Get photo storage usage statistics
   */
  async getPhotosStorageUsage(): Promise<{ count: number; totalSize: number }> {
    await this.initialize();

    const metadata = await this.getStorageMetadata();
    return {
      count: metadata.totalPhotos,
      totalSize: metadata.totalSize,
    };
  }

  private async getStorageMetadata(): Promise<PhotoStorageMetadata> {
    if (!this.db) {
      return {
        totalPhotos: 0,
        totalSize: 0,
        lastCleanup: 0,
        version: '1.0.0',
      };
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([METADATA_STORE], 'readonly');
      const store = transaction.objectStore(METADATA_STORE);
      const request = store.get('storage');

      request.onsuccess = () => {
        resolve(request.result?.value ?? {
          totalPhotos: 0,
          totalSize: 0,
          lastCleanup: 0,
          version: '1.0.0',
        });
      };

      request.onerror = () => {
        resolve({
          totalPhotos: 0,
          totalSize: 0,
          lastCleanup: 0,
          version: '1.0.0',
        });
      };
    });
  }

  private async updateStorageMetadata(photoCountDelta: number, sizeDelta: number): Promise<void> {
    if (!this.db) return;

    const currentMetadata = await this.getStorageMetadata();
    const newMetadata: PhotoStorageMetadata = {
      ...currentMetadata,
      totalPhotos: Math.max(0, currentMetadata.totalPhotos + photoCountDelta),
      totalSize: Math.max(0, currentMetadata.totalSize + sizeDelta),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([METADATA_STORE], 'readwrite');
      const store = transaction.objectStore(METADATA_STORE);
      const request = store.put({ key: 'storage', value: newMetadata });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to update metadata'));
    });
  }

  /**
   * Check storage health and capacity
   */
  async checkStorageCapacity(): Promise<{
    available: boolean;
    usedPercentage: number;
    warning?: string;
  }> {
    const quota = await this.getStorageQuota();
    const usedPercentage = quota.percentUsed;

    return {
      available: usedPercentage < 90,
      usedPercentage,
      warning: usedPercentage > 80 
        ? `Photo storage is ${usedPercentage.toFixed(1)}% full. Consider deleting old photos.`
        : undefined,
    };
  }

  /**
   * Clean up storage - remove invalid entries
   */
  async cleanupStorage(): Promise<number> {
    await this.initialize();

    if (!this.db) return 0;

    let cleanedCount = 0;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([PHOTO_STORE], 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const data = cursor.value;
          // Check if photo data is valid
          if (!data.encryptedBlob || !data.iv || !data.metadata) {
            cursor.delete();
            cleanedCount++;
          }
          cursor.continue();
        } else {
          // Update cleanup timestamp
          this.updateStorageMetadata(0, 0).then(() => {
            resolve(cleanedCount);
          });
        }
      };

      request.onerror = () => resolve(cleanedCount);
    });
  }
}

// Export singleton instance
export const indexedDBPhotoStorage = new IndexedDBPhotoStorage();