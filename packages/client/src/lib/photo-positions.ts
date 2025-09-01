/**
 * Photo position definitions for vehicle damage assessment
 * Based on industry standards for Independent Adjusters
 */

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
 * Standard photo positions for vehicle damage assessment
 * Following industry best practices for comprehensive documentation
 */
export const PHOTO_POSITIONS: PhotoPosition[] = [
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
 * Get photo positions by category
 */
export function getPositionsByCategory(category: PhotoPosition['category']): PhotoPosition[] {
  return PHOTO_POSITIONS.filter(pos => pos.category === category).sort((a, b) => a.order - b.order);
}

/**
 * Get required photo positions only
 */
export function getRequiredPositions(): PhotoPosition[] {
  return PHOTO_POSITIONS.filter(pos => pos.required).sort((a, b) => a.order - b.order);
}

/**
 * Get photo position by ID
 */
export function getPositionById(id: string): PhotoPosition | undefined {
  return PHOTO_POSITIONS.find(pos => pos.id === id);
}

/**
 * Get next photo position in sequence
 */
export function getNextPosition(currentId: string): PhotoPosition | null {
  const currentIndex = PHOTO_POSITIONS.findIndex(pos => pos.id === currentId);
  if (currentIndex === -1 || currentIndex === PHOTO_POSITIONS.length - 1) {
    return null;
  }
  return PHOTO_POSITIONS[currentIndex + 1];
}

/**
 * Get previous photo position in sequence
 */
export function getPreviousPosition(currentId: string): PhotoPosition | null {
  const currentIndex = PHOTO_POSITIONS.findIndex(pos => pos.id === currentId);
  if (currentIndex <= 0) {
    return null;
  }
  return PHOTO_POSITIONS[currentIndex - 1];
}

/**
 * Calculate progress percentage for photo completion
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
export function areAllRequiredPhotosCompleted(completedPositions: string[]): boolean {
  const requiredPositions = getRequiredPositions();
  return requiredPositions.every(pos => completedPositions.includes(pos.id));
}

/**
 * Photo position metadata for UI display
 */
export const PHOTO_GUIDE_METADATA = {
  totalRequired: getRequiredPositions().length,
  totalOptional: PHOTO_POSITIONS.filter(pos => !pos.required).length,
  categories: {
    overview: getPositionsByCategory('overview').length,
    interior: getPositionsByCategory('interior').length,
    documentation: getPositionsByCategory('documentation').length,
    damage: getPositionsByCategory('damage').length,
  },
} as const;