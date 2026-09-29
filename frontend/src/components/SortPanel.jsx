import React from 'react';
import { ArrowDownUp, Sparkles, Star, Navigation, MessageSquare, DollarSign } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

export const SortPanel = () => {
  const { sortBy, setSortBy } = useSearch();

  const sortOptions = [
    { id: 'recommended', label: 'Recommended', icon: Sparkles },
    { id: 'rating', label: 'Highest Rating', icon: Star },
    { id: 'distance', label: 'Closest', icon: Navigation },
    { id: 'reviews', label: 'Most Reviewed', icon: MessageSquare },
    { id: 'price', label: 'Lowest Price', icon: DollarSign }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '4px',
      scrollbarWidth: 'none'
    }}>
      <span style={{
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexShrink: 0
      }}>
        <ArrowDownUp size={13} /> Sort:
      </span>

      {sortOptions.map((opt) => {
        const Icon = opt.icon;
        const active = sortBy === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSortBy(opt.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              border: active ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
              background: active ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card)',
              color: active ? 'var(--accent-amber)' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            <Icon size={12} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
