import React, { memo } from 'react';
import { Button } from './button';
import { Typography } from './typography';
import { AssessmentCard } from './assessment-card';
import type { AssessmentListProps } from './types';

const EmptyState = memo(() => (
  <div style={{
    textAlign: 'center',
    padding: 'var(--space-3xl) var(--space-lg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-md)',
  }}>
    <div style={{
      fontSize: '48px',
      marginBottom: 'var(--space-md)',
    }}>
      📋
    </div>
    <Typography variant="body" style={{ 
      color: 'var(--text-secondary)',
      fontSize: 'var(--font-size-body)',
      lineHeight: 'var(--line-height-relaxed)'
    }}>
      Get started with your first assessment! They will show up here
    </Typography>
  </div>
));

EmptyState.displayName = 'EmptyState';

export const AssessmentList = memo<AssessmentListProps>(({ 
  assessments, 
  loading = false, 
  error, 
  readOnly = false,
  onAssessmentSelect, 
  onAddAssessment 
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }} aria-busy="true">
        <Typography variant="body">Loading assessments...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }} role="alert">
        <Typography variant="body" style={{ color: 'var(--error)' }}>
          Error loading assessments: {error}
        </Typography>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '400px' }}>
      {/* Create Assessment Button - Only show when not readOnly and not loading/error */}
      {!readOnly && !loading && !error && (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Button 
            variant="primary"
            onClick={() => onAddAssessment?.()}
            aria-label="Create Assessment"
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              fontSize: 'var(--font-size-body)',
              fontWeight: 'var(--font-weight-semibold)',
            }}
          >
            Create Assessment
          </Button>
        </div>
      )}

      {/* Section Header */}
      {assessments.length > 0 && (
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Typography variant="h2" style={{ 
            color: 'var(--text-primary)',
            fontSize: 'var(--font-size-h2)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-sm)'
          }}>
            Recent Assessments
          </Typography>
        </div>
      )}

      {/* Assessment List or Empty State */}
      {assessments.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0', // Cards have their own bottom margin
        }}>
          {assessments.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              onClick={() => onAssessmentSelect?.(assessment)}
            />
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <div style={{ 
        position: 'sticky',
        bottom: `calc(var(--space-xl) + env(safe-area-inset-bottom))`,
        marginTop: 'var(--space-lg)',
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: 'var(--space-xl)',
        zIndex: 1000,
        pointerEvents: 'none', // Allow clicks to pass through container
      }}>
        <Button 
          variant="primary"
          onClick={() => {
            onAddAssessment?.();
          }}
          aria-label="Create new assessment"
          style={{
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'normal',
            boxShadow: 'var(--shadow-3)',
            background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
            border: 'none',
            pointerEvents: 'all', // Re-enable clicks on button
          }}
        >
          +
        </Button>
      </div>
    </div>
  );
});

AssessmentList.displayName = 'AssessmentList';