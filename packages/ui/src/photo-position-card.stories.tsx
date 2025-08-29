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
        component: 'A card component for displaying photo positions in the vehicle assessment flow. Shows position details, photo preview, and action buttons.',
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