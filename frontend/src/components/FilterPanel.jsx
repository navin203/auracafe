import React from 'react';
import { Filter, RotateCcw, Star, DollarSign, Clock, MapPin, MessageSquare } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

export const FilterPanel = ({ isMobile = false, onClose }) => {
  const { filters, updateFilters, resetFilters } = useSearch();

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--accent-amber)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Filters</h3>
        </div>
        <button
          onClick={resetFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          title="Reset all filters"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      {/* 1. Open Now Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)'
      }}>
        <label
          htmlFor="filter-open-now"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}
        >
          <Clock size={16} color="#34d399" />
          <span>Open Now Only</span>
        </label>
        <input
          id="filter-open-now"
          type="checkbox"
          checked={filters.openNow}
          onChange={(e) => updateFilters({ openNow: e.target.checked })}
          style={{ width: '18px', height: '18px', accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
        />
      </div>

      {/* 2. Rating Filter */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
          <Star size={15} color="var(--accent-gold)" />
          Minimum Rating
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { label: 'Any', value: 0 },
            { label: '3.5+', value: 3.5 },
            { label: '4.0+', value: 4.0 },
            { label: '4.5+', value: 4.5 }
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => updateFilters({ minRating: item.value })}
              style={{
                padding: '6px 0',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: filters.minRating === item.value ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                background: filters.minRating === item.value ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: filters.minRating === item.value ? 'var(--accent-amber)' : 'var(--text-secondary)'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Distance Radius */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
          <MapPin size={15} color="var(--accent-amber)" />
          Max Distance
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { label: 'Any', value: null },
            { label: '2 km', value: 2 },
            { label: '5 km', value: 5 },
            { label: '10 km', value: 10 }
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => updateFilters({ maxDistance: item.value })}
              style={{
                padding: '6px 0',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: filters.maxDistance === item.value ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                background: filters.maxDistance === item.value ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: filters.maxDistance === item.value ? 'var(--accent-amber)' : 'var(--text-secondary)'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Price Level */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
          <DollarSign size={15} color="#34d399" />
          Price Level
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {[
            { label: 'Any', value: null },
            { label: '$', value: 1 },
            { label: '$$', value: 2 },
            { label: '$$$', value: 3 },
            { label: '$$$$', value: 4 }
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => updateFilters({ priceLevel: item.value })}
              style={{
                padding: '6px 0',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: filters.priceLevel === item.value ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                background: filters.priceLevel === item.value ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: filters.priceLevel === item.value ? 'var(--accent-amber)' : 'var(--text-secondary)'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Minimum Reviews */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
          <MessageSquare size={15} color="#60a5fa" />
          Review Count
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { label: 'Any', value: 0 },
            { label: '50+', value: 50 },
            { label: '200+', value: 200 },
            { label: '500+', value: 500 }
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => updateFilters({ minReviews: item.value })}
              style={{
                padding: '6px 0',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: filters.minReviews === item.value ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                background: filters.minReviews === item.value ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: filters.minReviews === item.value ? 'var(--accent-amber)' : 'var(--text-secondary)'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {isMobile && onClose && (
        <button
          onClick={onClose}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '8px' }}
        >
          Apply Filters
        </button>
      )}
    </div>
  );
};
