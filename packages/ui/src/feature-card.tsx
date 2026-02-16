import React from 'react';
import { Card, CardProps } from './card';
import { Typography } from './typography';

export interface FeatureCardProps extends Omit<CardProps, 'children'> {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
}

const iconContainerStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: 'var(--border-radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  opacity: 0.9,
};

const contentContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--space-md)',
};

const cardStyle: React.CSSProperties = {
  textAlign: 'center',
};

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon, title, description, iconBgColor, style, ...props }, ref) => {
    const combinedStyle: React.CSSProperties = {
      ...cardStyle,
      ...style,
    };

    const iconStyle: React.CSSProperties = {
      ...iconContainerStyle,
      backgroundColor: iconBgColor,
    };

    return (
      <Card ref={ref} elevation={1} padding="lg" style={combinedStyle} {...props}>
        <div style={contentContainerStyle}>
          <div style={iconStyle}>
            {icon}
          </div>
          <Typography variant="h3">{title}</Typography>
          <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </Typography>
        </div>
      </Card>
    );
  }
);

FeatureCard.displayName = 'FeatureCard';