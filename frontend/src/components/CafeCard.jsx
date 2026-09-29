import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, DollarSign, Clock, ExternalLink, Navigation, Heart, Check, Plus, Coffee } from 'lucide-react';
import { formatRating, formatReviews, formatPriceLevel, formatOpenStatus, getDirectionsUrl } from '../utils/formatters';
import { useComparison } from '../context/ComparisonContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { favoriteService } from '../services/favoriteService';

export const CafeCard = ({ cafe, isFavoriteInitial = false }) => {
  const { isSelected, toggleCafe } = useComparison();
  const { selectedCafe, setSelectedCafe, hoveredCafeId, setHoveredCafeId, userLocation } = useSearch();
  const { isAuthenticated } = useAuth();

  const [isFav, setIsFav] = useState(isFavoriteInitial);
  const [favLoading, setFavLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!cafe) return null;

  const compared = isSelected(cafe.place_id);
  const isActive = selectedCafe?.place_id === cafe.place_id;
  const isHovered = hoveredCafeId === cafe.place_id;

  const openStatus = formatOpenStatus(cafe.open_now);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to save cafes to your favorites list.');
      return;
    }

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

  const handleCompareClick = (e) => {
    e.stopPropagation();
    toggleCafe(cafe);
  };

  const photoUrl = (!imgError && cafe.primary_photo) ? cafe.primary_photo : null;

  return (
    <div
      onClick={() => setSelectedCafe(cafe)}
      onMouseEnter={() => setHoveredCafeId(cafe.place_id)}
      onMouseLeave={() => setHoveredCafeId(null)}
      style={{
        background: isActive ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: isActive
          ? '2px solid var(--accent-amber)'
          : isHovered
            ? '1px solid var(--accent-coffee)'
            : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'all var(--transition-fast)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isActive ? '0 0 20px var(--accent-glow)' : 'var(--shadow-sm)',
        position: 'relative'
      }}
      className="cafe-card"
    >
      {/* Photo Header */}
      <div style={{ position: 'relative', height: '160px', width: '100%', background: '#0f172a' }}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={cafe.name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            color: 'var(--text-muted)'
          }}>
            <Coffee size={36} color="var(--accent-coffee)" />
            <span style={{ fontSize: '0.8rem' }}>Google Place Preview</span>
          </div>
        )}

        {/* Status Badge */}
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <span className={`badge ${openStatus.className}`}>
            {openStatus.label}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={favLoading}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: isFav ? '#ef4444' : 'var(--text-primary)',
            transition: 'all 0.15s ease'
          }}
          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={16} fill={isFav ? '#ef4444' : 'none'} />
        </button>

        {/* Distance chip if available */}
        {cafe.distance?.text && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(4px)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px 8px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Navigation size={12} color="var(--accent-amber)" />
            {cafe.distance.text}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {/* Title and Rating */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <Link
              to={`/cafe/${cafe.place_id}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
                lineHeight: 1.3
              }}
              className="cafe-title-link"
            >
              {cafe.name}
            </Link>

            {/* Rating pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '3px 7px',
              flexShrink: 0
            }}>
              <Star size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                {formatRating(cafe.rating)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>{formatReviews(cafe.user_ratings_total)}</span>
            <span>•</span>
            <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
              {formatPriceLevel(cafe.price_level)}
            </span>
          </div>
        </div>

        {/* Address */}
        {cafe.address && (
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px',
            lineHeight: 1.4
          }}>
            <MapPin size={14} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {cafe.address}
            </span>
          </p>
        )}

        {/* Actions Row */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          {/* Compare Button */}
          <button
            onClick={handleCompareClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: compared ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: compared ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
              color: compared ? '#60a5fa' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            {compared ? <Check size={14} /> : <Plus size={14} />}
            {compared ? 'In Compare' : 'Compare'}
          </button>

          {/* External Google Map Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <a
              href={getDirectionsUrl(cafe, userLocation)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn-icon"
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)'
              }}
              title="Get directions on Google Maps"
            >
              <Navigation size={12} />
              Directions
            </a>

            <a
              href={cafe.google_maps_url || getDirectionsUrl(cafe)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn-icon"
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Open place in Google Maps"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .cafe-card:hover .cafe-title-link {
          color: var(--accent-amber) !important;
        }
      `}</style>
    </div>
  );
};
