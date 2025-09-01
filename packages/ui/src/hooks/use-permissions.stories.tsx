import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { usePermissions } from './use-permissions';
import { Button } from '../button';
import { Typography } from '../typography';
import { Card } from '../card';

const meta: Meta = {
  title: 'Hooks/usePermissions',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A hook for managing camera permissions with proactive checking and better error handling. Provides detailed browser information and permission states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Demo component using the permissions hook
const PermissionsDemo: React.FC = () => {
  const { permission, requestPermission, checkPermission, resetPermission } = usePermissions();
  const [lastRequestResult, setLastRequestResult] = useState<boolean | null>(null);

  const handleRequestPermission = async () => {
    const result = await requestPermission({
      facingMode: 'environment',
      showFallback: true,
      onFallback: () => alert('Fallback triggered!'),
    });
    setLastRequestResult(result);
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'granted': return 'var(--color-success)';
      case 'denied': return 'var(--color-error)';
      case 'unavailable': return 'var(--color-warning)';
      case 'checking': return 'var(--color-primary)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'granted': return '✅';
      case 'denied': return '❌';
      case 'unavailable': return '⚠️';
      case 'checking': return '🔄';
      default: return '❓';
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-lg)' }}>
      <Typography variant="h2" style={{ marginBottom: 'var(--space-lg)' }}>
        Camera Permissions Demo
      </Typography>

      <Card style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ padding: 'var(--space-lg)' }}>
          <Typography variant="h3" style={{ marginBottom: 'var(--space-md)' }}>
            Permission Status
          </Typography>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
          }}>
            <span style={{ fontSize: '24px' }}>{getStateIcon(permission.state)}</span>
            <Typography variant="body" style={{ 
              color: getStateColor(permission.state),
              fontWeight: 'bold',
            }}>
              {permission.state.toUpperCase()}
            </Typography>
          </div>

          <div style={{ 
            display: 'grid', 
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
          }}>
            <Typography variant="body">
              <strong>Can Request:</strong> {permission.canRequest ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body">
              <strong>Has Checked:</strong> {permission.hasChecked ? 'Yes' : 'No'}
            </Typography>
            {permission.error && (
              <Typography variant="body" style={{ color: 'var(--color-error)' }}>
                <strong>Error:</strong> {permission.error}
              </Typography>
            )}
            {lastRequestResult !== null && (
              <Typography variant="body" style={{ 
                color: lastRequestResult ? 'var(--color-success)' : 'var(--color-error)' 
              }}>
                <strong>Last Request:</strong> {lastRequestResult ? 'Success' : 'Failed'}
              </Typography>
            )}
          </div>
        </div>
      </Card>

      {permission.browserInfo && (
        <Card style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{ padding: 'var(--space-lg)' }}>
            <Typography variant="h3" style={{ marginBottom: 'var(--space-md)' }}>
              Browser Information
            </Typography>
            
            <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
              <Typography variant="body">
                <strong>Browser:</strong> {permission.browserInfo.name}
              </Typography>
              <Typography variant="body">
                <strong>Supports Permissions API:</strong> {permission.browserInfo.supportsPermissionAPI ? 'Yes' : 'No'}
              </Typography>
              <Typography variant="body">
                <strong>Requires User Gesture:</strong> {permission.browserInfo.requiresUserGesture ? 'Yes' : 'No'}
              </Typography>
            </div>
          </div>
        </Card>
      )}

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 'var(--space-sm)',
      }}>
        <Button
          variant="primary"
          onClick={handleRequestPermission}
          disabled={permission.state === 'checking'}
        >
          {permission.state === 'checking' ? 'Checking...' : 'Request Camera Permission'}
        </Button>
        
        <Button
          variant="secondary"
          onClick={checkPermission}
          disabled={permission.state === 'checking'}
        >
          Check Permission Status
        </Button>
        
        <Button
          variant="secondary"
          onClick={resetPermission}
        >
          Reset Permission State
        </Button>
      </div>

      <div style={{ 
        marginTop: 'var(--space-lg)',
        padding: 'var(--space-md)',
        background: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-md)',
      }}>
        <Typography variant="caption" style={{ color: 'var(--color-text-secondary)' }}>
          <strong>Note:</strong> Permission behavior may vary between browsers and devices. 
          Some browsers require user interaction before accessing camera permissions.
          Try different actions to see how the hook responds to various scenarios.
        </Typography>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <PermissionsDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo of the usePermissions hook. Test camera permission checking, requesting, and error handling across different browsers.',
      },
    },
  },
};

// Demo showing permission states
const PermissionStatesDemo: React.FC = () => {
  const [mockState, setMockState] = useState<'prompt' | 'granted' | 'denied' | 'unavailable' | 'checking'>('prompt');

  const mockPermission = {
    state: mockState,
    canRequest: mockState !== 'denied',
    hasChecked: mockState !== 'prompt',
    error: mockState === 'denied' ? 'Camera access denied by user' : undefined,
    browserInfo: {
      name: 'chrome',
      supportsPermissionAPI: true,
      requiresUserGesture: false,
    },
  };

  const getStateDescription = (state: string) => {
    switch (state) {
      case 'prompt': return 'Initial state - permission not yet requested';
      case 'granted': return 'Permission granted - camera access allowed';
      case 'denied': return 'Permission denied - camera access blocked';
      case 'unavailable': return 'Camera unavailable - not supported or no device';
      case 'checking': return 'Currently checking permission status';
      default: return 'Unknown state';
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-lg)' }}>
      <Typography variant="h2" style={{ marginBottom: 'var(--space-lg)' }}>
        Permission States Demo
      </Typography>

      <Card style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ padding: 'var(--space-lg)' }}>
          <Typography variant="h3" style={{ marginBottom: 'var(--space-md)' }}>
            Current State: {mockState.toUpperCase()}
          </Typography>
          
          <Typography variant="body" style={{ 
            marginBottom: 'var(--space-md)',
            color: 'var(--color-text-secondary)',
          }}>
            {getStateDescription(mockState)}
          </Typography>

          <div style={{ 
            display: 'grid', 
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-lg)',
          }}>
            <Typography variant="body">
              <strong>Can Request:</strong> {mockPermission.canRequest ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body">
              <strong>Has Checked:</strong> {mockPermission.hasChecked ? 'Yes' : 'No'}
            </Typography>
            {mockPermission.error && (
              <Typography variant="body" style={{ color: 'var(--color-error)' }}>
                <strong>Error:</strong> {mockPermission.error}
              </Typography>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 'var(--space-sm)',
          }}>
            {(['prompt', 'checking', 'granted', 'denied', 'unavailable'] as const).map(state => (
              <Button
                key={state}
                variant={mockState === state ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setMockState(state)}
              >
                {state}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export const PermissionStates: Story = {
  render: () => <PermissionStatesDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Demo showing different permission states and their characteristics. Click the state buttons to see how the UI responds to different permission scenarios.',
      },
    },
  },
};