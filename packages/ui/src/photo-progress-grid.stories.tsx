import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PhotoProgressGrid } from './photo-progress-grid';
import { MOCK_POSITIONS, MOCK_PHOTOS } from './photo-guide-types';

const meta: Meta<typeof PhotoProgressGrid> = {
  title: 'Photo Guide/PhotoProgressGrid',
  component: PhotoProgressGrid,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A 4x2 grid showing photo positions with progress indicators. Shows completion status, current position, and required vs optional indicators.',
      },
    },
  },
  argTypes: {
    positions: {
      description: 'Array of photo positions to display in the grid',
    },
    photos: {
      description: 'Array of captured photos to show completion status',
    },
    currentPositionId: {
      description: 'ID of the currently selected position',
    },
    onPositionSelect: {
      description: 'Callback when a position is selected in the grid',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhotoProgressGrid>;

// Story: Empty - No photos captured
export const Empty: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('front_overall');
    
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'var(--space-lg)' }}>
        <PhotoProgressGrid
          positions={MOCK_POSITIONS}
          photos={[]}
          currentPositionId={currentPositionId}
          onPositionSelect={setCurrentPositionId}
        />
      </div>
    );
  },
};

// Story: Partial - Some photos captured
export const Partial: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('passenger_side_overall');
    
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'var(--space-lg)' }}>
        <PhotoProgressGrid
          positions={MOCK_POSITIONS}
          photos={MOCK_PHOTOS}
          currentPositionId={currentPositionId}
          onPositionSelect={setCurrentPositionId}
        />
      </div>
    );
  },
};

// Story: Complete - All required photos captured
export const Complete: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('odometer');
    
    // Create completed photos for all required positions
    const completedPhotos = MOCK_POSITIONS
      .filter(p => p.required)
      .map(position => ({
        positionId: position.id,
        dataUrl: `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#${Math.floor(Math.random()*16777215).toString(16)}"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">${position.name}</text></svg>`)}`,
        timestamp: new Date(),
      }));
    
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'var(--space-lg)' }}>
        <PhotoProgressGrid
          positions={MOCK_POSITIONS}
          photos={completedPhotos}
          currentPositionId={currentPositionId}
          onPositionSelect={setCurrentPositionId}
        />
      </div>
    );
  },
};

// Story: Interactive - Demonstrates the selection interaction
export const Interactive: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('front_overall');
    const [photos] = useState(MOCK_PHOTOS);
    
    const handlePositionSelect = (positionId: string) => {
      setCurrentPositionId(positionId);
      console.log('Selected position:', positionId);
    };
    
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'var(--space-lg)' }}>
        <PhotoProgressGrid
          positions={MOCK_POSITIONS}
          photos={photos}
          currentPositionId={currentPositionId}
          onPositionSelect={handlePositionSelect}
        />
        
        <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-sm)' }}>
          <strong>Current Selection:</strong> {MOCK_POSITIONS.find(p => p.id === currentPositionId)?.name}
        </div>
      </div>
    );
  },
};

// Story: Defensive Coding - Test with null/undefined values
export const DefensiveCoding: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('front_overall');
    
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'var(--space-lg)' }}>
        {/* Test with undefined positions and photos */}
        <PhotoProgressGrid
          positions={undefined as any}
          photos={undefined as any}
          currentPositionId={currentPositionId}
          onPositionSelect={setCurrentPositionId}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          This demonstrates the defensive coding with null/undefined positions and photos arrays.
        </div>
      </div>
    );
  },
};