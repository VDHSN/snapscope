import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentList as UIAssessmentList } from '@snapscope/ui/assessment-list';
import { useAssessments, type Assessment } from '@/hooks/useAssessments';

interface AssessmentListProps {
  onAssessmentSelect?: (assessment: Assessment) => void;
}

export const AssessmentList = memo<AssessmentListProps>(({ onAssessmentSelect }) => {
  const router = useRouter();
  const { assessments, loading, error } = useAssessments();

  const handleAddAssessment = () => {
    console.log('Navigating to VIN entry screen');
    router.push('/assessments/new');
  };

  const handleSettingsClick = () => {
    console.log('Navigating to settings');
    router.push('/settings');
  };

  const handleAssessmentSelect = (assessment: Assessment) => {
    console.log('Navigating to assessment:', assessment.id);
    // Navigate directly to photos page for now
    // TODO: Navigate to detail page once issue #62 is implemented
    router.push(`/assessments/${assessment.id}/photos`);
  };

  const handleExport = (assessmentId: string) => {
    console.log('Navigating to export page for assessment:', assessmentId);
    router.push(`/assessments/${assessmentId}/export`);
  };

  return (
    <UIAssessmentList
      assessments={assessments}
      loading={loading}
      error={error || undefined}
      readOnly={false}
      onAssessmentSelect={onAssessmentSelect || handleAssessmentSelect}
      onAddAssessment={handleAddAssessment}
      onSettingsClick={handleSettingsClick}
      onExport={handleExport}
    />
  );
});

AssessmentList.displayName = 'AssessmentList';