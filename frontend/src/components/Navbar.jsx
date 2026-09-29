import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, MapPin, Layers, Heart, History, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComparison } from '../context/ComparisonContext';

export const Navbar = () => {
  const { user, profile, isAuthenticated, logout } = useAuth();
  const { count: compareCount } = useComparison();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'all 0.2s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        padding: '0 20px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
          }}>
            <Coffee size={22} color="#0f172a" strokeWidth={2.5} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #ffffff, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              AuraCafe
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '-2px'
            }}>
              Real Google Maps Finder
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          <Link
            to="/search"
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive('/search') ? 'var(--accent-amber)' : 'var(--text-secondary)',
              background: isActive('/search') ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <MapPin size={16} />
            Find Cafes
          </Link>

          <Link
            to="/map"
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive('/map') ? 'var(--accent-amber)' : 'var(--text-secondary)',
              background: isActive('/map') ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Layers size={16} />
            Map View
          </Link>

          <Link
            to="/compare"
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive('/compare') ? 'var(--accent-amber)' : 'var(--text-secondary)',
              background: isActive('/compare') ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={16} />
            Comparison
            {compareCount > 0 && (
              <span style={{
                background: 'var(--accent-amber)',
                color: '#0f172a',
                fontSize: '0.7rem',
                fontWeight: 800,
                borderRadius: '999px',
                padding: '1px 6px',
                marginLeft: '4px'
              }}>
                {compareCount}
              </span>
            )}
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/favorites"
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: isActive('/favorites') ? 'var(--accent-amber)' : 'var(--text-secondary)',
                  background: isActive('/favorites') ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Heart size={16} />
                Favorites
              </Link>

              <Link
                to="/history"
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: isActive('/history') ? 'var(--accent-amber)' : 'var(--text-secondary)',
                  background: isActive('/history') ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <History size={16} />
                History
              </Link>
            </>
          )}
        </div>

        {/* Auth / Profile Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--accent-amber)',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}>
                  {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
                </div>
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.full_name || user?.email?.split('@')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '200px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  zIndex: 60
                }}>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <User size={15} />
                    My Profile
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Heart size={15} />
                    Saved Cafes
                  </Link>
                  <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: '#f87171',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger"
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-strong)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', color: 'var(--text-primary)' }}
          >
            <MapPin size={18} color="var(--accent-amber)" /> Find Cafes
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', color: 'var(--text-primary)' }}
          >
            <Layers size={18} color="var(--accent-amber)" /> Map View
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', color: 'var(--text-primary)' }}
          >
            <Sparkles size={18} color="var(--accent-amber)" /> Compare ({compareCount})
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', color: 'var(--text-primary)' }}
              >
                <Heart size={18} color="var(--accent-amber)" /> Favorites
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', color: 'var(--text-primary)' }}
              >
                <History size={18} color="var(--accent-amber)" /> History
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', color: 'var(--text-primary)' }}
              >
                <User size={18} color="var(--accent-amber)" /> Profile
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 868px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
        @media (min-width: 869px) {
          .mobile-hamburger { display: none !important; }
        }
      `}</style>
    </nav>
  );
};
