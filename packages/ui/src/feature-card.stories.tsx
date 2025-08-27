import type { Meta, StoryObj } from '@storybook/react';
import { FeatureCard } from './feature-card';

const ClockIcon = (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ShieldIcon = (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const SettingsIcon = (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
    />
  </svg>
);

const meta: Meta<typeof FeatureCard> = {
  title: 'Components/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'FeatureCard component for displaying feature highlights with an icon, title, and description. Built on top of the Card component with consistent styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    iconBgColor: {
      control: 'color',
    },
    icon: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: ClockIcon,
    title: 'FASTER TURNAROUND. HAPPIER CLIENTS.',
    description: 'Deliver inspection files in record time with auto-labeling, built-in QA, and one-click exports—keeping your partners impressed and your pipeline moving.',
    iconBgColor: 'var(--success)',
  },
};

export const WithCustomColors: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
      <FeatureCard
        icon={ClockIcon}
        title="SUCCESS THEME"
        description="This card uses the success color theme for the icon background."
        iconBgColor="var(--success)"
      />
      <FeatureCard
        icon={ShieldIcon}
        title="INFO THEME"
        description="This card uses the info color theme for the icon background."
        iconBgColor="var(--info)"
      />
      <FeatureCard
        icon={SettingsIcon}
        title="PRIMARY GRADIENT"
        description="This card uses a primary gradient for the icon background."
        iconBgColor="linear-gradient(135deg, var(--primary-start), var(--primary-end))"
      />
    </div>
  ),
};

export const DifferentElevations: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
      <FeatureCard
        icon={ClockIcon}
        title="ELEVATION 1"
        description="Standard elevation for most use cases."
        iconBgColor="var(--success)"
        elevation={1}
      />
      <FeatureCard
        icon={ShieldIcon}
        title="ELEVATION 2"
        description="Medium elevation for emphasis."
        iconBgColor="var(--info)"
        elevation={2}
      />
      <FeatureCard
        icon={SettingsIcon}
        title="ELEVATION 3"
        description="High elevation for maximum emphasis."
        iconBgColor="var(--warning)"
        elevation={3}
      />
    </div>
  ),
};

export const InteractiveCard: Story = {
  args: {
    icon: ClockIcon,
    title: 'CLICKABLE FEATURE',
    description: 'This feature card has hover effects and can be clicked for interaction.',
    iconBgColor: 'var(--success)',
    onClick: () => alert('Feature card clicked!'),
    style: { cursor: 'pointer' },
  },
};

export const GridLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
      <FeatureCard
        icon={ClockIcon}
        title="FASTER TURNAROUND"
        description="Deliver inspection files in record time with auto-labeling and built-in QA."
        iconBgColor="var(--success)"
      />
      <FeatureCard
        icon={ShieldIcon}
        title="CONSISTENTLY ACCURATE"
        description="VIN verification, blur detection, and automated quality checks ensure reliability."
        iconBgColor="var(--info)"
      />
      <FeatureCard
        icon={SettingsIcon}
        title="TAILORED TO YOUR BUSINESS"
        description="Create custom workflows for every carrier or partner with flexible configuration."
        iconBgColor="linear-gradient(135deg, var(--primary-start), var(--primary-end))"
      />
    </div>
  ),
};