import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Calendar, Sparkles, Heart, History, Trash2, Edit3, Check, LogOut, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { comparisonService } from '../services/comparisonService';
import { LoadingSpinner } from '../components/LoadingSkeleton';

export const ProfilePage = () => {
  const { user, profile, isAuthenticated, loading: authLoading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [comparisons, setComparisons] = useState([]);
  const [loadingComp, setLoadingComp] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.full_name || '');

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (profile?.full_name) {
      setNameInput(profile.full_name);
    }
  }, [profile]);

  useEffect(() => {
    if (isAuthenticated) {
      comparisonService.getSavedComparisons()
        .then((res) => setComparisons(res.data || []))
        .catch(() => {})
        .finally(() => setLoadingComp(false));
    }
  }, [isAuthenticated]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    try {
      await updateProfile({ fullName: nameInput });
      setEditing(false);
    } catch (err) {
      alert(err.message || 'Failed to update name');
    }
  };

  const handleDeleteComparison = async (id) => {
    if (!window.confirm('Delete this saved comparison?')) return;
    try {
      await comparisonService.deleteComparison(id);
      setComparisons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  if (authLoading) {
    return <LoadingSpinner text="Checking authentication..." />;
  }

  return (
    <div className="container" style={{ padding: '36px 20px 80px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Profile Header Card */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 800,
            boxShadow: '0 0 25px var(--accent-glow)'
          }}>
            {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
          </div>

          <div>
            {editing ? (
              <form onSubmit={handleUpdateName} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px' }}>
                  <Check size={16} /> Save
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary" style={{ padding: '6px 12px' }}>
                  Cancel
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                  {profile?.full_name || user?.email?.split('@')[0]}
                </h1>
                <button onClick={() => setEditing(true)} style={{ color: 'var(--text-muted)', padding: '4px' }} title="Edit Name">
                  <Edit3 size={16} />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} /> {user?.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> Member
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-outline"
          style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#f87171' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Quick Nav Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <Link
          to="/favorites"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            transition: 'all 0.15s ease'
          }}
          className="profile-link-card"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444'
          }}>
            <Heart size={20} fill="#ef4444" />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Saved Favorites</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>View your bookmarked cafes</span>
          </div>
        </Link>

        <Link
          to="/history"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            transition: 'all 0.15s ease'
          }}
          className="profile-link-card"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa'
          }}>
            <History size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Search History</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Browse your past queries</span>
          </div>
        </Link>
      </div>

      {/* Saved Comparisons Section */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--accent-amber)" /> Saved Side-by-Side Comparisons
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Comparisons stored in Supabase under your user profile with Row Level Security.
            </p>
          </div>
          <Link to="/compare" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            New Comparison
          </Link>
        </div>

        {loadingComp ? (
          <LoadingSpinner text="Loading saved comparisons..." />
        ) : comparisons.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-strong)',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Coffee size={32} />
            <p style={{ fontSize: '0.9rem' }}>No comparisons saved yet. You can compare cafes and click "Save Comparison".</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comparisons.map((comp) => (
              <div
                key={comp.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {comp.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ textTransform: 'capitalize' }}>Preference: {comp.preference.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{comp.comparison_cafes?.length || 0} cafes</span>
                    <span>•</span>
                    <span>{new Date(comp.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleDeleteComparison(comp.id)}
                    style={{ color: 'var(--text-muted)', padding: '6px' }}
                    title="Delete comparison"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .profile-link-card:hover {
          border-color: var(--accent-amber) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};
