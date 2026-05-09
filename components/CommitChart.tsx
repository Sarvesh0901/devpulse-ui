'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Commit } from '@/lib/api';

interface Props { commits: Commit[]; }

export default function CommitChart({ commits }: Props) {
  // Group commits by date (last 30 days)
  const counts: Record<string, number> = {};
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    counts[key] = 0;
  }

  commits.forEach(c => {
    const d = new Date(c.commit.author.date);
    const key = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    if (key in counts) counts[key]++;
  });

  const data = Object.entries(counts).map(([date, count]) => ({ date, count }));
  // Show only every 5th label to avoid clutter
  const tickFormatter = (_: string, index: number) => (index % 5 === 0 ? data[index]?.date : '');

  return (
    <div className="glass" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        📈 Commit Frequency <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 400 }}>(last 30 days)</span>
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
          <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={tickFormatter} />
          <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'var(--text-primary)' }}
            itemStyle={{ color: 'var(--accent-2)' }}
          />
          <Bar dataKey="count" name="Commits" fill="url(#commitGrad)" radius={[4, 4, 0, 0]} />
          <defs>
            <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
