export default function SkeletonCard({ height = 160 }: { height?: number }) {
  return (
    <div className="glass" style={{ padding: '1.25rem', height }}>
      <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: 12, width: '90%', marginBottom: '0.4rem' }} />
      <div className="skeleton" style={{ height: 12, width: '75%', marginBottom: '1.2rem' }} />
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div className="skeleton" style={{ height: 10, width: 60 }} />
        <div className="skeleton" style={{ height: 10, width: 40 }} />
        <div className="skeleton" style={{ height: 10, width: 40 }} />
      </div>
    </div>
  );
}
