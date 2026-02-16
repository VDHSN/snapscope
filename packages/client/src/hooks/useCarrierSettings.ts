/**
 * React hook for managing carrier settings in local storage
 * Provides reactive access to carrier data with automatic re-rendering and cross-tab sync
 */

import { useState, useEffect, useCallback } from 'react';
import {
  carrierStorage,
  addStorageEventListener,
  StorageError
} from '@/lib/storage';
import type { Carrier } from '@/types/claim';

/**
 * Hook for managing carrier settings
 */
export function useCarrierSettings() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial carriers
  useEffect(() => {
    try {
      const storedCarriers = carrierStorage.getAll();
      setCarriers(storedCarriers);
      setError(null);
    } catch (err) {
      setError(err instanceof StorageError ? err.message : 'Failed to load carriers');
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for cross-tab changes
  const handleStorageChange = useCallback((key: string, newValue: unknown) => {
    if (key === 'snapscope_carrier_settings' && newValue && Array.isArray(newValue)) {
      setCarriers(newValue as Carrier[]);
    }
  }, []);

  useEffect(() => {
    const cleanup = addStorageEventListener(handleStorageChange);
    return cleanup;
  }, [handleStorageChange]);

  const saveCarrier = useCallback(async (carrier: Carrier) => {
    try {
      carrierStorage.save(carrier);
      const updatedCarriers = carrierStorage.getAll();
      setCarriers(updatedCarriers);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to save carrier';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteCarrier = useCallback(async (id: string) => {
    try {
      const success = carrierStorage.delete(id);
      if (success) {
        const updatedCarriers = carrierStorage.getAll();
        setCarriers(updatedCarriers);
        setError(null);
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to delete carrier';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const clearAllCarriers = useCallback(async () => {
    try {
      carrierStorage.clear();
      setCarriers([]);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to clear carriers';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getCarrier = useCallback((id: string): Carrier | null => {
    return carriers.find(carrier => carrier.id === id) ?? null;
  }, [carriers]);

  const getTemplates = useCallback((): Carrier[] => {
    return carriers.filter(carrier => carrier.isTemplate);
  }, [carriers]);

  const getCustomCarriers = useCallback((): Carrier[] => {
    return carriers.filter(carrier => !carrier.isTemplate);
  }, [carriers]);

  const exportCarriers = useCallback((): string => {
    try {
      return carrierStorage.export();
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to export carriers';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const importCarriers = useCallback(async (jsonData: string) => {
    try {
      const result = carrierStorage.import(jsonData);
      if (result.success) {
        const updatedCarriers = carrierStorage.getAll();
        setCarriers(updatedCarriers);
        setError(null);
      } else {
        setError(result.error ?? 'Import failed');
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof StorageError ? err.message : 'Failed to import carriers';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    carriers,
    loading,
    error,
    saveCarrier,
    deleteCarrier,
    clearAllCarriers,
    getCarrier,
    getTemplates,
    getCustomCarriers,
    exportCarriers,
    importCarriers,
  };
}
