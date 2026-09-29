/**
 * Formats Google price level number to $ currency signs
 */
export const formatPriceLevel = (level) => {
  if (level === null || level === undefined) return 'Price not available';
  const count = Math.max(1, Math.min(4, Number(level)));
  return '$'.repeat(count);
};

/**
 * Formats review counts (e.g. 1500 -> "1.5k reviews")
 */
export const formatReviews = (count) => {
  if (count === null || count === undefined) return 'No reviews';
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k reviews`;
  }
  return `${count} reviews`;
};

/**
 * Formats ratings to 1 decimal place
 */
export const formatRating = (rating) => {
  if (rating === null || rating === undefined) return 'Unrated';
  return Number(rating).toFixed(1);
};

/**
 * Returns user-friendly status badge info
 */
export const formatOpenStatus = (openNow) => {
  if (openNow === true) {
    return { label: 'Open Now', className: 'badge-open' };
  }
  if (openNow === false) {
    return { label: 'Closed', className: 'badge-closed' };
  }
  return { label: 'Hours not available', className: 'badge-neutral' };
};

/**
 * Returns Google Maps directions URL
 */
export const getDirectionsUrl = (cafe, userLocation = null) => {
  if (!cafe) return 'https://www.google.com/maps';

  const destination = cafe.location?.lat && cafe.location?.lng
    ? `${cafe.location.lat},${cafe.location.lng}`
    : encodeURIComponent(cafe.address || cafe.name);

  let url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  if (cafe.place_id) {
    url += `&destination_place_id=${cafe.place_id}`;
  }

  if (userLocation && userLocation.lat && userLocation.lng) {
    url += `&origin=${userLocation.lat},${userLocation.lng}`;
  }

  return url;
};
