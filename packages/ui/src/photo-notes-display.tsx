import React, { useState, useCallback, useEffect, useRef } from "react";
import { Typography } from "./typography";
import { TextArea } from "./textarea";

export interface PhotoNotesDisplayProps {
  notes?: string;
  onSave: (notes: string) => Promise<void> | void;
  isSaving?: boolean;
  placeholder?: string;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export const PhotoNotesDisplay = React.memo<PhotoNotesDisplayProps>(
  ({
    notes = "",
    onSave,
    isSaving = false,
    placeholder = "Describe any visible damage, severity, or important details...",
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localNotes, setLocalNotes] = useState(notes);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const savedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update local notes when prop changes (from external save)
    // Always sync to receive save confirmations
    // handleCollapse ensures pending changes are saved before component unmounts/collapses
    useEffect(() => {
      setLocalNotes(notes);
    }, [notes]);

    // Handle save with status updates
    const handleSave = useCallback(
      async (newNotes: string) => {
        setSaveStatus("saving");
        try {
          await onSave(newNotes);
          setSaveStatus("saved");

          // Clear saved status after 2 seconds
          if (savedTimeoutRef.current) {
            clearTimeout(savedTimeoutRef.current);
          }
          savedTimeoutRef.current = setTimeout(() => {
            setSaveStatus("idle");
          }, 2000);
        } catch (error) {
          console.error("Failed to save notes:", error);
          setSaveStatus("error");
        }
      },
      [onSave]
    );

    // Handle text change
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setLocalNotes(newValue);
      },
      []
    );

    // Handle expand
    const handleExpand = useCallback(() => {
      setIsEditing(true);
      // Focus textarea after expansion animation
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }, []);

    // Handle collapse
    const handleCollapse = useCallback(() => {
      setIsEditing(false);
      // Save any pending changes immediately when collapsing
      if (localNotes !== notes) {
        handleSave(localNotes);
      }
    }, [localNotes, notes, handleSave]);

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Escape") {
          handleCollapse();
        }
      },
      [handleCollapse]
    );

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (savedTimeoutRef.current) {
          clearTimeout(savedTimeoutRef.current);
        }
      };
    }, []);

    // Render save status
    const renderSaveStatus = () => {
      if (isSaving || saveStatus === "saving") {
        return (
          <Typography
            variant="caption"
            style={{
              color: "var(--text-secondary)",
              fontSize: "var(--font-size-xs)",
              fontStyle: "italic",
            }}
          >
            Saving...
          </Typography>
        );
      }

      if (saveStatus === "saved") {
        return (
          <Typography
            variant="caption"
            style={{
              color: "var(--color-success)",
              fontSize: "var(--font-size-xs)",
              fontStyle: "italic",
            }}
          >
            Saved ✓
          </Typography>
        );
      }

      if (saveStatus === "error") {
        return (
          <Typography
            variant="caption"
            style={{
              color: "var(--error)",
              fontSize: "var(--font-size-xs)",
            }}
          >
            Failed to save
          </Typography>
        );
      }

      return null;
    };

    // Collapsed view with notes
    if (!isEditing && localNotes) {
      return (
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "var(--border-radius-md)",
            padding: "var(--space-sm)",
            marginBottom: "var(--space-md)",
            border: "1px solid var(--border-color)",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "var(--space-sm)",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-xs)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                <span style={{ fontSize: "14px" }} aria-hidden="true">
                  📝
                </span>
                <Typography
                  variant="caption"
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "var(--font-size-xs)",
                    fontWeight: "var(--font-weight-semibold)",
                  }}
                >
                  Damage Notes
                </Typography>
              </div>
              <Typography
                variant="body"
                style={{
                  color: "var(--text-primary)",
                  fontSize: "var(--font-size-small)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  lineHeight: "1.4",
                }}
              >
                {localNotes}
              </Typography>
            </div>
            <button
              onClick={handleExpand}
              style={{
                background: "transparent",
                border: "none",
                padding: "var(--space-xs)",
                cursor: "pointer",
                color: "var(--primary-end)",
                fontSize: "var(--font-size-small)",
                fontWeight: "var(--font-weight-semibold)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-xs)",
                minHeight: "44px",
                minWidth: "44px",
                justifyContent: "center",
                borderRadius: "var(--border-radius-sm)",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-surface)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
              aria-label="Edit damage notes"
            >
              ✏️
            </button>
          </div>
        </div>
      );
    }

    // Expanded editing view
    if (isEditing) {
      return (
        <div
          style={{
            background: "var(--bg-surface)",
            borderRadius: "var(--border-radius-md)",
            padding: "var(--space-md)",
            marginBottom: "var(--space-md)",
            border: "2px solid var(--primary-end)",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-sm)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-xs)",
              }}
            >
              <span style={{ fontSize: "14px" }} aria-hidden="true">
                📝
              </span>
              <Typography
                variant="body"
                style={{
                  color: "var(--text-primary)",
                  fontSize: "var(--font-size-small)",
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                Damage Notes
              </Typography>
            </div>
            <button
              onClick={handleCollapse}
              style={{
                background: "var(--primary-end)",
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
                color: "white",
                fontSize: "var(--font-size-xs)",
                fontWeight: "var(--font-weight-semibold)",
                borderRadius: "var(--border-radius-sm)",
                minHeight: "32px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
              aria-label="Done editing notes"
            >
              Done
            </button>
          </div>

          <TextArea
            ref={textareaRef}
            value={localNotes}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={3}
            size="md"
            style={{
              marginBottom: "var(--space-xs)",
            }}
            aria-label="Damage notes text area"
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              style={{
                color: "var(--text-secondary)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              Press Esc or tap Done to finish
            </Typography>
            {renderSaveStatus()}
          </div>
        </div>
      );
    }

    // Collapsed view without notes (Add button)
    return (
      <button
        onClick={handleExpand}
        style={{
          background: "var(--bg-secondary)",
          border: "1px dashed var(--border-color)",
          borderRadius: "var(--border-radius-md)",
          padding: "var(--space-md)",
          marginBottom: "var(--space-md)",
          cursor: "pointer",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-sm)",
          minHeight: "44px",
          transition: "all 0.2s ease",
          color: "var(--text-secondary)",
          fontSize: "var(--font-size-small)",
          fontWeight: "var(--font-weight-medium)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--bg-surface)";
          e.currentTarget.style.borderColor = "var(--primary-end)";
          e.currentTarget.style.color = "var(--primary-end)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--bg-secondary)";
          e.currentTarget.style.borderColor = "var(--border-color)";
          e.currentTarget.style.color = "var(--text-secondary)";
        }}
        aria-label="Add damage notes"
      >
        <span aria-hidden="true">➕</span>
        <span>Add damage notes</span>
      </button>
    );
  }
);

PhotoNotesDisplay.displayName = "PhotoNotesDisplay";
