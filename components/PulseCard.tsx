'use client';

import type { Pulse } from '@/lib/api';

const MOOD_COLORS = {
  Productive: { bg: 'rgba(74,222,128,0.08)', border: '#4ade80', dot: '#4ade80' },
  Steady:     { bg: 'rgba(99,102,241,0.08)', border: '#6366f1', dot: '#6366f1' },
  Fixing:     { bg: 'rgba(251,146,60,0.08)',  border: '#fb923c', dot: '#fb923c' },
  Refactoring:{ bg: 'rgba(168,85,247,0.08)', border: '#a855f7', dot: '#a855f7' },
};

const CATEGORY_ICONS: Record<string, string> = {
  Feature: '🚀', Fix: '🐛', Refactor: '♻️', Chore: '🔧',
};

interface Props { pulse: Pulse; }

export default function PulseCard({ pulse }: Props) {
  const mood = MOOD_COLORS[pulse.mood] ?? MOOD_COLORS.Steady;
  const hasCommits = Object.values(pulse.categories).some(arr => arr.length > 0);

  return (
    <div className="glass card-ai" style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: 40, height: 40, borderRadius: 10, 
            background: 'linear-gradient(135deg, #d946ef, #8b5cf6)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(217, 70, 239, 0.4)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Gemini AI Insights</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Recent Code Commits Analysed</p>
          </div>
        </div>
        
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(139, 92, 246, 0.1)', border: `1px solid rgba(139, 92, 246, 0.3)`,
          borderRadius: 100, padding: '0.35rem 1rem', fontSize: '0.75rem', fontWeight: 700,
          color: 'var(--accent-1)', textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-1)', display: 'inline-block', boxShadow: '0 0 8px var(--accent-1)' }} />
          Gemini AI
        </span>
      </div>

      {/* Summary */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>
        &ldquo;{pulse.summary}&rdquo;
      </p>

      {/* Categories */}
      {hasCommits && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {(Object.entries(pulse.categories) as [keyof typeof pulse.categories, string[]][])
            .filter(([, items]) => items.length > 0)
            .map(([cat, items]) => (
              <div key={cat} style={{ background: 'rgba(99,102,241,0.05)', borderRadius: 8, padding: '0.75rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                  {CATEGORY_ICONS[cat]} {cat}
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {items.slice(0, 3).map((item, i) => (
                    <li key={i} style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}

      {/* Insights */}
      {pulse.insights.length > 0 && (
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>💡 Insights</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {pulse.insights.map((ins, i) => (
              <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--accent-2)' }}>→</span>
                {ins}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
