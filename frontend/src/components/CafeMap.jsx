import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ExternalLink, Sparkles, Layers, Check, Plus, Coffee, Compass } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSearch } from '../context/SearchContext';
import { useComparison } from '../context/ComparisonContext';
import { formatRating, formatOpenStatus, getDirectionsUrl } from '../utils/formatters';

// Fix default Leaflet icon assets missing in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

export const CafeMap = ({ cafes = [], searchCenter = null, height = '100%' }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);

  const { selectedCafe, setSelectedCafe, hoveredCafeId, userLocation, setUserLocation } = useSearch();
  const { toggleCafe, isSelected } = useComparison();
  const navigate = useNavigate();

  // Create custom HTML marker for a cafe
  const createCafeIcon = useCallback((cafe, isSel, isHov, compared) => {
    const bgGradient = compared
      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
      : isSel
      ? 'linear-gradient(135deg, #f59e0b, #b45309)'
      : 'linear-gradient(135deg, #f59e0b, #d97706)';

    const borderStyle = isSel
      ? '3px solid #ffffff'
      : compared
      ? '2px solid #93c5fd'
      : '2px solid #ffffff';

    const glowStyle = isSel
      ? '0 0 16px rgba(245, 158, 11, 0.8), 0 4px 12px rgba(0,0,0,0.5)'
      : compared
      ? '0 0 14px rgba(59, 130, 246, 0.7), 0 4px 10px rgba(0,0,0,0.5)'
      : '0 4px 12px rgba(0, 0, 0, 0.45)';

    const scale = isSel ? 'scale(1.2)' : isHov ? 'scale(1.15)' : 'scale(1)';

    const html = `
      <div style="
        transform: ${scale};
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          background: ${bgGradient};
          transform: rotate(-45deg);
          border: ${borderStyle};
          box-shadow: ${glowStyle};
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
              <line x1="6" y1="2" x2="6" y2="4"></line>
              <line x1="10" y1="2" x2="10" y2="4"></line>
              <line x1="14" y1="2" x2="14" y2="4"></line>
            </svg>
          </div>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-cafe-div-icon',
      html,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38]
    });
  }, []);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to Bhopal or search center
      const initialCenter = searchCenter || userLocation || { lat: 23.2332, lng: 77.4336 };

      const map = L.map(mapContainerRef.current, {
        center: [initialCenter.lat, initialCenter.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Dark Matter tiles (sleek dark aesthetic, ultra-fast, 100% reliable)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Custom styled zoom control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Do not destroy map on every re-render; destroy when component unmounts
    };
  }, []);

  // 2. Center/Bounds adjustment on cafes or search center update
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (cafes.length > 0) {
      const validCafes = cafes.filter(c => c.location?.lat && c.location?.lng);
      if (validCafes.length > 0) {
        const bounds = L.latLngBounds(validCafes.map(c => [c.location.lat, c.location.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    } else if (searchCenter?.lat && searchCenter?.lng) {
      map.setView([searchCenter.lat, searchCenter.lng], 13);
    }
  }, [cafes, searchCenter]);

  // 3. User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userLocation?.lat && userLocation?.lng) {
      const userIcon = L.divIcon({
        className: 'user-location-div-icon',
        html: `
          <div style="
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #06b6d4;
            border: 3px solid #ffffff;
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.9), 0 2px 8px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse-ring 2s infinite;
          "></div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 900 })
        .addTo(map)
        .bindPopup('<strong style="color:#06b6d4;">📍 Your Current Location</strong>');

      userMarkerRef.current = marker;
    }
  }, [userLocation]);

  // 4. Update Cafe Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach(m => map.removeLayer(m));
    markersRef.current = {};

    cafes.forEach(cafe => {
      if (!cafe.location?.lat || !cafe.location?.lng) return;

      const isSel = selectedCafe?.place_id === cafe.place_id;
      const isHov = hoveredCafeId === cafe.place_id;
      const compared = isSelected(cafe.place_id);

      const icon = createCafeIcon(cafe, isSel, isHov, compared);
      const marker = L.marker([cafe.location.lat, cafe.location.lng], {
        icon,
        zIndexOffset: isSel ? 1000 : isHov ? 500 : 100
      }).addTo(map);

      // Popup Content with details, rating, photo & action buttons
      const ratingHtml = cafe.rating
        ? `<span style="color:#fbbf24; font-weight:700;">★ ${formatRating(cafe.rating)}</span> <span style="color:#94a3b8; font-size:0.75rem;">(${cafe.user_ratings_total || 0})</span>`
        : '<span style="color:#64748b;">No rating</span>';

      const openStatus = formatOpenStatus(cafe.open_now);
      const photoUrl = cafe.primary_photo || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80';

      const popupHtml = `
        <div style="min-width: 220px; max-width: 260px; font-family: inherit;">
          <img src="${photoUrl}" alt="${cafe.name}" style="width:100%; height:90px; object-fit:cover; border-radius:8px; margin-bottom:8px; border:1px solid rgba(255,255,255,0.08);" />
          <h4 style="font-size:0.95rem; font-weight:700; color:#f8fafc; margin-bottom:4px; line-height:1.2;">
            ${cafe.name}
          </h4>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; font-size:0.8rem;">
            <div>${ratingHtml}</div>
            <span style="color:${openStatus.color}; font-size:0.75rem; font-weight:600;">${openStatus.label}</span>
          </div>
          <p style="font-size:0.75rem; color:#94a3b8; margin-bottom:10px; line-height:1.3; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
            ${cafe.address || 'Address unavailable'}
          </p>
          <div style="display:flex; gap:6px;">
            <button id="popup-btn-view-${cafe.place_id}" style="flex:1; background:linear-gradient(135deg, #f59e0b, #d97706); border:none; color:#0f172a; font-weight:700; font-size:0.75rem; padding:6px 10px; border-radius:6px; cursor:pointer;">
              View Details
            </button>
            <a href="${cafe.google_maps_url || getDirectionsUrl(cafe)}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; background:#1e293b; border:1px solid rgba(255,255,255,0.1); color:#f59e0b; padding:6px 10px; border-radius:6px; text-decoration:none; font-size:0.75rem;">
              Directions ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-view-${cafe.place_id}`);
        if (btn) {
          btn.onclick = () => {
            navigate(`/cafe/${cafe.place_id}`);
          };
        }
      });

      marker.on('click', () => {
        setSelectedCafe(cafe);
      });

      markersRef.current[cafe.place_id] = marker;
    });
  }, [cafes, selectedCafe, hoveredCafeId, isSelected, createCafeIcon, navigate, setSelectedCafe]);

  // 5. Pan and open popup when selectedCafe changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedCafe?.place_id) return;

    const marker = markersRef.current[selectedCafe.place_id];
    if (marker && selectedCafe.location?.lat) {
      map.flyTo([selectedCafe.location.lat, selectedCafe.location.lng], Math.max(map.getZoom(), 14), {
        duration: 0.8
      });
      marker.openPopup();
    }
  }, [selectedCafe]);

  // Handle locate user button
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(newLoc);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([newLoc.lat, newLoc.lng], 14, { duration: 1 });
        }
      },
      () => {
        alert('Could not retrieve your location. Please ensure location permissions are enabled.');
      }
    );
  };

  // Recenter map on all cafes
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const validCafes = cafes.filter(c => c.location?.lat && c.location?.lng);
    if (validCafes.length > 0) {
      const bounds = L.latLngBounds(validCafes.map(c => [c.location.lat, c.location.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (searchCenter?.lat && searchCenter?.lng) {
      map.setView([searchCenter.lat, searchCenter.lng], 13);
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      minHeight: '350px',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Map DOM Element */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#0a0e17' }} />

      {/* Map Interactive Overlay Controls */}
      <div style={{
        position: 'absolute',
        top: '14px',
        left: '14px',
        zIndex: 500,
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={handleLocateMe}
          title="Find My Location"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--accent-amber)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Navigation size={15} /> My Location
        </button>

        <button
          onClick={handleRecenter}
          title="Recenter Map"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Compass size={15} /> View All ({cafes.length})
        </button>
      </div>

      {/* Floating Cafe Count Chip */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        left: '14px',
        zIndex: 500,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-full)',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
        <span>Live Interactive Map &middot; {cafes.length} Cafes</span>
      </div>
    </div>
  );
};
export default CafeMap;
