'use client';

import { Typography } from '@snapscope/ui/typography';
import { Card } from '@snapscope/ui/card';
import { useRouter } from 'next/navigation';

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
  maxWidth: '1200px',
  margin: '0 auto',
  padding: 'var(--space-lg) var(--space-md)',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 'var(--space-lg)',
  marginTop: 'var(--space-xl)',
};

const settingCardStyle: React.CSSProperties = {
  cursor: 'pointer',
  transition: 'var(--transition-default)',
};

interface SettingCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

function SettingCard({ title, description, icon, onClick }: SettingCardProps) {
  return (
    <Card
      padding="lg"
      style={settingCardStyle}
      onClick={onClick}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            textAlign: 'center',
          }}
        >
          {icon}
        </div>
        <div>
          <Typography variant="h3" style={{ marginBottom: 'var(--space-xs)' }}>
            {title}
          </Typography>
          <Typography variant="body" color="secondary">
            {description}
          </Typography>
        </div>
      </div>
    </Card>
  );
}

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <button
          style={backButtonStyle}
          onClick={() => router.push('/')}
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
            Settings
          </Typography>
          <Typography variant="body" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Manage your SnapScope preferences and configurations
          </Typography>
        </div>
      </div>

      <div style={containerStyle}>
        <div style={gridStyle}>
          <SettingCard
            title="Carrier Settings"
            description="Manage insurance carrier profiles and photo workflows"
            icon="🏢"
            onClick={() => router.push('/settings/carriers')}
          />

          {/* Placeholder cards for future settings */}
          <Card padding="lg" style={{ opacity: 0.6 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
              }}
            >
              <div style={{ fontSize: '48px', textAlign: 'center' }}>⚙️</div>
              <div>
                <Typography variant="h3" style={{ marginBottom: 'var(--space-xs)' }}>
                  Preferences
                </Typography>
                <Typography variant="body" color="secondary">
                  Coming Soon
                </Typography>
              </div>
            </div>
          </Card>

          <Card padding="lg" style={{ opacity: 0.6 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
              }}
            >
              <div style={{ fontSize: '48px', textAlign: 'center' }}>👤</div>
              <div>
                <Typography variant="h3" style={{ marginBottom: 'var(--space-xs)' }}>
                  Account
                </Typography>
                <Typography variant="body" color="secondary">
                  Coming Soon
                </Typography>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
