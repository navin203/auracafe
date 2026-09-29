import React, { useState } from 'react';
import { Search, Navigation, X, Compass, Loader2 } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useGeolocation } from '../hooks/useGeolocation';

export const SearchBar = ({ onSearchComplete, compact = false }) => {
  const { query, setQuery, searchByText, searchNearby, loading: searchLoading } = useSearch();
  const { getLocation, loading: geoLoading, error: geoError } = useGeolocation();
  const [inputVal, setInputVal] = useState(query || '');

  const quickPills = [
    'Best cafes near me',
    'Cafes near Bhopal',
    'Starbucks',
    'Cafes near Misrod Bhopal',
    'Third Wave Coffee',
    'Cozy work cafes'
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase().includes('near me')) {
      handleUseMyLocation();
      return;
    }

    await searchByText(trimmed);
    if (onSearchComplete) onSearchComplete();
  };

  const handleUseMyLocation = async () => {
    try {
      const coords = await getLocation();
      if (coords) {
        setInputVal('Current Location');
        await searchNearby(coords.lat, coords.lng);
        if (onSearchComplete) onSearchComplete();
      }
    } catch {
      // Geo error state handled in hook
    }
  };

  const handlePillClick = (pillText) => {
    setInputVal(pillText);
    if (pillText.toLowerCase().includes('near me')) {
      handleUseMyLocation();
    } else {
      searchByText(pillText);
      if (onSearchComplete) onSearchComplete();
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: compact ? '100%' : '760px', margin: '0 auto' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-strong)',
          borderRadius: compact ? 'var(--radius-md)' : 'var(--radius-lg)',
          padding: compact ? '6px 10px' : '10px 16px',
          boxShadow: 'var(--shadow-md)',
          gap: '8px',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
        }}
        className="searchbar-box"
      >
        <Search size={compact ? 18 : 22} color="var(--accent-amber)" style={{ flexShrink: 0 }} />

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Search cafes, locations (e.g. 'Cafes near Bhopal', 'Starbucks')..."
          style={{
            flex: 1,
            background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: compact ? '0.9rem' : '1.05rem',
            padding: '4px 6px'
          }}
        />

        {inputVal && (
          <button
            type="button"
            onClick={() => setInputVal('')}
            style={{ color: 'var(--text-muted)', padding: '4px' }}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}

        {/* Location button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={geoLoading || searchLoading}
          className="btn btn-secondary"
          style={{
            padding: compact ? '6px 10px' : '8px 14px',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            whiteSpace: 'nowrap'
          }}
          title="Detect my current GPS location"
        >
          {geoLoading ? (
            <Loader2 size={16} className="spin-icon" />
          ) : (
            <Navigation size={16} color="var(--accent-amber)" />
          )}
          <span className="location-btn-text">{geoLoading ? 'Locating...' : 'Near Me'}</span>
        </button>

        {/* Search Submit button */}
        <button
          type="submit"
          disabled={searchLoading}
          className="btn btn-primary"
          style={{
            padding: compact ? '6px 14px' : '8px 20px',
            fontSize: compact ? '0.85rem' : '0.95rem',
            borderRadius: 'var(--radius-sm)',
            whiteSpace: 'nowrap'
          }}
        >
          {searchLoading ? <Loader2 size={16} className="spin-icon" /> : 'Search'}
        </button>
      </form>

      {/* Geolocation warning if denied */}
      {geoError && (
        <div style={{
          marginTop: '8px',
          color: '#f87171',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>⚠️ {geoError}</span>
        </div>
      )}

      {/* Quick Suggestion Pills */}
      {!compact && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '16px',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Compass size={14} /> Popular:
          </span>
          {quickPills.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => handlePillClick(pill)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-amber)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {pill}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .searchbar-box:focus-within {
          border-color: var(--accent-amber) !important;
          box-shadow: 0 0 20px var(--accent-glow) !important;
        }
        .spin-icon {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .location-btn-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
