import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { CafeDetailsPage } from './pages/CafeDetailsPage';
import { ComparePage } from './pages/ComparePage';
import { MapPage } from './pages/MapPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HistoryPage } from './pages/HistoryPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { Coffee, Heart } from 'lucide-react';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cafe/:placeId" element={<CafeDetailsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Modern Footer */}
      <footer style={{
        background: 'rgba(10, 14, 23, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '36px 20px',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coffee size={20} color="var(--accent-amber)" />
            <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              AuraCafe
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              • Powered by Official Google Maps Platform & Google Places
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a href="/search" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s ease' }}>
              Find Cafes
            </a>
            <a href="/compare" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s ease' }}>
              Compare
            </a>
            <a href="/map" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s ease' }}>
              Map Explorer
            </a>
            <a href="/favorites" style={{ color: 'var(--text-secondary)', transition: 'color 0.15s ease' }}>
              Saved Places
            </a>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} AuraCafe. Strictly real Places data.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
