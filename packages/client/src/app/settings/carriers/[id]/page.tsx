'use client';

import { useState, useEffect, use } from 'react';
import { Typography } from '@snapscope/ui/typography';
import { Button } from '@snapscope/ui/button';
import { Input } from '@snapscope/ui/input';
import { WorkflowBuilder, PhotoStep } from '@snapscope/ui/workflow-builder';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCarrierSettings } from '@/hooks/useCarrierSettings';
import { createCarrierFromTemplate } from '@/lib/carrier-templates';
import { sanitizeCarrierName, sanitizeInput } from '@/lib/utils';
import { useToast } from '@snapscope/ui/toast';
import type { Carrier } from '@/types/claim';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'var(--bg-primary)',
  paddingBottom: 'var(--space-2xl)',
};

const headerStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
  padding: 'var(--space-xl) var(--space-md)',
  color: 'white',
  position: 'relative',
};

const backButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'var(--space-md)',
  left: 'var(--space-md)',
  background: 'rgba(255, 255, 255, 0.2)',
  border: 'none',
  color: 'white',
  padding: 'var(--space-sm) var(--space-md)',
  borderRadius: 'var(--border-radius-md)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-xs)',
  fontSize: 'var(--font-size-body)',
  fontWeight: 'var(--font-weight-medium)',
  transition: 'var(--transition-default)',
  fontFamily: 'inherit',
};

const headerContentStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  textAlign: 'center',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '900px',
  margin: '0 auto',
  padding: 'var(--space-lg) var(--space-md)',
};

const sectionStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-lg)',
  marginBottom: 'var(--space-lg)',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-md)',
  justifyContent: 'space-between',
  marginTop: 'var(--space-xl)',
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: 'var(--space-md)',
};

const modalStyle: React.CSSProperties = {
  background: 'var(--bg-primary)',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-xl)',
  maxWidth: '500px',
  width: '100%',
  boxShadow: 'var(--shadow-3)',
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: 'var(--space-md)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 'var(--space-xs)',
  fontSize: 'var(--font-size-small)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--text-primary)',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: 'var(--space-sm)',
  borderRadius: 'var(--border-radius-md)',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-surface)',
  color: 'var(--text-primary)',
  fontSize: 'var(--font-size-body)',
  fontFamily: 'inherit',
};

interface CarrierEditorPageProps {
  params: Promise<{ id: string }>;
}

export default function CarrierEditorPage({ params }: CarrierEditorPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { saveCarrier, deleteCarrier, getCarrier } = useCarrierSettings();

  const [carrier, setCarrier] = useState<Carrier | null>(null);
  const [carrierName, setCarrierName] = useState('');
  const [steps, setSteps] = useState<PhotoStep[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStepData, setNewStepData] = useState({
    label: '',
    description: '',
    category: 'exterior' as PhotoStep['category'],
    required: true,
  });

  useEffect(() => {
    const templateId = searchParams.get('template');

    if (resolvedParams.id === 'new') {
      if (templateId) {
        const newCarrier = createCarrierFromTemplate(templateId);
        if (newCarrier) {
          setCarrier(newCarrier);
          setCarrierName(newCarrier.name);
          setSteps(newCarrier.workflow.standardPhotos);
        }
      }
    } else {
      const existingCarrier = getCarrier(resolvedParams.id);
      if (existingCarrier) {
        setCarrier(existingCarrier);
        setCarrierName(existingCarrier.name);
        setSteps(existingCarrier.workflow.standardPhotos);
      }
    }
  }, [resolvedParams.id, searchParams, getCarrier]);

  useEffect(() => {
    if (!carrier) return;

    const hasChanges =
      carrierName !== carrier.name ||
      JSON.stringify(steps) !== JSON.stringify(carrier.workflow.standardPhotos);

    setIsDirty(hasChanges);
  }, [carrier, carrierName, steps]);

  const handleSave = async () => {
    if (!carrier) return;

    try {
      const updatedCarrier: Carrier = {
        ...carrier,
        name: sanitizeCarrierName(carrierName),
        workflow: {
          ...carrier.workflow,
          standardPhotos: steps,
        },
        updatedAt: new Date(),
      };

      await saveCarrier(updatedCarrier);
      setIsDirty(false);
      showToast('Carrier saved successfully', 'success');
      router.push('/settings/carriers');
    } catch (err) {
      console.error('Save failed:', err);
      showToast('Failed to save carrier', 'error');
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    router.push('/settings/carriers');
  };

  const handleDelete = async () => {
    if (!carrier) return;
    if (!confirm(`Are you sure you want to delete "${carrier.name}"?`)) return;

    try {
      await deleteCarrier(carrier.id);
      showToast('Carrier deleted successfully', 'success');
      router.push('/settings/carriers');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to delete carrier', 'error');
    }
  };

  const handleAddStep = () => {
    setShowAddModal(true);
  };

  const handleCreateStep = () => {
    if (!newStepData.label.trim()) {
      showToast('Please enter a label for the photo step', 'warning');
      return;
    }

    const newStep: PhotoStep = {
      id: crypto.randomUUID(),
      label: sanitizeInput(newStepData.label),
      description: newStepData.description ? sanitizeInput(newStepData.description) : undefined,
      category: newStepData.category,
      required: newStepData.required,
      order: steps.length + 1,
    };

    setSteps([...steps, newStep]);
    setShowAddModal(false);
    setNewStepData({
      label: '',
      description: '',
      category: 'exterior',
      required: true,
    });
  };

  if (!carrier) {
    return (
      <div style={pageStyle}>
        <div style={{ ...containerStyle, textAlign: 'center', paddingTop: 'var(--space-2xl)' }}>
          <Typography variant="body">Loading carrier...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <button
          style={backButtonStyle}
          onClick={handleCancel}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          ← Back
        </button>

        <div style={headerContentStyle}>
          <Typography variant="h1" style={{ color: 'white', marginBottom: 'var(--space-sm)' }}>
            {resolvedParams.id === 'new' ? 'Create Carrier' : 'Edit Carrier'}
          </Typography>
          {isDirty && (
            <Typography variant="body" style={{ color: 'rgba(255, 200, 100, 1)' }}>
              You have unsaved changes
            </Typography>
          )}
        </div>
      </div>

      <div style={containerStyle}>
        <div style={sectionStyle}>
          <Typography variant="h3" style={{ marginBottom: 'var(--space-md)' }}>
            Carrier Information
          </Typography>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Carrier Name</label>
            <Input
              type="text"
              value={carrierName}
              onChange={(e) => setCarrierName(e.target.value)}
              placeholder="Enter carrier name"
            />
          </div>
        </div>

        <div style={sectionStyle}>
          <Typography variant="h3" style={{ marginBottom: 'var(--space-md)' }}>
            Photo Workflow
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: 'var(--space-lg)' }}>
            Configure the sequence of photos required for this carrier
          </Typography>

          <WorkflowBuilder
            steps={steps}
            onChange={setSteps}
            onAddStep={handleAddStep}
            onDeleteStep={() => {}} // Enable delete buttons (deletion handled by onChange)
            onToggleRequired={(stepId) => {
              const updatedSteps = steps.map((step) =>
                step.id === stepId ? { ...step, required: !step.required } : step
              );
              setSteps(updatedSteps);
            }}
          />
        </div>

        <div style={actionsStyle}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            {resolvedParams.id !== 'new' && !carrier.isTemplate && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
          <Button onClick={handleSave} disabled={!isDirty}>
            Save Changes
          </Button>
        </div>
      </div>

      {showAddModal && (
        <div
          style={modalOverlayStyle}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div style={modalStyle}>
            <Typography variant="h2" style={{ marginBottom: 'var(--space-lg)' }}>
              Add Photo Step
            </Typography>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Label *</label>
              <Input
                type="text"
                value={newStepData.label}
                onChange={(e) =>
                  setNewStepData({ ...newStepData, label: e.target.value })
                }
                placeholder="e.g., Front View"
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Description</label>
              <Input
                type="text"
                value={newStepData.description}
                onChange={(e) =>
                  setNewStepData({ ...newStepData, description: e.target.value })
                }
                placeholder="e.g., Capture entire front of vehicle"
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Category</label>
              <select
                style={selectStyle}
                value={newStepData.category}
                onChange={(e) =>
                  setNewStepData({
                    ...newStepData,
                    category: e.target.value as PhotoStep['category'],
                  })
                }
              >
                <option value="exterior">Exterior</option>
                <option value="interior">Interior</option>
                <option value="vin">VIN</option>
                <option value="damage">Damage</option>
              </select>
            </div>

            <div style={formGroupStyle}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <input
                  type="checkbox"
                  checked={newStepData.required}
                  onChange={(e) =>
                    setNewStepData({ ...newStepData, required: e.target.checked })
                  }
                />
                <span style={labelStyle}>Required</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <Button variant="secondary" onClick={() => setShowAddModal(false)} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button onClick={handleCreateStep} style={{ flex: 1 }}>
                Add Step
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
