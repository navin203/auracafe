import React from 'react';
import { CafeCard } from './CafeCard';
import { CafeCardSkeleton } from './LoadingSkeleton';
import { SortPanel } from './SortPanel';
import { Coffee, SearchX } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

export const CafeList = () => {
  const { cafes, loading, query } = useSearch();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ height: '24px', width: '180px' }} />
          <div className="skeleton" style={{ height: '32px', width: '220px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <CafeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (cafes.length === 0) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '60px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}>
          <SearchX size={32} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No cafes found</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.9rem' }}>
          We couldn't find cafes matching your current filters or query{query ? ` ("${query}")` : ''}. Try expanding your search distance or resetting filters.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* List Header & Sorting */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Coffee size={18} color="var(--accent-amber)" />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {cafes.length} {cafes.length === 1 ? 'Cafe' : 'Cafes'} Found
          </span>
          {query && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              for "{query}"
            </span>
          )}
        </div>

        <SortPanel />
      </div>

      {/* Grid of Cafe Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {cafes.map((cafe) => (
          <CafeCard key={cafe.place_id} cafe={cafe} />
        ))}
      </div>
    </div>
  );
};
