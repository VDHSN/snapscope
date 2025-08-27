import type { Meta, StoryObj } from '@storybook/react';
import { Icon, IconName } from './icon';
import { Typography } from './typography';

const meta: Meta<typeof Icon> = {
  title: 'VIN Entry/Icons',
  component: Icon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Icons specifically designed for the VIN Entry workflow, including navigation, actions, and status indicators.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: [
        'arrow-left', 'camera', 'edit', 'chevron-left', 'chevron-right',
        'scan-barcode', 'check', 'x', 'info', 'warning', 'error'
      ] as IconName[],
      description: 'VIN Entry specific icons',
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

// Default VIN Entry icon
export const Default: Story = {
  args: {
    name: 'camera',
    size: 'md',
    color: 'currentColor',
  },
};

// All VIN Entry Icons
export const AllVINEntryIcons: Story = {
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

// VIN Entry Actions
export const VINEntryActions: Story = {
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
      >
        <Icon name="camera" size="sm" />
        Scan VIN
      </button>
      
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
      >
        <Icon name="edit" size="sm" />
        Manual Entry
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
      >
        <Icon name="check" size="sm" />
        Continue
      </button>
    </div>
  ),
};

// VIN Entry Status Indicators
export const StatusIndicators: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Icon name="check" size="md" color="var(--success)" />
        <Typography>VIN is valid and verified</Typography>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Icon name="warning" size="md" color="var(--warning)" />
        <Typography>VIN format appears incorrect</Typography>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Icon name="error" size="md" color="var(--error)" />
        <Typography>Invalid VIN checksum</Typography>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Icon name="info" size="md" color="var(--info)" />
        <Typography>VIN must be 17 characters</Typography>
      </div>
    </div>
  ),
};

// VIN Entry Method Cards
export const VINEntryMethods: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)' }}>
      <div style={{
        padding: 'var(--space-lg)',
        border: '2px solid var(--primary)',
        borderRadius: 'var(--border-radius-lg)',
        background: 'var(--bg-surface)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}>
            <Icon name="edit" size="lg" />
          </div>
          <div>
            <Typography variant="h3">Manual Entry</Typography>
            <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>
              Type the VIN manually
            </Typography>
          </div>
        </div>
      </div>

      <div style={{
        padding: 'var(--space-lg)',
        border: '2px solid var(--border-color)',
        borderRadius: 'var(--border-radius-lg)',
        background: 'var(--bg-surface)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}>
            <Icon name="camera" size="lg" />
          </div>
          <div>
            <Typography variant="h3">Scan VIN</Typography>
            <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>
              Use camera to scan
            </Typography>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Navigation Icons
export const NavigationIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Icon name="chevron-left" size="lg" />
        <Typography variant="caption">Previous</Typography>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Icon name="arrow-left" size="lg" />
        <Typography variant="caption">Back</Typography>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Icon name="chevron-right" size="lg" />
        <Typography variant="caption">Next</Typography>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <Icon name="x" size="lg" />
        <Typography variant="caption">Close</Typography>
      </div>
    </div>
  ),
};