'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography } from '@snapscope/ui/typography';
import { Logo } from '@snapscope/ui/logo';
import { Button } from '@snapscope/ui/button';
import { Card } from '@snapscope/ui/card';
import { Badge } from '@snapscope/ui/badge';
import { Progress } from '@snapscope/ui/progress';
import { VINInput } from '@snapscope/ui/vin-input';
import { CarrierSelector } from '@snapscope/ui/carrier-selector';
import { ThemeToggle } from '@snapscope/ui/theme-toggle';
import { ArrowLeftIcon, CameraIcon, EditIcon } from '@snapscope/ui/icon';
import { isValidVIN } from '@/lib/vin-utils';
import { useClaims } from '@/hooks/useStorage';
import { useCarrierSettings } from '@/hooks/useCarrierSettings';


type VINEntryMethod = 'manual' | 'scan' | null;

// Analytics function with proper typing
const trackEvent = (eventName: string, eventData?: Record<string, string | number>) => {
  if (typeof window !== 'undefined' && 'va' in window) {
    try {
      // Use Vercel Analytics track function with proper typing
      window.va?.(eventName, eventData);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
};

export default function VINEntryPage() {
  const router = useRouter();
  const { createClaimWithVIN } = useClaims();
  const { carriers } = useCarrierSettings();
  const [vin, setVin] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<VINEntryMethod>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCarrierSelector, setShowCarrierSelector] = useState(false);

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

  const handleLogoClick = () => {
    router.push('/assessments');
  };

  const handleContinue = async () => {
    if (!canContinue) return;

    // Show carrier selector modal
    setShowCarrierSelector(true);
  };

  const handleCarrierSelect = async (carrierId: string) => {
    await createAssessment(carrierId);
  };

  const handleSkipCarrier = async () => {
    await createAssessment(undefined);
  };

  const createAssessment = async (carrierId: string | undefined) => {
    setIsSubmitting(true);

    try {
      // Track analytics for VIN entry completion
      trackEvent('vin_entry_completed', { vin: vin.substring(0, 3) + '***' }); // Partial VIN for privacy

      // Create claim with VIN and optional carrier
      console.log('Creating assessment with VIN:', vin, 'and carrier:', carrierId);
      const newClaim = await createClaimWithVIN(vin, carrierId);

      console.log('Assessment created with ID:', newClaim.id);

      // Navigate to next step (vehicle info page - to be implemented)
      router.push(`/assessments/${newClaim.id}/vehicle-info`);

    } catch (error) {
      console.error('Error creating assessment:', error);
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
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
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

      {/* Header with purple gradient */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
        padding: 'var(--space-md)',
        paddingRight: 'calc(var(--space-md) + 40px + var(--space-md))', // Space for theme toggle
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
            <ArrowLeftIcon size="sm" aria-hidden />
            Back
          </Button>

          <Typography variant="caption" style={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 'var(--font-weight-semibold)',
            marginRight: 'var(--space-sm)' // Extra margin to prevent overlap
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

        {/* Logo */}
        <div 
          onClick={handleLogoClick}
          style={{ 
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--space-md)'
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
            size="md" 
            variant="full" 
            style={{ color: 'white' }}
          />
        </div>

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
                <EditIcon size="lg" aria-hidden />
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
                <CameraIcon size="lg" aria-hidden />
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
              aria-describedby="vin-format-help vin-location-help"
            />
            
            <div>
              <Typography variant="caption" id="vin-format-help" style={{ 
                color: 'var(--text-secondary)',
                marginTop: 'var(--space-sm)',
                display: 'block',
                fontSize: 'var(--font-size-small)'
              }}>
                VIN must be 17 characters: letters A-H, J-N, P, R-Z, and numbers 0-9
              </Typography>
              <Typography variant="caption" id="vin-location-help" style={{ 
                color: 'var(--text-secondary)',
                marginTop: 'var(--space-xs)',
                display: 'block'
              }}>
                VIN can be found on your dashboard, driver&apos;s side door, or insurance documents
              </Typography>
            </div>
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

      {/* Carrier Selector Modal */}
      <CarrierSelector
        carriers={carriers.map((c) => ({
          id: c.id,
          name: c.name,
          photoCount: c.workflow.standardPhotos.length,
          isTemplate: c.isTemplate,
        }))}
        isOpen={showCarrierSelector}
        onClose={() => setShowCarrierSelector(false)}
        onSelectCarrier={handleCarrierSelect}
        onSkip={handleSkipCarrier}
        onCreateNew={() => {
          setShowCarrierSelector(false);
          router.push('/settings/carriers/new?template=custom');
        }}
      />
    </div>
  );
}