import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Input field component with consistent styling and focus states from the SnapScope design system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your text here',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Sample text input',
    onChange: () => {}, // Storybook requirement
  },
};

export const Placeholder: Story = {
  args: {
    placeholder: 'Enter your email address',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    placeholder: 'This field has an error',
    value: 'Invalid input',
    onChange: () => {},
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '300px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Small
        </label>
        <Input size="sm" placeholder="Small input" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Medium (default)
        </label>
        <Input size="md" placeholder="Medium input" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Large
        </label>
        <Input size="lg" placeholder="Large input" />
      </div>
    </div>
  ),
};

export const InputTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '300px' }}>
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="search" placeholder="Search input" />
      <Input type="url" placeholder="URL input" />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-semibold)' }}>
          Name
        </label>
        <Input placeholder="Enter your full name" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-semibold)' }}>
          Email
        </label>
        <Input type="email" placeholder="Enter your email" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-semibold)' }}>
          Phone (Error State)
        </label>
        <Input variant="error" placeholder="Enter phone number" value="Invalid format" onChange={() => {}} />
        <div style={{ marginTop: 'var(--space-xs)', fontSize: 'var(--font-size-caption)', color: 'var(--error)' }}>
          Please enter a valid phone number
        </div>
      </div>
    </form>
  ),
};