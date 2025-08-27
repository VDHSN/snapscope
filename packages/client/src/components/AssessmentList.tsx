import React, { memo } from 'react';
import { AssessmentList as UIAssessmentList } from '@snapscope/ui/assessment-list';
import { useAssessments, type Assessment } from '@/hooks/useAssessments';

interface AssessmentListProps {
  onAssessmentSelect?: (assessment: Assessment) => void;
}

export const AssessmentList = memo<AssessmentListProps>(({ onAssessmentSelect }) => {
  const { assessments, loading, error } = useAssessments();

  return (
    <UIAssessmentList
      assessments={assessments}
      loading={loading}
      error={error || undefined}
      readOnly={false}
      onAssessmentSelect={onAssessmentSelect}
      onAddAssessment={() => {
        console.log('adding new assessment');
      }}
    />
  );
});

AssessmentList.displayName = 'AssessmentList';