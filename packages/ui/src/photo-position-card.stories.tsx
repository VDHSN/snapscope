import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PhotoPositionCard } from './photo-position-card';
import { CameraCapture } from './camera-capture';
import { Card } from './card';
import { Typography } from './typography';
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

// Story: Null Position (Loading State)
export const NullPosition: Story = {
  render: (args) => (
    <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
      {/* Show a loading placeholder when position is null instead of passing null to component */}
      <Card elevation={2} padding="lg">
        <div style={{ textAlign: 'center' }}>
          <Typography variant="body" style={{ color: 'var(--text-secondary)' }}>
            Loading position...
          </Typography>
        </div>
      </Card>
    </div>
  ),
  args: {
    isSaving: false,
  },
};