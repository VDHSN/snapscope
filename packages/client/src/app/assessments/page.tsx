'use client';

import { Typography } from '@snapscope/ui/typography';
import { Logo } from '@snapscope/ui/logo';
import { ThemeToggle } from '@snapscope/ui/theme-toggle';
import { AssessmentList } from '@/components/AssessmentList';
import { useRouter } from 'next/navigation';

export default function AssessmentsPage() {
  const router = useRouter();
  
  const handleLogoClick = () => {
    // Stay on current page or refresh
    router.push('/assessments');
  };

  return (
    <div
      data-testid="page-assessments-list"
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      {/* Theme Toggle */}
      <div style={{ 
        position: 'absolute', 
        top: 'var(--space-md)', 
        right: 'var(--space-md)',
        zIndex: 10
      }}>
        <ThemeToggle />
      </div>


      {/* Header with Gradient */}
      <header
        data-testid="assessments-header"
        role="banner"
        style={{
          background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
          padding: 'var(--space-sm) var(--space-md)',
          paddingRight: 'calc(var(--space-md) + 40px + var(--space-md))', // Space for theme toggle
          color: 'white',
          position: 'relative'
        }}
      >
        {/* Logo in top left */}
        <div
          onClick={handleLogoClick}
          style={{
            cursor: 'pointer',
            position: 'absolute',
            top: 'var(--space-sm)',
            left: 'var(--space-md)'
          }}
          role="button"
          tabIndex={0}
          aria-label="Go to home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLogoClick();
            }
          }}
        >
          <Logo
            size="sm"
            variant="icon"
            theme="dark"
            style={{ color: 'white' }}
          />
        </div>

        {/* Title centered */}
        <Typography variant="h2" style={{
          color: 'white',
          fontSize: 'var(--font-size-h3)',
          textAlign: 'center',
          marginBottom: 'var(--space-xs)'
        }}>
          My Assessments
        </Typography>

        <Typography variant="body" style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 'var(--font-size-caption)',
          textAlign: 'center'
        }}>
          Vehicle Damage Assessment
        </Typography>
      </header>


      {/* Content Area */}
      <main
        data-testid="assessments-main-content"
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: 'var(--space-lg) var(--space-md)',
          minHeight: 'calc(100vh - 180px)'
        }}
      >
        <AssessmentList />
      </main>
    </div>
  );
}