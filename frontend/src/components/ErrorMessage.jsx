import React from 'react';
import { AlertCircle, RefreshCw, MapPin } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry, actionLabel = 'Try Again' }) => {
  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      borderRadius: 'var(--radius-md)',
      padding: '20px 24px',
      margin: '16px 0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px'
    }}>
      <AlertCircle size={24} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        <h4 style={{ color: '#f87171', fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>
          Notice
        </h4>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn btn-secondary"
            style={{
              marginTop: '12px',
              padding: '6px 14px',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
