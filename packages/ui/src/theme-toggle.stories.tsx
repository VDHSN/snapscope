import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './theme-toggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Foundation/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A circular toggle button for switching between light and dark themes. Shows sun icon when dark theme is active (to switch to light) and moon icon when light theme is active (to switch to dark). Features a 40x40px touch-friendly design with 24px icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onThemeChange: { action: 'theme changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomIcon: Story = {
  args: {
    children: '🎨',
  },
};

export const WithCallback: Story = {
  args: {
    onThemeChange: (theme: 'light' | 'dark') => {
      console.log(`Theme switched to: ${theme}`);
    },
  },
};

export const CustomStyle: Story = {
  args: {
    style: {
      background: 'var(--primary-start)',
      color: 'white',
      border: 'none',
    },
  },
};