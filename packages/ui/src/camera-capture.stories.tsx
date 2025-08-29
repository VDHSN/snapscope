import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { CameraCapture } from './camera-capture';
import { Button } from './button';
import { Typography } from './typography';

const meta: Meta<typeof CameraCapture> = {
  title: 'Components/CameraCapture',
  component: CameraCapture,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A camera capture component that uses MediaDevices API to take photos. Supports front/back camera switching and handles various error states.',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the camera modal is open',
    },
    facingMode: {
      control: 'select',
      options: ['user', 'environment'],
      description: 'Camera facing mode - user for front camera, environment for rear camera',
    },
    quality: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.1 },
      description: 'JPEG quality for captured photos (0.1 - 1.0)',
    },
    maxWidth: {
      control: { type: 'number', min: 640, max: 4096, step: 320 },
      description: 'Maximum width for captured photos',
    },
    maxHeight: {
      control: { type: 'number', min: 480, max: 4096, step: 240 },
      description: 'Maximum height for captured photos',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CameraCapture>;

// Interactive story wrapper
const CameraStoryWrapper: React.FC<{
  facingMode?: 'user' | 'environment';
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}> = ({ facingMode = 'environment', quality = 0.8, maxWidth = 1920, maxHeight = 1080 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = (photoBlob: Blob) => {
    const url = URL.createObjectURL(photoBlob);
    setCapturedPhotos(prev => [url, ...prev.slice(0, 4)]); // Keep last 5 photos
    setIsOpen(false);
    setError(null);
    console.log('Photo captured:', { size: photoBlob.size, type: photoBlob.type });
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    console.error('Camera error:', errorMessage);
  };

  return (
    <div style={{ padding: 'var(--space-lg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <Typography variant="h2" style={{ marginBottom: 'var(--space-lg)' }}>
          Camera Capture Demo
        </Typography>
        
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsOpen(true)}
            style={{ width: '100%' }}
          >
            📷 Open Camera
          </Button>
        </div>

        {error && (
          <div style={{
            background: 'var(--color-error-bg)',
            border: '1px solid var(--color-error)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
          }}>
            <Typography variant="body" style={{ color: 'var(--color-error)' }}>
              <strong>Error:</strong> {error}
            </Typography>
          </div>
        )}

        {capturedPhotos.length > 0 && (
          <div>
            <Typography variant="h3" style={{ marginBottom: 'var(--space-md)' }}>
              Captured Photos ({capturedPhotos.length})
            </Typography>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 'var(--space-sm)',
            }}>
              {capturedPhotos.map((url, index) => (
                <div key={url} style={{
                  aspectRatio: '1',
                  borderRadius: 'var(--border-radius-md)',
                  overflow: 'hidden',
                  border: '2px solid var(--border-color)',
                }}>
                  <img
                    src={url}
                    alt={`Captured photo ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCapturedPhotos([])}
              style={{ marginTop: 'var(--space-md)' }}
            >
              Clear Photos
            </Button>
          </div>
        )}
      </div>

      <CameraCapture
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCapture={handleCapture}
        onError={handleError}
        facingMode={facingMode}
        quality={quality}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <CameraStoryWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Default camera capture with rear-facing camera (environment mode). Click "Open Camera" to test the camera functionality.',
      },
    },
  },
};

export const FrontCamera: Story = {
  render: () => <CameraStoryWrapper facingMode="user" />,
  parameters: {
    docs: {
      description: {
        story: 'Camera capture configured for front-facing camera (user mode). Useful for selfies or user-facing scenarios.',
      },
    },
  },
};

export const HighQuality: Story = {
  render: () => <CameraStoryWrapper quality={1.0} maxWidth={4096} maxHeight={3072} />,
  parameters: {
    docs: {
      description: {
        story: 'High quality photo capture with maximum resolution and quality settings. Results in larger file sizes.',
      },
    },
  },
};

export const LowQuality: Story = {
  render: () => <CameraStoryWrapper quality={0.5} maxWidth={1280} maxHeight={720} />,
  parameters: {
    docs: {
      description: {
        story: 'Lower quality photo capture for faster processing and smaller file sizes.',
      },
    },
  },
};

// Static story showing the modal appearance
export const ModalAppearance: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close clicked'),
    onCapture: (blob) => console.log('Photo captured:', blob),
    onError: (error) => console.log('Error:', error),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the camera modal appearance. This is a static view - actual camera functionality requires user interaction.',
      },
    },
  },
};

export const ErrorState: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Mock component that always shows error state
    const MockCameraWithError = () => (
      <div style={{ padding: 'var(--space-lg)' }}>
        <Button onClick={() => setIsOpen(true)}>
          Show Camera Error State
        </Button>
        
        {isOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-md)',
              background: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
            }}>
              <Typography variant="h3" style={{ color: 'white' }}>
                Take Photo
              </Typography>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                }}
              >
                ✕
              </Button>
            </div>
            
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 'var(--space-md)',
              color: 'white',
              padding: 'var(--space-lg)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px' }}>⚠️</div>
              <Typography variant="h3" style={{ color: 'white' }}>
                Camera Error
              </Typography>
              <Typography variant="body" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Camera permission denied. Please allow camera access and try again.
              </Typography>
              <Button variant="primary" style={{ marginTop: 'var(--space-md)' }}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    );
    
    return <MockCameraWithError />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the error state when camera access is denied or unavailable.',
      },
    },
  },
};