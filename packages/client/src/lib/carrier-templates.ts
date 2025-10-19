/**
 * Default carrier templates with predefined photo workflows
 * These templates are loaded on first app launch
 */

import type { Carrier, PhotoStep } from '@/types/claim';

const createPhotoStep = (
  order: number,
  label: string,
  category: 'exterior' | 'interior' | 'vin' | 'damage',
  description?: string,
  required = true
): PhotoStep => ({
  id: `${category}-${order}-${label.toLowerCase().replace(/\s+/g, '-')}`,
  label,
  description,
  required,
  order,
  category,
});

const STATE_FARM_PHOTOS: PhotoStep[] = [
  createPhotoStep(1, 'VIN Plate', 'vin', 'Clear photo of VIN plate on dashboard'),
  createPhotoStep(2, 'Front View', 'exterior', 'Entire front of vehicle'),
  createPhotoStep(3, 'Front Driver Corner', 'exterior', '45-degree angle from front driver side'),
  createPhotoStep(4, 'Driver Side', 'exterior', 'Full side view from driver side'),
  createPhotoStep(5, 'Rear Driver Corner', 'exterior', '45-degree angle from rear driver side'),
  createPhotoStep(6, 'Rear View', 'exterior', 'Entire rear of vehicle'),
  createPhotoStep(7, 'Rear Passenger Corner', 'exterior', '45-degree angle from rear passenger side'),
  createPhotoStep(8, 'Passenger Side', 'exterior', 'Full side view from passenger side'),
  createPhotoStep(9, 'Front Passenger Corner', 'exterior', '45-degree angle from front passenger side'),
  createPhotoStep(10, 'Interior Front', 'interior', 'Dashboard and front seats'),
  createPhotoStep(11, 'Interior Rear', 'interior', 'Rear seats and cargo area'),
  createPhotoStep(12, 'Odometer', 'interior', 'Current mileage reading'),
  createPhotoStep(13, 'Dashboard Display', 'interior', 'Dashboard indicators and controls'),
  createPhotoStep(14, 'Trunk Interior', 'interior', 'Cargo area and spare tire'),
];

const PROGRESSIVE_PHOTOS: PhotoStep[] = [
  createPhotoStep(1, 'VIN Plate', 'vin', 'Clear photo of VIN plate'),
  createPhotoStep(2, 'Front View', 'exterior', 'Entire front of vehicle'),
  createPhotoStep(3, 'Front Driver Corner', 'exterior', '45-degree angle from front driver side'),
  createPhotoStep(4, 'Driver Side', 'exterior', 'Full side view from driver side'),
  createPhotoStep(5, 'Rear Driver Corner', 'exterior', '45-degree angle from rear driver side'),
  createPhotoStep(6, 'Rear View', 'exterior', 'Entire rear of vehicle'),
  createPhotoStep(7, 'Rear Passenger Corner', 'exterior', '45-degree angle from rear passenger side'),
  createPhotoStep(8, 'Passenger Side', 'exterior', 'Full side view from passenger side'),
  createPhotoStep(9, 'Front Passenger Corner', 'exterior', '45-degree angle from front passenger side'),
  createPhotoStep(10, 'Interior Dashboard', 'interior', 'Dashboard view'),
  createPhotoStep(11, 'Odometer', 'interior', 'Current mileage reading'),
  createPhotoStep(12, 'Interior Rear', 'interior', 'Rear seats', false),
];

const GEICO_PHOTOS: PhotoStep[] = [
  createPhotoStep(1, 'VIN Plate', 'vin', 'Clear photo of VIN plate'),
  createPhotoStep(2, 'Front View', 'exterior', 'Entire front of vehicle'),
  createPhotoStep(3, 'Driver Side', 'exterior', 'Full side view from driver side'),
  createPhotoStep(4, 'Rear View', 'exterior', 'Entire rear of vehicle'),
  createPhotoStep(5, 'Passenger Side', 'exterior', 'Full side view from passenger side'),
  createPhotoStep(6, 'Front Driver Corner', 'exterior', '45-degree angle from front driver side'),
  createPhotoStep(7, 'Rear Passenger Corner', 'exterior', '45-degree angle from rear passenger side'),
  createPhotoStep(8, 'Odometer', 'interior', 'Current mileage reading'),
  createPhotoStep(9, 'Dashboard', 'interior', 'Dashboard view'),
  createPhotoStep(10, 'Interior Overview', 'interior', 'Front and rear seats', false),
];

const ALLSTATE_PHOTOS: PhotoStep[] = [
  createPhotoStep(1, 'VIN Plate', 'vin', 'Clear photo of VIN plate on dashboard'),
  createPhotoStep(2, 'VIN Door Sticker', 'vin', 'VIN sticker on driver door jamb', false),
  createPhotoStep(3, 'Front View', 'exterior', 'Entire front of vehicle'),
  createPhotoStep(4, 'Front Driver Corner', 'exterior', '45-degree angle from front driver side'),
  createPhotoStep(5, 'Driver Side', 'exterior', 'Full side view from driver side'),
  createPhotoStep(6, 'Rear Driver Corner', 'exterior', '45-degree angle from rear driver side'),
  createPhotoStep(7, 'Rear View', 'exterior', 'Entire rear of vehicle'),
  createPhotoStep(8, 'Rear Passenger Corner', 'exterior', '45-degree angle from rear passenger side'),
  createPhotoStep(9, 'Passenger Side', 'exterior', 'Full side view from passenger side'),
  createPhotoStep(10, 'Front Passenger Corner', 'exterior', '45-degree angle from front passenger side'),
  createPhotoStep(11, 'Roof', 'exterior', 'Top of vehicle', false),
  createPhotoStep(12, 'Interior Front', 'interior', 'Dashboard and front seats'),
  createPhotoStep(13, 'Interior Rear', 'interior', 'Rear seats'),
  createPhotoStep(14, 'Odometer', 'interior', 'Current mileage reading'),
  createPhotoStep(15, 'Trunk', 'interior', 'Cargo area'),
];

const CUSTOM_PHOTOS: PhotoStep[] = [
  createPhotoStep(1, 'VIN Plate', 'vin', 'Clear photo of VIN plate'),
  createPhotoStep(2, 'Front View', 'exterior', 'Entire front of vehicle'),
  createPhotoStep(3, 'Driver Side', 'exterior', 'Full side view'),
  createPhotoStep(4, 'Rear View', 'exterior', 'Entire rear of vehicle'),
  createPhotoStep(5, 'Passenger Side', 'exterior', 'Full side view'),
  createPhotoStep(6, 'Interior Front', 'interior', 'Dashboard and seats'),
  createPhotoStep(7, 'Odometer', 'interior', 'Mileage reading'),
  createPhotoStep(8, 'Damage Areas', 'damage', 'Any visible damage', false),
];

const createCarrier = (
  id: string,
  name: string,
  photos: PhotoStep[],
  isTemplate = true
): Carrier => ({
  id,
  name,
  workflow: {
    standardPhotos: photos,
    damagePhotos: {
      requireLabeling: true,
      allowVoiceNotes: true,
      skipLabelingOption: false,
    },
  },
  isTemplate,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const DEFAULT_CARRIERS: Carrier[] = [
  createCarrier('state-farm-template', 'State Farm', STATE_FARM_PHOTOS),
  createCarrier('progressive-template', 'Progressive', PROGRESSIVE_PHOTOS),
  createCarrier('geico-template', 'Geico', GEICO_PHOTOS),
  createCarrier('allstate-template', 'Allstate', ALLSTATE_PHOTOS),
  createCarrier('custom-template', 'Custom', CUSTOM_PHOTOS),
];

export const getTemplateById = (templateId: string): Carrier | null => {
  const templates: Record<string, Carrier> = {
    'state-farm': DEFAULT_CARRIERS[0],
    'progressive': DEFAULT_CARRIERS[1],
    'geico': DEFAULT_CARRIERS[2],
    'allstate': DEFAULT_CARRIERS[3],
    'custom': DEFAULT_CARRIERS[4],
  };

  return templates[templateId] ?? null;
};

export const createCarrierFromTemplate = (
  templateId: string,
  name?: string
): Carrier | null => {
  const template = getTemplateById(templateId);
  if (!template) return null;

  return {
    ...template,
    id: crypto.randomUUID(),
    name: name ?? template.name,
    isTemplate: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
