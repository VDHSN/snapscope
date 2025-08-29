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

  return (
    <UIAssessmentList
      assessments={assessments}
      loading={loading}
      error={error || undefined}
      readOnly={false}
      onAssessmentSelect={onAssessmentSelect}
      onAddAssessment={handleAddAssessment}
    />
  );
});

AssessmentList.displayName = 'AssessmentList';