import React, { memo, useMemo } from 'react';
import { Card } from './card';
import { Typography } from './typography';
import { Badge } from './badge';
import type { AssessmentCardProps } from './types';

/**
 * Get relative time string (e.g., "2 hours ago")
 *
 * Handles dates that may be deserialized from storage where Date objects
 * are serialized as ISO strings. Accepts Date objects, string representations,
 * or Unix timestamps.
 *
 * @param date - The date value (Date object, ISO string, or Unix timestamp)
 * @returns Human-readable relative time string
 */
const getRelativeTimeString = (date: Date | string | number): string => {
  // Convert input to Date object
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  // Validate that we have a valid date
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60));

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

  return dateObj.toLocaleDateString();
};

export const AssessmentCard = memo<AssessmentCardProps>(({ assessment, onClick, onExport }) => {
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

  const handleExportClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    if (onExport) {
      onExport(assessment.id);
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

          {/* VIN */}
          <Typography variant="small" style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-caption)'
          }}>
            VIN: {assessment.vin}
          </Typography>

          {/* Timestamp and Completion Info */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xs)'
          }}>
            {assessment.completedAt && (
              <Typography variant="small" style={{
                color: 'var(--color-success)',
                fontSize: 'var(--font-size-caption)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                Completed: {new Date(assessment.completedAt).toLocaleDateString()}
              </Typography>
            )}
            <Typography variant="small" style={{
              color: 'var(--text-tertiary)',
              fontSize: 'var(--font-size-caption)'
            }}>
              {getRelativeTimeString(assessment.dateUpdated)}
            </Typography>
          </div>

          {/* Re-export button for completed assessments */}
          {assessment.status === 'COMPLETE' && onExport && (
            <button
              onClick={handleExportClick}
              style={{
                marginTop: 'var(--space-xs)',
                padding: 'var(--space-xs) var(--space-sm)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-size-caption)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'var(--transition-default)',
                fontFamily: 'inherit',
                alignSelf: 'flex-start',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary-start)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-surface)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              Re-export Assessment
            </button>
          )}
        </div>
      </div>
    </Card>
  );
});

AssessmentCard.displayName = 'AssessmentCard';