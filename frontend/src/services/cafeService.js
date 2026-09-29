import api from './api';

export const cafeService = {
  /**
   * Search cafes by text query or location
   */
  async searchCafes({ query, lat, lng, radius }) {
    const params = {};
    if (query) params.query = query;
    if (lat !== undefined && lat !== null) params.lat = lat;
    if (lng !== undefined && lng !== null) params.lng = lng;
    if (radius) params.radius = radius;

    return api.get('/cafes/search', { params });
  },

  /**
   * Search nearby cafes by GPS coordinates
   */
  async getNearbyCafes({ lat, lng, radius = 5000, keyword = 'cafe' }) {
    return api.get('/cafes/nearby', {
      params: { lat, lng, radius, keyword }
    });
  },

  /**
   * Get single cafe details by placeId
   */
  async getCafeDetails(placeId, lat = null, lng = null) {
    const params = {};
    if (lat !== null) params.lat = lat;
    if (lng !== null) params.lng = lng;

    return api.get(`/cafes/${placeId}`, { params });
  },

  /**
   * Compare 2-5 cafes with factual summary and preference scoring
   */
  async compareCafes({ placeIds, preference = 'default', userLat = null, userLng = null }) {
    return api.post('/cafes/compare', {
      placeIds,
      preference,
      userLat,
      userLng
    });
  },

  /**
   * Get photo URL via proxy endpoint
   */
  getPhotoUrl(photoReference, maxWidth = 600) {
    if (!photoReference) return null;
    const base = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${base}/cafes/photo?ref=${encodeURIComponent(photoReference)}&maxWidth=${maxWidth}`;
  }
};
