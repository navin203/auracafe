import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { Coffee, MapPin, Sparkles, Navigation, Layers, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

export const HomePage = () => {
  const navigate = useNavigate();
  const { searchByText } = useSearch();

  const handleSearchComplete = () => {
    navigate('/search');
  };

  const sampleSearches = [
    { label: 'Bhopal Best Cafes', query: 'Best cafes in Bhopal' },
    { label: 'Starbucks Outlets', query: 'Starbucks near me' },
    { label: 'Misrod Area Cafes', query: 'Cafes near Misrod Bhopal' },
    { label: 'Top Specialty Roasters', query: 'Specialty coffee shops near Bhopal' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '80px 20px 60px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(217, 119, 6, 0.15), transparent 70%)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 16px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--accent-amber)'
          }}>
            <Sparkles size={16} />
            <span>REAL GOOGLE PLACES DATA & MAP SEARCH</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: '900px',
            letterSpacing: '-0.03em'
          }}>
            Find Your Perfect Cafe.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Compare Side-by-Side.
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            lineHeight: 1.6
          }}>
            Search cafes near you or any location. Connect directly to real Google Places, visualize on interactive maps, and evaluate factual side-by-side differences.
          </p>

          {/* Search Box */}
          <div style={{ width: '100%', marginTop: '16px' }}>
            <SearchBar onSearchComplete={handleSearchComplete} />
          </div>

          {/* Popular Fast Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '8px'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quick explore:</span>
            {sampleSearches.map((s) => (
              <button
                key={s.label}
                onClick={() => {
                  searchByText(s.query);
                  navigate('/search');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-amber)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* Card 1 */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'all var(--transition-normal)'
          }} className="feature-hover-card">
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <MapPin size={24} color="var(--accent-amber)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Real Google Places Data</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              No mock data or hallucinated reviews. We fetch live ratings, review counts, operating hours, and location data directly from the official Google Places API.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'all var(--transition-normal)'
          }} className="feature-hover-card">
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <Sparkles size={24} color="#60a5fa" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Side-by-Side Comparison</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Select 2 to 5 cafes and compare prices, distances, verified ratings, and opening schedules. Get factual insights without artificial claims.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            transition: 'all var(--transition-normal)'
          }} className="feature-hover-card">
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <ShieldCheck size={24} color="#34d399" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Transparent Scoring</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Our App Comparison Score dynamically prioritizes what matters to you—whether you want the closest spot, highest rated coffee, or budget-friendly options.
            </p>
          </div>
        </div>
      </section>

      {/* How it works Banner */}
      <section className="container">
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 36px',
          border: '1px solid var(--border-strong)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-amber)' }}>
              HOW IT WORKS
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '6px' }}>
              From Search to First Sip in 4 Simple Steps
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}>
            {[
              { num: '01', title: 'Search Any Area', desc: 'Enter a city, landmark, or click "Near Me" to locate cafes around you.' },
              { num: '02', title: 'Explore Map & List', desc: 'Browse real Google Places listings with photos, ratings, and live hours.' },
              { num: '03', title: 'Select & Compare', desc: 'Pick 2 to 5 cafes to contrast prices, review volume, and distance side-by-side.' },
              { num: '04', title: 'Get Directions', desc: 'Choose your top pick and jump straight to Google Maps turn-by-turn navigation.' }
            ].map((step) => (
              <div key={step.num} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--accent-amber)',
                  opacity: 0.8
                }}>
                  {step.num}
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ alignSelf: 'flex-start' }}>
            <button
              onClick={() => {
                searchByText('cafes');
                navigate('/search');
              }}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}
            >
              <span>Start Exploring Cafes</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .feature-hover-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-amber);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
};
