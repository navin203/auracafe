import React, { useState } from 'react';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  Sliders,
  Star,
  Navigation,
  DollarSign,
  Clock,
  MessageSquare,
  Bookmark,
  Info,
  BookOpen,
  Users,
  Coffee
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { comparisonService } from '../services/comparisonService';

export const ComparisonSummary = ({
  cafes = [],
  factualSummary = [],
  preference = 'default',
  onPreferenceChange,
  topPick = null
}) => {
  const { isAuthenticated } = useAuth();
  const [saveTitle, setSaveTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const preferences = [
    { id: 'default', label: 'Balanced Score', icon: Sparkles },
    { id: 'highest_rated', label: 'Highest Rated', icon: Star },
    { id: 'closest', label: 'Closest Cafe', icon: Navigation },
    { id: 'budget_friendly', label: 'Budget Friendly', icon: DollarSign },
    { id: 'most_reviewed', label: 'Most Reviewed', icon: MessageSquare },
    { id: 'currently_open', label: 'Currently Open', icon: Clock },
    { id: 'study', label: 'Study Friendly', icon: BookOpen },
    { id: 'meeting', label: 'Meeting Suitable', icon: Users },
    { id: 'casual', label: 'Casual Food & Drinks', icon: Coffee }
  ];

  const handleSaveComparison = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to save this comparison.');
      return;
    }

    setSaving(true);
    try {
      await comparisonService.saveComparison({
        title: saveTitle || `Comparison: ${cafes.map(c => c.name).join(' vs ')}`,
        preference,
        notes: `Compared ${cafes.length} cafes based on verified Google Places data.`,
        cafes: cafes.map(c => ({
          place_id: c.place_id,
          name: c.name,
          rating: c.rating,
          user_ratings_total: c.user_ratings_total,
          price_level: c.price_level,
          address: c.address
        }))
      });
      setSavedSuccess(true);
      setShowSaveDialog(false);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      alert(err.message || 'Failed to save comparison');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Preference Selection Bar */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Prioritize Your Preference</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Adjusts transparent scoring weight formulas
          </span>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {preferences.map((p) => {
            const Icon = p.icon;
            const active = preference === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPreferenceChange(p.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: active ? '1px solid var(--accent-amber)' : '1px solid var(--border-subtle)',
                  background: active ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.25))' : 'rgba(255, 255, 255, 0.04)',
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: active ? '0 0 14px var(--accent-glow)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} color={active ? 'var(--accent-gold)' : 'currentColor'} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Top Recommendation Callout Card */}
      {topPick && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(245, 158, 11, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
              }}>
                <Trophy size={22} color="#0f172a" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  Top Match For Your Selected Preference
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {topPick.name}
                </h3>
              </div>
            </div>

            {/* Score Pill */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 14px'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                App Comparison Score
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {topPick.app_comparison_score} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ 100</span>
              </span>
            </div>
          </div>

          {/* Explanation rationale */}
          {topPick.preference_explanation && (
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-amber)' }}>
              {topPick.preference_explanation}
            </p>
          )}

          {/* Why this cafe matches your preferences */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 700 }}>
              Why this cafe matches your preferences:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px' }}>
              {topPick.match_reasons?.map((reason, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0 }} />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Score Weights & Components Breakdown */}
          {topPick.score_breakdown && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              border: '1px solid var(--border-subtle)',
              marginTop: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Info size={14} />
                <span>Transparent scoring weights applied for this calculation:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                {Object.entries(topPick.score_breakdown.weights).map(([key, wt]) => (
                  <div key={key} style={{ fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      <span style={{ textTransform: 'capitalize' }}>{key}</span>
                      <strong style={{ color: 'var(--accent-gold)' }}>{Math.round(wt * 100)}%</strong>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${wt * 100}%`, height: '100%', background: 'var(--accent-amber)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Factual Comparison Summary Bullets */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '20px'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--accent-amber)" /> Factual Comparison Summary
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {factualSummary.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                lineHeight: 1.4
              }}
            >
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={13} />
          <span>Factual differences are calculated strictly from real Google Places metadata without synthetic attributes.</span>
        </div>
      </div>

      {/* 4. Save Comparison Action */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Save This Comparison</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Store this side-by-side analysis in your account to revisit anytime.
          </p>
        </div>

        {savedSuccess ? (
          <div style={{ color: '#34d399', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={18} /> Comparison saved to your profile!
          </div>
        ) : showSaveDialog ? (
          <form onSubmit={handleSaveComparison} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              placeholder="Comparison title (e.g. Bhopal Weekend Work)..."
              required
              style={{
                flex: 1,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem'
              }}
            />
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setShowSaveDialog(false)}
              className="btn btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Bookmark size={15} /> Save Comparison
          </button>
        )}
      </div>
    </div>
  );
};
