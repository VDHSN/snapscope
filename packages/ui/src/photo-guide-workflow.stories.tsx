import type { Meta, StoryObj } from '@storybook/react';
import { useState, useMemo } from 'react';
import { PhotoGuideHeader } from './photo-guide-header';
import { PhotoPositionCard } from './photo-position-card';
import { PhotoProgressGrid } from './photo-progress-grid';
import { CameraCapture } from './camera-capture';
import { Button } from './button';
import { 
  type CapturedPhoto, 
  MOCK_POSITIONS, 
  generateMockPhotoDataUrl 
} from './photo-guide-types';

const meta: Meta = {
  title: 'Photo Guide/Workflow',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete photo guide workflow showcasing all photo guide components working together.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const CompleteWorkflow: Story = {
  name: 'Complete Workflow',
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('front_overall');
    const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
    const [showCamera, setShowCamera] = useState(false);
    
    const currentPosition = useMemo(
      () => MOCK_POSITIONS.find(p => p.id === currentPositionId),
      [currentPositionId]
    );
    const currentPhoto = useMemo(
      () => photos.find(p => p.positionId === currentPositionId),
      [photos, currentPositionId]
    );
    const requiredPositions = useMemo(
      () => MOCK_POSITIONS.filter(p => p.required) ?? [],
      []
    );
    const completedRequired = useMemo(
      () => photos.filter(p => 
        requiredPositions.some(pos => pos.id === p.positionId)
      ).length,
      [photos, requiredPositions]
    );
    const currentIndex = useMemo(
      () => MOCK_POSITIONS.findIndex(p => p.id === currentPositionId),
      [currentPositionId]
    );
    
    const handleTakePhoto = () => {
      setShowCamera(true);
    };
    
    const handlePhotoCapture = (_blob: Blob) => {
      // Simulate photo capture
      const newPhoto: CapturedPhoto = {
        positionId: currentPositionId,
        dataUrl: generateMockPhotoDataUrl(currentPosition?.name ?? 'Photo'),
        timestamp: new Date(),
      };
      
      setPhotos(prev => {
        const filtered = prev.filter(p => p.positionId !== currentPositionId);
        return [...filtered, newPhoto];
      });
      
      setShowCamera(false);
      
      // Auto-advance to next position
      if (currentIndex < MOCK_POSITIONS.length - 1) {
        setCurrentPositionId(MOCK_POSITIONS[currentIndex + 1].id);
      }
    };
    
    const handleSkip = () => {
      if (currentIndex < MOCK_POSITIONS.length - 1) {
        setCurrentPositionId(MOCK_POSITIONS[currentIndex + 1].id);
      }
    };
    
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <PhotoGuideHeader
          currentStep={currentIndex + 1}
          totalSteps={MOCK_POSITIONS.length}
          completedCount={completedRequired}
          requiredCount={requiredPositions.length}
          onBack={() => console.log('Go back')}
          onLogoClick={() => console.log('Go to home')}
        />
        
        <div style={{ 
          flex: 1,
          maxWidth: '480px',
          margin: '0 auto',
          padding: 'var(--space-lg) var(--space-md)',
          width: '100%'
        }}>
          {currentPosition && (
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <PhotoPositionCard
                position={currentPosition}
                photo={currentPhoto}
                onTakePhoto={handleTakePhoto}
                onRetakePhoto={handleTakePhoto}
                onSkip={!currentPosition.required ? handleSkip : undefined}
              />
            </div>
          )}
          
          <PhotoProgressGrid
            positions={MOCK_POSITIONS}
            photos={photos}
            currentPositionId={currentPositionId}
            onPositionSelect={setCurrentPositionId}
          />
          
          {completedRequired === requiredPositions.length && (
            <div style={{ marginTop: 'var(--space-xl)' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => console.log('Continue to review')}
                style={{ width: '100%' }}
              >
                Continue to Review
              </Button>
            </div>
          )}
        </div>
        
        <CameraCapture
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={handlePhotoCapture}
          onError={(error) => console.error('Camera error:', error)}
          facingMode="environment"
        />
      </div>
    );
  },
};

export const MobileView: Story = {
  name: 'Mobile View',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story: 'Photo guide workflow optimized for mobile screens.',
      },
    },
  },
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('interior_front_seats');
    const [photos, setPhotos] = useState<CapturedPhoto[]>([
      {
        positionId: 'front_overall',
        dataUrl: generateMockPhotoDataUrl('Front View', '#4f46e5'),
        timestamp: new Date(),
      },
      {
        positionId: 'rear_overall',
        dataUrl: generateMockPhotoDataUrl('Rear View', '#059669'),
        timestamp: new Date(),
      },
    ]);
    const [showCamera, setShowCamera] = useState(false);
    
    const currentPosition = useMemo(
      () => MOCK_POSITIONS.find(p => p.id === currentPositionId),
      [currentPositionId]
    );
    const currentPhoto = useMemo(
      () => photos.find(p => p.positionId === currentPositionId),
      [photos, currentPositionId]
    );
    const requiredPositions = useMemo(
      () => MOCK_POSITIONS.filter(p => p.required) ?? [],
      []
    );
    const completedRequired = useMemo(
      () => photos.filter(p => 
        requiredPositions.some(pos => pos.id === p.positionId)
      ).length,
      [photos, requiredPositions]
    );
    const currentIndex = useMemo(
      () => MOCK_POSITIONS.findIndex(p => p.id === currentPositionId),
      [currentPositionId]
    );
    
    const handleTakePhoto = () => setShowCamera(true);
    const handlePhotoCapture = (_blob: Blob) => {
      const newPhoto: CapturedPhoto = {
        positionId: currentPositionId,
        dataUrl: generateMockPhotoDataUrl(currentPosition?.name ?? 'Photo'),
        timestamp: new Date(),
      };
      setPhotos(prev => [...prev.filter(p => p.positionId !== currentPositionId), newPhoto]);
      setShowCamera(false);
    };
    
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <PhotoGuideHeader
          currentStep={currentIndex + 1}
          totalSteps={MOCK_POSITIONS.length}
          completedCount={completedRequired}
          requiredCount={requiredPositions.length}
          onBack={() => console.log('Go back')}
          onLogoClick={() => console.log('Go to home')}
        />
        
        <div style={{ 
          flex: 1,
          padding: 'var(--space-md)',
          width: '100%'
        }}>
          {currentPosition && (
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <PhotoPositionCard
                position={currentPosition}
                photo={currentPhoto}
                onTakePhoto={handleTakePhoto}
                onRetakePhoto={handleTakePhoto}
                onSkip={!currentPosition.required ? () => console.log('Skip') : undefined}
              />
            </div>
          )}
          
          <PhotoProgressGrid
            positions={MOCK_POSITIONS}
            photos={photos}
            currentPositionId={currentPositionId}
            onPositionSelect={setCurrentPositionId}
          />
        </div>
        
        <CameraCapture
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={handlePhotoCapture}
          onError={(error) => console.error('Camera error:', error)}
          facingMode="environment"
        />
      </div>
    );
  },
};

export const DesktopView: Story = {
  name: 'Desktop View',
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    docs: {
      description: {
        story: 'Photo guide workflow layout optimized for desktop screens with wider content area.',
      },
    },
  },
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('dashboard_vin');
    const [photos, setPhotos] = useState<CapturedPhoto[]>([
      {
        positionId: 'front_overall',
        dataUrl: generateMockPhotoDataUrl('Front View', '#4f46e5'),
        timestamp: new Date(),
      },
      {
        positionId: 'rear_overall',
        dataUrl: generateMockPhotoDataUrl('Rear View', '#059669'),
        timestamp: new Date(),
      },
      {
        positionId: 'driver_side_overall',
        dataUrl: generateMockPhotoDataUrl('Driver Side', '#dc2626'),
        timestamp: new Date(),
      },
      {
        positionId: 'passenger_side_overall',
        dataUrl: generateMockPhotoDataUrl('Passenger Side', '#7c2d12'),
        timestamp: new Date(),
      },
      {
        positionId: 'interior_front_seats',
        dataUrl: generateMockPhotoDataUrl('Front Interior', '#1f2937'),
        timestamp: new Date(),
      },
    ]);
    const [showCamera, setShowCamera] = useState(false);
    
    const currentPosition = useMemo(
      () => MOCK_POSITIONS.find(p => p.id === currentPositionId),
      [currentPositionId]
    );
    const currentPhoto = useMemo(
      () => photos.find(p => p.positionId === currentPositionId),
      [photos, currentPositionId]
    );
    const requiredPositions = useMemo(
      () => MOCK_POSITIONS.filter(p => p.required) ?? [],
      []
    );
    const completedRequired = useMemo(
      () => photos.filter(p => 
        requiredPositions.some(pos => pos.id === p.positionId)
      ).length,
      [photos, requiredPositions]
    );
    const currentIndex = useMemo(
      () => MOCK_POSITIONS.findIndex(p => p.id === currentPositionId),
      [currentPositionId]
    );
    
    const handleTakePhoto = () => setShowCamera(true);
    const handlePhotoCapture = (_blob: Blob) => {
      const newPhoto: CapturedPhoto = {
        positionId: currentPositionId,
        dataUrl: generateMockPhotoDataUrl(currentPosition?.name ?? 'Photo'),
        timestamp: new Date(),
      };
      setPhotos(prev => [...prev.filter(p => p.positionId !== currentPositionId), newPhoto]);
      setShowCamera(false);
    };
    
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <PhotoGuideHeader
          currentStep={currentIndex + 1}
          totalSteps={MOCK_POSITIONS.length}
          completedCount={completedRequired}
          requiredCount={requiredPositions.length}
          onBack={() => console.log('Go back')}
          onLogoClick={() => console.log('Go to home')}
        />
        
        <div style={{ 
          flex: 1,
          maxWidth: '800px',
          margin: '0 auto',
          padding: 'var(--space-xl) var(--space-lg)',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-xl)',
          alignItems: 'start'
        }}>
          <div>
            {currentPosition && (
              <PhotoPositionCard
                position={currentPosition}
                photo={currentPhoto}
                onTakePhoto={handleTakePhoto}
                onRetakePhoto={handleTakePhoto}
                onSkip={!currentPosition.required ? () => console.log('Skip') : undefined}
              />
            )}
            
            {completedRequired === requiredPositions.length && (
              <div style={{ marginTop: 'var(--space-xl)' }}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => console.log('Continue to review')}
                  style={{ width: '100%' }}
                >
                  Continue to Review
                </Button>
              </div>
            )}
          </div>
          
          <div>
            <PhotoProgressGrid
              positions={MOCK_POSITIONS}
              photos={photos}
              currentPositionId={currentPositionId}
              onPositionSelect={setCurrentPositionId}
            />
          </div>
        </div>
        
        <CameraCapture
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={handlePhotoCapture}
          onError={(error) => console.error('Camera error:', error)}
          facingMode="environment"
        />
      </div>
    );
  },
};

export const NearCompletion: Story = {
  name: 'Near Completion',
  render: () => {
    const [currentPositionId, setCurrentPositionId] = useState('damage_area_1');
    const [photos, setPhotos] = useState<CapturedPhoto[]>([
      {
        positionId: 'front_overall',
        dataUrl: generateMockPhotoDataUrl('Front View', '#4f46e5'),
        timestamp: new Date(),
      },
      {
        positionId: 'rear_overall',
        dataUrl: generateMockPhotoDataUrl('Rear View', '#059669'),
        timestamp: new Date(),
      },
      {
        positionId: 'driver_side_overall',
        dataUrl: generateMockPhotoDataUrl('Driver Side', '#dc2626'),
        timestamp: new Date(),
      },
      {
        positionId: 'passenger_side_overall',
        dataUrl: generateMockPhotoDataUrl('Passenger Side', '#7c2d12'),
        timestamp: new Date(),
      },
      {
        positionId: 'interior_front_seats',
        dataUrl: generateMockPhotoDataUrl('Front Interior', '#1f2937'),
        timestamp: new Date(),
      },
      {
        positionId: 'interior_rear_seats',
        dataUrl: generateMockPhotoDataUrl('Rear Interior', '#374151'),
        timestamp: new Date(),
      },
      {
        positionId: 'dashboard_vin',
        dataUrl: generateMockPhotoDataUrl('Dashboard VIN', '#581c87'),
        timestamp: new Date(),
      },
      {
        positionId: 'odometer',
        dataUrl: generateMockPhotoDataUrl('Odometer', '#7e22ce'),
        timestamp: new Date(),
      },
    ]);
    const [showCamera, setShowCamera] = useState(false);
    
    const currentPosition = useMemo(
      () => MOCK_POSITIONS.find(p => p.id === currentPositionId),
      [currentPositionId]
    );
    const currentPhoto = useMemo(
      () => photos.find(p => p.positionId === currentPositionId),
      [photos, currentPositionId]
    );
    const requiredPositions = useMemo(
      () => MOCK_POSITIONS.filter(p => p.required) ?? [],
      []
    );
    const completedRequired = useMemo(
      () => photos.filter(p => 
        requiredPositions.some(pos => pos.id === p.positionId)
      ).length,
      [photos, requiredPositions]
    );
    const currentIndex = useMemo(
      () => MOCK_POSITIONS.findIndex(p => p.id === currentPositionId),
      [currentPositionId]
    );
    
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <PhotoGuideHeader
          currentStep={currentIndex + 1}
          totalSteps={MOCK_POSITIONS.length}
          completedCount={completedRequired}
          requiredCount={requiredPositions.length}
          onBack={() => console.log('Go back')}
          onLogoClick={() => console.log('Go to home')}
        />
        
        <div style={{ 
          flex: 1,
          maxWidth: '480px',
          margin: '0 auto',
          padding: 'var(--space-lg) var(--space-md)',
          width: '100%'
        }}>
          {currentPosition && (
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <PhotoPositionCard
                position={currentPosition}
                photo={currentPhoto}
                onTakePhoto={() => setShowCamera(true)}
                onRetakePhoto={() => setShowCamera(true)}
                onSkip={!currentPosition.required ? () => console.log('Skip') : undefined}
              />
            </div>
          )}
          
          <PhotoProgressGrid
            positions={MOCK_POSITIONS}
            photos={photos}
            currentPositionId={currentPositionId}
            onPositionSelect={setCurrentPositionId}
          />
          
          {completedRequired === requiredPositions.length && (
            <div style={{ marginTop: 'var(--space-xl)' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => console.log('Continue to review')}
                style={{ width: '100%' }}
              >
                Continue to Review
              </Button>
            </div>
          )}
        </div>
        
        <CameraCapture
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={(_blob: Blob) => {
            const newPhoto: CapturedPhoto = {
              positionId: currentPositionId,
              dataUrl: generateMockPhotoDataUrl(currentPosition?.name ?? 'Photo'),
              timestamp: new Date(),
            };
            setPhotos(prev => [...prev.filter(p => p.positionId !== currentPositionId), newPhoto]);
            setShowCamera(false);
          }}
          onError={(error) => console.error('Camera error:', error)}
          facingMode="environment"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Workflow state where most required photos are completed, showing the "Continue to Review" button.',
      },
    },
  },
};