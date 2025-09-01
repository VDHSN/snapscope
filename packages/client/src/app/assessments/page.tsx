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
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
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
      
      {/* Header with Gradient */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
        padding: 'var(--space-xl) var(--space-md) var(--space-2xl)',
        paddingRight: 'calc(var(--space-md) + 40px + var(--space-md))', // Space for theme toggle
        color: 'white',
        textAlign: 'center'
      }}>
        <div 
          onClick={handleLogoClick}
          style={{ 
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--space-sm)'
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
            size="xl" 
            variant="full" 
            style={{ color: 'white' }}
          />
        </div>
        <Typography variant="body" style={{ 
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 'var(--font-size-small)'
        }}>
          Vehicle Damage Assessment
        </Typography>
      </div>
      
      {/* Content Area */}
      <div style={{ 
        maxWidth: '480px', 
        margin: '0 auto',
        padding: 'var(--space-lg) var(--space-md)',
        minHeight: 'calc(100vh - 180px)'
      }}>
        <AssessmentList />
      </div>
    </div>
  );
}