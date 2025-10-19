import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PhotoStepCard } from './photo-step-card';
import { Button } from './button';

export interface PhotoStep {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  order: number;
  category: 'exterior' | 'interior' | 'vin' | 'damage';
}

export interface WorkflowBuilderProps {
  steps: PhotoStep[];
  onChange: (steps: PhotoStep[]) => void;
  onAddStep?: () => void;
  onEditStep?: (stepId: string) => void;
  onDeleteStep?: (stepId: string) => void;
  onToggleRequired?: (stepId: string) => void;
  className?: string;
  maxSteps?: number;
}

interface SortablePhotoStepProps {
  step: PhotoStep;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleRequired?: () => void;
}

const SortablePhotoStep: React.FC<SortablePhotoStepProps> = ({
  step,
  onEdit,
  onDelete,
  onToggleRequired,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <PhotoStepCard
        order={step.order}
        label={step.label}
        description={step.description}
        category={step.category}
        required={step.required}
        draggable
        dragHandleProps={{ ...attributes, ...listeners }}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleRequired={onToggleRequired}
      />
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
};

const addButtonContainerStyle: React.CSSProperties = {
  marginTop: 'var(--space-md)',
};

const emptyStateStyle: React.CSSProperties = {
  padding: 'var(--space-xl)',
  textAlign: 'center',
  background: 'var(--bg-surface)',
  border: '2px dashed var(--border-color)',
  borderRadius: 'var(--border-radius-md)',
  color: 'var(--text-secondary)',
};

export const WorkflowBuilder = React.forwardRef<HTMLDivElement, WorkflowBuilderProps>(
  (
    {
      steps,
      onChange,
      onAddStep,
      onEditStep,
      onDeleteStep,
      onToggleRequired,
      className,
      maxSteps,
    },
    ref
  ) => {
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragEnd = React.useCallback(
      (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
          const oldIndex = steps.findIndex((step) => step.id === active.id);
          const newIndex = steps.findIndex((step) => step.id === over.id);

          const reorderedSteps = arrayMove(steps, oldIndex, newIndex);

          const updatedSteps = reorderedSteps.map((step, index) => ({
            ...step,
            order: index + 1,
          }));

          onChange(updatedSteps);
        }
      },
      [steps, onChange]
    );

    const handleToggleRequired = React.useCallback(
      (stepId: string) => {
        const updatedSteps = steps.map((step) =>
          step.id === stepId ? { ...step, required: !step.required } : step
        );
        onChange(updatedSteps);
        onToggleRequired?.(stepId);
      },
      [steps, onChange, onToggleRequired]
    );

    const handleDelete = React.useCallback(
      (stepId: string) => {
        const filteredSteps = steps.filter((step) => step.id !== stepId);
        const updatedSteps = filteredSteps.map((step, index) => ({
          ...step,
          order: index + 1,
        }));
        onChange(updatedSteps);
        onDeleteStep?.(stepId);
      },
      [steps, onChange, onDeleteStep]
    );

    const handleEdit = React.useCallback(
      (stepId: string) => {
        onEditStep?.(stepId);
      },
      [onEditStep]
    );

    const canAddMore = !maxSteps || steps.length < maxSteps;

    return (
      <div ref={ref} className={className} style={containerStyle}>
        {steps.length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={{ margin: 0, marginBottom: 'var(--space-md)' }}>
              No photo steps defined yet
            </p>
            {onAddStep && (
              <Button variant="secondary" onClick={onAddStep}>
                Add Your First Photo Step
              </Button>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={steps.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div style={listStyle}>
                {steps.map((step) => (
                  <SortablePhotoStep
                    key={step.id}
                    step={step}
                    onEdit={onEditStep ? () => handleEdit(step.id) : undefined}
                    onDelete={
                      onDeleteStep ? () => handleDelete(step.id) : undefined
                    }
                    onToggleRequired={
                      onToggleRequired
                        ? () => handleToggleRequired(step.id)
                        : undefined
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {onAddStep && steps.length > 0 && (
          <div style={addButtonContainerStyle}>
            <Button
              variant="secondary"
              onClick={onAddStep}
              disabled={!canAddMore}
              style={{ width: '100%' }}
            >
              {canAddMore
                ? 'Add Photo Step'
                : `Maximum ${maxSteps} steps reached`}
            </Button>
          </div>
        )}
      </div>
    );
  }
);

WorkflowBuilder.displayName = 'WorkflowBuilder';
