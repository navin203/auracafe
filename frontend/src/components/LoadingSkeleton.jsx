import React from 'react';

export const CafeCardSkeleton = () => {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '16px'
    }}>
      <div className="skeleton" style={{ height: '160px', width: '100%', borderRadius: 'var(--radius-sm)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ height: '22px', width: '60%' }} />
        <div className="skeleton" style={{ height: '22px', width: '25%' }} />
      </div>
      <div className="skeleton" style={{ height: '14px', width: '80%' }} />
      <div className="skeleton" style={{ height: '14px', width: '40%' }} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <div className="skeleton" style={{ height: '36px', flex: 1 }} />
        <div className="skeleton" style={{ height: '36px', width: '40px' }} />
      </div>
    </div>
  );
};

export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '3px solid rgba(245, 158, 11, 0.2)',
        borderTopColor: 'var(--accent-amber)',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>{text}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
