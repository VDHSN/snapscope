'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@snapscope/ui/typography';
import { Button } from '@snapscope/ui/button';
import { Card } from '@snapscope/ui/card';
import { Badge } from '@snapscope/ui/badge';
import { Progress } from '@snapscope/ui/progress';
import { VINInput } from '@snapscope/ui/vin-input';
import { isValidVIN } from '@/lib/vin-utils';
import { useClaims } from '@/hooks/useStorage';

// Icons components (using inline SVG for now)
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5C18.8978 2.1022 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

type VINEntryMethod = 'manual' | 'scan' | null;

// Analytics function with proper typing
const trackEvent = (eventName: string, eventData?: Record<string, string | number>) => {
  if (typeof window !== 'undefined' && 'va' in window) {
    try {
      // Use Vercel Analytics track function
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).va?.(eventName, eventData);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
};

export default function VINEntryPage() {
  const router = useRouter();
  const { createClaimWithVIN } = useClaims();
  const [vin, setVin] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<VINEntryMethod>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVinValid = isValidVIN(vin);
  const canContinue = selectedMethod === 'manual' && isVinValid;

  const handleMethodSelect = (method: VINEntryMethod) => {
    setSelectedMethod(method);
    
    // Track analytics for method selection
    trackEvent('vin_entry_method', { method: method || '' });
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = async () => {
    if (!canContinue) return;
    
    setIsSubmitting(true);
    
    try {
      // Track analytics for VIN entry completion
      trackEvent('vin_entry_completed', { vin: vin.substring(0, 3) + '***' }); // Partial VIN for privacy

      // Create claim with VIN using useClaims hook
      console.log('Creating assessment with VIN:', vin);
      const newClaim = await createClaimWithVIN(vin);
      
      console.log('Assessment created with ID:', newClaim.id);
      
      // Navigate to next step (vehicle info page - to be implemented)
      router.push(`/assessments/${newClaim.id}/vehicle-info`);
      
    } catch (error) {
      console.error('Error creating assessment:', error);
      // TODO: Show error toast
      alert('Failed to create assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Track analytics for page load
  React.useEffect(() => {
    trackEvent('vin_entry_started');
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#F5E6D3', // Cream background
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header with purple gradient */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
        padding: 'var(--space-md)',
        color: 'white'
      }}>
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
            onClick={handleBack}
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              backdropFilter: 'blur(10px)'
            }}
          >
            <ArrowLeftIcon />
            Back
          </Button>

          <Typography variant="caption" style={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 'var(--font-weight-semibold)'
          }}>
            Step 1 of 9
          </Typography>
        </div>

        {/* Progress bar */}
        <Progress 
          value={11.11} // 1/9 steps
          size="sm"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            marginBottom: 'var(--space-md)'
          }}
        />

        {/* Title */}
        <Typography variant="h2" style={{ 
          color: 'white',
          marginBottom: 'var(--space-xs)',
          fontSize: 'var(--font-size-h2)'
        }}>
          Enter Vehicle VIN
        </Typography>
        
        <Typography variant="body" style={{ 
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 'var(--font-size-small)'
        }}>
          We need the VIN to start your assessment
        </Typography>
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1,
        maxWidth: '480px',
        margin: '0 auto',
        padding: 'var(--space-lg) var(--space-md)',
        width: '100%'
      }}>
        {/* VIN Entry Methods */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)'
        }}>
          <Typography variant="h3" style={{ 
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-sm)',
            fontSize: 'var(--font-size-h3)'
          }}>
            Choose Entry Method
          </Typography>

          {/* Manual Entry Card */}
          <Card
            elevation={selectedMethod === 'manual' ? 3 : 1}
            padding="lg"
            onClick={() => handleMethodSelect('manual')}
            style={{
              cursor: 'pointer',
              border: selectedMethod === 'manual' 
                ? '2px solid var(--primary-end)' 
                : '1px solid var(--border-color)',
              transform: selectedMethod === 'manual' ? 'translateY(-2px)' : undefined,
              transition: 'all 0.2s ease'
            }}
            tabIndex={0}
            role="button"
            aria-pressed={selectedMethod === 'manual'}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)'
            }}>
              <div style={{
                padding: 'var(--space-sm)',
                borderRadius: 'var(--border-radius-md)',
                background: selectedMethod === 'manual' 
                  ? 'var(--primary-start)' 
                  : 'var(--bg-secondary)',
                color: selectedMethod === 'manual' ? 'white' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <EditIcon />
              </div>
              
              <div style={{ flex: 1 }}>
                <Typography variant="h3" style={{ 
                  marginBottom: 'var(--space-xs)',
                  color: 'var(--text-primary)'
                }}>
                  Manual VIN Entry
                </Typography>
                <Typography variant="body" style={{ 
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--font-size-small)'
                }}>
                  Type the 17-character VIN manually
                </Typography>
              </div>
            </div>
          </Card>

          {/* Scan VIN Card (Coming Soon) */}
          <Card
            elevation={1}
            padding="lg"
            onClick={() => handleMethodSelect('scan')}
            style={{
              cursor: 'pointer',
              opacity: 0.7,
              position: 'relative'
            }}
            tabIndex={0}
            role="button"
            aria-disabled="true"
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)'
            }}>
              <div style={{
                padding: 'var(--space-sm)',
                borderRadius: 'var(--border-radius-md)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CameraIcon />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-xs)'
                }}>
                  <Typography variant="h3" style={{ 
                    color: 'var(--text-primary)'
                  }}>
                    Scan VIN Barcode
                  </Typography>
                  <Badge variant="neutral" size="sm">
                    Coming Soon
                  </Badge>
                </div>
                <Typography variant="body" style={{ 
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--font-size-small)'
                }}>
                  Use camera to scan VIN barcode
                </Typography>
              </div>
            </div>
          </Card>
        </div>

        {/* VIN Input Field (shown when manual method is selected) */}
        {selectedMethod === 'manual' && (
          <div style={{ 
            marginBottom: 'var(--space-xl)'
          }}>
            <Typography variant="h3" style={{ 
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)',
              fontSize: 'var(--font-size-h3)'
            }}>
              Enter VIN
            </Typography>
            
            <VINInput
              value={vin}
              onChange={setVin}
              size="lg"
              showCharacterCount={true}
              showValidation={true}
              placeholder="Enter 17-character VIN"
              autoFocus
            />
            
            <Typography variant="caption" style={{ 
              color: 'var(--text-secondary)',
              marginTop: 'var(--space-sm)',
              display: 'block'
            }}>
              VIN can be found on your dashboard, driver&apos;s side door, or insurance documents
            </Typography>
          </div>
        )}

        {/* Continue Button */}
        <div style={{ 
          position: 'sticky',
          bottom: 'var(--space-md)',
          marginTop: 'auto'
        }}>
          <Button
            variant="primary"
            size="lg"
            disabled={!canContinue || isSubmitting}
            onClick={handleContinue}
            style={{
              width: '100%',
              opacity: canContinue ? 1 : 0.5,
              cursor: canContinue ? 'pointer' : 'not-allowed'
            }}
          >
            {isSubmitting ? 'Creating Assessment...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}