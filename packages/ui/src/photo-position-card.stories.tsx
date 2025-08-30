import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PhotoPositionCard } from './photo-position-card';
import { CameraCapture } from './camera-capture';
import { MOCK_POSITIONS, MOCK_PHOTOS } from './photo-guide-types';

const meta: Meta<typeof PhotoPositionCard> = {
  title: 'Photo Guide/PhotoPositionCard',
  component: PhotoPositionCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A responsive card component for displaying photo positions in the vehicle assessment flow. Adapts photo preview height for different screen sizes: 200px on mobile (< 640px), 240px on tablet/desktop (≥ 640px). Shows position details, photo preview, and action buttons with mobile-optimized layout.',
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
  argTypes: {
    position: { control: false },
    photo: { control: false },
    isSaving: { control: 'boolean' },
    onTakePhoto: { action: 'take photo' },
    onRetakePhoto: { action: 'retake photo' },
    onSkip: { action: 'skip' },
    onImageError: { action: 'image error' },
    isLoading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PhotoPositionCard>;

// Story: Empty State
export const Empty: Story = {
  render: (args) => {
    const [showCamera, setShowCamera] = useState(false);
    
    return (
      <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
        <PhotoPositionCard
          {...args}
          position={MOCK_POSITIONS[0]}
          onTakePhoto={() => setShowCamera(true)}
        />
        <CameraCapture
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={(_blob) => {
            console.log('Photo captured:', _blob);
            setShowCamera(false);
          }}
          onError={(error) => console.error('Camera error:', error)}
          facingMode="environment"
        />
      </div>
    );
  },
  args: {
    isSaving: false,
  },
};

// Story: With Photo
export const WithPhoto: Story = {
  render: (args) => (
    <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
      <PhotoPositionCard
        {...args}
        position={MOCK_POSITIONS[0]}
        photo={MOCK_PHOTOS[0]}
        onTakePhoto={() => console.log('Retake photo')}
        onRetakePhoto={() => console.log('Retake photo')}
      />
    </div>
  ),
  args: {
    isSaving: false,
  },
};

// Story: Optional Position
export const Optional: Story = {
  render: (args) => (
    <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
      <PhotoPositionCard
        {...args}
        position={MOCK_POSITIONS[8]} // Optional damage photo
        onTakePhoto={() => console.log('Take photo')}
        onSkip={() => console.log('Skip optional photo')}
      />
    </div>
  ),
  args: {
    isSaving: false,
  },
};

// Story: Saving State
export const Saving: Story = {
  render: (args) => (
    <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
      <PhotoPositionCard
        {...args}
        position={MOCK_POSITIONS[0]}
        onTakePhoto={() => console.log('Take photo')}
      />
    </div>
  ),
  args: {
    isSaving: true,
  },
};

// Story: Loading State
export const Loading: Story = {
  render: (args) => (
    <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
      <PhotoPositionCard
        {...args}
        position={MOCK_POSITIONS[0]}
        onTakePhoto={() => console.log('Take photo')}
      />
    </div>
  ),
  args: {
    isLoading: true,
  },
};

// Story: Invalid Photo Data URL
export const InvalidPhotoData: Story = {
  render: (args) => (
    <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
      <PhotoPositionCard
        {...args}
        position={MOCK_POSITIONS[0]}
        photo={{
          positionId: 'front_overall',
          dataUrl: 'invalid-data-url',
          timestamp: new Date(),
        }}
        onTakePhoto={() => console.log('Retake photo')}
        onRetakePhoto={() => console.log('Retake photo')}
      />
    </div>
  ),
  args: {
    isSaving: false,
  },
};

// Story: Corrupted Base64 Data
export const CorruptedPhotoData: Story = {
  render: (args) => (
    <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
      <PhotoPositionCard
        {...args}
        position={MOCK_POSITIONS[0]}
        photo={{
          positionId: 'front_overall',
          dataUrl: 'data:image/jpeg;base64,corrupted-base64-data',
          timestamp: new Date(),
        }}
        onTakePhoto={() => console.log('Retake photo')}
        onRetakePhoto={() => console.log('Retake photo')}
      />
    </div>
  ),
  args: {
    isSaving: false,
  },
};

// Story: Image Load Error (Simulated)
export const ImageLoadError: Story = {
  render: (args) => (
    <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
      <PhotoPositionCard
        {...args}
        position={MOCK_POSITIONS[0]}
        photo={{
          positionId: 'front_overall',
          // Use a valid data URL format but with content that will fail to load as image
          dataUrl: 'data:image/svg+xml;base64,aW52YWxpZA==', // "invalid" in base64
          timestamp: new Date(),
        }}
        onTakePhoto={() => console.log('Retake photo')}
        onRetakePhoto={() => console.log('Retake photo')}
      />
    </div>
  ),
  args: {
    isSaving: false,
  },
};

// Story: Error Boundary Test
export const WithErrorBoundary: Story = {
  render: (args) => {
    // Import ErrorBoundary dynamically
    const { ErrorBoundary } = eval('require("./error-boundary")') as { ErrorBoundary: React.ComponentType<any> };
    
    return (
      <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
        <ErrorBoundary onError={(error: Error) => console.error('Caught error:', error)}>
          <PhotoPositionCard
            {...args}
            position={MOCK_POSITIONS[0]}
            photo={MOCK_PHOTOS[0]}
            onTakePhoto={() => console.log('Take photo')}
          />
        </ErrorBoundary>
      </div>
    );
  },
  args: {
    isSaving: false,
  },
};

// Story: Responsive Mobile View
export const MobileView: Story = {
  render: (args) => {
    return (
      <div style={{ width: '100%', padding: 'var(--space-sm)' }}>
        <PhotoPositionCard
          {...args}
          position={MOCK_POSITIONS[0]}
          photo={MOCK_PHOTOS[0]}
          onTakePhoto={() => console.log('Retake photo')}
          onRetakePhoto={() => console.log('Retake photo')}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Mobile view: 200px photo height, reduced padding, optimized for touch
        </div>
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Shows the card in mobile viewport with 200px photo preview height and mobile-optimized spacing.',
      },
    },
  },
  args: {
    isSaving: false,
  },
};

// Story: Responsive Mobile - Stacked Buttons
export const MobileStackedButtons: Story = {
  render: (args) => {
    return (
      <div style={{ width: '320px', padding: 'var(--space-xs)' }}>
        <PhotoPositionCard
          {...args}
          position={MOCK_POSITIONS[8]} // Optional position with skip button
          onTakePhoto={() => console.log('Take photo')}
          onSkip={() => console.log('Skip optional photo')}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Small mobile (320px): Buttons stack vertically for better touch targets
        </div>
      </div>
    );
  },
  parameters: {
    viewport: {
      viewports: {
        smallMobile: {
          name: 'Small Mobile',
          styles: {
            width: '320px',
            height: '568px',
          },
        },
      },
      defaultViewport: 'smallMobile',
    },
    docs: {
      description: {
        story: 'Shows the card on very small screens (320px) where buttons stack vertically for better usability.',
      },
    },
  },
  args: {
    isSaving: false,
  },
};

// Story: Responsive Tablet View
export const TabletView: Story = {
  render: (args) => {
    return (
      <div style={{ width: '100%', maxWidth: '600px', padding: 'var(--space-md)' }}>
        <PhotoPositionCard
          {...args}
          position={MOCK_POSITIONS[1]}
          photo={MOCK_PHOTOS[0]}
          onTakePhoto={() => console.log('Retake photo')}
          onRetakePhoto={() => console.log('Retake photo')}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Tablet view: 240px photo height, standard padding, side-by-side buttons
        </div>
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Shows the card in tablet viewport with 240px photo preview height and standard spacing.',
      },
    },
  },
  args: {
    isSaving: false,
  },
};

// Story: Responsive Desktop View
export const DesktopView: Story = {
  render: (args) => {
    return (
      <div style={{ width: '100%', maxWidth: '800px', padding: 'var(--space-lg)' }}>
        <PhotoPositionCard
          {...args}
          position={MOCK_POSITIONS[2]}
          onTakePhoto={() => console.log('Take photo')}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)', textAlign: 'center' }}>
          Desktop view: 240px photo height, generous padding, optimal for larger screens
        </div>
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Shows the card in desktop viewport with 240px photo preview height and generous spacing.',
      },
    },
  },
  args: {
    isSaving: false,
  },
};