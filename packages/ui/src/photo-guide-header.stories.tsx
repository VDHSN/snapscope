import type { Meta, StoryObj } from '@storybook/react';
import { PhotoGuideHeader } from './photo-guide-header';

const meta: Meta<typeof PhotoGuideHeader> = {
  title: 'Photo Guide/PhotoGuideHeader',
  component: PhotoGuideHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Responsive header component for the photo guide flow, featuring navigation, progress tracking, and branding. Adapts layout for different screen sizes with mobile-optimized spacing and controls positioning.',
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
      },
    },
  },
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Current step in the photo guide',
    },
    totalSteps: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Total number of steps in the photo guide',
    },
    completedCount: {
      control: { type: 'number', min: 0, max: 20 },
      description: 'Number of photos completed',
    },
    requiredCount: {
      control: { type: 'number', min: 0, max: 20 },
      description: 'Number of required photos',
    },
    onBack: {
      action: 'back clicked',
      description: 'Callback when back button is clicked',
    },
    onLogoClick: {
      action: 'logo clicked',
      description: 'Callback when logo is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhotoGuideHeader>;

export const Default: Story = {
  args: {
    currentStep: 3,
    totalSteps: 9,
    completedCount: 3,
    requiredCount: 8,
    onBack: () => console.log('Back clicked'),
    onLogoClick: () => console.log('Logo clicked'),
  },
};

export const FirstStep: Story = {
  args: {
    currentStep: 1,
    totalSteps: 9,
    completedCount: 0,
    requiredCount: 8,
    onBack: () => console.log('Back clicked'),
    onLogoClick: () => console.log('Logo clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'First step with no photos completed yet.',
      },
    },
  },
};

export const MidProgress: Story = {
  args: {
    currentStep: 5,
    totalSteps: 9,
    completedCount: 4,
    requiredCount: 8,
    onBack: () => console.log('Back clicked'),
    onLogoClick: () => console.log('Logo clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Mid-progress state showing steady advancement through the photo guide.',
      },
    },
  },
};

export const AlmostComplete: Story = {
  args: {
    currentStep: 8,
    totalSteps: 9,
    completedCount: 7,
    requiredCount: 8,
    onBack: () => console.log('Back clicked'),
    onLogoClick: () => console.log('Logo clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Near completion with most photos taken.',
      },
    },
  },
};

export const AllComplete: Story = {
  args: {
    currentStep: 9,
    totalSteps: 9,
    completedCount: 8,
    requiredCount: 8,
    onBack: () => console.log('Back clicked'),
    onLogoClick: () => console.log('Logo clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'All required photos completed - ready to finish.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    currentStep: 4,
    totalSteps: 9,
    completedCount: 3,
    requiredCount: 8,
    onBack: () => {
      console.log('Back button clicked - would navigate to previous screen');
    },
    onLogoClick: () => {
      console.log('Logo clicked - would navigate to home');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive version with console logging for testing callbacks.',
      },
    },
  },
};

// Story: Responsive Mobile View
export const MobileView: Story = {
  render: (args) => (
    <div style={{ width: '100%' }}>
      <PhotoGuideHeader {...args} />
      <div style={{ padding: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' }}>
        Mobile view: Reduced padding, smaller logo, optimized spacing for touch interfaces
      </div>
    </div>
  ),
  args: {
    currentStep: 3,
    totalSteps: 9,
    completedCount: 2,
    requiredCount: 8,
    onBack: () => console.log('Back clicked'),
    onLogoClick: () => console.log('Logo clicked'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Shows the header in mobile viewport (375px) with mobile-optimized spacing and layout.',
      },
    },
  },
};

// Story: Responsive Mobile - Very Small Screen
export const SmallMobileView: Story = {
  render: (args) => (
    <div style={{ width: '100%' }}>
      <PhotoGuideHeader {...args} />
      <div style={{ padding: 'var(--space-sm)', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' }}>
        Small mobile (< 480px): Controls stack vertically, minimal padding, compact layout
      </div>
    </div>
  ),
  args: {
    currentStep: 5,
    totalSteps: 9,
    completedCount: 4,
    requiredCount: 8,
    onBack: () => console.log('Back clicked'),
    onLogoClick: () => console.log('Logo clicked'),
  },
  parameters: {
    viewport: {
      viewports: {
        smallMobile: {
          name: 'Small Mobile',
          styles: {
            width: '320px',
            height: '568px',
          },
        },
      },
      defaultViewport: 'smallMobile',
    },
    docs: {
      description: {
        story: 'Shows the header on very small screens (320px) where controls stack vertically for better usability.',
      },
    },
  },
};

// Story: Responsive Tablet View
export const TabletView: Story = {
  render: (args) => (
    <div style={{ width: '100%' }}>
      <PhotoGuideHeader {...args} />
      <div style={{ padding: 'var(--space-lg)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' }}>
        Tablet view: Standard spacing, full-size logo, side-by-side controls
      </div>
    </div>
  ),
  args: {
    currentStep: 6,
    totalSteps: 9,
    completedCount: 5,
    requiredCount: 8,
    onBack: () => console.log('Back clicked'),
    onLogoClick: () => console.log('Logo clicked'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Shows the header in tablet viewport (768px) with standard spacing and layout.',
      },
    },
  },
};

// Story: Responsive Desktop View
export const DesktopView: Story = {
  render: (args) => (
    <div style={{ width: '100%' }}>
      <PhotoGuideHeader {...args} />
      <div style={{ padding: 'var(--space-xl)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' }}>
        Desktop view: Generous spacing, full-size logo, optimal for large screens
      </div>
    </div>
  ),
  args: {
    currentStep: 7,
    totalSteps: 9,
    completedCount: 6,
    requiredCount: 8,
    onBack: () => console.log('Back clicked'),
    onLogoClick: () => console.log('Logo clicked'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Shows the header in desktop viewport (1200px) with generous spacing and full layout.',
      },
    },
  },
};