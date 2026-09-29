let googleMapsScriptPromise = null;

/**
 * Dynamically injects Google Maps JavaScript API script
 * @param {string} apiKey 
 * @returns {Promise<typeof google.maps>}
 */
export const loadGoogleMapsApi = (apiKey) => {
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.type = 'text/javascript';
    const keyParam = apiKey ? `key=${encodeURIComponent(apiKey)}&` : '';
    script.src = `https://maps.googleapis.com/maps/api/js?${keyParam}libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps SDK loaded but window.google.maps not available'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps JavaScript API script. Check network or API key restrictions.'));
    };

    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
};

/**
 * Creates custom styled Google Map markers with SVG
 */
export const createMarkerIcon = (isSelected = false, isHovered = false, isCompared = false, number = null) => {
  const primaryColor = isSelected ? '#f59e0b' : isCompared ? '#3b82f6' : isHovered ? '#fbbf24' : '#d97706';
  const size = isSelected || isHovered ? 44 : 36;

  // Custom coffee cup SVG pin
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${primaryColor}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
      <circle cx="12" cy="10" r="3" fill="#0f172a" stroke="#ffffff" stroke-width="1"/>
    </svg>
  `;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(size, size),
    anchor: new window.google.maps.Point(size / 2, size)
  };
};

/**
 * Dark theme map styling JSON for sleek high-tech night look
 */
export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#111827' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#111827' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f8fafc' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d97706' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#16222f' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#34d399' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0f172a' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748b' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#334155' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0f172a' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#cbd5e1' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1f2937' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0c1322' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }]
  }
];
