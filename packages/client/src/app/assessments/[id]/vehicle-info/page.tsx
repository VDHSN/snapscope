'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Typography } from '@snapscope/ui/typography';
import { Logo } from '@snapscope/ui/logo';
import { Button } from '@snapscope/ui/button';
import { Card } from '@snapscope/ui/card';
import { Input } from '@snapscope/ui/input';
import { Progress } from '@snapscope/ui/progress';
import { ThemeToggle } from '@snapscope/ui/theme-toggle';
import { ArrowLeftIcon } from '@snapscope/ui/icon';
import { useClaims } from '@/hooks/useStorage';
import type { Claim } from '@/types/claim';

export default function VehicleInfoPage() {
  const router = useRouter();
  const params = useParams();
  const { getClaim, saveClaim } = useClaims();
  const claimId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [claim, setClaim] = useState<Claim | null>(null);
  
  // Vehicle info form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [color, setColor] = useState('');

  // Load claim data
  useEffect(() => {
    const loadedClaim = getClaim(claimId);
    if (loadedClaim) {
      setClaim(loadedClaim);
      
      // Update status to in_progress if it's still in draft
      if (loadedClaim.status === 'draft') {
        const updatedClaim = {
          ...loadedClaim,
          status: 'in_progress' as const,
          updatedAt: new Date()
        };
        saveClaim(updatedClaim);
        setClaim(updatedClaim);
      }
      
      // Pre-populate form if data exists
      setMake(loadedClaim.vehicle.make || '');
      setModel(loadedClaim.vehicle.model || '');
      setYear(loadedClaim.vehicle.year || new Date().getFullYear());
      setColor(loadedClaim.vehicle.color || '');
    }
    setLoading(false);
  }, [claimId, getClaim, saveClaim]);

  const handleBack = () => {
    router.back();
  };

  const handleLogoClick = () => {
    router.push('/assessments');
  };

  const handleContinue = async () => {
    if (!claim) return;
    
    setSaving(true);
    
    try {
      // Update claim with vehicle info
      const updatedClaim = {
        ...claim,
        vehicle: {
          ...claim.vehicle,
          make: make.trim() || undefined,
          model: model.trim() || undefined,
          year,
          color: color.trim() || undefined,
        },
        updatedAt: new Date(),
      };

      await saveClaim(updatedClaim);
      
      // Navigate to photo guide
      router.push(`/assessments/${claimId}/photos`);
      
    } catch (error) {
      console.error('Error saving vehicle info:', error);
      alert('Failed to save vehicle information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="body">Loading...</Typography>
      </div>
    );
  }

  if (!claim) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="body">Assessment not found</Typography>
      </div>
    );
  }

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
            marginRight: 'var(--space-sm)'
          }}>
            Step 2 of 9
          </Typography>
        </div>

        {/* Progress bar */}
        <Progress 
          value={22.22} // 2/9 steps
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
            theme="dark"
            style={{ color: 'white' }}
          />
        </div>

        {/* Title */}
        <Typography variant="h2" style={{ 
          color: 'white',
          marginBottom: 'var(--space-xs)',
          fontSize: 'var(--font-size-h2)'
        }}>
          Vehicle Information
        </Typography>
        
        <Typography variant="body" style={{ 
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 'var(--font-size-small)'
        }}>
          Help us identify your vehicle (optional)
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
        {/* VIN Display */}
        <Card
          elevation={1}
          padding="lg"
          style={{ marginBottom: 'var(--space-xl)' }}
        >
          <Typography variant="h3" style={{ 
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-sm)',
            fontSize: 'var(--font-size-h3)'
          }}>
            VIN: {claim.vehicle.vin}
          </Typography>
          <Typography variant="body" style={{ 
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-small)'
          }}>
            We&apos;ll use this to help identify your vehicle
          </Typography>
        </Card>

        {/* Vehicle Info Form */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)',
          marginBottom: 'var(--space-xl)'
        }}>
          <Typography variant="h3" style={{ 
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-sm)',
            fontSize: 'var(--font-size-h3)'
          }}>
            Vehicle Details
          </Typography>

          {/* Make and Model */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-md)'
          }}>
            <div>
              <Typography variant="body" style={{ 
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-xs)',
                fontSize: 'var(--font-size-small)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                Make
              </Typography>
              <Input
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g., Honda"
                size="lg"
              />
            </div>
            
            <div>
              <Typography variant="body" style={{ 
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-xs)',
                fontSize: 'var(--font-size-small)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                Model
              </Typography>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., Accord"
                size="lg"
              />
            </div>
          </div>

          {/* Year and Color */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-md)'
          }}>
            <div>
              <Typography variant="body" style={{ 
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-xs)',
                fontSize: 'var(--font-size-small)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                Year
              </Typography>
              <Input
                type="number"
                value={year.toString()}
                onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                min={1900}
                max={new Date().getFullYear() + 1}
                size="lg"
              />
            </div>
            
            <div>
              <Typography variant="body" style={{ 
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-xs)',
                fontSize: 'var(--font-size-small)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                Color
              </Typography>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Silver"
                size="lg"
              />
            </div>
          </div>

          <Typography variant="caption" style={{ 
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-small)',
            fontStyle: 'italic'
          }}>
            All fields are optional. You can skip this step if you prefer.
          </Typography>
        </div>

        {/* Continue Button */}
        <div style={{ 
          position: 'sticky',
          bottom: 'var(--space-md)',
          marginTop: 'auto'
        }}>
          <Button
            variant="primary"
            size="lg"
            disabled={saving}
            onClick={handleContinue}
            style={{
              width: '100%'
            }}
          >
            {saving ? 'Saving...' : 'Continue to Photos'}
          </Button>
        </div>
      </div>
    </div>
  );
}