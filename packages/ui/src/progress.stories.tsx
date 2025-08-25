import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Progress bar component for displaying completion status with different variants and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showLabel: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    showLabel: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', width: '300px' }}>
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>Primary</h4>
        <Progress value={65} variant="primary" showLabel />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>Success</h4>
        <Progress value={85} variant="success" showLabel />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>Warning</h4>
        <Progress value={45} variant="warning" showLabel />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>Error</h4>
        <Progress value={25} variant="error" showLabel />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', width: '300px' }}>
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>Small</h4>
        <Progress value={60} size="sm" showLabel />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>Medium</h4>
        <Progress value={60} size="md" showLabel />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>Large</h4>
        <Progress value={60} size="lg" showLabel />
      </div>
    </div>
  ),
};

export const CustomLabel: Story = {
  args: {
    value: 42,
    showLabel: true,
    label: '42 of 100 tasks',
  },
};

export const ProgressStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', width: '400px' }}>
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>Not Started</h4>
        <Progress value={0} showLabel />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>In Progress</h4>
        <Progress value={35} variant="primary" showLabel />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>Nearly Complete</h4>
        <Progress value={90} variant="success" showLabel />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>Complete</h4>
        <Progress value={100} variant="success" showLabel />
      </div>
      
      <div>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>Failed</h4>
        <Progress value={30} variant="error" showLabel label="Failed at 30%" />
      </div>
    </div>
  ),
};

export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = React.useState(0);
    
    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 100);
      
      return () => clearInterval(timer);
    }, []);
    
    return (
      <div style={{ width: '400px' }}>
        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-h3)' }}>
          Animated Progress
        </h4>
        <Progress value={progress} showLabel variant="primary" />
        <p style={{ 
          marginTop: 'var(--space-sm)', 
          fontSize: 'var(--font-size-small)', 
          color: 'var(--text-secondary)' 
        }}>
          This progress bar automatically animates from 0% to 100% and loops.
        </p>
      </div>
    );
  },
};

export const MultipleProgress: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', width: '350px' }}>
      <div style={{ 
        background: 'var(--bg-surface)', 
        padding: 'var(--space-lg)', 
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-h3)' }}>
          Project Dashboard
        </h3>
        
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Progress value={85} variant="success" showLabel label="Frontend: 85%" />
        </div>
        
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Progress value={60} variant="primary" showLabel label="Backend: 60%" />
        </div>
        
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Progress value={30} variant="warning" showLabel label="Testing: 30%" />
        </div>
        
        <div>
          <Progress value={75} variant="primary" showLabel label="Overall: 75%" size="lg" />
        </div>
      </div>
    </div>
  ),
};