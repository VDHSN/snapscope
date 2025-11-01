import * as React from 'react';
import { Typography } from './typography';
import { Card } from './card';
import { CheckIcon } from './icon';

export interface CompletionSummaryProps {
  vin: string;
  photoCount: number;
  completedDate: Date;
  fileName: string;
  'data-testid'?: string;
}

const summaryContainerStyle: React.CSSProperties = {
  textAlign: 'center'
};

const iconContainerStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  margin: '0 auto var(--space-md)',
  borderRadius: '50%',
  background: 'var(--color-success)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white'
};

const headingStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  marginBottom: 'var(--space-md)',
  fontSize: 'var(--font-size-h2)',
  fontWeight: 'var(--font-weight-bold)'
};

const infoRowStyle: React.CSSProperties = {
  marginBottom: 'var(--space-sm)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--space-sm) 0',
  borderBottom: '1px solid var(--border-color)'
};

const labelStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: 'var(--font-size-small)',
  fontWeight: 'var(--font-weight-medium)'
};

const valueStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  fontSize: 'var(--font-size-body)',
  fontWeight: 'var(--font-weight-semibold)'
};

const fileNameStyle: React.CSSProperties = {
  marginTop: 'var(--space-md)',
  padding: 'var(--space-sm)',
  background: 'var(--bg-secondary)',
  borderRadius: 'var(--border-radius-sm)',
  fontFamily: 'monospace',
  fontSize: 'var(--font-size-small)',
  color: 'var(--text-secondary)',
  wordBreak: 'break-all'
};

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const CompletionSummary: React.FC<CompletionSummaryProps> = ({
  vin,
  photoCount,
  completedDate,
  fileName,
  'data-testid': testId
}) => {
  return (
    <Card elevation={2} padding="lg" data-testid={testId}>
      <div style={summaryContainerStyle}>
        {/* Success Icon */}
        <div style={iconContainerStyle}>
          <CheckIcon size="lg" />
        </div>

        {/* Heading */}
        <Typography variant="h2" style={headingStyle}>
          Assessment Complete!
        </Typography>

        {/* Info Rows */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={infoRowStyle}>
            <span style={labelStyle}>Vehicle VIN</span>
            <span style={valueStyle}>{vin}</span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>Photos Captured</span>
            <span style={valueStyle}>{photoCount}</span>
          </div>

          <div style={infoRowStyle}>
            <span style={labelStyle}>Completed</span>
            <span style={valueStyle}>{formatDate(completedDate)}</span>
          </div>
        </div>

        {/* File Name */}
        <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>
          Export file name:
        </Typography>
        <div style={fileNameStyle}>
          {fileName}
        </div>
      </div>
    </Card>
  );
};

CompletionSummary.displayName = 'CompletionSummary';
