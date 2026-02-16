import type { Meta, StoryObj } from '@storybook/react';
import { CarrierCard } from './carrier-card';

const meta: Meta<typeof CarrierCard> = {
  title: 'Components/CarrierCard',
  component: CarrierCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CarrierCard>;

export const StateFarm: Story = {
  args: {
    name: 'State Farm',
    photoCount: 8,
    isTemplate: true,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
    onSelect: () => console.log('Select clicked'),
  },
};

export const CustomCarrier: Story = {
  args: {
    name: 'My Custom Workflow',
    photoCount: 12,
    isTemplate: false,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
    onSelect: () => console.log('Select clicked'),
  },
};

export const SelectOnly: Story = {
  args: {
    name: 'Progressive',
    photoCount: 10,
    isTemplate: true,
    onSelect: () => console.log('Select clicked'),
  },
};

export const WithoutActions: Story = {
  args: {
    name: 'Geico',
    photoCount: 9,
    isTemplate: false,
  },
};
