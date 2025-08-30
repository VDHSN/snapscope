import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PhotoGuideHeader } from './photo-guide-header';
import { PhotoProgressGrid } from './photo-progress-grid';
import { PhotoPositionCard } from './photo-position-card';
import { CameraCapture } from './camera-capture';
import { MOCK_POSITIONS, MOCK_PHOTOS } from './photo-guide-types';
import type { CapturedPhoto } from './photo-guide-types';

const meta: Meta = {
  title: 'Photo Guide/Complete Workflow',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete photo guide workflow demonstrating responsive behavior across all components. Shows header, progress grid, and position card working together seamlessly on different screen sizes.',
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Workflow Component
const PhotoGuideWorkflow: React.FC = () => {
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [photos, setPhotos] = useState<CapturedPhoto[]>(MOCK_PHOTOS);
  const [showCamera, setShowCamera] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentPosition = MOCK_POSITIONS[currentPositionIndex];
  const currentPhoto = photos.find(p => p.positionId === currentPosition?.id);
  const completedCount = photos.filter(photo => 
    MOCK_POSITIONS.some(pos => pos.id === photo.positionId && pos.required)
  ).length;
  const requiredCount = MOCK_POSITIONS.filter(pos => pos.required).length;

  const handlePositionSelect = (positionId: string) => {
    const newIndex = MOCK_POSITIONS.findIndex(pos => pos.id === positionId);
    if (newIndex !== -1) {
      setCurrentPositionIndex(newIndex);
    }
  };

  const handleTakePhoto = () => {
    setShowCamera(true);
  };

  const handleCameraCapture = async (blob: Blob) => {
    setIsSaving(true);
    setShowCamera(false);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Convert blob to data URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      
      const newPhoto: CapturedPhoto = {
        positionId: currentPosition.id,
        dataUrl,
        timestamp: new Date(),
      };
      
      setPhotos(prev => {
        const filtered = prev.filter(p => p.positionId !== currentPosition.id);
        return [...filtered, newPhoto];
      });
      
      setIsSaving(false);
      
      // Auto-advance to next position if available
      if (currentPositionIndex < MOCK_POSITIONS.length - 1) {
        setTimeout(() => {
          setCurrentPositionIndex(prev => prev + 1);
        }, 500);
      }
    };
    reader.readAsDataURL(blob);
  };

  const handleSkip = () => {
    if (currentPositionIndex < MOCK_POSITIONS.length - 1) {
      setCurrentPositionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    console.log('Navigate back to assessment list');
  };

  const handleLogoClick = () => {
    console.log('Navigate to home');
  };

  // Add responsive styles for the workflow
  React.useEffect(() => {
    const workflowStyles = `
      .workflow-main-content {
        padding: var(--space-sm) !important;
      }
      
      @media (min-width: 640px) {
        .workflow-main-content {
          padding: var(--space-md) !important;
        }
      }
      
      @media (min-width: 1024px) {
        .workflow-main-content {
          padding: var(--space-lg) !important;
        }
      }
    `;
    
    if (!document.head.querySelector('#workflow-responsive-styles')) {
      const style = document.createElement('style');
      style.id = 'workflow-responsive-styles';
      style.textContent = workflowStyles;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <PhotoGuideHeader
        currentStep={currentPositionIndex + 1}
        totalSteps={MOCK_POSITIONS.length}
        completedCount={completedCount}
        requiredCount={requiredCount}
        onBack={handleBack}
        onLogoClick={handleLogoClick}
      />

      {/* Main Content */}
      <div style={{ 
        flex: 1,
        padding: 'var(--space-sm)',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
      }}
      className="workflow-main-content"
      >
        {/* Progress Grid */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <PhotoProgressGrid
            positions={MOCK_POSITIONS}
            photos={photos}
            currentPositionId={currentPosition?.id}
            onPositionSelect={handlePositionSelect}
            isLoading={isSaving}
          />
        </div>

        {/* Current Position Card */}
        {currentPosition && (
          <PhotoPositionCard
            position={currentPosition}
            photo={currentPhoto}
            isSaving={isSaving}
            onTakePhoto={handleTakePhoto}
            onRetakePhoto={handleTakePhoto}
            onSkip={!currentPosition.required ? handleSkip : undefined}
          />
        )}
      </div>

      {/* Camera Modal */}
      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
        onError={(error) => {
          console.error('Camera error:', error);
          setShowCamera(false);
        }}
        facingMode="environment"
      />
    </div>
  );
};

export const FullWorkflow: Story = {
  render: () => <PhotoGuideWorkflow />,
  parameters: {
    docs: {
      description: {
        story: 'Complete interactive photo guide workflow showing all components working together responsively. Try taking photos and navigating between positions.',
      },
    },
  },
};

export const MobileWorkflow: Story = {
  render: () => <PhotoGuideWorkflow />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Mobile view of the complete workflow, optimized for touch interaction with 3-column grid and mobile-specific spacing.',
      },
    },
  },
};

export const TabletWorkflow: Story = {
  render: () => <PhotoGuideWorkflow />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet view of the complete workflow with 4-column grid and standard spacing.',
      },
    },
  },
};

export const DesktopWorkflow: Story = {
  render: () => <PhotoGuideWorkflow />,
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Desktop view of the complete workflow with generous spacing and optimal layout for large screens.',
      },
    },
  },
};