'use client';

import { useState, useEffect } from 'react';
import { UnifiedPhotoStorage } from '@/lib/photo-storage-unified';

/**
 * Custom React hook for managing photo storage
 * Ensures UnifiedPhotoStorage is only instantiated on the client side
 */
export function usePhotoStorage() {
  const [photoStorage, setPhotoStorage] = useState<UnifiedPhotoStorage | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<Error | null>(null);

  useEffect(() => {
    // Only run on client side where localStorage is available
    if (typeof window === 'undefined') return;

    let isCancelled = false;

    const initializeStorage = async () => {
      try {
        const storage = new UnifiedPhotoStorage();
        
        // Initialize the storage system
        await storage.initialize();
        
        // Only update state if component is still mounted
        if (!isCancelled) {
          setPhotoStorage(storage);
          setIsInitialized(true);
          setInitializationError(null);
        }
      } catch (error) {
        console.error('Failed to initialize photo storage:', error);
        
        if (!isCancelled) {
          setInitializationError(error instanceof Error ? error : new Error('Unknown initialization error'));
          setIsInitialized(true); // Still mark as initialized even if failed
        }
      }
    };

    initializeStorage();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    photoStorage,
    isInitialized,
    initializationError,
    // Convenience flag for checking if storage is ready to use
    isReady: isInitialized && photoStorage !== null && initializationError === null
  };
}