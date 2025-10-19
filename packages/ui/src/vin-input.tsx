import React, { useId } from 'react';
import { Input, InputProps } from './input';

export interface VINInputProps extends Omit<InputProps, 'value' | 'onChange' | 'maxLength'> {
  value: string;
  onChange: (value: string) => void;
  showCharacterCount?: boolean;
  showValidation?: boolean;
  'aria-describedby'?: string;
  'data-testid'?: string;
}

/**
 * Formats VIN input by removing invalid characters and converting to uppercase
 */
function formatVINInput(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-HJ-NPR-Z0-9]/g, '') // Remove invalid characters (including I, O, Q)
    .slice(0, 17); // Limit to 17 characters
}

/**
 * Gets validation state for VIN input
 */
function getValidationState(vin: string): {
  variant: 'default' | 'error';
  message: string | null;
} {
  if (vin.length === 0) {
    return { variant: 'default', message: null };
  }
  
  if (vin.length < 17) {
    return { 
      variant: 'default', 
      message: `${vin.length}/17 characters` 
    };
  }
  
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return { 
      variant: 'error', 
      message: 'Invalid characters (no I, O, Q)' 
    };
  }
  
  return { 
    variant: 'default', 
    message: 'VIN format valid' 
  };
}

export const VINInput = React.forwardRef<HTMLInputElement, VINInputProps>(
  ({
    value,
    onChange,
    showCharacterCount = true,
    showValidation = true,
    style,
    'aria-describedby': ariaDescribedBy,
    'data-testid': testId = 'vin-input',
    ...props
  }, ref) => {
    const validation = getValidationState(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatVINInput(e.target.value);
      onChange(formatted);
    };

    const containerStyle: React.CSSProperties = {
      position: 'relative',
      width: '100%',
    };

    const inputStyle: React.CSSProperties = {
      ...style,
      paddingRight: showCharacterCount ? '60px' : undefined,
      letterSpacing: '0.05em',
      fontFamily: 'ui-monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    };

    const counterStyle: React.CSSProperties = {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: 'var(--font-size-small)',
      color: value.length === 17 ? 'var(--success)' : 'var(--text-secondary)',
      fontWeight: '500',
      pointerEvents: 'none',
    };

    const messageStyle: React.CSSProperties = {
      marginTop: '4px',
      fontSize: 'var(--font-size-small)',
      color: validation.variant === 'error' ? 'var(--error)' : 'var(--text-secondary)',
    };

    // Construct aria-describedby with validation message ID if present
    const validationId = useId();
    const fullAriaDescribedBy = [
      ariaDescribedBy,
      showValidation && validation.message ? validationId : null
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div style={containerStyle} data-testid={`${testId}-container`}>
        <Input
          ref={ref}
          value={value}
          onChange={handleChange}
          variant={validation.variant}
          placeholder="Enter 17-character VIN"
          maxLength={17}
          style={inputStyle}
          aria-describedby={fullAriaDescribedBy}
          aria-invalid={validation.variant === 'error'}
          role="textbox"
          data-testid={testId}
          {...props}
        />

        {showCharacterCount && (
          <div
            style={counterStyle}
            aria-live="polite"
            aria-label={`Character count: ${value.length} of 17`}
            data-testid={`${testId}-counter`}
          >
            {value.length}/17
          </div>
        )}

        {showValidation && validation.message && (
          <div
            id={validationId}
            style={messageStyle}
            role={validation.variant === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            data-testid={`${testId}-validation`}
          >
            {validation.message}
          </div>
        )}
      </div>
    );
  }
);

VINInput.displayName = 'VINInput';