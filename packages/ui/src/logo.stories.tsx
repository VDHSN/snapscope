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
    theme: {
      control: 'select',
      options: ['light', 'dark', 'auto'],
      description: 'Theme for logo appearance - affects colors and shadows',
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

export const LightTheme: Story = {
  args: {
    size: 'lg',
    variant: 'full',
    showText: true,
    theme: 'light',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '40px', background: '#F5E6D3', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Logo with light theme - optimized for light/beige backgrounds with enhanced shadows',
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    size: 'lg',
    variant: 'full',
    showText: true,
    theme: 'dark',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '40px',
          background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
          borderRadius: '8px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Logo with dark theme - white logo for dark/gradient backgrounds',
      },
    },
  },
};

export const ThemeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Light Theme (for beige/light backgrounds)</h3>
        <div style={{ padding: '40px', background: '#F5E6D3', borderRadius: '8px' }}>
          <Logo size="lg" variant="full" theme="light" />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Dark Theme (for gradient/dark backgrounds)</h3>
        <div
          style={{
            padding: '40px',
            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
            borderRadius: '8px',
          }}
        >
          <Logo size="lg" variant="full" theme="dark" />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Auto Theme (default)</h3>
        <div style={{ padding: '40px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <Logo size="lg" variant="full" theme="auto" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all theme variations showing proper contrast on different backgrounds',
      },
    },
  },
};

export const IconWithThemes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ padding: '24px', background: '#F5E6D3', borderRadius: '8px', marginBottom: '8px' }}>
          <Logo size="lg" variant="icon" theme="light" />
        </div>
        <p style={{ fontSize: '12px', color: '#666' }}>Light theme</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
            borderRadius: '8px',
            marginBottom: '8px',
          }}
        >
          <Logo size="lg" variant="icon" theme="dark" />
        </div>
        <p style={{ fontSize: '12px', color: '#666' }}>Dark theme</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon-only logos with different themes showing visibility on various backgrounds',
      },
    },
  },
};