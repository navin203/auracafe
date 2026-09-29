import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { History, Search, Trash2, ArrowRight, Clock, MapPin } from 'lucide-react';
import { historyService } from '../services/historyService';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { LoadingSpinner } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';

export const HistoryPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { searchByText } = useSearch();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await historyService.getHistory(30);
      setHistory(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load search history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const handleDeleteItem = async (id) => {
    try {
      await historyService.deleteItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete history item');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all your search history?')) return;
    try {
      await historyService.clearHistory();
      setHistory([]);
    } catch (err) {
      alert(err.message || 'Failed to clear history');
    }
  };

  const handleRerunSearch = (queryText, coords = null) => {
    searchByText(queryText, coords);
    navigate('/search');
  };

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '48px 24px',
          maxWidth: '500px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <History size={44} color="var(--accent-amber)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Search History</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to track your past cafe queries and quickly jump back to recent searches.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px', marginTop: '8px' }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '36px 20px 80px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={24} color="var(--accent-amber)" /> Search History
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Your past cafe discoveries and area explorations.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#f87171' }}
          >
            <Trash2 size={15} /> Clear All
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} onRetry={loadHistory} />}

      {loading ? (
        <LoadingSpinner text="Loading search history..." />
      ) : history.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '60px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <Search size={40} color="var(--accent-coffee)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No search history yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem' }}>
            Your cafe queries will be saved here automatically when you are logged in.
          </p>
          <Link to="/search" className="btn btn-primary" style={{ padding: '10px 24px', marginTop: '8px' }}>
            Start Searching
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {history.map((item) => {
            const timeAgo = item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : null;

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-amber)'
                  }}>
                    <Search size={16} />
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.query}
                    </h4>
                    {item.location_name && item.location_name !== item.query && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {item.location_name}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {timeAgo && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {timeAgo}
                    </span>
                  )}

                  <button
                    onClick={() => handleRerunSearch(item.query, (item.latitude && item.longitude) ? { lat: item.latitude, lng: item.longitude } : null)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    <span>Search</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    style={{ color: 'var(--text-muted)', padding: '6px' }}
                    title="Delete item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
