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
        component: 'A responsive grid showing photo positions with progress indicators. Adapts to different screen sizes: 3 columns on mobile (< 640px), 4 columns on tablet and desktop (≥ 640px). Shows completion status, current position, and required vs optional indicators.',
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
    isLoading: {
      control: 'boolean',
      description: 'Loading state for the grid',
    },
    onPhotoError: {
      description: 'Callback when a photo fails to render',
      action: 'photo error',
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

// Story: Loading State
export const Loading: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('front_overall');
    
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'var(--space-lg)' }}>
        <PhotoProgressGrid
          positions={MOCK_POSITIONS}
          photos={MOCK_PHOTOS}
          currentPositionId={currentPositionId}
          onPositionSelect={setCurrentPositionId}
          isLoading={true}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Loading state shows disabled buttons with reduced opacity.
        </div>
      </div>
    );
  },
};

// Story: Invalid Photo Data
export const WithInvalidPhotos: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('rear_overall');
    
    const photosWithErrors = [
      ...MOCK_PHOTOS.slice(0, 1), // Keep one valid photo
      {
        positionId: 'rear_overall',
        dataUrl: 'invalid-data-url', // Invalid format
        timestamp: new Date(),
      },
      {
        positionId: 'driver_side_overall',
        dataUrl: 'data:image/jpeg;base64,corrupted-base64', // Corrupted base64
        timestamp: new Date(),
      },
    ];
    
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'var(--space-lg)' }}>
        <PhotoProgressGrid
          positions={MOCK_POSITIONS}
          photos={photosWithErrors}
          currentPositionId={currentPositionId}
          onPositionSelect={setCurrentPositionId}
          onPhotoError={(positionId, error) => console.error('Photo error for position:', positionId, error)}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          This demonstrates error handling for corrupted or invalid photo data. Check the console for error logs.
        </div>
      </div>
    );
  },
};

// Story: Mixed Photo States
export const MixedPhotoStates: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('interior_front_seats');
    
    const mixedPhotos = [
      MOCK_PHOTOS[0], // Valid photo
      {
        positionId: 'rear_overall',
        dataUrl: 'data:image/svg+xml;base64,aW52YWxpZA==', // Invalid content but valid format
        timestamp: new Date(),
      },
      {
        positionId: 'driver_side_overall',
        dataUrl: 'not-a-data-url', // Completely invalid
        timestamp: new Date(),
      },
    ];
    
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'var(--space-lg)' }}>
        <PhotoProgressGrid
          positions={MOCK_POSITIONS}
          photos={mixedPhotos}
          currentPositionId={currentPositionId}
          onPositionSelect={setCurrentPositionId}
          onPhotoError={(positionId, error) => console.error('Photo error:', positionId, error.message)}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Grid showing a mix of valid photos (✓), corrupted photos (⚠️), and empty positions.
        </div>
      </div>
    );
  },
};

// Story: Error Boundary Test
export const WithErrorBoundary: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('front_overall');
    // Import ErrorBoundary dynamically
    const { ErrorBoundary } = eval('require("./error-boundary")') as { ErrorBoundary: React.ComponentType<any> };
    
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'var(--space-lg)' }}>
        <ErrorBoundary onError={(error: Error) => console.error('Caught error:', error)}>
          <PhotoProgressGrid
            positions={MOCK_POSITIONS}
            photos={MOCK_PHOTOS}
            currentPositionId={currentPositionId}
            onPositionSelect={setCurrentPositionId}
          />
        </ErrorBoundary>
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Grid wrapped with ErrorBoundary component for graceful error handling.
        </div>
      </div>
    );
  },
};

// Story: Edge Cases - Test with empty arrays
export const EdgeCases: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('front_overall');
    
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: 'var(--space-lg)' }}>
        {/* Test with empty positions and photos arrays */}
        <PhotoProgressGrid
          positions={[]}
          photos={[]}
          currentPositionId={currentPositionId}
          onPositionSelect={setCurrentPositionId}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          This demonstrates the component behavior with empty positions and photos arrays.
        </div>
      </div>
    );
  },
};

// Story: Responsive Mobile View
export const MobileView: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('front_overall');
    
    return (
      <div style={{ width: '100%', padding: 'var(--space-sm)' }}>
        <PhotoProgressGrid
          positions={MOCK_POSITIONS}
          photos={MOCK_PHOTOS}
          currentPositionId={currentPositionId}
          onPositionSelect={setCurrentPositionId}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Mobile view (&lt; 640px): 3-column grid with optimized spacing
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
        story: 'Shows the grid in mobile viewport (375px width) with 3 columns and mobile-optimized spacing.',
      },
    },
  },
};

// Story: Responsive Tablet View
export const TabletView: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('passenger_side_overall');
    
    return (
      <div style={{ width: '100%', padding: 'var(--space-md)' }}>
        <PhotoProgressGrid
          positions={MOCK_POSITIONS}
          photos={MOCK_PHOTOS}
          currentPositionId={currentPositionId}
          onPositionSelect={setCurrentPositionId}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Tablet view (≥ 640px): 4-column grid with standard spacing
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
        story: 'Shows the grid in tablet viewport (768px width) with 4 columns and standard spacing.',
      },
    },
  },
};

// Story: Responsive Desktop View
export const DesktopView: Story = {
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('rear_overall');
    
    return (
      <div style={{ width: '100%', maxWidth: '600px', padding: 'var(--space-lg)' }}>
        <PhotoProgressGrid
          positions={MOCK_POSITIONS}
          photos={MOCK_PHOTOS}
          currentPositionId={currentPositionId}
          onPositionSelect={setCurrentPositionId}
        />
        
        <div style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Desktop view (≥ 640px): 4-column grid with generous spacing
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
        story: 'Shows the grid in desktop viewport (1200px width) with 4 columns and generous spacing.',
      },
    },
  },
};