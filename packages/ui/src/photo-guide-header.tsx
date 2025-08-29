import React from 'react';
import { Button } from './button';
import { Progress } from './progress';
import { Typography } from './typography';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { ArrowLeftIcon } from './icon';

export interface PhotoGuideHeaderProps {
  currentStep: number;
  totalSteps: number;
  completedCount: number;
  requiredCount: number;
  onBack: () => void;
  onLogoClick: () => void;
}

export const PhotoGuideHeader: React.FC<PhotoGuideHeaderProps> = ({ 
  currentStep, 
  totalSteps, 
  completedCount, 
  requiredCount, 
  onBack, 
  onLogoClick 
}) => {
  const progressValue = ((currentStep ?? 0) / (totalSteps ?? 1)) * 100;
  
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
      padding: 'var(--space-md)',
      paddingRight: 'calc(var(--space-md) + 40px + var(--space-md))',
      color: 'white',
      position: 'relative'
    }}>
      {/* Theme Toggle */}
      <div style={{ 
        position: 'absolute', 
        top: 'var(--space-md)', 
        right: 'var(--space-md)',
        zIndex: 10
      }}>
        <ThemeToggle />
      </div>

      {/* Back button and progress */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-sm)'
      }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={onBack}
          style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            backdropFilter: 'blur(10px)'
          }}
        >
          <ArrowLeftIcon size="sm" aria-hidden />
          Back
        </Button>

        <Typography variant="caption" style={{ 
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 'var(--font-weight-semibold)',
          marginRight: 'var(--space-sm)'
        }}>
          Step {currentStep ?? 1} of {totalSteps ?? 1}
        </Typography>
      </div>

      {/* Progress bar */}
      <Progress 
        value={progressValue}
        size="sm"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          marginBottom: 'var(--space-md)'
        }}
      />

      {/* Logo */}
      <div 
        onClick={onLogoClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onLogoClick();
          }
        }}
        style={{ 
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--space-md)'
        }}
        role="button"
        tabIndex={0}
        aria-label="Return to home"
      >
        <Logo 
          size="md" 
          variant="full" 
          style={{ color: 'white' }}
        />
      </div>

      {/* Title and current position */}
      <Typography variant="h2" style={{ 
        color: 'white',
        marginBottom: 'var(--space-xs)',
        fontSize: 'var(--font-size-h2)'
      }}>
        Photo Guide
      </Typography>
      
      <Typography variant="body" style={{ 
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 'var(--font-size-small)'
      }}>
        {completedCount ?? 0} of {requiredCount ?? 0} required photos completed
      </Typography>
    </div>
  );
};