import type { Meta, StoryObj } from '@storybook/react';
import { ExportButton } from './export-button';

const meta = {
  title: 'Components/ExportButton',
  component: ExportButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Show loading state'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size'
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive'],
      description: 'Button variant'
    }
  },
} satisfies Meta<typeof ExportButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
    disabled: false,
    size: 'md',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    disabled: false,
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    loading: false,
    disabled: true,
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    loading: false,
    disabled: false,
    size: 'lg',
  },
};

export const Small: Story = {
  args: {
    loading: false,
    disabled: false,
    size: 'sm',
  },
};

export const CustomText: Story = {
  args: {
    loading: false,
    disabled: false,
    size: 'md',
    children: 'Download ZIP',
  },
};
