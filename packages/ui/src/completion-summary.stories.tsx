import type { Meta, StoryObj } from '@storybook/react';
import { CompletionSummary } from './completion-summary';

const meta = {
  title: 'Components/CompletionSummary',
  component: CompletionSummary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    vin: {
      control: 'text',
      description: 'Vehicle VIN number'
    },
    photoCount: {
      control: 'number',
      description: 'Number of photos captured'
    },
    completedDate: {
      control: 'date',
      description: 'Date assessment was completed'
    },
    fileName: {
      control: 'text',
      description: 'Expected export file name'
    }
  },
} satisfies Meta<typeof CompletionSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    vin: '1FMPU18L9WLA04056',
    photoCount: 8,
    completedDate: new Date('2025-10-21T14:30:00'),
    fileName: 'Assessment_1FMPU18L9WLA04056_20251021.zip',
  },
};

export const FewPhotos: Story = {
  args: {
    vin: 'JTEDS41AX82059224',
    photoCount: 3,
    completedDate: new Date('2025-10-20T09:15:00'),
    fileName: 'Assessment_JTEDS41AX82059224_20251020.zip',
  },
};

export const ManyPhotos: Story = {
  args: {
    vin: '4A3AE35G11E084392',
    photoCount: 15,
    completedDate: new Date('2025-10-19T16:45:00'),
    fileName: 'Assessment_4A3AE35G11E084392_20251019.zip',
  },
};

export const RecentCompletion: Story = {
  args: {
    vin: '2FALP74W8RX149728',
    photoCount: 10,
    completedDate: new Date(),
    fileName: 'Assessment_2FALP74W8RX149728_20251021.zip',
  },
};
