import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, ArrowRight, Trash2 } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';

export const CompareDock = () => {
  const { selectedCafes, removeCafe, clearSelection, count, notification } = useComparison();
  const navigate = useNavigate();

  if (count === 0 && !notification) return null;

  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 110,
          background: 'rgba(239, 68, 68, 0.9)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {notification}
        </div>
      )}

      {/* Floating Bottom Comparison Dock */}
      {count > 0 && (
        <div className="compare-dock">
          {/* Badge & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--accent-amber)',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              {count}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }} className="dock-title">
              Selected ({count}/5)
            </span>
          </div>

          {/* Selected Cafe Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            maxWidth: '460px',
            padding: '2px 0'
          }} className="dock-chips">
            {selectedCafes.map((cafe) => (
              <div
                key={cafe.place_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cafe.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeCafe(cafe.place_id)}
                  style={{
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    padding: '2px'
                  }}
                  title="Remove from comparison"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={clearSelection}
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 8px'
              }}
              title="Clear all selected cafes"
            >
              <Trash2 size={14} />
              <span className="dock-clear-text">Clear</span>
            </button>

            <button
              onClick={() => navigate('/compare')}
              className="btn btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} />
              <span>Compare {count >= 2 ? `Now (${count})` : `(Add 1 more)`}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .dock-chips { display: none !important; }
          .dock-clear-text { display: none !important; }
        }
      `}</style>
    </>
  );
};
