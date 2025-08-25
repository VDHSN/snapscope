import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './theme-toggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Foundation/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A toggle button for switching between light and dark themes. Uses the design system theme utilities.',
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

export const CustomText: Story = {
  args: {
    children: (
      <>
        🎨 <span>Switch Theme</span>
      </>
    ),
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