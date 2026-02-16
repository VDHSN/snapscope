import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ErrorBoundary } from './error-boundary';
import { Button } from './button';
import { Typography } from './typography';
import { Card } from './card';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Utils/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Error boundary component for gracefully handling React errors and providing fallback UI.',
      },
    },
  },
  argTypes: {
    children: { control: false },
    fallback: { control: false },
    onError: { action: 'error caught' },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

// Component that throws an error when button is clicked
const ErrorThrowingComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('This is a simulated error for testing the ErrorBoundary');
  }
  
  return (
    <Card padding="md">
      <Typography variant="h3" style={{ marginBottom: 'var(--space-md)' }}>
        Component Working Normally
      </Typography>
      <Typography variant="body">
        This component is working fine. Click the button below to trigger an error.
      </Typography>
    </Card>
  );
};

// Story: Default Error Boundary
export const Default: Story = {
  render: (args) => {
    const [shouldThrow, setShouldThrow] = useState(false);
    
    return (
      <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Button 
            variant="primary" 
            onClick={() => setShouldThrow(!shouldThrow)}
          >
            {shouldThrow ? 'Reset Component' : 'Trigger Error'}
          </Button>
        </div>
        
        <ErrorBoundary {...args}>
          <ErrorThrowingComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      </div>
    );
  },
  args: {
    onError: (error, _errorInfo) => {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', _errorInfo);
    },
  },
};

// Custom fallback component
const CustomFallback: React.FC<{ error?: Error; onRetry: () => void }> = ({ error, onRetry }) => (
  <Card padding="lg" style={{ textAlign: 'center', border: '2px solid var(--color-error)' }}>
    <div style={{ color: 'var(--color-error)', fontSize: '48px', marginBottom: 'var(--space-md)' }}>
      🚨
    </div>
    <Typography variant="h3" style={{ color: 'var(--color-error)', marginBottom: 'var(--space-sm)' }}>
      Custom Error Handler
    </Typography>
    <Typography variant="body" style={{ marginBottom: 'var(--space-lg)' }}>
      Something went wrong in our custom error boundary!
    </Typography>
    <Button variant="primary" onClick={onRetry}>
      Try Again
    </Button>
    {error && typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && (
      <details style={{ 
        marginTop: 'var(--space-md)', 
        textAlign: 'left',
        fontSize: 'var(--font-size-small)' 
      }}>
        <summary>Error Details</summary>
        <pre style={{ 
          background: 'var(--bg-secondary)',
          padding: 'var(--space-sm)',
          borderRadius: 'var(--border-radius-sm)',
          overflow: 'auto',
          marginTop: 'var(--space-sm)'
        }}>
          {error.message}
        </pre>
      </details>
    )}
  </Card>
);

// Story: Custom Fallback UI
export const CustomFallbackUI: Story = {
  render: (args) => {
    const [shouldThrow, setShouldThrow] = useState(false);
    
    return (
      <div style={{ maxWidth: '480px', padding: 'var(--space-lg)' }}>
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Button 
            variant="primary" 
            onClick={() => setShouldThrow(!shouldThrow)}
          >
            {shouldThrow ? 'Reset Component' : 'Trigger Error'}
          </Button>
        </div>
        
        <ErrorBoundary {...args} fallback={CustomFallback}>
          <ErrorThrowingComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      </div>
    );
  },
  args: {
    onError: (error, _errorInfo) => {
      console.error('Custom fallback caught error:', error);
      console.error('Error info:', _errorInfo);
    },
  },
};

// Story: Multiple Components
export const MultipleComponents: Story = {
  render: (args) => {
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    
    return (
      <div style={{ maxWidth: '600px', padding: 'var(--space-lg)' }}>
        <Typography variant="h2" style={{ marginBottom: 'var(--space-lg)' }}>
          Multiple Error Boundaries
        </Typography>
        
        <div style={{ display: 'grid', gap: 'var(--space-lg)', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <Typography variant="h3" style={{ marginBottom: 'var(--space-md)' }}>
              Component A
            </Typography>
            <Button 
              variant="secondary" 
              onClick={() => setError1(!error1)}
              style={{ marginBottom: 'var(--space-md)' }}
            >
              {error1 ? 'Reset A' : 'Break A'}
            </Button>
            <ErrorBoundary {...args}>
              <ErrorThrowingComponent shouldThrow={error1} />
            </ErrorBoundary>
          </div>
          
          <div>
            <Typography variant="h3" style={{ marginBottom: 'var(--space-md)' }}>
              Component B
            </Typography>
            <Button 
              variant="secondary" 
              onClick={() => setError2(!error2)}
              style={{ marginBottom: 'var(--space-md)' }}
            >
              {error2 ? 'Reset B' : 'Break B'}
            </Button>
            <ErrorBoundary {...args}>
              <ErrorThrowingComponent shouldThrow={error2} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    );
  },
  args: {
    onError: (error, _errorInfo) => {
      console.error('One of multiple components errored:', error);
    },
  },
};

// Story: Nested Error Boundaries
export const NestedBoundaries: Story = {
  render: (args) => {
    const [outerError, setOuterError] = useState(false);
    const [innerError, setInnerError] = useState(false);
    
    return (
      <div style={{ maxWidth: '600px', padding: 'var(--space-lg)' }}>
        <Typography variant="h2" style={{ marginBottom: 'var(--space-lg)' }}>
          Nested Error Boundaries
        </Typography>
        
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <Button 
            variant="primary" 
            onClick={() => setOuterError(!outerError)}
            style={{ marginRight: 'var(--space-sm)' }}
          >
            {outerError ? 'Reset Outer' : 'Break Outer'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => setInnerError(!innerError)}
          >
            {innerError ? 'Reset Inner' : 'Break Inner'}
          </Button>
        </div>
        
        <ErrorBoundary 
          {...args} 
          onError={(error) => console.error('Outer boundary caught:', error.message)}
        >
          <Card padding="md" style={{ border: '2px dashed var(--primary-end)' }}>
            <Typography variant="body" style={{ marginBottom: 'var(--space-md)' }}>
              Outer Boundary - This catches errors from the inner component
            </Typography>
            
            <ErrorBoundary 
              onError={(error) => console.error('Inner boundary caught:', error.message)}
            >
              <Card padding="sm" style={{ border: '1px dashed var(--color-success)' }}>
                <Typography variant="caption" style={{ marginBottom: 'var(--space-sm)' }}>
                  Inner Boundary - This catches its own errors first
                </Typography>
                <ErrorThrowingComponent shouldThrow={innerError || outerError} />
              </Card>
            </ErrorBoundary>
          </Card>
        </ErrorBoundary>
      </div>
    );
  },
  args: {},
};