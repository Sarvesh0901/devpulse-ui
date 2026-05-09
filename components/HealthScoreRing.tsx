'use client';

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import type { HealthScore } from '@/lib/api';

const gradeColors: Record<string, string> = {
  'A+': '#4ade80', A: '#86efac', B: '#facc15', C: '#fb923c', D: '#f87171', F: '#ef4444',
};

interface Props { health: HealthScore; }

export default function HealthScoreRing({ health }: Props) {
  const { score, grade, breakdown } = health;
  const color = gradeColors[grade] ?? '#6366f1';

  const data = [{ value: score, fill: color }];
  const breakdownItems = [
    { label: 'Commit Consistency', value: breakdown.commitConsistency, max: 25 },
    { label: 'PR Turnaround', value: breakdown.prTurnaround, max: 30 },
    { label: 'Issue Resolution', value: breakdown.issueResolution, max: 20 },
    { label: 'Recent Activity', value: breakdown.recentActivity, max: 25 },
  ];

  return (
    <div className="glass" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>❤️ Repository Health</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Ring */}
        <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" startAngle={90} endAngle={-270} data={data}>
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'rgba(99,102,241,0.1)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* Centre label */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color }}>{score}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color }}>{grade}</span>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ flex: 1, minWidth: 180 }}>
          {breakdownItems.map(item => (
            <div key={item.label} style={{ marginBottom: '0.7rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.value}/{item.max}</span>
              </div>
              <div style={{ height: 5, background: 'rgba(99,102,241,0.12)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(item.value / item.max) * 100}%`, background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
