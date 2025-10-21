import React, { memo, useMemo } from 'react';
import { Card } from './card';
import { Typography } from './typography';
import { Badge } from './badge';
import type { AssessmentCardProps } from './types';

const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }
  
  return date.toLocaleDateString();
};

export const AssessmentCard = memo<AssessmentCardProps>(({ assessment, onClick }) => {
  const statusVariant = useMemo(() => {
    return assessment.status === 'COMPLETE' ? 'success' : 'warning';
  }, [assessment.status]);

  const statusLabel = useMemo(() => {
    return assessment.status === 'COMPLETE' ? 'Done' : 'In Progress';
  }, [assessment.status]);

  const vehicleIcon = '🚗'; // Could be made dynamic based on vehicle type

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      elevation={2}
      padding="lg"
      onClick={onClick}
      onKeyDown={handleKeyPress}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View assessment for ${assessment.vehicleName}` : undefined}
      data-testid={`assessment-card-${assessment.id}`}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        marginBottom: 'var(--space-md)',
        transition: 'var(--transition-default)',
        outline: 'none',
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
            <Badge variant={statusVariant} size="sm" data-testid={`assessment-card-${assessment.id}-status`}>
              {statusLabel}
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
            {getRelativeTimeString(assessment.dateUpdated)}
          </Typography>
        </div>
      </div>
    </Card>
  );
});

AssessmentCard.displayName = 'AssessmentCard';