import type { Meta, StoryObj } from '@storybook/react';
import { PhotoStepCard } from './photo-step-card';

const meta: Meta<typeof PhotoStepCard> = {
  title: 'Components/PhotoStepCard',
  component: PhotoStepCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    order: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Step order number',
    },
    label: {
      control: 'text',
      description: 'Photo step label',
    },
    description: {
      control: 'text',
      description: 'Optional description',
    },
    category: {
      control: 'select',
      options: ['exterior', 'interior', 'vin', 'damage'],
      description: 'Photo category',
    },
    required: {
      control: 'boolean',
      description: 'Whether the photo is required',
    },
    draggable: {
      control: 'boolean',
      description: 'Show drag handle',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhotoStepCard>;

export const ExteriorRequired: Story = {
  args: {
    order: 1,
    label: 'Front View',
    description: 'Capture the entire front of the vehicle',
    category: 'exterior',
    required: true,
    onToggleRequired: () => console.log('Toggle required'),
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
  },
};

export const InteriorOptional: Story = {
  args: {
    order: 5,
    label: 'Interior Front',
    description: 'Dashboard and front seats view',
    category: 'interior',
    required: false,
    onToggleRequired: () => console.log('Toggle required'),
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
  },
};

export const VINPhoto: Story = {
  args: {
    order: 2,
    label: 'VIN Plate',
    description: 'Clear photo of the VIN plate',
    category: 'vin',
    required: true,
    onToggleRequired: () => console.log('Toggle required'),
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
  },
};

export const DamagePhoto: Story = {
  args: {
    order: 10,
    label: 'Front Bumper Damage',
    description: 'Close-up of damage to front bumper',
    category: 'damage',
    required: true,
    onToggleRequired: () => console.log('Toggle required'),
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
  },
};

export const WithoutDescription: Story = {
  args: {
    order: 3,
    label: 'Left Side View',
    category: 'exterior',
    required: true,
    onToggleRequired: () => console.log('Toggle required'),
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
  },
};

export const Draggable: Story = {
  args: {
    order: 4,
    label: 'Right Side View',
    description: 'Full side view from passenger side',
    category: 'exterior',
    required: true,
    draggable: true,
    onToggleRequired: () => console.log('Toggle required'),
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
  },
};

export const ReadOnly: Story = {
  args: {
    order: 7,
    label: 'Odometer Reading',
    description: 'Clear photo showing current mileage',
    category: 'interior',
    required: true,
  },
};

export const MinimalActions: Story = {
  args: {
    order: 8,
    label: 'Trunk Interior',
    description: 'View of trunk/cargo area',
    category: 'interior',
    required: false,
    onEdit: () => console.log('Edit clicked'),
  },
};

export const AllCategories: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '600px' }}>
      <PhotoStepCard
        order={1}
        label="Front Exterior"
        category="exterior"
        required={true}
        onToggleRequired={() => console.log('Toggle')}
        onEdit={() => console.log('Edit')}
        onDelete={() => console.log('Delete')}
      />
      <PhotoStepCard
        order={2}
        label="Driver Seat"
        category="interior"
        required={true}
        onToggleRequired={() => console.log('Toggle')}
        onEdit={() => console.log('Edit')}
        onDelete={() => console.log('Delete')}
      />
      <PhotoStepCard
        order={3}
        label="VIN Plate"
        category="vin"
        required={true}
        onToggleRequired={() => console.log('Toggle')}
        onEdit={() => console.log('Edit')}
        onDelete={() => console.log('Delete')}
      />
      <PhotoStepCard
        order={4}
        label="Bumper Scratch"
        category="damage"
        required={false}
        onToggleRequired={() => console.log('Toggle')}
        onEdit={() => console.log('Edit')}
        onDelete={() => console.log('Delete')}
      />
    </div>
  ),
};
