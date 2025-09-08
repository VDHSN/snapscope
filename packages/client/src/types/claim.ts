/**
 * TypeScript interfaces for claim data structures
 * These interfaces define the shape of data stored locally for offline-first functionality
 */

export interface Vehicle {
  id: string;
  vin: string; // VIN is now required (17 characters, no I/O/Q)
  make?: string; // Optional during initial creation
  model?: string; // Optional during initial creation  
  year: number;
  color?: string;
  licensePlate?: string;
  mileage?: number;
}

export interface ClaimContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: 'claimant' | 'policyholder' | 'witness' | 'other';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface DamageAssessment {
  id: string;
  area: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'total_loss';
  estimatedCost?: number;
  photos?: string[]; // References to photo IDs
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhotoReference {
  id: string;
  filename: string;
  localPath?: string; // For offline storage
  cloudUrl?: string;  // For synced storage
  caption?: string;
  damageAreaId?: string;
  timestamp: Date;
  metadata?: {
    fileSize: number;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

export interface Claim {
  id: string;
  claimNumber?: string;
  policyNumber?: string;
  dateOfLoss: Date;
  location: {
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Parties involved
  vehicle: Vehicle;
  contacts: ClaimContact[];
  
  // Assessment data
  damages: DamageAssessment[];
  photos?: Record<string, PhotoReference>;
  
  // Status and workflow
  status: 'draft' | 'in_progress' | 'completed' | 'submitted' | 'approved' | 'rejected';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // Adjuster ID
  syncStatus: 'local_only' | 'synced' | 'sync_pending' | 'sync_failed';
  
  // Additional notes and documentation
  notes?: string;
  weatherConditions?: string;
  accidentDescription?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoSave: boolean;
  syncFrequency: 'manual' | 'immediate' | 'hourly' | 'daily';
  cameraQuality: 'low' | 'medium' | 'high';
  offlineMode: boolean;
  notifications: {
    syncCompleted: boolean;
    syncFailed: boolean;
    reminderTasks: boolean;
  };
}

export interface SyncQueueItem {
  id: string;
  type: 'claim_update' | 'photo_upload' | 'claim_create' | 'claim_delete';
  claimId: string;
  data: Record<string, unknown>;
  timestamp: Date;
  retryCount: number;
  lastError?: string;
}

export interface StorageMetadata {
  version: string;
  lastSync: Date;
  totalClaims: number;
  totalPhotos: number;
  storageUsed: number; // in bytes
  maxStorage: number;  // in bytes
}