import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Badge component for displaying status, categories, or labels with semantic color variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-secondary)' }}>Small</div>
        <Badge size="sm" variant="success">Small</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-secondary)' }}>Medium</div>
        <Badge size="md" variant="success">Medium</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-secondary)' }}>Large</div>
        <Badge size="lg" variant="success">Large</Badge>
      </div>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <span style={{ minWidth: '80px', fontSize: 'var(--font-size-small)' }}>Active:</span>
        <Badge variant="success">Online</Badge>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <span style={{ minWidth: '80px', fontSize: 'var(--font-size-small)' }}>Warning:</span>
        <Badge variant="warning">Pending</Badge>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <span style={{ minWidth: '80px', fontSize: 'var(--font-size-small)' }}>Error:</span>
        <Badge variant="error">Failed</Badge>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <span style={{ minWidth: '80px', fontSize: 'var(--font-size-small)' }}>Info:</span>
        <Badge variant="info">Processing</Badge>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
        <span style={{ minWidth: '80px', fontSize: 'var(--font-size-small)' }}>Neutral:</span>
        <Badge variant="neutral">Draft</Badge>
      </div>
    </div>
  ),
};

export const InlineUsage: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <p style={{ margin: 0, fontSize: 'var(--font-size-body)', lineHeight: 'var(--line-height-normal)' }}>
        This is a paragraph with an inline <Badge variant="info">Info</Badge> badge and 
        another <Badge variant="success">Success</Badge> badge to show how they appear 
        within text content.
      </p>
    </div>
  ),
};

export const AllVariantsAllSizes: Story = {
  render: () => {
    const variants = ['success', 'warning', 'error', 'info', 'neutral'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {variants.map((variant) => (
          <div key={variant}>
            <h4 style={{ marginBottom: 'var(--space-sm)', textTransform: 'capitalize', fontSize: 'var(--font-size-h3)' }}>
              {variant}
            </h4>
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
              {sizes.map((size) => (
                <Badge key={`${variant}-${size}`} variant={variant} size={size}>
                  {size} {variant}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};