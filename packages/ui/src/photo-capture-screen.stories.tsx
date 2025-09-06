import type { Meta, StoryObj } from '@storybook/react';
import { PhotoCaptureScreen } from './photo-capture-screen';
import { useState } from 'react';
import { Button } from './button';

const meta: Meta<typeof PhotoCaptureScreen> = {
  title: 'Components/PhotoCaptureScreen',
  component: PhotoCaptureScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A specialized camera capture screen for vehicle assessment workflows. Built on the CameraCapture foundation with added features:

- **Customizable header and footer text**
- **Progress indicators** 
- **Semi-transparent overlays**
- **Bottom-right capture button positioning** (as per mockup requirements)
- **Optional blur detection**
- **Mobile-first responsive design**

## Key Features

- **Mobile-optimized**: Touch targets follow mobile accessibility standards (44px minimum)
- **PWA-ready**: Offline-first design with proper fallbacks
- **Blur Detection**: Optional image quality analysis
- **Flexible Layout**: Customizable header, progress, and footer content
- **Overlay Support**: Semi-transparent color overlays for visual guidance

## Use Cases

- VIN Entry screen's VIN Scanning feature
- Photo Guide screen for vehicle assessment positions
- Any workflow requiring guided photo capture with context
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the capture screen is open/visible'
    },
    headerText: {
      control: 'text',
      description: 'Header text displayed at top of screen'
    },
    footerText: {
      control: 'text', 
      description: 'Footer text displayed at bottom of screen'
    },
    progressText: {
      control: 'text',
      description: 'Progress text (e.g., "2/10 photos complete")'
    },
    overlayColor: {
      control: 'color',
      description: 'CSS color for semi-transparent overlay'
    },
    enableBlurDetection: {
      control: 'boolean',
      description: 'Whether to enable blur detection'
    },
    blurThreshold: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Blur detection threshold (0-100, lower = more sensitive)'
    },
    facingMode: {
      control: 'select',
      options: ['user', 'environment'],
      description: 'Camera facing mode'
    },
    quality: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.1 },
      description: 'Photo quality (0-1)'
    },
    allowFallbackUpload: {
      control: 'boolean',
      description: 'Allow fallback file upload'
    }
  },
};

export default meta;
type Story = StoryObj<typeof PhotoCaptureScreen>;

// Base story with interactive controls
const PhotoCaptureScreenWithControls = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<Array<{ blob: Blob, isBlurry?: boolean }>>([]);
  const [blurResults, setBlurResults] = useState<string[]>([]);

  const handleCapture = (photoBlob: Blob, isBlurry?: boolean) => {
    console.log('Photo captured:', { size: photoBlob.size, isBlurry });
    setCapturedPhotos(prev => [...prev, { blob: photoBlob, isBlurry }]);
    setIsOpen(false);
    
    // Add blur result to log
    if (isBlurry !== undefined) {
      setBlurResults(prev => [...prev, `Photo ${prev.length + 1}: ${isBlurry ? 'Blurry' : 'Sharp'}`]);
    }
  };

  const handleError = (error: string) => {
    console.error('Camera error:', error);
    alert(`Camera Error: ${error}`);
  };

  const handleBlurDetected = (isBlurry: boolean) => {
    console.log('Blur detected:', isBlurry);
  };

  return (
    <div style={{ padding: '16px' }}>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="primary"
        style={{ marginBottom: '16px' }}
      >
        Open Photo Capture Screen
      </Button>
      
      {capturedPhotos.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h3>Captured Photos: {capturedPhotos.length}</h3>
          {blurResults.length > 0 && (
            <div>
              <h4>Blur Detection Results:</h4>
              <ul>
                {blurResults.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <PhotoCaptureScreen
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCapture={handleCapture}
        onError={handleError}
        onBlurDetected={handleBlurDetected}
      />
    </div>
  );
};

export const Default: Story = {
  render: PhotoCaptureScreenWithControls,
  args: {
    headerText: 'Take Photo',
    facingMode: 'environment',
    quality: 0.8,
    enableBlurDetection: false,
    blurThreshold: 30,
    allowFallbackUpload: true,
  },
};

export const VINScanner: Story = {
  render: PhotoCaptureScreenWithControls,
  args: {
    headerText: 'VIN Scanner',
    footerText: 'Position the VIN clearly in the camera view',
    progressText: '1/1 VIN photo required',
    overlayColor: '#3B82F6', // Blue overlay
    enableBlurDetection: true,
    blurThreshold: 40, // More sensitive for VIN reading
    facingMode: 'environment',
    quality: 0.9, // Higher quality for text recognition
  },
};

export const VehicleAssessment: Story = {
  render: PhotoCaptureScreenWithControls,
  args: {
    headerText: 'LF Corner',
    footerText: 'Capture the left front corner damage clearly',
    progressText: '3/10 photos complete',
    overlayColor: '#F59E0B', // Amber overlay for damage assessment
    enableBlurDetection: true,
    blurThreshold: 25, // Sensitive blur detection for damage clarity
    facingMode: 'environment',
    quality: 0.8,
  },
};

export const InteriorPhoto: Story = {
  render: PhotoCaptureScreenWithControls,
  args: {
    headerText: 'Interior Dashboard',
    footerText: 'Show odometer and dashboard condition',
    progressText: '7/10 photos complete',
    overlayColor: '#10B981', // Green overlay
    enableBlurDetection: true,
    blurThreshold: 35,
    facingMode: 'environment',
    quality: 0.8,
  },
};

export const WithoutBlurDetection: Story = {
  render: PhotoCaptureScreenWithControls,
  args: {
    headerText: 'Quick Photo',
    footerText: 'Tap the button to capture',
    enableBlurDetection: false,
    facingMode: 'environment',
    quality: 0.7,
  },
};

export const FrontCamera: Story = {
  render: PhotoCaptureScreenWithControls,
  args: {
    headerText: 'Front Camera Mode',
    footerText: 'Using front-facing camera',
    facingMode: 'user',
    enableBlurDetection: false,
    quality: 0.8,
  },
};

export const HighQualityCapture: Story = {
  render: PhotoCaptureScreenWithControls,
  args: {
    headerText: 'High Quality Capture',
    footerText: 'Maximum quality for important documentation',
    progressText: '1/3 high-res photos',
    enableBlurDetection: true,
    blurThreshold: 20, // Very sensitive
    facingMode: 'environment',
    quality: 1.0, // Maximum quality
    maxWidth: 2560,
    maxHeight: 1440,
  },
};

export const CustomOverlayColors: Story = {
  render: PhotoCaptureScreenWithControls,
  args: {
    headerText: 'Custom Overlay Demo',
    footerText: 'Different overlay colors for different contexts',
    overlayColor: '#DC2626', // Red overlay for critical areas
    enableBlurDetection: false,
    facingMode: 'environment',
    quality: 0.8,
  },
};

export const MinimalInterface: Story = {
  render: PhotoCaptureScreenWithControls,
  args: {
    headerText: 'Photo',
    enableBlurDetection: false,
    facingMode: 'environment',
    quality: 0.8,
    // No footer, progress, or overlay - minimal interface
  },
};

export const ComplexWorkflow: Story = {
  render: PhotoCaptureScreenWithControls,
  args: {
    headerText: 'RF Wheel Well Damage',
    footerText: 'Include tire condition and suspension components in frame',
    progressText: '8/15 photos complete - Damage Documentation',
    overlayColor: '#7C3AED', // Purple overlay
    enableBlurDetection: true,
    blurThreshold: 30,
    facingMode: 'environment',
    quality: 0.85,
  },
};

// Story showing error handling
export const ErrorDemo: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleError = (error: string) => {
      console.error('Intentional error for demo:', error);
      // Keep the error visible for demo purposes
    };

    return (
      <div style={{ padding: '16px' }}>
        <Button 
          onClick={() => setIsOpen(true)}
          variant="primary"
        >
          Open Photo Capture (Error Demo)
        </Button>
        
        <p style={{ margin: '16px 0', color: '#666' }}>
          This story demonstrates error handling. The component will show error states 
          if camera permissions are denied or camera is not available.
        </p>

        <PhotoCaptureScreen
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onCapture={() => {}}
          onError={handleError}
        />
      </div>
    );
  },
  args: {
    headerText: 'Error Handling Demo',
    footerText: 'This will show error states if camera is unavailable',
    allowFallbackUpload: true,
    enableBlurDetection: false,
  },
};

// Performance test with blur detection
export const BlurDetectionPerformance: Story = {
  render: PhotoCaptureScreenWithControls,
  args: {
    headerText: 'Blur Detection Performance Test',
    footerText: 'Testing blur detection with various thresholds',
    progressText: 'Performance testing mode',
    enableBlurDetection: true,
    blurThreshold: 50, // Medium sensitivity for testing
    facingMode: 'environment',
    quality: 0.8,
  },
  parameters: {
    docs: {
      description: {
        story: 'This story tests the blur detection performance. Take multiple photos to see how blur detection performs with different image qualities.'
      }
    }
  }
};