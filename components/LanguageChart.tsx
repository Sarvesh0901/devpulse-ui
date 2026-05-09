'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', 'C++': '#f34b7d',
  CSS: '#563d7c', HTML: '#e34c26', Ruby: '#701516', Swift: '#F05138',
  Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
};
const FALLBACK_COLORS = ['#6366f1', '#06b6d4', '#a855f7', '#f59e0b', '#10b981', '#ef4444'];

interface Props { languages: Record<string, number>; }

export default function LanguageChart({ languages }: Props) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  const data = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, bytes]) => ({
      name,
      value: parseFloat(((bytes / total) * 100).toFixed(1)),
    }));

  return (
    <div className="glass" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>🌐 Language Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={LANG_COLORS[entry.name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => [`${v}%`, '']}
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
