import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './textarea';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Multi-line text input component with consistent styling and focus states from the SnapScope design system.',
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
    rows: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your notes here...',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Front bumper has significant damage with scratches and dents.',
    onChange: () => {}, // Storybook requirement
  },
};

export const Placeholder: Story = {
  args: {
    placeholder: 'Describe the damage in detail...',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '400px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Small
        </label>
        <TextArea size="sm" placeholder="Small textarea" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Medium (default)
        </label>
        <TextArea size="md" placeholder="Medium textarea" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          Large
        </label>
        <TextArea size="lg" placeholder="Large textarea" />
      </div>
    </div>
  ),
};

export const DifferentRows: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '400px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          2 Rows
        </label>
        <TextArea rows={2} placeholder="Compact textarea" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          4 Rows (default)
        </label>
        <TextArea rows={4} placeholder="Standard textarea" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          8 Rows
        </label>
        <TextArea rows={8} placeholder="Large textarea" />
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-semibold)' }}>
          Damage Description
        </label>
        <TextArea placeholder="Describe the damage in detail..." />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-semibold)' }}>
          Additional Notes (Error State)
        </label>
        <TextArea
          variant="error"
          placeholder="Enter additional notes"
          value="Notes are required for this type of damage"
          onChange={() => {}}
        />
        <div style={{ marginTop: 'var(--space-xs)', fontSize: 'var(--font-size-caption)', color: 'var(--error)' }}>
          Please provide more detailed notes
        </div>
      </div>
    </form>
  ),
};

export const DamageNotesExample: Story = {
  render: () => (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      <label style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
        Add damage notes (optional):
      </label>
      <TextArea
        placeholder="E.g., Front bumper has deep scratches and dents on driver side..."
        rows={4}
      />
      <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--text-secondary)', margin: 0 }}>
        Describe any visible damage, estimated severity, or important details.
      </p>
    </div>
  ),
};
