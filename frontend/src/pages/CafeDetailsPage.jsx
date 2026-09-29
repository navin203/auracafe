import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  Navigation,
  ExternalLink,
  Heart,
  Sparkles,
  ArrowLeft,
  Coffee,
  Check,
  Plus,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { cafeService } from '../services/cafeService';
import { favoriteService } from '../services/favoriteService';
import { useComparison } from '../context/ComparisonContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { formatRating, formatReviews, formatPriceLevel, formatOpenStatus, getDirectionsUrl } from '../utils/formatters';
import { LoadingSpinner } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';

export const CafeDetailsPage = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { userLocation } = useSearch();
  const { isSelected, toggleCafe } = useComparison();
  const { isAuthenticated } = useAuth();

  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    cafeService.getCafeDetails(placeId, userLocation?.lat, userLocation?.lng)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data?.cafe;
        setCafe(data);
        setIsFav(!!data?.isFavorite);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load cafe details from Google Places.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [placeId, userLocation]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save this cafe to your favorites.');
      return;
    }

    if (!cafe) return;

    setFavLoading(true);
    try {
      if (isFav) {
        await favoriteService.removeFavorite(cafe.place_id);
        setIsFav(false);
      } else {
        await favoriteService.addFavorite(cafe);
        setIsFav(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px' }}>
        <LoadingSpinner text="Retrieving verified place details from Google Places..." />
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <ErrorMessage
          message={error || 'Cafe details could not be found.'}
          onRetry={() => window.location.reload()}
        />
        <button onClick={() => navigate('/search')} className="btn btn-secondary" style={{ marginTop: '16px' }}>
          <ArrowLeft size={16} /> Return to Search
        </button>
      </div>
    );
  }

  const compared = isSelected(cafe.place_id);
  const openStatus = formatOpenStatus(cafe.open_now);
  const photos = cafe.photos || [];

  return (
    <div className="container" style={{ padding: '32px 20px 80px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => toggleCafe(cafe)}
            className="btn btn-secondary"
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              border: compared ? '1px solid #3b82f6' : undefined,
              color: compared ? '#60a5fa' : undefined
            }}
          >
            {compared ? <Check size={16} /> : <Plus size={16} />}
            {compared ? 'In Comparison' : 'Add to Compare'}
          </button>

          <button
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Heart size={16} color={isFav ? '#ef4444' : 'currentColor'} fill={isFav ? '#ef4444' : 'none'} />
            {isFav ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Hero Photo & Gallery */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          width: '100%',
          height: 'clamp(260px, 40vw, 420px)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: '#0f172a',
          position: 'relative',
          border: '1px solid var(--border-subtle)'
        }}>
          {photos.length > 0 ? (
            <img
              src={photos[activePhotoIdx]?.url || cafe.primary_photo}
              alt={cafe.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)'
            }}>
              <Coffee size={48} color="var(--accent-coffee)" />
              <span style={{ color: 'var(--text-muted)' }}>No Google photos uploaded for this place</span>
            </div>
          )}

          {/* Status badge overlay */}
          <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
            <span className={`badge ${openStatus.className}`} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              {openStatus.label}
            </span>
          </div>
        </div>

        {/* Thumbnails row */}
        {photos.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {photos.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                style={{
                  width: '80px',
                  height: '60px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: activePhotoIdx === idx ? '2px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                  opacity: activePhotoIdx === idx ? 1 : 0.6,
                  transition: 'all 0.15s ease'
                }}
              >
                <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Title & Core Overview Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px'
      }}>
        {/* Left Column: Core Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, color: 'var(--text-primary)' }}>
              {cafe.name}
            </h1>
            {cafe.address && (
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.95rem' }}>
                <MapPin size={16} color="var(--accent-amber)" />
                {cafe.address}
              </p>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '12px',
            background: 'var(--bg-card)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <Star size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />
                <strong style={{ fontSize: '1.1rem', color: 'var(--accent-gold)' }}>{formatRating(cafe.rating)}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 5.0</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reviews</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '2px' }}>
                {formatReviews(cafe.user_ratings_total)}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Price</span>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
                {formatPriceLevel(cafe.price_level)}
              </div>
            </div>

            {cafe.distance?.text && (
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Distance</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '2px' }}>
                  {cafe.distance.text}
                </div>
              </div>
            )}
          </div>

          {/* Contact Details & Links */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Contact & Location Information</h3>

            {cafe.phone_number && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <Phone size={16} color="var(--text-secondary)" />
                <a href={`tel:${cafe.phone_number}`} style={{ color: 'var(--accent-amber)' }}>
                  {cafe.phone_number}
                </a>
              </div>
            )}

            {cafe.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                <Globe size={16} color="var(--text-secondary)" />
                <a href={cafe.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Official Website <ExternalLink size={13} />
                </a>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <a
                href={getDirectionsUrl(cafe, userLocation)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px' }}
              >
                <Navigation size={16} /> Get Directions
              </a>

              <a
                href={cafe.google_maps_url || getDirectionsUrl(cafe)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px' }}
              >
                <ExternalLink size={16} /> Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Hours & Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Operating Hours */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--accent-amber)" /> Opening Hours
            </h3>

            {Array.isArray(cafe.opening_hours?.weekday_text) && cafe.opening_hours.weekday_text.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cafe.opening_hours.weekday_text.map((dayLine, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      padding: '6px 0',
                      borderBottom: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <span>{dayLine.split(': ')[0]}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{dayLine.split(': ')[1] || 'Closed'}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Detailed weekly operating hours are not reported on Google Places for this location.
              </p>
            )}
          </div>

          {/* Place categories / tags */}
          {cafe.types && cafe.types.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                Google Place Categories
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {cafe.types.map((type) => (
                  <span
                    key={type}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      textTransform: 'capitalize'
                    }}
                  >
                    {type.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verified Google Reviews Section */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '28px'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={20} color="var(--accent-amber)" /> Verified Google Reviews
        </h3>

        {cafe.reviews && cafe.reviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cafe.reviews.map((rev, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-strong)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--accent-amber)'
                    }}>
                      {(rev.author_name || 'U')[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{rev.author_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.relative_time_description}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s < (rev.rating || 0) ? 'var(--accent-gold)' : 'none'}
                        color={s < (rev.rating || 0) ? 'var(--accent-gold)' : 'var(--text-muted)'}
                      />
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginTop: '4px' }}>
                  {rev.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No individual review texts were returned by Google Places for this location.
          </p>
        )}
      </div>
    </div>
  );
};
