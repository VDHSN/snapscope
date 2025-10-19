'use client';

import { useState, useRef } from 'react';
import { Typography } from '@snapscope/ui/typography';
import { Button } from '@snapscope/ui/button';
import { Input } from '@snapscope/ui/input';
import { CarrierCard } from '@snapscope/ui/carrier-card';
import { useRouter } from 'next/navigation';
import { useCarrierSettings } from '@/hooks/useCarrierSettings';
import { ErrorBoundary } from '@/components/error-boundary';
import { useToast } from '@snapscope/ui/toast';
import { CARRIER_TEMPLATE_LIST } from '@/lib/carrier-templates';

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

const actionsRowStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: 'var(--space-lg) auto 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'var(--space-md)',
  flexWrap: 'wrap',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: 'var(--space-lg) var(--space-md)',
};

const searchStyle: React.CSSProperties = {
  marginBottom: 'var(--space-lg)',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 'var(--space-lg)',
};

const emptyStateStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: 'var(--space-2xl)',
  background: 'var(--bg-surface)',
  borderRadius: 'var(--border-radius-lg)',
  border: '2px dashed var(--border-color)',
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

const templateGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 'var(--space-md)',
  marginTop: 'var(--space-lg)',
};

const templateButtonStyle: React.CSSProperties = {
  padding: 'var(--space-md)',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--border-radius-md)',
  cursor: 'pointer',
  transition: 'var(--transition-default)',
  textAlign: 'left',
  fontFamily: 'inherit',
};

function CarriersPageContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    carriers,
    loading,
    error,
    deleteCarrier,
    exportCarriers,
    importCarriers,
  } = useCarrierSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCarriers = carriers.filter((carrier) =>
    carrier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    try {
      const jsonData = exportCarriers();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snapscope-carriers-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      showToast('Failed to export carriers', 'error');
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = await importCarriers(text);
      if (result.success) {
        showToast(`Successfully imported ${result.imported ?? 0} carriers`, 'success');
      } else {
        showToast(`Import failed: ${result.error ?? 'Unknown error'}`, 'error');
      }
    } catch (err) {
      console.error('Import failed:', err);
      showToast('Failed to import carriers', 'error');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setShowTemplateModal(false);
    router.push(`/settings/carriers/new?template=${templateId}`);
  };

  const handleDelete = async (carrierId: string) => {
    if (!confirm('Are you sure you want to delete this carrier?')) return;

    try {
      await deleteCarrier(carrierId);
      showToast('Carrier deleted successfully', 'success');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to delete carrier', 'error');
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ ...containerStyle, textAlign: 'center', paddingTop: 'var(--space-2xl)' }}>
          <Typography variant="body">Loading carriers...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <button
          style={backButtonStyle}
          onClick={() => router.push('/settings')}
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
            Carrier Settings
          </Typography>
          <Typography variant="body" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Manage insurance carrier profiles and photo workflows
          </Typography>
        </div>

        <div style={actionsRowStyle}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              Export
            </Button>
            <Button variant="secondary" size="sm" onClick={handleImport}>
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
          <Button onClick={() => setShowTemplateModal(true)}>Add Carrier</Button>
        </div>
      </div>

      <div style={containerStyle}>
        {error && (
          <div
            style={{
              padding: 'var(--space-md)',
              background: 'var(--error)',
              color: 'white',
              borderRadius: 'var(--border-radius-md)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            {error}
          </div>
        )}

        <div style={searchStyle}>
          <Input
            type="search"
            placeholder="Search carriers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredCarriers.length === 0 ? (
          <div style={emptyStateStyle}>
            <Typography variant="h3" style={{ marginBottom: 'var(--space-md)' }}>
              {searchQuery ? 'No carriers found' : 'No carriers yet'}
            </Typography>
            <Typography variant="body" color="secondary" style={{ marginBottom: 'var(--space-lg)' }}>
              {searchQuery
                ? 'Try a different search term'
                : 'Add your first carrier to get started'}
            </Typography>
            {!searchQuery && (
              <Button onClick={() => setShowTemplateModal(true)}>Add Carrier</Button>
            )}
          </div>
        ) : (
          <div style={gridStyle}>
            {filteredCarriers.map((carrier) => (
              <CarrierCard
                key={carrier.id}
                name={carrier.name}
                photoCount={carrier.workflow.standardPhotos.length}
                isTemplate={carrier.isTemplate}
                onEdit={() => router.push(`/settings/carriers/${carrier.id}`)}
                onDelete={() => handleDelete(carrier.id)}
                onSelect={() => router.push(`/settings/carriers/${carrier.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {showTemplateModal && (
        <div
          style={modalOverlayStyle}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTemplateModal(false);
          }}
        >
          <div style={modalStyle}>
            <Typography variant="h2" style={{ marginBottom: 'var(--space-md)' }}>
              Choose a Template
            </Typography>
            <Typography variant="body" color="secondary" style={{ marginBottom: 'var(--space-lg)' }}>
              Select a carrier template to start with
            </Typography>

            <div style={templateGridStyle}>
              {CARRIER_TEMPLATE_LIST.map((template) => (
                <button
                  key={template.id}
                  style={templateButtonStyle}
                  onClick={() => handleTemplateSelect(template.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.borderColor = 'var(--primary-start)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-surface)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  <Typography variant="h3" style={{ marginBottom: 'var(--space-xs)' }}>
                    {template.name}
                  </Typography>
                  <Typography variant="body" color="secondary">
                    {template.photoCount} photos
                  </Typography>
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              onClick={() => setShowTemplateModal(false)}
              style={{ width: '100%', marginTop: 'var(--space-lg)' }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CarriersPage() {
  return (
    <ErrorBoundary>
      <CarriersPageContent />
    </ErrorBoundary>
  );
}
