import type { Meta, StoryObj } from '@storybook/react';
import { AssessmentCard } from './assessment-card';
import type { Assessment } from './types';

const meta: Meta<typeof AssessmentCard> = {
  title: 'Assessments Page/AssessmentCard',
  component: AssessmentCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Assessment card component for displaying vehicle damage assessments with status, VIN, and relative timestamps.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample assessment data
const sampleAssessments: Record<string, Assessment> = {
  toyotaCamry: {
    id: '1',
    vehicleName: '2020 Toyota Camry',
    status: 'COMPLETE',
    dateUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    claimId: 'claim-1',
    vin: '1FMPU18L9WLA04056',
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    exportedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  hondaCRV: {
    id: '2',
    vehicleName: '2019 Honda CR-V',
    status: 'IN PROGRESS',
    dateUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    claimId: 'claim-2',
    vin: 'JTEDS41AX82059224',
  },
  fordF150: {
    id: '3',
    vehicleName: '2021 Ford F-150',
    status: 'COMPLETE',
    dateUpdated: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    claimId: 'claim-3',
    vin: 'JTJGF10U630150394',
    completedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  chevroletMalibu: {
    id: '4',
    vehicleName: '2018 Chevrolet Malibu',
    status: 'IN PROGRESS',
    dateUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    claimId: 'claim-4',
    vin: '4A3AE35G11E084392',
  },
};

export const Default: Story = {
  args: {
    assessment: sampleAssessments.toyotaCamry,
  },
};

export const Complete: Story = {
  args: {
    assessment: sampleAssessments.toyotaCamry,
  },
};

export const InProgress: Story = {
  args: {
    assessment: sampleAssessments.hondaCRV,
  },
};

export const RecentAssessment: Story = {
  args: {
    assessment: sampleAssessments.fordF150,
  },
};

export const OlderAssessment: Story = {
  args: {
    assessment: sampleAssessments.chevroletMalibu,
  },
};

export const Interactive: Story = {
  args: {
    assessment: sampleAssessments.toyotaCamry,
    onClick: () => alert('Assessment selected!'),
  },
};

export const VariousTimestamps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <AssessmentCard assessment={sampleAssessments.fordF150} />
      <AssessmentCard assessment={sampleAssessments.toyotaCamry} />
      <AssessmentCard assessment={sampleAssessments.hondaCRV} />
      <AssessmentCard assessment={sampleAssessments.chevroletMalibu} />
    </div>
  ),
};

export const StatusVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <AssessmentCard assessment={sampleAssessments.toyotaCamry} />
      <AssessmentCard assessment={sampleAssessments.hondaCRV} />
    </div>
  ),
};

export const WithClickHandlers: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <AssessmentCard 
        assessment={sampleAssessments.toyotaCamry} 
        onClick={() => alert('Toyota Camry selected!')}
      />
      <AssessmentCard 
        assessment={sampleAssessments.hondaCRV}
        onClick={() => alert('Honda CR-V selected!')}
      />
      <AssessmentCard 
        assessment={sampleAssessments.fordF150}
        onClick={() => alert('Ford F-150 selected!')}
      />
    </div>
  ),
};