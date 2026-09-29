import { useState, useCallback } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errMsg = 'Geolocation is not supported by your browser.';
        setError(errMsg);
        reject(new Error(errMsg));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(coords);
          setLoading(false);
          resolve(coords);
        },
        (err) => {
          let userMsg = 'Unable to retrieve location.';
          if (err.code === 1) {
            userMsg = 'Location permission was denied. Please allow location access or search manually.';
          } else if (err.code === 2) {
            userMsg = 'Location unavailable. Please check your device GPS.';
          } else if (err.code === 3) {
            userMsg = 'Location request timed out. Please try again.';
          }
          setError(userMsg);
          setLoading(false);
          reject(new Error(userMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }, []);

  return { location, loading, error, getLocation };
};
