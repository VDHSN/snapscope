'use client';

import * as React from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastContainerProps {
  toasts: Toast[];
}

function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--space-lg)',
        right: 'var(--space-lg)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
        maxWidth: '400px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => (
        <ToastMessage key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

interface ToastMessageProps {
  toast: Toast;
}

function ToastMessage({ toast }: ToastMessageProps) {
  const colors: Record<ToastType, string> = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      style={{
        background: 'var(--bg-primary)',
        border: `2px solid ${colors[toast.type]}`,
        borderRadius: 'var(--border-radius-md)',
        padding: 'var(--space-md)',
        boxShadow: 'var(--shadow-3)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        pointerEvents: 'auto',
        animation: 'slideInRight 0.3s ease-out',
        minWidth: '300px',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: colors[toast.type],
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          flexShrink: 0,
        }}
      >
        {icons[toast.type]}
      </div>
      <p
        style={{
          margin: 0,
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-body)',
          flex: 1,
        }}
      >
        {toast.message}
      </p>
    </div>
  );
}
