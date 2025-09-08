/**
 * React hooks for interacting with local storage
 * Provides reactive access to storage data with automatic re-rendering
 */

import { useState, useEffect, useCallback } from 'react';
import {
  claimsStorage,
  preferencesStorage,
  syncQueueStorage,
  addStorageEventListener,
  getStorageUsage,
  checkStorageQuota,
  StorageError
} from '@/lib/storage';
import type { Claim, UserPreferences, SyncQueueItem } from '@/types/claim';

/**
 * Hook for managing claims in local storage
 */
export function useClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial claims
  useEffect(() => {
    try {
      const storedClaims = claimsStorage.getAll();
      setClaims(storedClaims);
      setError(null);
    } catch (err) {
      setError(err instanceof StorageError ? err.message : 'Failed to load claims');
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for cross-tab changes
  const handleStorageChange = useCallback((key: string, newValue: unknown) => {
    if (key === 'snapscope_claims' && newValue && Array.isArray(newValue)) {
      setClaims(newValue as Claim[]);
    }
  }, []);

  useEffect(() => {
    const cleanup = addStorageEventListener(handleStorageChange);
    return cleanup;
  }, [handleStorageChange]);

  const saveClaim = useCallback(async (claim: Claim) => {
    try {
      claimsStorage.save(claim);
      const updatedClaims = claimsStorage.getAll();
      setClaims(updatedClaims);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to save claim';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteClaim = useCallback(async (id: string) => {
    try {
      const success = claimsStorage.delete(id);
      if (success) {
        const updatedClaims = claimsStorage.getAll();
        setClaims(updatedClaims);
        setError(null);
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to delete claim';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const clearAllClaims = useCallback(async () => {
    try {
      claimsStorage.clear();
      setClaims([]);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to clear claims';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getClaim = useCallback((id: string): Claim | null => {
    return claims.find(claim => claim.id === id) || null;
  }, [claims]);

  const getClaimsByStatus = useCallback((status: Claim['status']): Claim[] => {
    return claims.filter(claim => claim.status === status);
  }, [claims]);

  const createClaimWithVIN = useCallback(async (vin: string): Promise<Claim> => {
    try {
      const now = new Date();
      const claimId = `claim_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const vehicleId = `vehicle_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      const newClaim: Claim = {
        id: claimId,
        claimNumber: undefined,
        policyNumber: undefined,
        dateOfLoss: now,
        location: {
          address: undefined,
          coordinates: undefined,
        },
        vehicle: {
          id: vehicleId,
          vin: vin.toUpperCase(),
          make: undefined, // To be filled in next steps
          model: undefined, // To be filled in next steps  
          year: new Date().getFullYear(), // Default to current year, to be updated
        },
        contacts: [],
        damages: [],
        photos: {},
        status: 'draft',
        priority: 'normal',
        createdAt: now,
        updatedAt: now,
        createdBy: undefined, // Could be set from user context
        syncStatus: 'local_only',
        notes: undefined,
        weatherConditions: undefined,
        accidentDescription: undefined,
      };

      await saveClaim(newClaim);
      return newClaim;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create claim with VIN';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [saveClaim]);

  return {
    claims,
    loading,
    error,
    saveClaim,
    deleteClaim,
    clearAllClaims,
    getClaim,
    getClaimsByStatus,
    createClaimWithVIN,
  };
}

/**
 * Hook for managing user preferences
 */
export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial preferences
  useEffect(() => {
    try {
      const storedPreferences = preferencesStorage.get();
      setPreferences(storedPreferences);
      setError(null);
    } catch (err) {
      setError(err instanceof StorageError ? err.message : 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for cross-tab changes
  const handlePreferencesChange = useCallback((key: string, newValue: unknown) => {
    if (key === 'snapscope_preferences' && newValue && typeof newValue === 'object') {
      setPreferences(newValue as UserPreferences);
    }
  }, []);

  useEffect(() => {
    const cleanup = addStorageEventListener(handlePreferencesChange);
    return cleanup;
  }, [handlePreferencesChange]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    try {
      preferencesStorage.save(updates);
      const updatedPreferences = preferencesStorage.get();
      setPreferences(updatedPreferences);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to update preferences';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const resetPreferences = useCallback(async () => {
    try {
      preferencesStorage.reset();
      const defaultPreferences = preferencesStorage.get();
      setPreferences(defaultPreferences);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to reset preferences';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    resetPreferences,
  };
}

/**
 * Hook for managing sync queue
 */
export function useSyncQueue() {
  const [queue, setQueue] = useState<SyncQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial queue
  useEffect(() => {
    try {
      const storedQueue = syncQueueStorage.getAll();
      setQueue(storedQueue);
      setError(null);
    } catch (err) {
      setError(err instanceof StorageError ? err.message : 'Failed to load sync queue');
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for cross-tab changes
  const handleQueueChange = useCallback((key: string, newValue: unknown) => {
    if (key === 'snapscope_sync_queue' && newValue && Array.isArray(newValue)) {
      setQueue(newValue as SyncQueueItem[]);
    }
  }, []);

  useEffect(() => {
    const cleanup = addStorageEventListener(handleQueueChange);
    return cleanup;
  }, [handleQueueChange]);

  const addToQueue = useCallback(async (item: SyncQueueItem) => {
    try {
      syncQueueStorage.add(item);
      const updatedQueue = syncQueueStorage.getAll();
      setQueue(updatedQueue);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to add item to queue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const removeFromQueue = useCallback(async (id: string) => {
    try {
      const success = syncQueueStorage.remove(id);
      if (success) {
        const updatedQueue = syncQueueStorage.getAll();
        setQueue(updatedQueue);
        setError(null);
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to remove item from queue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const clearQueue = useCallback(async () => {
    try {
      syncQueueStorage.clear();
      setQueue([]);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to clear queue';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getPendingItemsCount = useCallback((): number => {
    return queue.length;
  }, [queue]);

  const getFailedItemsCount = useCallback((): number => {
    return queue.filter(item => item.retryCount > 0).length;
  }, [queue]);

  return {
    queue,
    loading,
    error,
    addToQueue,
    removeFromQueue,
    clearQueue,
    getPendingItemsCount,
    getFailedItemsCount,
  };
}

/**
 * Hook for monitoring storage usage and quota
 */
export function useStorageQuota() {
  const [usage, setUsage] = useState<{
    used: number;
    available: number;
    total: number;
    percentage: number;
  }>({ used: 0, available: 0, total: 0, percentage: 0 });
  const [warning, setWarning] = useState<string | null>(null);
  const [canStore, setCanStore] = useState(true);

  const updateUsage = useCallback(() => {
    const storageInfo = getStorageUsage();
    const quotaInfo = checkStorageQuota();
    
    setUsage({
      ...storageInfo,
      percentage: quotaInfo.usage,
    });
    setWarning(quotaInfo.warning || null);
    setCanStore(quotaInfo.canStore);
  }, []);

  const handleUsageChange = useCallback(() => {
    updateUsage();
  }, [updateUsage]);

  useEffect(() => {
    updateUsage();
    
    // Update usage when storage changes
    const cleanup = addStorageEventListener(handleUsageChange);
    return cleanup;
  }, [updateUsage, handleUsageChange]);

  return {
    usage,
    warning,
    canStore,
    refreshUsage: updateUsage,
  };
}

/**
 * Hook for managing storage across multiple tabs
 */
export function useStorageSync() {
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncEvents, setSyncEvents] = useState<Array<{ key: string; timestamp: Date }>>([]);

  const handleSyncChange = useCallback((key: string) => {
    const now = new Date();
    setLastSyncTime(now);
    setSyncEvents(prev => [
      { key, timestamp: now },
      ...prev.slice(0, 9) // Keep last 10 events
    ]);
  }, []);

  useEffect(() => {
    const cleanup = addStorageEventListener(handleSyncChange);
    return cleanup;
  }, [handleSyncChange]);

  const triggerManualSync = useCallback(() => {
    // This would trigger a manual sync process
    // For now, we just update the timestamp
    setLastSyncTime(new Date());
  }, []);

  return {
    lastSyncTime,
    syncEvents,
    triggerManualSync,
  };
}