/**
 * Photo position definitions for vehicle damage assessment
 * Based on industry standards for Independent Adjusters
 * Now supports dynamic workflows from carrier settings
 */

import type { PhotoStep } from '@/types/claim';
import { carrierStorage } from './storage';

export interface PhotoPosition {
  id: string;
  name: string;
  description: string;
  guidance: string;
  required: boolean;
  category: 'overview' | 'interior' | 'damage' | 'documentation';
  order: number;
}

/**
 * Convert PhotoStep to PhotoPosition format
 */
function convertPhotoStepToPosition(step: PhotoStep): PhotoPosition {
  // Map category types between PhotoStep and PhotoPosition
  const categoryMap: Record<PhotoStep['category'], PhotoPosition['category']> = {
    exterior: 'overview',
    interior: 'interior',
    vin: 'documentation',
    damage: 'damage',
  };

  return {
    id: step.id,
    name: step.label,
    description: step.description ?? '',
    guidance: step.description ?? '',
    required: step.required,
    category: categoryMap[step.category],
    order: step.order,
  };
}

/**
 * Standard photo positions for vehicle damage assessment
 * Following industry best practices for comprehensive documentation
 * Used as default when no carrier is specified (backward compatibility)
 */
export const REQUIRED_PHOTO_POSITIONS: PhotoPosition[] = [
  // Overview Photos - External
  {
    id: 'front_overall',
    name: 'Front View',
    description: 'Overall front view of vehicle',
    guidance: 'Stand back to capture the entire front of the vehicle. Include license plate and any front damage.',
    required: true,
    category: 'overview',
    order: 1,
  },
  {
    id: 'rear_overall',
    name: 'Rear View', 
    description: 'Overall rear view of vehicle',
    guidance: 'Stand back to capture the entire rear of the vehicle. Include license plate and any rear damage.',
    required: true,
    category: 'overview',
    order: 2,
  },
  {
    id: 'driver_side_overall',
    name: 'Driver Side',
    description: 'Full driver side view',
    guidance: 'Stand back to capture the entire driver side of the vehicle from front wheel to rear wheel.',
    required: true,
    category: 'overview',
    order: 3,
  },
  {
    id: 'passenger_side_overall',
    name: 'Passenger Side',
    description: 'Full passenger side view',
    guidance: 'Stand back to capture the entire passenger side of the vehicle from front wheel to rear wheel.',
    required: true,
    category: 'overview',
    order: 4,
  },

  // Interior Photos
  {
    id: 'interior_front_seats',
    name: 'Front Interior',
    description: 'Front seats and dashboard area',
    guidance: 'Capture both front seats, dashboard, and center console. Check for any damage or wear.',
    required: true,
    category: 'interior',
    order: 5,
  },
  {
    id: 'interior_rear_seats',
    name: 'Rear Interior',
    description: 'Rear seating area',
    guidance: 'Capture rear seats and interior space. Document any damage or excessive wear.',
    required: true,
    category: 'interior',
    order: 6,
  },

  // Documentation Photos
  {
    id: 'dashboard_vin',
    name: 'Dashboard VIN',
    description: 'VIN visible through windshield',
    guidance: 'Capture the VIN number visible on the dashboard through the windshield on the driver side.',
    required: true,
    category: 'documentation',
    order: 7,
  },
  {
    id: 'odometer',
    name: 'Odometer Reading',
    description: 'Current mileage display',
    guidance: 'Capture a clear photo of the odometer showing current mileage. Ensure numbers are readable.',
    required: true,
    category: 'documentation',
    order: 8,
  },

  // Damage-Specific Photos (dynamically added based on damage assessment)
  {
    id: 'damage_area_1',
    name: 'Primary Damage',
    description: 'Primary damage area',
    guidance: 'Take close-up photos of the primary damage area. Include multiple angles if needed.',
    required: false,
    category: 'damage',
    order: 9,
  },
];

/**
 * Get photo positions for a specific carrier or default positions
 * @param carrierId - Optional carrier ID to get custom workflow
 * @returns Array of photo positions
 */
export function getPhotoPositionsForCarrier(carrierId?: string): PhotoPosition[] {
  if (!carrierId) {
    return REQUIRED_PHOTO_POSITIONS;
  }

  try {
    const carrier = carrierStorage.getById(carrierId);
    if (!carrier) {
      console.warn(`Carrier ${carrierId} not found, using default positions`);
      return REQUIRED_PHOTO_POSITIONS;
    }

    return carrier.workflow.standardPhotos
      .map(convertPhotoStepToPosition)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error loading carrier workflow, using default:', error);
    return REQUIRED_PHOTO_POSITIONS;
  }
}

/**
 * Get photo positions by category
 * @deprecated Use getPhotoPositionsForCarrier instead for carrier-specific workflows
 */
export function getPositionsByCategory(category: PhotoPosition['category']): PhotoPosition[] {
  return REQUIRED_PHOTO_POSITIONS.filter(pos => pos.category === category).sort((a, b) => a.order - b.order);
}

/**
 * Get required photo positions only
 * @deprecated Use getPhotoPositionsForCarrier and filter by required for carrier-specific workflows
 */
export function getRequiredPositions(): PhotoPosition[] {
  return REQUIRED_PHOTO_POSITIONS.filter(pos => pos.required).sort((a, b) => a.order - b.order);
}

/**
 * Get photo position by ID from carrier workflow or default
 */
export function getPositionById(id: string, carrierId?: string): PhotoPosition | undefined {
  const positions = getPhotoPositionsForCarrier(carrierId);
  return positions.find(pos => pos.id === id);
}

/**
 * Get next photo position in sequence
 */
export function getNextPosition(currentId: string, carrierId?: string): PhotoPosition | null {
  const positions = getPhotoPositionsForCarrier(carrierId);
  const currentIndex = positions.findIndex(pos => pos.id === currentId);
  if (currentIndex === -1 || currentIndex === positions.length - 1) {
    return null;
  }
  return positions[currentIndex + 1];
}

/**
 * Get previous photo position in sequence
 */
export function getPreviousPosition(currentId: string, carrierId?: string): PhotoPosition | null {
  const positions = getPhotoPositionsForCarrier(carrierId);
  const currentIndex = positions.findIndex(pos => pos.id === currentId);
  if (currentIndex <= 0) {
    return null;
  }
  return positions[currentIndex - 1];
}

/**
 * Calculate progress percentage for photo completion with carrier-specific workflow
 */
export function getPhotoProgressForCarrier(
  carrierId: string | undefined,
  completedPhotos: Record<string, { id: string; damageAreaId?: string }>
): { completed: number; total: number; percentage: number; requiredCompleted: number; requiredTotal: number } {
  const positions = getPhotoPositionsForCarrier(carrierId);
  const requiredPositions = positions.filter(pos => pos.required);

  const completedIds = Object.values(completedPhotos)
    .map(photo => photo.damageAreaId)
    .filter((id): id is string => id !== undefined);

  const completedRequired = completedIds.filter(id =>
    requiredPositions.some(pos => pos.id === id)
  ).length;

  return {
    completed: completedIds.length,
    total: positions.length,
    percentage: requiredPositions.length > 0 ? (completedRequired / requiredPositions.length) * 100 : 0,
    requiredCompleted: completedRequired,
    requiredTotal: requiredPositions.length,
  };
}

/**
 * Calculate progress percentage for photo completion
 * @deprecated Use getPhotoProgressForCarrier for carrier-specific workflows
 */
export function calculateProgress(completedPositions: string[]): number {
  const requiredPositions = getRequiredPositions();
  const completedRequired = completedPositions.filter(id =>
    requiredPositions.some(pos => pos.id === id)
  ).length;

  return (completedRequired / requiredPositions.length) * 100;
}

/**
 * Check if all required photos are completed
 */
export function areAllRequiredPhotosCompleted(completedPositions: string[], carrierId?: string): boolean {
  const positions = getPhotoPositionsForCarrier(carrierId);
  const requiredPositions = positions.filter(pos => pos.required);
  return requiredPositions.every(pos => completedPositions.includes(pos.id));
}

/**
 * Photo position metadata for UI display
 * @deprecated Use getPhotoPositionsForCarrier and calculate metadata dynamically
 */
export const PHOTO_GUIDE_METADATA = {
  totalRequired: getRequiredPositions().length,
  totalOptional: REQUIRED_PHOTO_POSITIONS.filter(pos => !pos.required).length,
  categories: {
    overview: getPositionsByCategory('overview').length,
    interior: getPositionsByCategory('interior').length,
    documentation: getPositionsByCategory('documentation').length,
    damage: getPositionsByCategory('damage').length,
  },
} as const;

/**
 * Get metadata for carrier-specific photo workflow
 */
export function getPhotoMetadataForCarrier(carrierId?: string) {
  const positions = getPhotoPositionsForCarrier(carrierId);
  const requiredPositions = positions.filter(pos => pos.required);

  return {
    totalRequired: requiredPositions.length,
    totalOptional: positions.filter(pos => !pos.required).length,
    total: positions.length,
    categories: {
      overview: positions.filter(pos => pos.category === 'overview').length,
      interior: positions.filter(pos => pos.category === 'interior').length,
      documentation: positions.filter(pos => pos.category === 'documentation').length,
      damage: positions.filter(pos => pos.category === 'damage').length,
    },
  };
}