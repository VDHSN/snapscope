import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './card';
import { Typography } from './typography';
import { Badge } from './badge';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Card component with elevation system for creating surfaces with depth. Includes hover effects and customizable padding.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: 'select',
      options: [1, 2, 3],
    },
    padding: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Typography variant="h3" style={{ marginBottom: 'var(--space-sm)' }}>
          Card Title
        </Typography>
        <Typography variant="body">
          This is a basic card with default styling and elevation.
        </Typography>
      </>
    ),
  },
};

export const Elevations: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
      <Card elevation={1}>
        <Typography variant="h3" style={{ marginBottom: 'var(--space-sm)' }}>Level 1</Typography>
        <Typography variant="body">Light elevation for subtle depth</Typography>
        <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-xs)', display: 'block' }}>
          box-shadow: var(--shadow-1)
        </Typography>
      </Card>
      
      <Card elevation={2}>
        <Typography variant="h3" style={{ marginBottom: 'var(--space-sm)' }}>Level 2</Typography>
        <Typography variant="body">Medium elevation for modals</Typography>
        <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-xs)', display: 'block' }}>
          box-shadow: var(--shadow-2)
        </Typography>
      </Card>
      
      <Card elevation={3}>
        <Typography variant="h3" style={{ marginBottom: 'var(--space-sm)' }}>Level 3</Typography>
        <Typography variant="body">High elevation for tooltips</Typography>
        <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-xs)', display: 'block' }}>
          box-shadow: var(--shadow-3)
        </Typography>
      </Card>
    </div>
  ),
};

export const PaddingSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <Card padding="sm" style={{ maxWidth: '300px' }}>
        <Typography variant="h3" style={{ marginBottom: 'var(--space-xs)' }}>Small Padding</Typography>
        <Typography variant="body">Compact card with minimal padding</Typography>
      </Card>
      
      <Card padding="md" style={{ maxWidth: '300px' }}>
        <Typography variant="h3" style={{ marginBottom: 'var(--space-xs)' }}>Medium Padding</Typography>
        <Typography variant="body">Standard padding for most use cases</Typography>
      </Card>
      
      <Card padding="lg" style={{ maxWidth: '300px' }}>
        <Typography variant="h3" style={{ marginBottom: 'var(--space-sm)' }}>Large Padding</Typography>
        <Typography variant="body">Default padding with more breathing room</Typography>
      </Card>
      
      <Card padding="xl" style={{ maxWidth: '300px' }}>
        <Typography variant="h3" style={{ marginBottom: 'var(--space-sm)' }}>Extra Large Padding</Typography>
        <Typography variant="body">Maximum padding for featured content</Typography>
      </Card>
    </div>
  ),
};

export const WithComplexContent: Story = {
  render: () => (
    <Card elevation={2} style={{ maxWidth: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
        <Typography variant="h2">Project Status</Typography>
        <Badge variant="success">Active</Badge>
      </div>
      
      <Typography variant="body" style={{ marginBottom: 'var(--space-md)' }}>
        This project is currently in development phase with all major milestones on track.
      </Typography>
      
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        <Badge variant="info" size="sm">React</Badge>
        <Badge variant="info" size="sm">TypeScript</Badge>
        <Badge variant="info" size="sm">Storybook</Badge>
      </div>
      
      <div style={{ borderTop: '1px solid var(--divider-color)', paddingTop: 'var(--space-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
            Last updated: 2 hours ago
          </Typography>
          <Typography variant="small" style={{ color: 'var(--text-secondary)' }}>
            85% complete
          </Typography>
        </div>
      </div>
    </Card>
  ),
};

export const InteractiveCard: Story = {
  render: () => (
    <Card 
      elevation={1} 
      style={{ 
        maxWidth: '300px',
        cursor: 'pointer',
      }}
      onClick={() => alert('Card clicked!')}
    >
      <Typography variant="h3" style={{ marginBottom: 'var(--space-sm)' }}>
        Interactive Card
      </Typography>
      <Typography variant="body" style={{ marginBottom: 'var(--space-md)' }}>
        This card has hover effects and click handling. Try interacting with it!
      </Typography>
      <Typography variant="caption" style={{ color: 'var(--text-secondary)' }}>
        Click to trigger action
      </Typography>
    </Card>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)' }}>
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i} elevation={1}>
          <Typography variant="h3" style={{ marginBottom: 'var(--space-sm)' }}>
            Card {i + 1}
          </Typography>
          <Typography variant="body" style={{ marginBottom: 'var(--space-md)' }}>
            This is card number {i + 1} in a responsive grid layout.
          </Typography>
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <Badge variant="neutral" size="sm">Tag {i + 1}</Badge>
            <Badge variant="info" size="sm">Grid</Badge>
          </div>
        </Card>
      ))}
    </div>
  ),
};