import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { WorkflowBuilder, PhotoStep } from './workflow-builder';

const meta: Meta<typeof WorkflowBuilder> = {
  title: 'Components/WorkflowBuilder',
  component: WorkflowBuilder,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WorkflowBuilder>;

const defaultSteps: PhotoStep[] = [
  {
    id: '1',
    label: 'Front View',
    description: 'Capture entire front of vehicle',
    category: 'exterior',
    required: true,
    order: 1,
  },
  {
    id: '2',
    label: 'VIN Plate',
    description: 'Clear photo of VIN plate',
    category: 'vin',
    required: true,
    order: 2,
  },
  {
    id: '3',
    label: 'Driver Side',
    description: 'Full side view from driver side',
    category: 'exterior',
    required: true,
    order: 3,
  },
  {
    id: '4',
    label: 'Passenger Side',
    description: 'Full side view from passenger side',
    category: 'exterior',
    required: true,
    order: 4,
  },
  {
    id: '5',
    label: 'Rear View',
    description: 'Capture entire rear of vehicle',
    category: 'exterior',
    required: true,
    order: 5,
  },
  {
    id: '6',
    label: 'Dashboard',
    description: 'Interior dashboard view',
    category: 'interior',
    required: false,
    order: 6,
  },
  {
    id: '7',
    label: 'Front Bumper Damage',
    description: 'Close-up of damage',
    category: 'damage',
    required: false,
    order: 7,
  },
];

export const Interactive: Story = {
  render: () => {
    const [steps, setSteps] = useState<PhotoStep[]>(defaultSteps);

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <WorkflowBuilder
          steps={steps}
          onChange={setSteps}
          onAddStep={() => {
            const newStep: PhotoStep = {
              id: String(Date.now()),
              label: `New Step ${steps.length + 1}`,
              description: 'Add description...',
              category: 'exterior',
              required: false,
              order: steps.length + 1,
            };
            setSteps([...steps, newStep]);
          }}
          onEditStep={(id) => console.log('Edit step:', id)}
          onDeleteStep={(id) => console.log('Delete step:', id)}
          onToggleRequired={(id) => console.log('Toggle required:', id)}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [steps, setSteps] = useState<PhotoStep[]>([]);

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <WorkflowBuilder
          steps={steps}
          onChange={setSteps}
          onAddStep={() => {
            const newStep: PhotoStep = {
              id: String(Date.now()),
              label: 'First Photo Step',
              description: 'Describe what photo to capture',
              category: 'exterior',
              required: true,
              order: 1,
            };
            setSteps([newStep]);
          }}
        />
      </div>
    );
  },
};

export const WithMaxSteps: Story = {
  render: () => {
    const [steps, setSteps] = useState<PhotoStep[]>(defaultSteps.slice(0, 3));

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-md)' }}>
          Limited to 5 Steps
        </h3>
        <WorkflowBuilder
          steps={steps}
          onChange={setSteps}
          maxSteps={5}
          onAddStep={() => {
            const newStep: PhotoStep = {
              id: String(Date.now()),
              label: `Step ${steps.length + 1}`,
              category: 'exterior',
              required: false,
              order: steps.length + 1,
            };
            setSteps([...steps, newStep]);
          }}
          onEditStep={(id) => console.log('Edit step:', id)}
          onDeleteStep={(id) => console.log('Delete step:', id)}
          onToggleRequired={(id) => console.log('Toggle required:', id)}
        />
      </div>
    );
  },
};

export const ReadOnly: Story = {
  render: () => {
    const [steps] = useState<PhotoStep[]>(defaultSteps.slice(0, 4));

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-md)' }}>
          Read-Only View (No Actions)
        </h3>
        <WorkflowBuilder steps={steps} onChange={() => {}} />
      </div>
    );
  },
};

export const MinimalSteps: Story = {
  render: () => {
    const [steps, setSteps] = useState<PhotoStep[]>([
      {
        id: '1',
        label: 'VIN Photo',
        category: 'vin',
        required: true,
        order: 1,
      },
      {
        id: '2',
        label: 'Front Exterior',
        category: 'exterior',
        required: true,
        order: 2,
      },
    ]);

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <WorkflowBuilder
          steps={steps}
          onChange={setSteps}
          onAddStep={() => {
            const newStep: PhotoStep = {
              id: String(Date.now()),
              label: `Step ${steps.length + 1}`,
              category: 'exterior',
              required: false,
              order: steps.length + 1,
            };
            setSteps([...steps, newStep]);
          }}
          onToggleRequired={(id) => console.log('Toggle required:', id)}
        />
      </div>
    );
  },
};

export const AllCategories: Story = {
  render: () => {
    const [steps, setSteps] = useState<PhotoStep[]>([
      {
        id: '1',
        label: 'Front Exterior',
        description: 'Full front view',
        category: 'exterior',
        required: true,
        order: 1,
      },
      {
        id: '2',
        label: 'Interior Dashboard',
        description: 'Dashboard and controls',
        category: 'interior',
        required: true,
        order: 2,
      },
      {
        id: '3',
        label: 'VIN Plate',
        description: 'VIN number clearly visible',
        category: 'vin',
        required: true,
        order: 3,
      },
      {
        id: '4',
        label: 'Bumper Damage',
        description: 'Close-up of damaged area',
        category: 'damage',
        required: false,
        order: 4,
      },
    ]);

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-md)' }}>
          Showcasing All Categories
        </h3>
        <WorkflowBuilder
          steps={steps}
          onChange={setSteps}
          onAddStep={() => {
            const categories: Array<'exterior' | 'interior' | 'vin' | 'damage'> = [
              'exterior',
              'interior',
              'vin',
              'damage',
            ];
            const randomCategory =
              categories[Math.floor(Math.random() * categories.length)];

            const newStep: PhotoStep = {
              id: String(Date.now()),
              label: `New ${randomCategory} step`,
              category: randomCategory,
              required: false,
              order: steps.length + 1,
            };
            setSteps([...steps, newStep]);
          }}
          onEditStep={(id) => console.log('Edit step:', id)}
          onDeleteStep={(id) => console.log('Delete step:', id)}
          onToggleRequired={(id) => console.log('Toggle required:', id)}
        />
      </div>
    );
  },
};
