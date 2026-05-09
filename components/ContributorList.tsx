'use client';

import type { Contributor } from '@/lib/api';

interface Props { contributors: Contributor[]; }

export default function ContributorList({ contributors }: Props) {
  if (!contributors.length) return null;
  const max = contributors[0].contributions;

  return (
    <div className="glass" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>👥 Top Contributors</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {contributors.map((c, i) => (
          <a key={c.login} href={c.html_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Rank */}
              <span style={{ width: 20, textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                #{i + 1}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.avatar_url} alt={c.login} style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-1)' }}>{c.login}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.contributions} commits</span>
                </div>
                <div style={{ height: 4, background: 'rgba(99,102,241,0.12)', borderRadius: 2 }}>
                  <div style={{
                    height: '100%',
                    width: `${(c.contributions / max) * 100}%`,
                    background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                    borderRadius: 2,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
