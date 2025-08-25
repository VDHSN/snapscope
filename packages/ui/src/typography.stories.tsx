import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './typography';

const meta: Meta<typeof Typography> = {
  title: 'Foundation/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Typography components following the SnapScope design system. Includes H1-H3 headings, body text, small text, and captions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'body', 'small', 'caption'],
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--divider-color)' }}>
        <Typography variant="h1">H1 Heading - Primary Header</Typography>
        <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-xs)', display: 'block' }}>
          24px • 600 weight • 1.2 line-height
        </Typography>
      </div>
      
      <div style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--divider-color)' }}>
        <Typography variant="h2">H2 Heading - Section Header</Typography>
        <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-xs)', display: 'block' }}>
          20px • 600 weight • 1.2 line-height
        </Typography>
      </div>
      
      <div style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--divider-color)' }}>
        <Typography variant="h3">H3 Heading - Subsection</Typography>
        <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-xs)', display: 'block' }}>
          18px • 600 weight • 1.2 line-height
        </Typography>
      </div>
      
      <div style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--divider-color)' }}>
        <Typography variant="body">Body text for main content and descriptions</Typography>
        <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-xs)', display: 'block' }}>
          16px • 400 weight • 1.5 line-height
        </Typography>
      </div>
      
      <div style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--divider-color)' }}>
        <Typography variant="small">Small text for secondary information</Typography>
        <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-xs)', display: 'block' }}>
          14px • 400 weight • 1.5 line-height
        </Typography>
      </div>
      
      <div style={{ padding: 'var(--space-sm) 0' }}>
        <Typography variant="caption">Caption text for labels and metadata</Typography>
        <Typography variant="caption" style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-xs)', display: 'block' }}>
          12px • 400 weight • 1.6 line-height
        </Typography>
      </div>
    </div>
  ),
};

export const H1: Story = {
  args: {
    variant: 'h1',
    children: 'Primary Header',
  },
};

export const H2: Story = {
  args: {
    variant: 'h2',
    children: 'Section Header',
  },
};

export const H3: Story = {
  args: {
    variant: 'h3',
    children: 'Subsection Header',
  },
};

export const Body: Story = {
  args: {
    variant: 'body',
    children: 'This is body text used for main content and descriptions. It has good readability and spacing.',
  },
};

export const Small: Story = {
  args: {
    variant: 'small',
    children: 'This is small text used for secondary information and supporting details.',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'This is caption text used for labels, metadata, and fine print.',
  },
};

export const CustomElement: Story = {
  args: {
    variant: 'body',
    as: 'div',
    children: 'Body text rendered as a div element instead of paragraph',
  },
};

export const WithCustomStyles: Story = {
  args: {
    variant: 'h2',
    children: 'Custom styled heading',
    style: {
      color: 'var(--success)',
      textDecoration: 'underline',
    },
  },
};