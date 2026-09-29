import React, { useState } from 'react';
import { CafeMap } from '../components/CafeMap';
import { CafeCard } from '../components/CafeCard';
import { SearchBar } from '../components/SearchBar';
import { CompareDock } from '../components/CompareDock';
import { useSearch } from '../context/SearchContext';
import { ChevronDown, ChevronUp, Layers, List } from 'lucide-react';

export const MapPage = () => {
  const { cafes, searchCenter } = useSearch();
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
      {/* Floating Search Controls */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        width: 'calc(100% - 40px)',
        maxWidth: '640px'
      }}>
        <SearchBar compact={true} />
      </div>

      {/* Full Viewport Map */}
      <div style={{ width: '100%', height: '100%' }}>
        <CafeMap cafes={cafes} searchCenter={searchCenter} height="100%" />
      </div>

      {/* Floating Bottom Drawer for Cafe Cards */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-strong)',
        transition: 'all 0.3s ease',
        maxHeight: drawerOpen ? '320px' : '48px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Drawer Toggle Header */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          style={{
            height: '48px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: drawerOpen ? '1px solid var(--border-subtle)' : 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
            <List size={16} color="var(--accent-amber)" />
            <span>Cafes on Map ({cafes.length})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{drawerOpen ? 'Collapse Drawer' : 'Show List'}</span>
            {drawerOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </button>

        {/* Horizontal scroll of cafe mini cards */}
        {drawerOpen && (
          <div style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            padding: '16px 20px',
            flex: 1
          }}>
            {cafes.map((cafe) => (
              <div key={cafe.place_id} style={{ width: '280px', flexShrink: 0 }}>
                <CafeCard cafe={cafe} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating comparison dock */}
      <CompareDock />
    </div>
  );
};
