import type { Meta, StoryObj } from '@storybook/react';
import { PhotoGuideHeader } from './photo-guide-header';

const meta: Meta<typeof PhotoGuideHeader> = {
  title: 'Photo Guide/PhotoGuideHeader',
  component: PhotoGuideHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Header component for the photo guide flow, featuring navigation, progress tracking, and branding.',
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