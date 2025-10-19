import * as React from 'react';
import { Card } from './card';
import { Button } from './button';
import { Input } from './input';

export interface CarrierOption {
  id: string;
  name: string;
  photoCount: number;
  isTemplate?: boolean;
}

export interface CarrierSelectorProps {
  carriers: CarrierOption[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCarrier: (carrierId: string) => void;
  onSkip: () => void;
  onCreateNew?: () => void;
  title?: string;
  className?: string;
}

const overlayStyle: React.CSSProperties = {
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
  maxWidth: '600px',
  width: '100%',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'var(--shadow-3)',
};

const headerStyle: React.CSSProperties = {
  padding: 'var(--space-lg)',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-xl)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--text-primary)',
  margin: 0,
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  padding: '4px',
  lineHeight: 1,
  fontFamily: 'inherit',
};

const bodyStyle: React.CSSProperties = {
  padding: 'var(--space-lg)',
  overflowY: 'auto',
  flex: 1,
};

const searchContainerStyle: React.CSSProperties = {
  marginBottom: 'var(--space-lg)',
};

const carrierListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
};

const carrierItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--space-md)',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--border-radius-md)',
  cursor: 'pointer',
  transition: 'var(--transition-default)',
};

const carrierInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-xs)',
};

const carrierNameStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-body)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--text-primary)',
  margin: 0,
};

const carrierMetaStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-small)',
  color: 'var(--text-secondary)',
};

const templateBadgeStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-small)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--primary-start)',
  background: 'var(--primary-light)',
  padding: '4px 8px',
  borderRadius: 'var(--border-radius-sm)',
  marginLeft: 'var(--space-xs)',
};

const footerStyle: React.CSSProperties = {
  padding: 'var(--space-lg)',
  borderTop: '1px solid var(--border-color)',
  display: 'flex',
  gap: 'var(--space-md)',
  flexWrap: 'wrap',
};

const emptyStateStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: 'var(--space-xl)',
  color: 'var(--text-secondary)',
};

const hoverStyle: React.CSSProperties = {
  background: 'var(--bg-hover)',
  borderColor: 'var(--primary-start)',
};

export const CarrierSelector = React.forwardRef<HTMLDivElement, CarrierSelectorProps>(
  (
    {
      carriers,
      isOpen,
      onClose,
      onSelectCarrier,
      onSkip,
      onCreateNew,
      title = 'Select Carrier Workflow',
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [hoveredId, setHoveredId] = React.useState<string | null>(null);

    const filteredCarriers = React.useMemo(() => {
      if (!searchQuery.trim()) return carriers;
      const query = searchQuery.toLowerCase();
      return carriers.filter((carrier) =>
        carrier.name.toLowerCase().includes(query)
      );
    }, [carriers, searchQuery]);

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div
        style={overlayStyle}
        onClick={handleOverlayClick}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="carrier-selector-title"
      >
        <div ref={ref} className={className} style={modalStyle}>
          <div style={headerStyle}>
            <h2 id="carrier-selector-title" style={titleStyle}>
              {title}
            </h2>
            <button
              type="button"
              style={closeButtonStyle}
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div style={bodyStyle}>
            <div style={searchContainerStyle}>
              <Input
                type="search"
                placeholder="Search carriers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search carriers"
              />
            </div>

            {filteredCarriers.length > 0 ? (
              <div style={carrierListStyle}>
                {filteredCarriers.map((carrier) => (
                  <div
                    key={carrier.id}
                    style={{
                      ...carrierItemStyle,
                      ...(hoveredId === carrier.id ? hoverStyle : {}),
                    }}
                    onClick={() => {
                      onSelectCarrier(carrier.id);
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredId(carrier.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectCarrier(carrier.id);
                        onClose();
                      }
                    }}
                  >
                    <div style={carrierInfoStyle}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={carrierNameStyle}>{carrier.name}</span>
                        {carrier.isTemplate && (
                          <span style={templateBadgeStyle}>Template</span>
                        )}
                      </div>
                      <span style={carrierMetaStyle}>
                        {carrier.photoCount}{' '}
                        {carrier.photoCount === 1 ? 'photo' : 'photos'} required
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={emptyStateStyle}>
                <p>No carriers found matching "{searchQuery}"</p>
                {onCreateNew && (
                  <Button variant="secondary" size="sm" onClick={onCreateNew}>
                    Create Custom Carrier
                  </Button>
                )}
              </div>
            )}
          </div>

          <div style={footerStyle}>
            <Button variant="secondary" onClick={onSkip} style={{ flex: 1 }}>
              Skip (Use Default)
            </Button>
            {onCreateNew && (
              <Button
                variant="secondary"
                onClick={() => {
                  onCreateNew();
                  onClose();
                }}
                style={{ flex: 1 }}
              >
                Create New
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CarrierSelector.displayName = 'CarrierSelector';
