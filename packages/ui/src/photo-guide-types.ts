/**
 * Shared types and mock data for Photo Guide components
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

export interface CapturedPhoto {
  positionId: string;
  dataUrl: string;
  timestamp: Date;
}

// Mock photo positions data for stories
export const MOCK_POSITIONS: PhotoPosition[] = [
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

// Mock captured photos with data URLs (using placeholder gradients)
export const MOCK_PHOTOS: CapturedPhoto[] = [
  {
    positionId: 'front_overall',
    dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRhNWY3ZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5Gcm9udCBWaWV3PC90ZXh0Pjwvc3ZnPg==',
    timestamp: new Date('2024-01-15T10:30:00'),
  },
  {
    positionId: 'rear_overall',
    dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzVhNmY4ZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5SZWFyIFZpZXc8L3RleHQ+PC9zdmc+',
    timestamp: new Date('2024-01-15T10:31:00'),
  },
  {
    positionId: 'driver_side_overall',
    dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzZhN2Y5ZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5Ecml2ZXIgU2lkZTwvdGV4dD48L3N2Zz4=',
    timestamp: new Date('2024-01-15T10:32:00'),
  },
];

// Helper function to generate mock photo data URL
export function generateMockPhotoDataUrl(text: string, color: string = '#7c3aed'): string {
  const svg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}