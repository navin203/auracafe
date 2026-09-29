import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ExternalLink, Sparkles, AlertTriangle, Layers } from 'lucide-react';
import { loadGoogleMapsApi, darkMapStyle, createMarkerIcon } from '../utils/mapHelpers';
import { useSearch } from '../context/SearchContext';
import { useComparison } from '../context/ComparisonContext';
import { formatRating, formatOpenStatus, getDirectionsUrl } from '../utils/formatters';
import api from '../services/api';

export const CafeMap = ({ cafes = [], searchCenter = null, height = '100%' }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const infoWindowRef = useRef(null);
  const userMarkerRef = useRef(null);

  const { selectedCafe, setSelectedCafe, hoveredCafeId, userLocation } = useSearch();
  const { toggleCafe, isSelected } = useComparison();
  const navigate = useNavigate();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '');

  // 1. Fetch API key from backend if not set in client env
  useEffect(() => {
    if (!apiKey) {
      api.get('/cafes/config')
        .then((res) => {
          if (res.data?.googleMapsApiKey) {
            setApiKey(res.data.googleMapsApiKey);
          }
        })
        .catch(() => {
          // Backend offline or config unavailable
        });
    }
  }, [apiKey]);

  // 2. Initialize Google Map
  useEffect(() => {
    let isMounted = true;

    if (!mapContainerRef.current) return;

    loadGoogleMapsApi(apiKey)
      .then((googleMaps) => {
        if (!isMounted || !mapContainerRef.current) return;

        const defaultCenter = searchCenter || userLocation || { lat: 23.2599, lng: 77.4126 }; // Default Bhopal coordinates

        const map = new googleMaps.Map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 13,
          styles: darkMapStyle,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        });

        infoWindowRef.current = new googleMaps.InfoWindow({
          pixelOffset: new googleMaps.Size(0, -30)
        });

        mapInstanceRef.current = map;
        setMapLoaded(true);
        setMapError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Google Maps JS API load notice:', err.message);
        setMapError(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  // 3. Update User Location Pin
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !window.google?.maps || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    userMarkerRef.current = new window.google.maps.Marker({
      position: userLocation,
      map: mapInstanceRef.current,
      title: 'Your Current Location',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#3b82f6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      },
      zIndex: 999
    });
  }, [mapLoaded, userLocation]);

  // 4. Update Cafe Markers
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !window.google?.maps) return;

    const map = mapInstanceRef.current;

    // Clear previous markers
    Object.values(markersRef.current).forEach((marker) => marker.setMap(null));
    markersRef.current = {};

    if (cafes.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    cafes.forEach((cafe) => {
      if (!cafe.location?.lat || !cafe.location?.lng) return;

      const pos = { lat: cafe.location.lat, lng: cafe.location.lng };
      bounds.extend(pos);

      const compared = isSelected(cafe.place_id);
      const isSel = selectedCafe?.place_id === cafe.place_id;

      const marker = new window.google.maps.Marker({
        position: pos,
        map,
        title: cafe.name,
        icon: createMarkerIcon(isSel, false, compared),
        zIndex: isSel ? 100 : 1
      });

      // Marker click -> Select cafe and open InfoWindow
      marker.addListener('click', () => {
        setSelectedCafe(cafe);

        const openBadge = formatOpenStatus(cafe.open_now);
        const ratingText = formatRating(cafe.rating);

        const content = `
          <div style="color: #0f172a; padding: 6px; font-family: 'Plus Jakarta Sans', sans-serif; max-width: 240px;">
            <div style="font-weight: 700; font-size: 1rem; margin-bottom: 4px; color: #0f172a;">
              ${cafe.name}
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; margin-bottom: 6px;">
              <span style="background: #f59e0b; color: #0f172a; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                ★ ${ratingText}
              </span>
              <span style="color: #64748b;">(${cafe.user_ratings_total || 0} reviews)</span>
            </div>
            <p style="font-size: 0.75rem; color: #475569; margin-bottom: 8px; line-height: 1.3;">
              ${cafe.address || 'Address not available'}
            </p>
            <div style="display: flex; gap: 6px;">
              <a href="/cafe/${cafe.place_id}" style="background: #0f172a; color: #ffffff; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; text-decoration: none; font-weight: 600;">
                View Details
              </a>
              <a href="${getDirectionsUrl(cafe, userLocation)}" target="_blank" rel="noopener noreferrer" style="background: #f1f5f9; color: #334155; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; text-decoration: none; font-weight: 600;">
                Directions
              </a>
            </div>
          </div>
        `;

        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current[cafe.place_id] = marker;
    });

    // Auto-fit bounds if more than 1 cafe
    if (cafes.length > 1) {
      map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
    } else if (cafes.length === 1 && cafes[0].location) {
      map.setCenter({ lat: cafes[0].location.lat, lng: cafes[0].location.lng });
      map.setZoom(15);
    }
  }, [mapLoaded, cafes, isSelected, setSelectedCafe, userLocation]);

  // 5. Highlight marker when selectedCafe or hoveredCafe changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !window.google?.maps) return;

    const map = mapInstanceRef.current;

    cafes.forEach((cafe) => {
      const marker = markersRef.current[cafe.place_id];
      if (!marker) return;

      const isSel = selectedCafe?.place_id === cafe.place_id;
      const isHov = hoveredCafeId === cafe.place_id;
      const compared = isSelected(cafe.place_id);

      marker.setIcon(createMarkerIcon(isSel, isHov, compared));
      marker.setZIndex(isSel ? 100 : isHov ? 50 : 1);

      if (isSel && cafe.location?.lat) {
        map.panTo({ lat: cafe.location.lat, lng: cafe.location.lng });
      }
    });
  }, [mapLoaded, selectedCafe, hoveredCafeId, cafes, isSelected]);

  return (
    <div style={{ position: 'relative', width: '100%', height, minHeight: '350px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
      {/* Map container DOM element */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#111827' }} />

      {/* Fallback Banner if Google Maps API key is not configured */}
      {mapError && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          gap: '16px',
          zIndex: 10
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={28} color="var(--accent-amber)" />
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Google Maps Interactive View
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5 }}>
              To render interactive map pins directly in the browser, please provide your{' '}
              <strong style={{ color: 'var(--accent-amber)' }}>GOOGLE_MAPS_API_KEY</strong> in{' '}
              <code style={{ background: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>backend/.env</code>.
            </p>
          </div>

          {/* Quick list of real cafes with direct Google Maps external links */}
          {cafes.length > 0 && (
            <div style={{
              width: '100%',
              maxWidth: '460px',
              maxHeight: '180px',
              overflowY: 'auto',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              padding: '8px'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textAlign: 'left' }}>
                Found {cafes.length} Real Cafes from Google Places:
              </div>
              {cafes.slice(0, 6).map((c) => (
                <div key={c.place_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', fontSize: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c.name}</span>
                  <a
                    href={c.google_maps_url || getDirectionsUrl(c)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Open Map <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
