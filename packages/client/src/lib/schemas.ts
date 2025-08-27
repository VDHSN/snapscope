/**
 * Zod schemas for runtime validation of storage data
 * These schemas ensure data integrity and prevent malicious inputs
 */

import { z } from 'zod';

// Base schemas for validation
const vehicleSchema = z.object({
  id: z.string().min(1),
  vin: z
    .string()
    .length(17, { message: 'VIN must be exactly 17 characters' })
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, { 
      message: 'VIN must contain only alphanumeric characters (no I, O, Q)' 
    })
    .transform((vin) => vin.toUpperCase()),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 2),
  color: z.string().optional(),
  licensePlate: z.string().optional(),
  mileage: z.number().int().min(0).optional(),
});

const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
});

const claimContactSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  role: z.enum(['claimant', 'policyholder', 'witness', 'other']),
  address: addressSchema.optional(),
});

const damageAssessmentSchema = z.object({
  id: z.string().min(1),
  area: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(['minor', 'moderate', 'severe', 'total_loss']),
  estimatedCost: z.number().min(0).optional(),
  photos: z.array(z.string()).optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const photoReferenceSchema = z.object({
  id: z.string().min(1),
  filename: z.string().min(1),
  localPath: z.string().optional(),
  cloudUrl: z.string().url().optional().or(z.literal('')),
  caption: z.string().optional(),
  damageAreaId: z.string().optional(),
  timestamp: z.date(),
  metadata: z.object({
    fileSize: z.number().int().min(0),
    dimensions: z.object({
      width: z.number().int().min(1),
      height: z.number().int().min(1),
    }).optional(),
  }).optional(),
});

const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const claimSchema = z.object({
  id: z.string().min(1),
  claimNumber: z.string().optional(),
  policyNumber: z.string().optional(),
  dateOfLoss: z.date(),
  location: z.object({
    address: z.string().optional(),
    coordinates: coordinatesSchema.optional(),
  }),
  vehicle: vehicleSchema,
  contacts: z.array(claimContactSchema),
  damages: z.array(damageAssessmentSchema),
  photos: z.array(photoReferenceSchema),
  status: z.enum(['draft', 'in_progress', 'completed', 'submitted', 'approved', 'rejected']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().optional(),
  syncStatus: z.enum(['local_only', 'synced', 'sync_pending', 'sync_failed']),
  notes: z.string().optional(),
  weatherConditions: z.string().optional(),
  accidentDescription: z.string().optional(),
});

const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().min(1),
  autoSave: z.boolean(),
  syncFrequency: z.enum(['manual', 'immediate', 'hourly', 'daily']),
  cameraQuality: z.enum(['low', 'medium', 'high']),
  offlineMode: z.boolean(),
  notifications: z.object({
    syncCompleted: z.boolean(),
    syncFailed: z.boolean(),
    reminderTasks: z.boolean(),
  }),
});

const syncQueueItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['claim_update', 'photo_upload', 'claim_create', 'claim_delete']),
  claimId: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
  timestamp: z.date(),
  retryCount: z.number().int().min(0),
  lastError: z.string().optional(),
});

const storageMetadataSchema = z.object({
  version: z.string().min(1),
  lastSync: z.date(),
  totalClaims: z.number().int().min(0),
  totalPhotos: z.number().int().min(0),
  storageUsed: z.number().int().min(0),
  maxStorage: z.number().int().min(0),
});

// Export schemas for use in storage layer
export const schemas = {
  vehicle: vehicleSchema,
  claimContact: claimContactSchema,
  damageAssessment: damageAssessmentSchema,
  photoReference: photoReferenceSchema,
  claim: claimSchema,
  userPreferences: userPreferencesSchema,
  syncQueueItem: syncQueueItemSchema,
  storageMetadata: storageMetadataSchema,
  claims: z.array(claimSchema),
  syncQueue: z.array(syncQueueItemSchema),
} as const;

// Storage key validation schema
export const storageKeySchema = z.enum([
  'snapscope_claims',
  'snapscope_sync_queue',
  'snapscope_user_preferences',
  'snapscope_storage_metadata',
]);

// ISO date string validation schema
export const isoDateStringSchema = z.string().datetime({ message: 'Invalid ISO date string' });