'use client';

import { Typography } from '@snapscope/ui/typography';
import { ThemeToggle } from '@snapscope/ui/theme-toggle';
import { AssessmentList } from '@/components/AssessmentList';

export default function AssessmentsPage() {
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
        <Typography variant="h1" style={{ 
          color: 'white',
          marginBottom: 'var(--space-sm)',
          fontSize: 'var(--font-size-h1)'
        }}>
          SnapScope
        </Typography>
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