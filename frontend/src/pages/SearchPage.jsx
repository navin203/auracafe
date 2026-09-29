import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { CafeList } from '../components/CafeList';
import { CafeMap } from '../components/CafeMap';
import { CompareDock } from '../components/CompareDock';
import { ErrorMessage } from '../components/ErrorMessage';
import { List, Map as MapIcon, Filter, SlidersHorizontal } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

export const SearchPage = () => {
  const { cafes, searchCenter, error, setError, query, searchByText, rawCafes } = useSearch();

  // Mobile view mode: 'list' | 'map'
  const [viewMode, setViewMode] = useState('list');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // If page opened with no cafes loaded yet, trigger default search
  useEffect(() => {
    if (rawCafes.length === 0 && !query) {
      searchByText('cafes in Bhopal');
    }
  }, [rawCafes.length, query, searchByText]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 70px)' }}>
      {/* Top Search & Filter Bar */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px 20px',
        position: 'sticky',
        top: '70px',
        zIndex: 40
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <SearchBar compact={true} />
            </div>

            {/* Mobile View Toggle & Filter Button */}
            <div className="mobile-toggle-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                title="Toggle Filters"
              >
                <SlidersHorizontal size={16} />
                <span className="toggle-label">Filters</span>
              </button>

              <div style={{
                display: 'inline-flex',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                padding: '3px'
              }}>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: viewMode === 'list' ? 'var(--accent-amber)' : 'transparent',
                    color: viewMode === 'list' ? '#0f172a' : 'var(--text-secondary)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem'
                  }}
                >
                  <List size={14} />
                  <span className="toggle-label">List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: viewMode === 'map' ? 'var(--accent-amber)' : 'transparent',
                    color: viewMode === 'map' ? '#0f172a' : 'var(--text-secondary)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem'
                  }}
                >
                  <MapIcon size={14} />
                  <span className="toggle-label">Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="mobile-filter-drawer" style={{ marginTop: '8px' }}>
              <FilterPanel isMobile={true} onClose={() => setMobileFilterOpen(false)} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => searchByText(query || 'cafes')}
            actionLabel="Retry Search"
          />
        )}

        {/* Desktop Split Screen Layout */}
        <div className="desktop-split-container" style={{
          display: 'grid',
          gridTemplateColumns: '260px minmax(360px, 1fr) minmax(380px, 1fr)',
          gap: '24px',
          alignItems: 'start',
          flex: 1
        }}>
          {/* Left Column: Filter Panel */}
          <aside className="desktop-filters" style={{ position: 'sticky', top: '150px' }}>
            <FilterPanel />
          </aside>

          {/* Center Column: Cafe List */}
          <main className={`search-list-col ${viewMode === 'map' ? 'mobile-hide' : ''}`} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <CafeList />
          </main>

          {/* Right Column: Google Map */}
          <aside className={`search-map-col ${viewMode === 'list' ? 'mobile-hide' : ''}`} style={{
            position: 'sticky',
            top: '150px',
            height: 'calc(100vh - 180px)',
            minHeight: '400px'
          }}>
            <CafeMap cafes={cafes} searchCenter={searchCenter} height="100%" />
          </aside>
        </div>
      </div>

      {/* Floating Bottom Comparison Dock */}
      <CompareDock />

      <style>{`
        @media (max-width: 1024px) {
          .desktop-split-container {
            grid-templateColumns: 1fr !important;
          }
          .desktop-filters {
            display: none !important;
          }
          .search-map-col {
            position: relative !important;
            top: 0 !important;
            height: 550px !important;
          }
          .mobile-hide {
            display: none !important;
          }
        }
        @media (min-width: 1025px) {
          .mobile-toggle-group {
            display: none !important;
          }
          .mobile-filter-drawer {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .toggle-label {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
