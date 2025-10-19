import type { Meta, StoryObj } from '@storybook/react';
import { PhotoNotesDisplay } from './photo-notes-display';
import { useState } from 'react';

const meta: Meta<typeof PhotoNotesDisplay> = {
  title: 'Components/PhotoNotesDisplay',
  component: PhotoNotesDisplay,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Inline damage notes display and editing component with auto-save functionality. Shows collapsed view with notes or "Add Notes" button, expands to editable TextArea with debounced auto-save.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    notes: {
      control: 'text',
      description: 'Current notes text',
    },
    onSave: {
      action: 'saved',
      description: 'Callback when notes are saved (debounced)',
    },
    isSaving: {
      control: 'boolean',
      description: 'External saving state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for TextArea',
    },
    debounceMs: {
      control: 'number',
      description: 'Debounce delay in milliseconds',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NoNotes: Story = {
  args: {
    notes: '',
    placeholder: 'Describe any visible damage, severity, or important details...',
  },
};

export const WithNotes: Story = {
  args: {
    notes: 'Front bumper has deep scratches and dents on the driver side. Paint is chipped and there appears to be some rust forming.',
    placeholder: 'Describe any visible damage, severity, or important details...',
  },
};

export const ShortNotes: Story = {
  args: {
    notes: 'Minor scratch on door.',
    placeholder: 'Describe any visible damage, severity, or important details...',
  },
};

export const LongNotes: Story = {
  args: {
    notes: 'Extensive damage to the entire front end of the vehicle. The hood is severely dented and misaligned. Front bumper is completely cracked and hanging loose on the passenger side. Both headlights are shattered and non-functional. The radiator support appears to be bent, and there may be engine damage. Driver side fender has multiple deep scratches and large dent. Paint damage extends along the entire driver side panel. Estimated repair cost will be significant.',
    placeholder: 'Describe any visible damage, severity, or important details...',
  },
};

export const Interactive: Story = {
  render: () => {
    const [notes, setNotes] = useState('Front bumper damage with scratches.');
    const [saving, setSaving] = useState(false);

    const handleSave = async (newNotes: string) => {
      console.log('Saving notes:', newNotes);
      setSaving(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setNotes(newNotes);
      setSaving(false);
      console.log('Notes saved:', newNotes);
    };

    return (
      <div style={{ maxWidth: '480px' }}>
        <PhotoNotesDisplay
          notes={notes}
          onSave={handleSave}
          isSaving={saving}
        />

        <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
          <strong>Current Notes Value:</strong>
          <pre style={{ marginTop: 'var(--space-xs)', whiteSpace: 'pre-wrap', fontSize: 'var(--font-size-small)' }}>
            {notes || '(empty)'}
          </pre>
        </div>
      </div>
    );
  },
};

export const FastDebounce: Story = {
  render: () => {
    const [notes, setNotes] = useState('');

    const handleSave = async (newNotes: string) => {
      console.log('Saving notes (fast):', newNotes);
      setNotes(newNotes);
    };

    return (
      <div style={{ maxWidth: '480px' }}>
        <PhotoNotesDisplay
          notes={notes}
          onSave={handleSave}
          debounceMs={300}
        />

        <p style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--text-secondary)' }}>
          This example uses a 300ms debounce (faster than default 800ms). Check console for save events.
        </p>
      </div>
    );
  },
};

export const SaveError: Story = {
  render: () => {
    const [notes, setNotes] = useState('These notes will fail to save.');

    const handleSave = async (newNotes: string) => {
      console.log('Attempting to save:', newNotes);

      // Simulate save error
      await new Promise((_, reject) => setTimeout(() => reject(new Error('Save failed')), 1000));
    };

    return (
      <div style={{ maxWidth: '480px' }}>
        <PhotoNotesDisplay
          notes={notes}
          onSave={handleSave}
        />

        <p style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-small)', color: 'var(--error)' }}>
          This example simulates a save error. Edit the notes to see the error state.
        </p>
      </div>
    );
  },
};

export const WithinPhotoCard: Story = {
  render: () => {
    const [notes, setNotes] = useState('Front bumper has deep scratches.');

    const handleSave = async (newNotes: string) => {
      console.log('Saving notes:', newNotes);
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotes(newNotes);
    };

    return (
      <div style={{ maxWidth: '480px' }}>
        {/* Simulated photo preview */}
        <div style={{
          width: '100%',
          height: '240px',
          background: 'linear-gradient(135deg, #4a5f7f, #5a6f8f)',
          borderRadius: 'var(--border-radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-md)',
          border: '2px solid var(--color-success)',
          color: 'white',
          fontSize: 'var(--font-size-h3)',
          fontWeight: 'var(--font-weight-bold)',
        }}>
          Front View Photo
        </div>

        {/* Notes component */}
        <PhotoNotesDisplay
          notes={notes}
          onSave={handleSave}
        />

        {/* Simulated guidance text */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-small)',
          fontStyle: 'italic',
          marginBottom: 'var(--space-lg)',
        }}>
          💡 Stand back to capture the entire front of the vehicle. Include license plate and any front damage.
        </p>
      </div>
    );
  },
};

export const MobileView: Story = {
  render: () => {
    const [notes, setNotes] = useState('Minor scratch on passenger door.');

    const handleSave = async (newNotes: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotes(newNotes);
    };

    return (
      <div style={{
        maxWidth: '375px',
        margin: '0 auto',
        padding: 'var(--space-md)',
        background: 'var(--bg-primary)',
        minHeight: '600px',
      }}>
        <div style={{
          width: '100%',
          height: '200px',
          background: 'linear-gradient(135deg, #6a7f9f, #7a8faf)',
          borderRadius: 'var(--border-radius-md)',
          marginBottom: 'var(--space-md)',
          border: '2px solid var(--color-success)',
        }} />

        <PhotoNotesDisplay
          notes={notes}
          onSave={handleSave}
        />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
