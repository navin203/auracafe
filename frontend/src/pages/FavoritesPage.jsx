import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ExternalLink, Navigation, Sparkles, Coffee } from 'lucide-react';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import { useComparison } from '../context/ComparisonContext';
import { formatRating, formatPriceLevel, getDirectionsUrl } from '../utils/formatters';
import { LoadingSpinner } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { CompareDock } from '../components/CompareDock';

export const FavoritesPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toggleCafe, isSelected } = useComparison();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await favoriteService.getFavorites();
      setFavorites(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load favorite cafes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const handleRemove = async (placeId) => {
    try {
      await favoriteService.removeFavorite(placeId);
      setFavorites((prev) => prev.filter((f) => f.place_id !== placeId));
    } catch (err) {
      alert(err.message || 'Failed to remove favorite');
    }
  };

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '48px 24px',
          maxWidth: '500px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <Heart size={44} color="var(--accent-amber)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Sign in to View Favorites</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Save your favorite spots from Google Places and access them across all your devices.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '8px 20px' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px 20px 80px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={24} color="#ef4444" fill="#ef4444" /> Your Saved Cafes
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Cafes bookmarked from Google Places with verified information.
          </p>
        </div>
        <Link to="/search" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          Explore More Cafes
        </Link>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadFavorites} />}

      {loading ? (
        <LoadingSpinner text="Loading your saved cafes..." />
      ) : favorites.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '60px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <Coffee size={40} color="var(--accent-coffee)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No saved cafes yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem' }}>
            When browsing cafes on our interactive map or search page, click the heart icon to save your favorites here.
          </p>
          <Link to="/search" className="btn btn-primary" style={{ padding: '10px 24px', marginTop: '8px' }}>
            Search Cafes Now
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {favorites.map((fav) => {
            const cafeObj = {
              place_id: fav.place_id,
              name: fav.cafe_name,
              rating: fav.rating,
              user_ratings_total: fav.user_ratings_total,
              price_level: fav.price_level,
              address: fav.cafe_address,
              primary_photo: fav.photo_reference ? `/api/cafes/photo?ref=${encodeURIComponent(fav.photo_reference)}` : null,
              location: { lat: fav.latitude, lng: fav.longitude }
            };
            const compared = isSelected(fav.place_id);

            return (
              <div
                key={fav.id || fav.place_id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Link
                    to={`/cafe/${fav.place_id}`}
                    style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}
                  >
                    {fav.cafe_name}
                  </Link>

                  <button
                    onClick={() => handleRemove(fav.place_id)}
                    style={{ color: 'var(--text-muted)', padding: '4px' }}
                    title="Remove from favorites"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                    ★ {formatRating(fav.rating)}
                  </span>
                  <span>•</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {fav.user_ratings_total ? `${fav.user_ratings_total} reviews` : 'Reviews unlisted'}
                  </span>
                  <span>•</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>
                    {formatPriceLevel(fav.price_level)}
                  </span>
                </div>

                {fav.cafe_address && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {fav.cafe_address}
                  </p>
                )}

                <div style={{
                  marginTop: 'auto',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => toggleCafe(cafeObj)}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: compared ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: compared ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                      color: compared ? '#60a5fa' : 'var(--text-secondary)'
                    }}
                  >
                    {compared ? 'In Compare' : 'Compare'}
                  </button>

                  <a
                    href={getDirectionsUrl(cafeObj)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  >
                    <Navigation size={12} />
                    Directions
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CompareDock />
    </div>
  );
};
