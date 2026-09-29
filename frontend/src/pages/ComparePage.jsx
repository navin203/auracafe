import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ComparisonTable } from '../components/ComparisonTable';
import { ComparisonSummary } from '../components/ComparisonSummary';
import { LoadingSpinner } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { Sparkles, ArrowLeft, Plus, Coffee, AlertCircle } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import { useSearch } from '../context/SearchContext';
import { cafeService } from '../services/cafeService';

export const ComparePage = () => {
  const { selectedCafes, removeCafe, count } = useComparison();
  const { userLocation } = useSearch();
  const navigate = useNavigate();

  const [comparedData, setComparedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preference, setPreference] = useState('default');

  const fetchComparison = useCallback(async (pref = preference) => {
    if (selectedCafes.length < 2) return;

    setLoading(true);
    setError(null);

    try {
      const placeIds = selectedCafes.map((c) => c.place_id);
      const res = await cafeService.compareCafes({
        placeIds,
        preference: pref,
        userLat: userLocation?.lat,
        userLng: userLocation?.lng
      });

      setComparedData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to compare cafes. Please verify Google Places connectivity.');
    } finally {
      setLoading(false);
    }
  }, [selectedCafes, preference, userLocation]);

  useEffect(() => {
    if (selectedCafes.length >= 2) {
      fetchComparison(preference);
    } else {
      setComparedData(null);
    }
  }, [selectedCafes.length, preference, fetchComparison]);

  const handlePreferenceChange = (newPref) => {
    setPreference(newPref);
    fetchComparison(newPref);
  };

  const handleRemoveCafe = (placeId) => {
    removeCafe(placeId);
  };

  return (
    <div className="container" style={{ padding: '36px 20px 80px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={24} color="var(--accent-amber)" /> Side-by-Side Cafe Comparison
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Compare verified Google Places attributes, distance, ratings, prices, and hours.
            </p>
          </div>
        </div>

        <Link to="/search" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <Plus size={16} />
          Add More Cafes ({count}/5)
        </Link>
      </div>

      {/* State 1: Fewer than 2 cafes selected */}
      {selectedCafes.length < 2 && (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '60px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px'
        }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <Coffee size={32} color="var(--accent-amber)" />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Select at least 2 cafes to compare</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '0.95rem', lineHeight: 1.5 }}>
            You currently have {selectedCafes.length} cafe selected. Head over to our cafe search and click <strong>[ Compare ]</strong> on 2 to 5 cafes to analyze them side-by-side.
          </p>

          <Link to="/search" className="btn btn-primary" style={{ padding: '10px 24px', marginTop: '8px' }}>
            <span>Browse Real Cafes</span>
          </Link>
        </div>
      )}

      {/* Error state */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => fetchComparison(preference)}
          actionLabel="Retry Comparison"
        />
      )}

      {/* State 2: Loading */}
      {loading && (
        <LoadingSpinner text="Analyzing Google Places data & calculating comparison scores..." />
      )}

      {/* State 3: Active Comparison Content */}
      {!loading && comparedData && comparedData.cafes && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Section A: Recommendation Summary & Preferences */}
          <ComparisonSummary
            cafes={comparedData.cafes}
            factualSummary={comparedData.factualSummary || []}
            preference={preference}
            onPreferenceChange={handlePreferenceChange}
            topPick={comparedData.topPick}
          />

          {/* Section B: Detailed Side-by-Side Comparison Matrix */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Full Attribute Comparison Matrix
            </h3>
            <ComparisonTable
              cafes={comparedData.cafes}
              onRemoveCafe={handleRemoveCafe}
            />
          </div>
        </div>
      )}
    </div>
  );
};
