export interface Assessment {
  id: string;
  vehicleName: string;
  status: 'IN PROGRESS' | 'COMPLETE';
  dateUpdated: Date;
  claimId: string;
}

export interface AssessmentListProps {
  assessments: Assessment[];
  loading?: boolean;
  error?: string;
  readOnly?: boolean;
  onAssessmentSelect?: (assessment: Assessment) => void;
  onAddAssessment?: () => void;
  onSettingsClick?: () => void;
}

export interface AssessmentCardProps {
  assessment: Assessment;
  onClick?: () => void;
}