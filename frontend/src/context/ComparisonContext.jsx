import React, { createContext, useContext, useState, useEffect } from 'react';

const ComparisonContext = createContext(null);

export const ComparisonProvider = ({ children }) => {
  const [selectedCafes, setSelectedCafes] = useState(() => {
    try {
      const saved = localStorage.getItem('auracafe_compare_selection');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  // Sync selection to localStorage
  useEffect(() => {
    localStorage.setItem('auracafe_compare_selection', JSON.stringify(selectedCafes));
  }, [selectedCafes]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const toggleCafe = (cafe) => {
    if (!cafe || !cafe.place_id) return;

    setSelectedCafes((prev) => {
      const exists = prev.some((c) => c.place_id === cafe.place_id);
      if (exists) {
        return prev.filter((c) => c.place_id !== cafe.place_id);
      }

      if (prev.length >= 5) {
        showNotification('You can compare a maximum of 5 cafes at a time.');
        return prev;
      }

      return [...prev, cafe];
    });
  };

  const removeCafe = (placeId) => {
    setSelectedCafes((prev) => prev.filter((c) => c.place_id !== placeId));
  };

  const clearSelection = () => {
    setSelectedCafes([]);
  };

  const isSelected = (placeId) => {
    return selectedCafes.some((c) => c.place_id === placeId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        selectedCafes,
        toggleCafe,
        removeCafe,
        clearSelection,
        isSelected,
        count: selectedCafes.length,
        notification
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
