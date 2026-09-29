import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { cafeService } from '../services/cafeService';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [cafes, setCafes] = useState([]);
  const [searchCenter, setSearchCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [hoveredCafeId, setHoveredCafeId] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    minRating: 0,
    maxDistance: null, // in km
    priceLevel: null,  // 1, 2, 3, 4 or null
    openNow: false,
    minReviews: 0
  });

  // Sort state: 'recommended' | 'rating' | 'distance' | 'reviews' | 'price'
  const [sortBy, setSortBy] = useState('recommended');

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      minRating: 0,
      maxDistance: null,
      priceLevel: null,
      openNow: false,
      minReviews: 0
    });
    setSortBy('recommended');
  };

  const searchByText = useCallback(async (searchQuery, coords = null) => {
    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const lat = coords?.lat ?? userLocation?.lat;
      const lng = coords?.lng ?? userLocation?.lng;

      const res = await cafeService.searchCafes({
        query: searchQuery,
        lat,
        lng
      });

      const fetched = res.data?.cafes || [];
      setCafes(fetched);
      if (res.data?.searchCenter) {
        setSearchCenter(res.data.searchCenter);
      } else if (fetched.length > 0 && fetched[0].location?.lat) {
        setSearchCenter({
          lat: fetched[0].location.lat,
          lng: fetched[0].location.lng
        });
      }

      if (fetched.length === 0) {
        setError(`No cafes found matching "${searchQuery}". Try searching another city, area, or landmark.`);
      }
    } catch (err) {
      setError(err.message || 'Failed to search cafes from Google Places. Please verify API configuration.');
      setCafes([]);
    } finally {
      setLoading(false);
    }
  }, [userLocation]);

  const searchNearby = useCallback(async (lat, lng, radius = 5000) => {
    setLoading(true);
    setError(null);
    setUserLocation({ lat, lng });

    try {
      const res = await cafeService.getNearbyCafes({ lat, lng, radius });
      const fetched = res.data?.cafes || [];
      setCafes(fetched);
      setSearchCenter({ lat, lng });
      setQuery('Nearby Cafes');

      if (fetched.length === 0) {
        setError('No cafes found near your current location. Try expanding search distance.');
      }
    } catch (err) {
      setError(err.message || 'Failed to search nearby cafes. Please check permissions and Google API key.');
      setCafes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtered and sorted cafes computation
  const filteredCafes = useMemo(() => {
    let result = [...cafes];

    // Filter by Rating
    if (filters.minRating > 0) {
      result = result.filter(c => typeof c.rating === 'number' && c.rating >= filters.minRating);
    }

    // Filter by Distance
    if (filters.maxDistance !== null && filters.maxDistance > 0) {
      result = result.filter(c => c.distance?.km !== null && c.distance.km <= filters.maxDistance);
    }

    // Filter by Price Level
    if (filters.priceLevel !== null) {
      result = result.filter(c => c.price_level === filters.priceLevel);
    }

    // Filter by Open Now
    if (filters.openNow) {
      result = result.filter(c => c.open_now === true);
    }

    // Filter by Min Reviews
    if (filters.minReviews > 0) {
      result = result.filter(c => typeof c.user_ratings_total === 'number' && c.user_ratings_total >= filters.minReviews);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'distance':
          return (a.distance?.km ?? 9999) - (b.distance?.km ?? 9999);
        case 'reviews':
          return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
        case 'price':
          return (a.price_level ?? 99) - (b.price_level ?? 99);
        case 'recommended':
        default:
          // Composite sorting: high rating with good reviews & proximity
          const scoreA = ((a.rating || 3.0) * 10) + Math.min(20, Math.log10((a.user_ratings_total || 1) + 1) * 5) - ((a.distance?.km || 5) * 0.5);
          const scoreB = ((b.rating || 3.0) * 10) + Math.min(20, Math.log10((b.user_ratings_total || 1) + 1) * 5) - ((b.distance?.km || 5) * 0.5);
          return scoreB - scoreA;
      }
    });

    return result;
  }, [cafes, filters, sortBy]);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        cafes: filteredCafes,
        rawCafes: cafes,
        searchCenter,
        setSearchCenter,
        userLocation,
        setUserLocation,
        loading,
        error,
        setError,
        selectedCafe,
        setSelectedCafe,
        hoveredCafeId,
        setHoveredCafeId,
        filters,
        updateFilters,
        resetFilters,
        sortBy,
        setSortBy,
        searchByText,
        searchNearby
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
