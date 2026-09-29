import React from 'react';
import { Star, MapPin, DollarSign, Clock, Phone, Globe, Navigation, ExternalLink, X, Coffee, CheckCircle, AlertCircle } from 'lucide-react';
import { formatRating, formatReviews, formatPriceLevel, formatOpenStatus, getDirectionsUrl } from '../utils/formatters';

export const ComparisonTable = ({ cafes = [], onRemoveCafe }) => {
  if (!cafes || cafes.length === 0) return null;

  return (
    <div style={{
      width: '100%',
      overflowX: 'auto',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        minWidth: `${Math.max(640, cafes.length * 240 + 160)}px`
      }}>
        <thead>
          <tr>
            <th style={{
              padding: '20px 16px',
              width: '180px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderBottom: '2px solid var(--border-strong)',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)'
            }}>
              Feature
            </th>
            {cafes.map((cafe) => (
              <th
                key={cafe.place_id}
                style={{
                  padding: '20px 16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderBottom: '2px solid var(--border-strong)',
                  verticalAlign: 'top',
                  minWidth: '220px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Photo & Remove Button */}
                  <div style={{ position: 'relative', width: '100%', height: '120px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#0f172a' }}>
                    {cafe.primary_photo ? (
                      <img
                        src={cafe.primary_photo}
                        alt={cafe.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b' }}>
                        <Coffee size={28} color="var(--accent-coffee)" />
                      </div>
                    )}
                    {onRemoveCafe && (
                      <button
                        onClick={() => onRemoveCafe(cafe.place_id)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: 'rgba(15, 23, 42, 0.8)',
                          color: '#f87171',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}
                        title="Remove cafe from comparison"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Cafe Name */}
                  <h4 style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.3
                  }}>
                    {cafe.name}
                  </h4>

                  {/* App Comparison Score if available */}
                  {cafe.app_comparison_score !== undefined && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
                      border: '1px solid var(--accent-amber)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      alignSelf: 'flex-start'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Score:</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--accent-gold)' }}>
                        {cafe.app_comparison_score}/100
                      </strong>
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Row 1: Google Rating */}
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={15} color="var(--accent-gold)" /> Rating
              </div>
            </td>
            {cafes.map((cafe) => (
              <td key={cafe.place_id} style={{ padding: '14px 16px' }}>
                {cafe.rating ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                      ★ {formatRating(cafe.rating)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 5.0</span>
                  </div>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not available</span>
                )}
              </td>
            ))}
          </tr>

          {/* Row 2: Review Volume */}
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Total Reviews
            </td>
            {cafes.map((cafe) => (
              <td key={cafe.place_id} style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {cafe.user_ratings_total !== null && cafe.user_ratings_total !== undefined
                  ? `${cafe.user_ratings_total.toLocaleString()} Google reviews`
                  : <span style={{ color: 'var(--text-muted)' }}>Not available</span>}
              </td>
            ))}
          </tr>

          {/* Row 3: Distance */}
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Navigation size={15} color="var(--accent-amber)" /> Distance
              </div>
            </td>
            {cafes.map((cafe) => (
              <td key={cafe.place_id} style={{ padding: '14px 16px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {cafe.distance?.text || (cafe.distance?.km ? `${cafe.distance.km} km` : <span style={{ color: 'var(--text-muted)' }}>Not calculated</span>)}
              </td>
            ))}
          </tr>

          {/* Row 4: Price Level */}
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={15} color="#34d399" /> Price Level
              </div>
            </td>
            {cafes.map((cafe) => (
              <td key={cafe.place_id} style={{ padding: '14px 16px' }}>
                {typeof cafe.price_level === 'number' ? (
                  <span style={{ fontWeight: 700, color: '#34d399', fontSize: '0.95rem' }}>
                    {formatPriceLevel(cafe.price_level)}
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not available</span>
                )}
              </td>
            ))}
          </tr>

          {/* Row 5: Current Status */}
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} color="var(--accent-amber)" /> Status
              </div>
            </td>
            {cafes.map((cafe) => {
              const status = formatOpenStatus(cafe.open_now);
              return (
                <td key={cafe.place_id} style={{ padding: '14px 16px' }}>
                  <span className={`badge ${status.className}`}>
                    {status.label}
                  </span>
                </td>
              );
            })}
          </tr>

          {/* Row 6: Address */}
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--text-secondary)" /> Address
              </div>
            </td>
            {cafes.map((cafe) => (
              <td key={cafe.place_id} style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {cafe.address || <span style={{ color: 'var(--text-muted)' }}>Not available</span>}
              </td>
            ))}
          </tr>

          {/* Row 7: Opening Hours */}
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Operating Hours
            </td>
            {cafes.map((cafe) => {
              const weekday = cafe.opening_hours?.weekday_text;
              return (
                <td key={cafe.place_id} style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {Array.isArray(weekday) && weekday.length > 0 ? (
                    <div style={{ maxHeight: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {weekday.map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Weekly hours not provided</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Row 8: Phone */}
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} color="var(--text-secondary)" /> Phone
              </div>
            </td>
            {cafes.map((cafe) => (
              <td key={cafe.place_id} style={{ padding: '14px 16px', fontSize: '0.85rem' }}>
                {cafe.phone_number ? (
                  <a href={`tel:${cafe.phone_number}`} style={{ color: 'var(--accent-amber)' }}>
                    {cafe.phone_number}
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Not available</span>
                )}
              </td>
            ))}
          </tr>

          {/* Row 9: Website */}
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={15} color="var(--text-secondary)" /> Website
              </div>
            </td>
            {cafes.map((cafe) => (
              <td key={cafe.place_id} style={{ padding: '14px 16px', fontSize: '0.85rem' }}>
                {cafe.website ? (
                  <a
                    href={cafe.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Visit Website <ExternalLink size={12} />
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Not available</span>
                )}
              </td>
            ))}
          </tr>

          {/* Row 10: Official Links / Actions */}
          <tr>
            <td style={{ padding: '18px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Navigation
            </td>
            {cafes.map((cafe) => (
              <td key={cafe.place_id} style={{ padding: '18px 16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a
                    href={getDirectionsUrl(cafe)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', width: '100%' }}
                  >
                    <Navigation size={13} />
                    Get Directions
                  </a>
                  <a
                    href={cafe.google_maps_url || getDirectionsUrl(cafe)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', width: '100%' }}
                  >
                    <ExternalLink size={13} />
                    Open in Maps
                  </a>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
