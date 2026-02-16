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

export interface AssessmentListProps {
  assessments: Assessment[];
  loading?: boolean;
  error?: string;
  readOnly?: boolean;
  onAssessmentSelect?: (assessment: Assessment) => void;
  onAddAssessment?: () => void;
  onSettingsClick?: () => void;
  onExport?: (assessmentId: string) => void;
}

export interface AssessmentCardProps {
  assessment: Assessment;
  onClick?: () => void;
  onExport?: (assessmentId: string) => void;
}