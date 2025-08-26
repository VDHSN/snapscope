import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './logo';

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the logo',
    },
    variant: {
      control: 'select',
      options: ['full', 'icon'],
      description: 'Logo variant - full with text or icon only',
    },
    showText: {
      control: 'boolean',
      description: 'Show or hide the SnapScope text (only applies to full variant)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'full',
    showText: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'full',
    showText: true,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    variant: 'full',
    showText: true,
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    variant: 'full',
    showText: true,
  },
};

export const IconOnly: Story = {
  args: {
    size: 'md',
    variant: 'icon',
  },
};

export const IconOnlyLarge: Story = {
  args: {
    size: 'lg',
    variant: 'icon',
  },
};

export const WithoutText: Story = {
  args: {
    size: 'md',
    variant: 'full',
    showText: false,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'end', gap: '24px' }}>
      <Logo size="sm" />
      <Logo size="md" />
      <Logo size="lg" />
      <Logo size="xl" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available logo sizes',
      },
    },
  },
};