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
    <div className="glass" style={{ padding: '2rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Repository Health Score</h3>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        {/* Ring */}
        <div style={{ position: 'relative', width: 220, height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="85%" outerRadius="100%" startAngle={90} endAngle={-270} data={data}>
              <RadialBar dataKey="value" cornerRadius={20} background={{ fill: 'rgba(255,255,255,0.03)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          {/* Centre label */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '4.2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', filter: `drop-shadow(0 0 20px ${color}44)` }}>{score}%</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Score: <span style={{ color }}>{score}/100</span> | Overall: <span style={{ color, fontWeight: 700 }}>{grade}</span>
            </p>
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
