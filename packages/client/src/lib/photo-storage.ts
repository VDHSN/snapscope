/**
 * Photo blob storage utilities for handling actual photo data
 * Extends the existing PhotoReference system with blob management
 */

import { photosStorage, StorageError } from './storage';
import type { PhotoReference } from '@/types/claim';

// Storage keys for photo blobs
const PHOTO_BLOB_PREFIX = 'snapscope_photo_blob_';
const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB limit per photo
const COMPRESSION_QUALITY = 0.8;

/**
 * Convert blob to data URL for storage
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert data URL back to blob
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

/**
 * Compress image blob if it's too large
 */
function compressImageBlob(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (blob.size <= MAX_PHOTO_SIZE) {
      resolve(blob);
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions to fit within size limit
      let { width, height } = img;
      const ratio = Math.sqrt(MAX_PHOTO_SIZE / blob.size);
      
      if (ratio < 1) {
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((compressedBlob) => {
        if (compressedBlob) {
          resolve(compressedBlob);
        } else {
          reject(new Error('Failed to compress image'));
        }
      }, 'image/jpeg', COMPRESSION_QUALITY);
    };

    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(blob);
  });
}

/**
 * Get photo blob storage key
 */
function getPhotoBlobKey(photoId: string): string {
  return `${PHOTO_BLOB_PREFIX}${photoId}`;
}

/**
 * Photo blob storage operations
 */
export const photoBlobStorage = {
  /**
   * Save photo blob and create PhotoReference
   */
  async savePhoto(
    photoBlob: Blob, 
    metadata: Omit<PhotoReference, 'id' | 'localPath' | 'metadata'>
  ): Promise<PhotoReference> {
    try {
      // Compress if needed
      const compressedBlob = await compressImageBlob(photoBlob);
      
      // Convert to data URL for storage
      const dataUrl = await blobToDataUrl(compressedBlob);
      
      // Generate photo ID
      const photoId = crypto.randomUUID();
      
      // Create PhotoReference
      const photoReference: PhotoReference = {
        ...metadata,
        id: photoId,
        localPath: getPhotoBlobKey(photoId), // Store the blob key as path
        metadata: {
          fileSize: compressedBlob.size,
          dimensions: undefined, // Could be extracted from image
        },
      };

      // Update local path with actual photo ID
      photoReference.localPath = getPhotoBlobKey(photoReference.id);
      
      // Save blob data
      localStorage.setItem(photoReference.localPath, dataUrl);
      
      // Save photo reference
      photosStorage.save(photoReference);
      
      return photoReference;
      
    } catch (error) {
      throw new StorageError('Failed to save photo', error as Error);
    }
  },

  /**
   * Get photo blob by PhotoReference ID
   */
  getPhotoBlob(photoId: string): Blob | null {
    try {
      const photoRef = photosStorage.getById(photoId);
      if (!photoRef?.localPath) return null;
      
      const dataUrl = localStorage.getItem(photoRef.localPath);
      if (!dataUrl) return null;
      
      return dataUrlToBlob(dataUrl);
    } catch (error) {
      console.warn('Failed to get photo blob:', error);
      return null;
    }
  },

  /**
   * Get photo as object URL for display
   */
  getPhotoObjectUrl(photoId: string): string | null {
    const blob = this.getPhotoBlob(photoId);
    if (!blob) return null;
    
    return URL.createObjectURL(blob);
  },

  /**
   * Get photo as data URL for display
   */
  getPhotoDataUrl(photoId: string): string | null {
    try {
      const photoRef = photosStorage.getById(photoId);
      if (!photoRef?.localPath) return null;
      
      return localStorage.getItem(photoRef.localPath) || null;
    } catch (error) {
      console.warn('Failed to get photo data URL:', error);
      return null;
    }
  },

  /**
   * Delete photo blob and reference
   */
  deletePhoto(photoId: string): boolean {
    try {
      const photoRef = photosStorage.getById(photoId);
      
      // Delete blob data
      if (photoRef?.localPath) {
        localStorage.removeItem(photoRef.localPath);
      }
      
      // Delete reference
      return photosStorage.delete(photoId);
    } catch (error) {
      console.warn('Failed to delete photo:', error);
      return false;
    }
  },

  /**
   * Get total storage used by photos
   */
  getPhotosStorageUsage(): { count: number; totalSize: number } {
    let totalSize = 0;
    let count = 0;
    
    const photos = photosStorage.getAll();
    
    photos.forEach(photo => {
      if (photo.localPath) {
        const dataUrl = localStorage.getItem(photo.localPath);
        if (dataUrl) {
          totalSize += dataUrl.length;
          count++;
        }
      }
    });
    
    return { count, totalSize };
  },

  /**
   * Clean up orphaned photo blobs (blobs without references)
   */
  cleanupOrphanedBlobs(): number {
    let cleanedCount = 0;
    const photoReferences = photosStorage.getAll();
    const validBlobKeys = new Set(
      photoReferences
        .map(photo => photo.localPath)
        .filter(Boolean)
    );
    
    // Check all localStorage keys for photo blobs
    for (const key in localStorage) {
      if (key.startsWith(PHOTO_BLOB_PREFIX) && !validBlobKeys.has(key)) {
        localStorage.removeItem(key);
        cleanedCount++;
      }
    }
    
    return cleanedCount;
  },

  /**
   * Check if photo storage is approaching capacity
   */
  checkStorageCapacity(): {
    available: boolean;
    usedPercentage: number;
    warning?: string;
  } {
    try {
      const testKey = 'storage_test';
      const testData = 'x'.repeat(1024); // 1KB test
      
      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);
      
      // Get rough storage usage
      let totalUsed = 0;
      for (const key in localStorage) {
        totalUsed += localStorage[key].length;
      }
      
      const estimatedLimit = 5 * 1024 * 1024; // 5MB estimate
      const usedPercentage = (totalUsed / estimatedLimit) * 100;
      
      return {
        available: usedPercentage < 90,
        usedPercentage,
        warning: usedPercentage > 80 
          ? 'Photo storage is getting full. Consider deleting old photos.'
          : undefined,
      };
    } catch {
      return {
        available: false,
        usedPercentage: 100,
        warning: 'Photo storage is full or unavailable.',
      };
    }
  },
};

/**
 * Extended hook integration for photo management
 */
export interface PhotoWithBlob extends PhotoReference {
  blobUrl?: string;
  dataUrl?: string;
}

/**
 * Get photos with blob URLs for display
 */
export function getPhotosWithBlobs(photoReferences: PhotoReference[]): PhotoWithBlob[] {
  return photoReferences.map(photo => {
    const dataUrl = photoBlobStorage.getPhotoDataUrl(photo.id);
    return {
      ...photo,
      dataUrl: dataUrl || undefined,
      blobUrl: dataUrl ? URL.createObjectURL(dataUrlToBlob(dataUrl)) : undefined,
    };
  });
}

/**
 * Utility to create thumbnail from full photo
 */
export function createThumbnail(blob: Blob, maxSize = 150): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }

    img.onload = () => {
      // Calculate thumbnail dimensions
      let { width, height } = img;
      const aspectRatio = width / height;

      if (width > height) {
        width = maxSize;
        height = maxSize / aspectRatio;
      } else {
        height = maxSize;
        width = maxSize * aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;
      
      // Draw thumbnail
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((thumbnailBlob) => {
        if (thumbnailBlob) {
          resolve(thumbnailBlob);
        } else {
          reject(new Error('Failed to create thumbnail'));
        }
      }, 'image/jpeg', 0.7);
    };

    img.onerror = () => reject(new Error('Failed to load image for thumbnail'));
    img.src = URL.createObjectURL(blob);
  });
}