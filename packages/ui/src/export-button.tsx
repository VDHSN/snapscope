import * as React from 'react';
import { Button, type ButtonProps } from './button';

export interface ExportButtonProps extends Omit<ButtonProps, 'children'> {
  loading?: boolean;
  children?: React.ReactNode;
}

const loadingSpinnerStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '16px',
  height: '16px',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderTopColor: 'white',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite'
};

export const ExportButton = React.forwardRef<HTMLButtonElement, ExportButtonProps>(
  ({ loading = false, disabled, children = 'Export Assessment', ...props }, ref) => {
    // Inject keyframe animation into document if not already present
    React.useEffect(() => {
      if (typeof document === 'undefined') return;

      const styleId = 'export-button-spinner-keyframes';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
    }, []);

    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        variant="primary"
        {...props}
      >
        {loading ? (
          <>
            <span style={loadingSpinnerStyle} aria-hidden="true" />
            Exporting...
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

ExportButton.displayName = 'ExportButton';
