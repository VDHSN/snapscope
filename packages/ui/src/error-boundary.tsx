import React from 'react';
import { Typography } from './typography';
import { Card } from './card';
import { Button } from './button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error?: Error;
    onRetry: () => void;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Simple error boundary component for gracefully handling React errors
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error in development
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} onRetry={this.handleRetry} />;
      }

      // Default fallback UI
      return (
        <Card elevation={1} padding="lg" style={{ textAlign: 'center' }}>
          <div style={{ 
            color: 'var(--color-error)', 
            marginBottom: 'var(--space-md)' 
          }}>
            ⚠️
          </div>
          
          <Typography variant="h3" style={{ 
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-sm)'
          }}>
            Something went wrong
          </Typography>
          
          <Typography variant="body" style={{ 
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-lg)'
          }}>
            We encountered an unexpected error. Please try again.
          </Typography>

          <Button 
            variant="primary" 
            onClick={this.handleRetry}
          >
            Try Again
          </Button>

          {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              marginTop: 'var(--space-lg)',
              textAlign: 'left',
              fontSize: 'var(--font-size-small)',
              color: 'var(--text-secondary)'
            }}>
              <summary>Error Details (Development)</summary>
              <pre style={{ 
                background: 'var(--bg-secondary)',
                padding: 'var(--space-sm)',
                borderRadius: 'var(--border-radius-sm)',
                overflow: 'auto',
                marginTop: 'var(--space-sm)'
              }}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap components with ErrorBoundary
 */
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: T) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}