import React, { memo, useMemo } from 'react';
import { Card } from '@snapscope/ui/card';
import { Typography } from '@snapscope/ui/typography';
import { Badge } from '@snapscope/ui/badge';
import type { Assessment } from '@/hooks/useAssessments';

interface AssessmentCardProps {
  assessment: Assessment;
  onClick?: () => void;
}

export const AssessmentCard = memo<AssessmentCardProps>(({ assessment, onClick }) => {
  const statusVariant = useMemo(() => {
    return assessment.status === 'COMPLETE' ? 'success' : 'warning';
  }, [assessment.status]);

  const vehicleIcon = '🚗'; // Could be made dynamic based on vehicle type

  return (
    <Card 
      elevation={2} 
      padding="lg"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        marginBottom: 'var(--space-md)',
        transition: 'var(--transition-default)',
      }}
    >
      <div style={{
        display: 'flex',
        gap: 'var(--space-md)',
        alignItems: 'flex-start',
      }}>
        {/* Vehicle Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          flexShrink: 0,
        }}>
          {vehicleIcon}
        </div>

        {/* Assessment Details */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xs)',
        }}>
          {/* Vehicle Name and Status */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 'var(--space-sm)',
          }}>
            <Typography variant="h3" style={{ 
              fontSize: 'var(--font-size-body)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)'
            }}>
              {assessment.vehicleName}
            </Typography>
            <Badge variant={statusVariant} size="sm">
              {assessment.status === 'COMPLETE' ? 'Done' : 'In Progress'}
            </Badge>
          </div>

          {/* VIN (mock data for now) */}
          <Typography variant="small" style={{ 
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-caption)'
          }}>
            VIN: 1HGBH41JXMN{Math.random().toString().slice(2,8)}
          </Typography>

          {/* Timestamp */}
          <Typography variant="small" style={{ 
            color: 'var(--text-tertiary)',
            fontSize: 'var(--font-size-caption)'
          }}>
            {assessment.dateUpdated.toLocaleDateString()} • {assessment.dateUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Typography>
        </div>
      </div>
    </Card>
  );
});

AssessmentCard.displayName = 'AssessmentCard';