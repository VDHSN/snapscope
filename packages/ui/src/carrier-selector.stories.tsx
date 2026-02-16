import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CarrierSelector } from './carrier-selector';
import { Button } from './button';

const meta: Meta<typeof CarrierSelector> = {
  title: 'Components/CarrierSelector',
  component: CarrierSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CarrierSelector>;

const mockCarriers = [
  { id: '1', name: 'State Farm', photoCount: 14, isTemplate: true },
  { id: '2', name: 'Progressive', photoCount: 12, isTemplate: true },
  { id: '3', name: 'Geico', photoCount: 10, isTemplate: true },
  { id: '4', name: 'Allstate', photoCount: 15, isTemplate: true },
  { id: '5', name: 'Custom Workflow', photoCount: 8, isTemplate: false },
  { id: '6', name: 'USAA', photoCount: 13, isTemplate: true },
  { id: '7', name: 'Liberty Mutual', photoCount: 11, isTemplate: true },
];

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCarrier, setSelectedCarrier] = useState<string>('');

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Carrier Selector</Button>
        {selectedCarrier && (
          <p style={{ marginTop: 'var(--space-md)', color: 'var(--text-primary)' }}>
            Selected: {mockCarriers.find((c) => c.id === selectedCarrier)?.name}
          </p>
        )}
        <CarrierSelector
          carriers={mockCarriers}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectCarrier={(id) => {
            setSelectedCarrier(id);
            console.log('Selected carrier:', id);
          }}
          onSkip={() => {
            setIsOpen(false);
            console.log('Skipped carrier selection');
          }}
          onCreateNew={() => {
            console.log('Create new carrier clicked');
          }}
        />
      </div>
    );
  },
};

export const WithSearch: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div>
        <CarrierSelector
          carriers={mockCarriers}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectCarrier={(id) => console.log('Selected:', id)}
          onSkip={() => console.log('Skipped')}
          onCreateNew={() => console.log('Create new')}
        />
      </div>
    );
  },
};

export const FewCarriers: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div>
        <CarrierSelector
          carriers={[
            { id: '1', name: 'State Farm', photoCount: 14, isTemplate: true },
            { id: '2', name: 'Progressive', photoCount: 12, isTemplate: true },
            { id: '3', name: 'Custom', photoCount: 8, isTemplate: false },
          ]}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectCarrier={(id) => console.log('Selected:', id)}
          onSkip={() => console.log('Skipped')}
          onCreateNew={() => console.log('Create new')}
        />
      </div>
    );
  },
};

export const NoCarriers: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div>
        <CarrierSelector
          carriers={[]}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectCarrier={(id) => console.log('Selected:', id)}
          onSkip={() => console.log('Skipped')}
          onCreateNew={() => console.log('Create new')}
        />
      </div>
    );
  },
};

export const WithoutCreateNew: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div>
        <CarrierSelector
          carriers={mockCarriers}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectCarrier={(id) => console.log('Selected:', id)}
          onSkip={() => console.log('Skipped')}
        />
      </div>
    );
  },
};

export const CustomTitle: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div>
        <CarrierSelector
          carriers={mockCarriers}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectCarrier={(id) => console.log('Selected:', id)}
          onSkip={() => console.log('Skipped')}
          onCreateNew={() => console.log('Create new')}
          title="Choose Your Insurance Carrier"
        />
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
    const [skipped, setSkipped] = useState(false);

    return (
      <div style={{ padding: 'var(--space-xl)' }}>
        <Button onClick={() => setIsOpen(true)}>Select Carrier</Button>

        {selectedCarrier && (
          <div
            style={{
              marginTop: 'var(--space-md)',
              padding: 'var(--space-md)',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--border-radius-md)',
            }}
          >
            <strong>Selected Carrier:</strong>{' '}
            {mockCarriers.find((c) => c.id === selectedCarrier)?.name}
          </div>
        )}

        {skipped && (
          <div
            style={{
              marginTop: 'var(--space-md)',
              padding: 'var(--space-md)',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--border-radius-md)',
            }}
          >
            Using default workflow (no carrier selected)
          </div>
        )}

        <CarrierSelector
          carriers={mockCarriers}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectCarrier={(id) => {
            setSelectedCarrier(id);
            setSkipped(false);
            console.log('Selected carrier:', id);
          }}
          onSkip={() => {
            setSkipped(true);
            setSelectedCarrier(null);
            console.log('Skipped carrier selection');
          }}
          onCreateNew={() => {
            console.log('Create new carrier');
          }}
        />
      </div>
    );
  },
};
