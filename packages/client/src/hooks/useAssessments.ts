import { useMemo } from 'react';
import { useClaims } from './useStorage';
import type { Claim } from '@/types/claim';

export interface Assessment {
  id: string;
  vehicleName: string;
  status: 'IN PROGRESS' | 'COMPLETE';
  dateUpdated: Date;
  claimId: string;
  completedAt?: Date;
  exportedAt?: Date;
  vin: string;
}

const mapClaimStatusToAssessment = (status: Claim['status']): Assessment['status'] => {
  switch (status) {
    case 'completed':
    case 'submitted': 
    case 'approved':
      return 'COMPLETE';
    case 'draft':
    case 'in_progress':
    case 'rejected':
    default:
      return 'IN PROGRESS';
  }
};

export function useAssessments() {
  const { claims, loading, error } = useClaims();
  
  const assessments = useMemo<Assessment[]>(() =>
    claims.map(claim => ({
      id: claim.id,
      vehicleName: `${claim.vehicle.year} ${claim.vehicle.make ?? ''} ${claim.vehicle.model ?? ''}`.trim(),
      status: mapClaimStatusToAssessment(claim.status),
      dateUpdated: claim.updatedAt,
      claimId: claim.id,
      completedAt: claim.completedAt,
      exportedAt: claim.exportedAt,
      vin: claim.vehicle.vin
    }))
  , [claims]);

  return {
    assessments,
    loading,
    error,
  };
}