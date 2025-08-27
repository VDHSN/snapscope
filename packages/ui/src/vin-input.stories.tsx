import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { VINInput } from './vin-input';

const meta: Meta<typeof VINInput> = {
  title: 'VIN Entry/VINInput',
  component: VINInput,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    showCharacterCount: {
      control: 'boolean',
      description: 'Show character counter (X/17)',
    },
    showValidation: {
      control: 'boolean',
      description: 'Show validation messages',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof VINInput>;

const VINInputWithState = ({ value: initialValue = '', ...args }) => {
  const [value, setValue] = useState(initialValue);
  
  return (
    <VINInput
      {...args}
      value={value}
      onChange={setValue}
    />
  );
};

export const Default: Story = {
  render: (args) => <VINInputWithState {...args} />,
  args: {
    showCharacterCount: true,
    showValidation: true,
  },
};

export const WithInitialValue: Story = {
  render: (args) => <VINInputWithState {...args} />,
  args: {
    value: '1HGBH41JXMN109186',
    showCharacterCount: true,
    showValidation: true,
  },
};

export const PartiallyFilled: Story = {
  render: (args) => <VINInputWithState {...args} />,
  args: {
    value: '1HGBH41JX',
    showCharacterCount: true,
    showValidation: true,
  },
};

export const WithInvalidCharacters: Story = {
  render: (args) => <VINInputWithState {...args} />,
  args: {
    value: '1HGBH41JXMN109IO6', // Contains I and O
    showCharacterCount: true,
    showValidation: true,
  },
};

export const NoCharacterCount: Story = {
  render: (args) => <VINInputWithState {...args} />,
  args: {
    value: '1HGBH41JX',
    showCharacterCount: false,
    showValidation: true,
  },
};

export const NoValidation: Story = {
  render: (args) => <VINInputWithState {...args} />,
  args: {
    value: '1HGBH41JX',
    showCharacterCount: true,
    showValidation: false,
  },
};

export const Disabled: Story = {
  render: (args) => <VINInputWithState {...args} />,
  args: {
    value: '1HGBH41JXMN109186',
    disabled: true,
    showCharacterCount: true,
    showValidation: true,
  },
};

export const Large: Story = {
  render: (args) => <VINInputWithState {...args} />,
  args: {
    size: 'lg',
    showCharacterCount: true,
    showValidation: true,
  },
};

export const Small: Story = {
  render: (args) => <VINInputWithState {...args} />,
  args: {
    size: 'sm',
    showCharacterCount: true,
    showValidation: true,
  },
};

// Interactive example showing real-time validation
export const InteractiveExample: Story = {
  render: () => {
    const [value, setValue] = useState('');
    
    const examples = [
      { label: 'Valid VIN', vin: '1HGBH41JXMN109186' },
      { label: 'Honda Civic', vin: '2HGFC2F59HH123456' },
      { label: 'Toyota Camry', vin: '4T1BF1FK5GU123456' },
    ];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <VINInput
          value={value}
          onChange={setValue}
          showCharacterCount={true}
          showValidation={true}
        />
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setValue('')}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
          
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setValue(example.vin)}
              style={{
                padding: '8px 12px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>
    );
  },
};