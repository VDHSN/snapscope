import React from 'react';
import { Button } from './button';
import { Progress } from './progress';
import { Typography } from './typography';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';
import { ArrowLeftIcon } from './icon';
import { createResponsiveStyles, injectResponsiveStyles, RESPONSIVE_SPACING } from './responsive-utils';

export interface PhotoGuideHeaderProps {
  currentStep: number;
  totalSteps: number;
  completedCount: number;
  requiredCount: number;
  onBack: () => void;
  onLogoClick: () => void;
}

export const PhotoGuideHeader = React.memo<PhotoGuideHeaderProps>(({ 
  currentStep, 
  totalSteps, 
  completedCount, 
  requiredCount, 
  onBack, 
  onLogoClick 
}) => {
  const progressValue = ((currentStep ?? 0) / (totalSteps ?? 1)) * 100;
  
  // Inject responsive styles using utilities
  React.useEffect(() => {
    const responsiveStyles = [
      createResponsiveStyles('.photo-guide-header', {
        base: {
          background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
          color: 'white',
          position: 'relative',
        },
        mobile: {
          padding: RESPONSIVE_SPACING.padding.mobile,
          paddingRight: `calc(${RESPONSIVE_SPACING.padding.mobile} + 40px + ${RESPONSIVE_SPACING.padding.mobile})`,
        },
        tablet: {
          padding: RESPONSIVE_SPACING.padding.tablet,
          paddingRight: `calc(${RESPONSIVE_SPACING.padding.tablet} + 40px + ${RESPONSIVE_SPACING.padding.tablet})`,
        },
      }),
      createResponsiveStyles('.photo-guide-header-controls', {
        base: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-xs)',
        },
      }),
      createResponsiveStyles('.photo-guide-theme-toggle', {
        base: {
          position: 'absolute',
          zIndex: '10',
        },
        mobile: {
          top: RESPONSIVE_SPACING.padding.mobile,
          right: RESPONSIVE_SPACING.padding.mobile,
        },
        tablet: {
          top: RESPONSIVE_SPACING.padding.tablet,
          right: RESPONSIVE_SPACING.padding.tablet,
        },
      }),
      createResponsiveStyles('.photo-guide-logo', {
        base: {
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--space-xs)',
        },
      }),
      createResponsiveStyles('.photo-guide-step-info', {
        base: {
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 'var(--font-weight-semibold)',
          marginRight: 'var(--space-sm)',
        },
      }),
      // Additional styles for very small screens
      `@media (max-width: 479px) {
        .photo-guide-header-controls {
          flex-direction: column;
          gap: var(--space-xs);
          align-items: flex-start;
        }
        .photo-guide-step-info {
          margin-right: 0;
          font-size: var(--font-size-xs);
        }
      }`,
      `@media (max-width: 639px) {
        .photo-guide-logo .logo-sm {
          font-size: 1rem;
        }
      }`,
      `.photo-guide-logo .logo-sm {
        font-size: 1.25rem;
      }`,
    ].join('\n\n');
    
    injectResponsiveStyles('photo-guide-header-responsive', responsiveStyles);
  }, []);
  
  return (
    <div className="photo-guide-header">
      {/* Theme Toggle */}
      <div className="photo-guide-theme-toggle">
        <ThemeToggle />
      </div>

      {/* Back button and progress */}
      <div className="photo-guide-header-controls">
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

        <Typography variant="caption" className="photo-guide-step-info">
          Step {currentStep ?? 1} of {totalSteps ?? 1}
        </Typography>
      </div>

      {/* Progress bar */}
      <Progress
        value={progressValue}
        size="sm"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          marginBottom: 'var(--space-sm)'
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
        className="photo-guide-logo"
        role="button"
        tabIndex={0}
        aria-label="Return to home"
      >
        <Logo
          size="sm"
          variant="full"
          theme="dark"
          style={{ color: 'white' }}
          className="logo-sm"
        />
      </div>

      {/* Title and current position */}
      <Typography variant="h2" style={{
        color: 'white',
        marginBottom: 'var(--space-xs)',
        fontSize: 'var(--font-size-h3)'
      }}>
        Photo Guide
      </Typography>

      <Typography variant="body" style={{
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 'var(--font-size-caption)'
      }}>
        {completedCount ?? 0} of {requiredCount ?? 0} required photos completed
      </Typography>
    </div>
  );
});