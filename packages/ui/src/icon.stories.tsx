import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconName, IconSize } from './icon';
import { Typography } from './typography';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible icon component that supports multiple icon types and sizes with consistent styling. Includes icons for both the landing page and VIN entry features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        // Landing page icons
        'clock', 'shield', 'settings', 'briefcase', 'users', 'plus', 'play',
        // VIN entry icons
        'arrow-left', 'camera', 'edit', 'chevron-left', 'chevron-right',
        'scan-barcode', 'check', 'x', 'info', 'warning', 'error'
      ] as IconName[],
      description: 'The icon to display',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the icon (sm: 16px, md: 20px, lg: 24px)',
    },
    color: {
      control: 'color',
      description: 'Color of the icon',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the icon',
    },
    'aria-hidden': {
      control: 'boolean',
      description: 'Whether the icon should be hidden from screen readers',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'clock',
    size: 'md',
    color: 'currentColor',
  },
};

// Landing Page Icons
export const LandingPageIcons: Story = {
  render: () => {
    const iconNames: IconName[] = ['clock', 'shield', 'settings', 'briefcase', 'users', 'plus', 'play'];
    
    return (
      <div>
        <Typography variant="h2" style={{ marginBottom: 'var(--space-md)' }}>Landing Page Icons</Typography>
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
              <Icon name={name} size="lg" />
              <Typography variant="caption">{name}</Typography>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// VIN Entry Icons
export const VINEntryIcons: Story = {
  render: () => {
    const iconNames: IconName[] = [
      'arrow-left', 'camera', 'edit', 'chevron-left', 'chevron-right',
      'scan-barcode', 'check', 'x', 'info', 'warning', 'error'
    ];
    
    return (
      <div>
        <Typography variant="h2" style={{ marginBottom: 'var(--space-md)' }}>VIN Entry Icons</Typography>
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
              <Icon name={name} size="lg" />
              <Typography variant="caption" style={{ fontFamily: 'monospace' }}>{name}</Typography>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// All Icons
export const AllIcons: Story = {
  render: () => {
    const allIcons: IconName[] = [
      // Landing page icons
      'clock', 'shield', 'settings', 'briefcase', 'users', 'plus', 'play',
      // VIN entry icons
      'arrow-left', 'camera', 'edit', 'chevron-left', 'chevron-right',
      'scan-barcode', 'check', 'x', 'info', 'warning', 'error'
    ];
    
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--space-lg)' }}>
        {allIcons.map((name) => (
          <div key={name} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 'var(--space-sm)',
            padding: 'var(--space-md)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
          }}>
            <Icon name={name} size="lg" />
            <Typography variant="caption" style={{ fontFamily: 'monospace' }}>{name}</Typography>
          </div>
        ))}
      </div>
    );
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
      <div style={{ textAlign: 'center' }}>
        <Icon name="camera" size="sm" />
        <Typography variant="caption" style={{ marginTop: 'var(--space-xs)', display: 'block' }}>Small (16px)</Typography>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="camera" size="md" />
        <Typography variant="caption" style={{ marginTop: 'var(--space-xs)', display: 'block' }}>Medium (20px)</Typography>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="camera" size="lg" />
        <Typography variant="caption" style={{ marginTop: 'var(--space-xs)', display: 'block' }}>Large (24px)</Typography>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="camera" size={32} />
        <Typography variant="caption" style={{ marginTop: 'var(--space-xs)', display: 'block' }}>Custom (32px)</Typography>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="camera" size={48} />
        <Typography variant="caption" style={{ marginTop: 'var(--space-xs)', display: 'block' }}>Custom (48px)</Typography>
      </div>
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
          <Icon name="shield" size="lg" color={color} />
          <Typography variant="caption">{label}</Typography>
        </div>
      ))}
    </div>
  ),
};

// Interactive icons (for buttons)
export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
      <button 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          padding: 'var(--space-sm) var(--space-md)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--bg-surface)',
          cursor: 'pointer',
          fontSize: 'var(--font-size-base)'
        }}
        onClick={() => alert('Back clicked!')}
      >
        <Icon name="arrow-left" size="sm" />
        Back
      </button>
      <button 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          padding: 'var(--space-sm) var(--space-md)',
          border: '1px solid var(--primary)',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--primary)',
          color: 'white',
          cursor: 'pointer',
          fontSize: 'var(--font-size-base)'
        }}
        onClick={() => alert('Camera clicked!')}
      >
        <Icon name="camera" size="sm" />
        Take Photo
      </button>
      <button 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          padding: 'var(--space-sm) var(--space-md)',
          border: '1px solid var(--success)',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--success)',
          color: 'white',
          cursor: 'pointer',
          fontSize: 'var(--font-size-base)'
        }}
        onClick={() => alert('Success!')}
      >
        <Icon name="check" size="sm" />
        Confirm
      </button>
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

// Accessibility example
export const Accessibility: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div>
        <Typography variant="h3" style={{ marginBottom: 'var(--space-sm)' }}>With aria-label (for meaningful icons)</Typography>
        <Icon name="info" size="lg" aria-label="Information" />
        <Typography variant="caption" style={{ marginLeft: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
          Screen readers will announce "Information"
        </Typography>
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 'var(--space-sm)' }}>Hidden from screen readers (decorative)</Typography>
        <Icon name="chevron-right" size="lg" aria-hidden={true} />
        <Typography variant="caption" style={{ marginLeft: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
          Screen readers will ignore this icon
        </Typography>
      </div>
    </div>
  ),
};