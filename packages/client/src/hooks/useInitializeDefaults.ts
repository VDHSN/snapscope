/**
 * Hook to initialize default carriers on first app load
 */

import { useEffect } from 'react';
import { useCarrierSettings } from './useCarrierSettings';
import { DEFAULT_CARRIERS } from '@/lib/carrier-templates';

export function useInitializeDefaults() {
  const { carriers, saveCarrier, loading } = useCarrierSettings();

  useEffect(() => {
    const initializeDefaults = async () => {
      // Wait for carriers to load
      if (loading) return;

      // Check if carriers are already initialized
      if (carriers.length > 0) return;

      console.log('Initializing default carriers...');

      try {
        // Load all default carrier templates
        for (const carrier of DEFAULT_CARRIERS) {
          await saveCarrier(carrier);
        }

        console.log(`Successfully initialized ${DEFAULT_CARRIERS.length} default carriers`);
      } catch (error) {
        console.error('Failed to initialize default carriers:', error);
      }
    };

    initializeDefaults();
  }, [carriers.length, loading, saveCarrier]);
}
