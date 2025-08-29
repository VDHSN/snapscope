import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PhotoPreviewGrid } from './photo-preview-grid';
import { Button } from './button';
import { Typography } from './typography';

const meta: Meta<typeof PhotoPreviewGrid> = {
  title: 'Components/PhotoPreviewGrid',
  component: PhotoPreviewGrid,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A grid component for displaying photo positions with progress tracking. Shows completed photos as thumbnails and highlights the current position.',
      },
    },
  },
  argTypes: {
    columns: {
      control: { type: 'number', min: 2, max: 6, step: 1 },
      description: 'Number of columns in the grid',
    },
    showLabels: {
      control: 'boolean',
      description: 'Whether to show position labels below thumbnails',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant for the grid items',
    },
    currentPositionId: {
      control: 'text',
      description: 'ID of the currently active position',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhotoPreviewGrid>;

// Mock data for stories
const mockPositions = [
  { id: 'front', name: 'Front View', order: 1, required: true },
  { id: 'rear', name: 'Rear View', order: 2, required: true },
  { id: 'driver_side', name: 'Driver Side', order: 3, required: true },
  { id: 'passenger_side', name: 'Passenger Side', order: 4, required: true },
  { id: 'interior_front', name: 'Front Interior', order: 5, required: true },
  { id: 'interior_rear', name: 'Rear Interior', order: 6, required: true },
  { id: 'dashboard', name: 'Dashboard', order: 7, required: true },
  { id: 'damage_1', name: 'Damage Area', order: 8, required: false },
];

const mockPhotos = [
  { 
    positionId: 'front', 
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100&h=100&fit=crop'
  },
  { 
    positionId: 'rear', 
    url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=100&h=100&fit=crop'
  },
  { 
    positionId: 'driver_side', 
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop'
  },
];

// Interactive story wrapper
const PhotoGridDemo: React.FC<{
  columns?: number;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  initialPhotos?: typeof mockPhotos;
}> = ({ 
  columns = 4, 
  showLabels = false, 
  size = 'md',
  initialPhotos = mockPhotos 
}) => {
  const [currentPositionId, setCurrentPositionId] = useState('passenger_side');
  const [photos, setPhotos] = useState(initialPhotos);

  const handlePositionSelect = (positionId: string) => {
    setCurrentPositionId(positionId);
  };

  const simulatePhotoCapture = () => {
    if (!photos.find(p => p.positionId === currentPositionId)) {
      const newPhoto = {
        positionId: currentPositionId,
        url: `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`,
        thumbnail: `https://images.unsplash.com/photo-${Date.now()}?w=100&h=100&fit=crop`
      };
      setPhotos(prev => [...prev, newPhoto]);
      
      // Move to next position
      const currentIndex = mockPositions.findIndex(p => p.id === currentPositionId);
      const nextPosition = mockPositions[currentIndex + 1];
      if (nextPosition && !photos.find(p => p.positionId === nextPosition.id)) {
        setCurrentPositionId(nextPosition.id);
      }
    }
  };

  const resetDemo = () => {
    setPhotos(initialPhotos);
    setCurrentPositionId('passenger_side');
  };

  const completedCount = photos.length;
  const requiredCount = mockPositions.filter(p => p.required).length;
  const progress = (completedCount / requiredCount) * 100;

  return (
    <div style={{ 
      padding: 'var(--space-lg)', 
      maxWidth: '600px',
      background: 'var(--bg-primary)',
      borderRadius: 'var(--border-radius-md)',
    }}>
      <Typography variant="h3" style={{ marginBottom: 'var(--space-md)' }}>
        Photo Progress Demo
      </Typography>
      
      <div style={{ 
        marginBottom: 'var(--space-lg)',
        padding: 'var(--space-md)',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--border-radius-sm)',
      }}>
        <Typography variant="body" style={{ marginBottom: 'var(--space-sm)' }}>
          Progress: {completedCount} of {requiredCount} required photos ({Math.round(progress)}%)
        </Typography>
        <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>
          Current position: {mockPositions.find(p => p.id === currentPositionId)?.name}
        </Typography>
      </div>

      <PhotoPreviewGrid
        positions={mockPositions}
        photos={photos}
        currentPositionId={currentPositionId}
        onPositionSelect={handlePositionSelect}
        columns={columns}
        showLabels={showLabels}
        size={size}
        style={{ marginBottom: 'var(--space-lg)' }}
      />

      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-md)', 
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <Button
          variant="primary"
          onClick={simulatePhotoCapture}
          disabled={!!photos.find(p => p.positionId === currentPositionId)}
        >
          {photos.find(p => p.positionId === currentPositionId) ? 'Photo Taken' : 'Take Photo'}
        </Button>
        <Button variant="secondary" onClick={resetDemo}>
          Reset Demo
        </Button>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <PhotoGridDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Default photo preview grid with 4 columns. Click on positions to select them, and use "Take Photo" to simulate photo capture.',
      },
    },
  },
};

export const WithLabels: Story = {
  render: () => <PhotoGridDemo showLabels={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Photo grid with position labels displayed below each thumbnail.',
      },
    },
  },
};

export const Compact: Story = {
  render: () => <PhotoGridDemo size="sm" columns={6} />,
  parameters: {
    docs: {
      description: {
        story: 'Compact grid with smaller thumbnails and more columns for space-constrained layouts.',
      },
    },
  },
};

export const Large: Story = {
  render: () => <PhotoGridDemo size="lg" columns={3} showLabels={true} />,
  parameters: {
    docs: {
      description: {
        story: 'Large grid with bigger thumbnails, fewer columns, and labels for better visibility.',
      },
    },
  },
};

export const AllCompleted: Story = {
  render: () => (
    <PhotoGridDemo 
      initialPhotos={mockPositions.slice(0, 7).map(pos => ({
        positionId: pos.id,
        url: `https://images.unsplash.com/photo-${pos.order}?w=400&h=300&fit=crop`,
        thumbnail: `https://images.unsplash.com/photo-${pos.order}?w=100&h=100&fit=crop`
      }))}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grid showing all required photos completed - demonstrates the completed state.',
      },
    },
  },
};

export const EmptyGrid: Story = {
  render: () => <PhotoGridDemo initialPhotos={[]} />,
  parameters: {
    docs: {
      description: {
        story: 'Empty grid showing initial state with no photos captured yet.',
      },
    },
  },
};

// Static stories without interactivity
export const StaticView: Story = {
  args: {
    positions: mockPositions.slice(0, 6),
    photos: mockPhotos,
    currentPositionId: 'passenger_side',
    columns: 3,
    showLabels: true,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Static view of the photo grid component without interactive functionality.',
      },
    },
  },
};

export const MobileLayout: Story = {
  render: () => (
    <div style={{ maxWidth: '320px', margin: '0 auto' }}>
      <PhotoGridDemo columns={3} size="sm" showLabels={false} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Mobile-optimized layout with 3 columns and compact sizing.',
      },
    },
  },
};