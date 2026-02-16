'use client';

import { useInitializeDefaults } from '@/hooks/useInitializeDefaults';

/**
 * Component to initialize default carriers on first app load
 * Must be placed in the root layout as a client component
 */
export function DefaultsInitializer() {
  useInitializeDefaults();
  return null;
}
