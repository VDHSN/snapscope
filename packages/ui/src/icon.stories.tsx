import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconName } from './icon';
import { Typography } from './typography';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Icon component that renders SVG icons with customizable size and color. Supports all common icons used throughout the application.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: ['clock', 'shield', 'settings', 'briefcase', 'users', 'plus', 'play'],
    },
    size: {
      control: 'number',
      min: 12,
      max: 96,
    },
    color: {
      control: 'color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'clock',
    size: 24,
    color: 'currentColor',
  },
};

export const AllIcons: Story = {
  render: () => {
    const iconNames: IconName[] = ['clock', 'shield', 'settings', 'briefcase', 'users', 'plus', 'play'];
    
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--space-lg)' }}>
        {iconNames.map((name) => (
          <div key={name} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 'var(--space-sm)',
            padding: 'var(--space-md)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
          }}>
            <Icon name={name} size={32} />
            <Typography variant="caption">{name}</Typography>
          </div>
        ))}
      </div>
    );
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
      {[16, 20, 24, 32, 48, 64].map((size) => (
        <div key={size} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 'var(--space-xs)' 
        }}>
          <Icon name="clock" size={size} />
          <Typography variant="caption">{size}px</Typography>
        </div>
      ))}
    </div>
  ),
};

export const DifferentColors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
      {[
        { color: 'var(--success)', label: 'Success' },
        { color: 'var(--info)', label: 'Info' },
        { color: 'var(--warning)', label: 'Warning' },
        { color: 'var(--error)', label: 'Error' },
        { color: 'var(--text-primary)', label: 'Primary' },
        { color: 'var(--text-secondary)', label: 'Secondary' },
      ].map(({ color, label }) => (
        <div key={label} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 'var(--space-xs)' 
        }}>
          <Icon name="shield" size={32} color={color} />
          <Typography variant="caption">{label}</Typography>
        </div>
      ))}
    </div>
  ),
};

export const InFeatureCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
      <div style={{ 
        background: 'var(--bg-surface)',
        borderRadius: 'var(--border-radius-xl)',
        border: '1px solid var(--border-color)',
        padding: 'var(--space-lg)',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-md)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--border-radius-md)',
            backgroundColor: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            opacity: 0.9,
          }}>
            <Icon name="clock" />
          </div>
          <Typography variant="h2">FASTER TURNAROUND</Typography>
          <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
            Deliver inspection files in record time.
          </Typography>
        </div>
      </div>

      <div style={{ 
        background: 'var(--bg-surface)',
        borderRadius: 'var(--border-radius-xl)',
        border: '1px solid var(--border-color)',
        padding: 'var(--space-lg)',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-md)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--border-radius-md)',
            backgroundColor: 'var(--info)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            opacity: 0.9,
          }}>
            <Icon name="shield" />
          </div>
          <Typography variant="h2">CONSISTENTLY ACCURATE</Typography>
          <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
            Zero guesswork with automated quality checks.
          </Typography>
        </div>
      </div>
    </div>
  ),
};