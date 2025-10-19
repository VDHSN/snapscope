'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Typography } from '@snapscope/ui/typography';
import { Button } from '@snapscope/ui/button';
import { Card } from '@snapscope/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error Boundary caught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-lg)',
            background: 'var(--bg-primary)',
          }}
        >
          <Card
            padding="lg"
            style={{
              maxWidth: '600px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '64px',
                marginBottom: 'var(--space-lg)',
              }}
            >
              ⚠️
            </div>
            <Typography
              variant="h2"
              style={{
                marginBottom: 'var(--space-md)',
                color: 'var(--text-primary)',
              }}
            >
              Something went wrong
            </Typography>
            <Typography
              variant="body"
              color="secondary"
              style={{
                marginBottom: 'var(--space-lg)',
              }}
            >
              We encountered an unexpected error. Please try again or contact support if the
              problem persists.
            </Typography>
            {this.state.error && (
              <details
                style={{
                  marginBottom: 'var(--space-lg)',
                  textAlign: 'left',
                  padding: 'var(--space-md)',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  Error Details
                </summary>
                <pre
                  style={{
                    fontSize: 'var(--font-size-small)',
                    color: 'var(--text-secondary)',
                    overflow: 'auto',
                    margin: 0,
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && `\n\n${this.state.errorInfo.componentStack}`}
                </pre>
              </details>
            )}
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-sm)',
                justifyContent: 'center',
              }}
            >
              <Button variant="primary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="secondary" onClick={() => window.location.href = '/assessments'}>
                Go to Assessments
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
