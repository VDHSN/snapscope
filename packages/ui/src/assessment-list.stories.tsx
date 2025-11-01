import type { Meta, StoryObj } from '@storybook/react';
import { AssessmentList } from './assessment-list';
import type { Assessment } from './types';

const meta: Meta<typeof AssessmentList> = {
  title: 'Assessments Page/AssessmentList',
  component: AssessmentList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Assessment list component that displays a collection of vehicle assessments with empty states, loading, and error handling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onAssessmentSelect: { action: 'assessment selected' },
    onAddAssessment: { action: 'add assessment clicked' },
    loading: { control: 'boolean' },
    error: { control: 'text' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample assessment data matching the design
const sampleAssessments: Assessment[] = [
  {
    id: '1',
    vehicleName: '2020 Toyota Camry',
    status: 'COMPLETE',
    dateUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    claimId: 'claim-1',
    vin: '1FMPU18L9WLA04056',
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    vehicleName: '2019 Honda CR-V',
    status: 'IN PROGRESS',
    dateUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    claimId: 'claim-2',
    vin: 'JTEDS41AX82059224',
  },
  {
    id: '3',
    vehicleName: '2021 Ford F-150',
    status: 'COMPLETE',
    dateUpdated: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    claimId: 'claim-3',
    vin: 'JTJGF10U630150394',
    completedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '4',
    vehicleName: '2018 Chevrolet Malibu',
    status: 'IN PROGRESS',
    dateUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    claimId: 'claim-4',
    vin: '4A3AE35G11E084392',
  },
];

export const Default: Story = {
  args: {
    assessments: sampleAssessments,
  },
};

export const EmptyState: Story = {
  args: {
    assessments: [],
  },
};

export const Loading: Story = {
  args: {
    assessments: [],
    loading: true,
  },
};

export const Error: Story = {
  args: {
    assessments: [],
    error: 'Failed to load assessments. Please try again.',
  },
};

export const SingleAssessment: Story = {
  args: {
    assessments: [sampleAssessments[0]],
  },
};

export const TwoAssessments: Story = {
  args: {
    assessments: [sampleAssessments[0], sampleAssessments[1]],
  },
};

export const ManyAssessments: Story = {
  args: {
    assessments: [
      ...sampleAssessments,
      {
        id: '5',
        vehicleName: '2017 Nissan Altima',
        status: 'COMPLETE',
        dateUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        claimId: 'claim-5',
        vin: '2FALP74W8RX149728',
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: '6',
        vehicleName: '2022 Tesla Model 3',
        status: 'IN PROGRESS',
        dateUpdated: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        claimId: 'claim-6',
        vin: '5YJ3E1EA5NF123456',
      },
    ],
  },
};

export const Interactive: Story = {
  args: {
    assessments: sampleAssessments.slice(0, 2),
    onAssessmentSelect: (assessment: Assessment) => {
      console.log('Selected assessment:', assessment.vehicleName);
    },
    onAddAssessment: () => {
      console.log('adding new assessment');
    },
  },
};

export const ReadOnlyMode: Story = {
  args: {
    assessments: sampleAssessments.slice(0, 2),
    readOnly: true,
  },
};

export const ReadOnlyEmptyState: Story = {
  args: {
    assessments: [],
    readOnly: true,
  },
};

export const WithCreateButton: Story = {
  args: {
    assessments: sampleAssessments.slice(0, 2),
    readOnly: false,
    onAddAssessment: () => {
      console.log('Create Assessment clicked!');
    },
  },
};

export const WithAllStates: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-xl)' }}>
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>Empty State (Editable)</h3>
        <div style={{ border: '1px solid var(--divider-color)', borderRadius: '8px', padding: 'var(--space-md)' }}>
          <AssessmentList assessments={[]} readOnly={false} />
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>Empty State (Read Only)</h3>
        <div style={{ border: '1px solid var(--divider-color)', borderRadius: '8px', padding: 'var(--space-md)' }}>
          <AssessmentList assessments={[]} readOnly={true} />
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>Loading State</h3>
        <div style={{ border: '1px solid var(--divider-color)', borderRadius: '8px', padding: 'var(--space-md)' }}>
          <AssessmentList assessments={[]} loading={true} />
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>Error State</h3>
        <div style={{ border: '1px solid var(--divider-color)', borderRadius: '8px', padding: 'var(--space-md)' }}>
          <AssessmentList assessments={[]} error="Failed to load assessments" />
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>With Data (Editable)</h3>
        <div style={{ border: '1px solid var(--divider-color)', borderRadius: '8px', padding: 'var(--space-md)' }}>
          <AssessmentList assessments={sampleAssessments.slice(0, 2)} readOnly={false} />
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: 'var(--space-md)' }}>With Data (Read Only)</h3>
        <div style={{ border: '1px solid var(--divider-color)', borderRadius: '8px', padding: 'var(--space-md)' }}>
          <AssessmentList assessments={sampleAssessments.slice(0, 2)} readOnly={true} />
        </div>
      </div>
    </div>
  ),
};