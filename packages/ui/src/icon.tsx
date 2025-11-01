import React from 'react';

// Combined icon names from both branches
export type IconName = 
  // Icons from landing page
  | 'clock' 
  | 'shield' 
  | 'settings' 
  | 'briefcase' 
  | 'users' 
  | 'plus' 
  | 'play'
  // Icons from VIN entry feature
  | 'arrow-left' 
  | 'camera' 
  | 'edit' 
  | 'chevron-left' 
  | 'chevron-right' 
  | 'scan-barcode'
  | 'check'
  | 'x'
  | 'info'
  | 'warning'
  | 'error'
  // Theme toggle icons
  | 'sun'
  | 'moon'
  // Camera flash icons
  | 'flash'
  | 'flash-off';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: IconSize | number;
  color?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

// Icon size mappings
const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

// Combined icon paths from both branches
const iconPaths: Record<IconName, React.ReactNode> = {
  // Landing page icons
  clock: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  ),
  settings: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
    />
  ),
  briefcase: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
      />
    </>
  ),
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  ),
  plus: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  ),
  play: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v5a2 2 0 002 2z"
    />
  ),
  // VIN entry icons
  'arrow-left': (
    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  'camera': (
    <>
      <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  'edit': (
    <>
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5C18.8978 2.1022 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  'chevron-left': (
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  'chevron-right': (
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  'scan-barcode': (
    <>
      <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H7M17 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7M21 17V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H17M7 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9H9.01M15 9H15.01M9 15H9.01M15 15H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  'check': (
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  'x': (
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  'info': (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  'warning': (
    <>
      <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.64 21H20.36A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 9V13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  'error': (
    <>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  'sun': (
    <>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  'moon': (
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  'flash': (
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  ),
  'flash-off': (
    <>
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
};

/**
 * Icon component that renders SVG icons with consistent sizing and styling
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ 
    name, 
    size = 'md', 
    color = 'currentColor',
    className,
    style,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden = !ariaLabel,
    ...props 
  }, ref) => {
    // Handle both size types (string key or numeric value)
    const iconSize = typeof size === 'number' ? size : sizeMap[size];
    const iconContent = iconPaths[name];

    if (!iconContent) {
      console.warn(`Icon "${name}" not found`);
      return null;
    }

    const iconStyle: React.CSSProperties = {
      display: 'inline-block',
      verticalAlign: 'middle',
      color,
      ...style,
    };

    return (
      <svg
        ref={ref}
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={iconStyle}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        role={ariaLabel ? 'img' : 'presentation'}
        {...props}
      >
        {iconContent}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';

// Export individual icon components for convenience
export const ArrowLeftIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="arrow-left" {...props} />
);

export const CameraIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="camera" {...props} />
);

export const EditIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="edit" {...props} />
);

export const ChevronLeftIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="chevron-left" {...props} />
);

export const ChevronRightIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="chevron-right" {...props} />
);

export const ScanBarcodeIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="scan-barcode" {...props} />
);

export const CheckIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="check" {...props} />
);

export const XIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="x" {...props} />
);

export const InfoIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="info" {...props} />
);

export const WarningIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="warning" {...props} />
);

export const ErrorIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="error" {...props} />
);

export const SunIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="sun" {...props} />
);

export const MoonIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="moon" {...props} />
);

export const FlashIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="flash" {...props} />
);

export const FlashOffIcon = (props: Omit<IconProps, 'name'>) => (
  <Icon name="flash-off" {...props} />
);