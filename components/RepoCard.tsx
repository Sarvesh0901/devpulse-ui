import type { Repo } from '@/lib/api';
import Link from 'next/link';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Rust: '#dea584', Go: '#00ADD8', Java: '#b07219', 'C++': '#f34b7d',
  CSS: '#563d7c', HTML: '#e34c26', Ruby: '#701516', Swift: '#F05138',
  Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
};

interface RepoCardProps { repo: Repo; }

export default function RepoCard({ repo }: RepoCardProps) {
  const [owner, name] = repo.full_name.split('/');
  const langColor = LANG_COLORS[repo.language || ''] ?? '#8b949e';
  const updatedAt = new Date(repo.updated_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Link
      href={`/dashboard/${owner}/${name}`}
      id={`repo-card-${repo.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div className="glass" style={{ padding: '1.25rem', cursor: 'pointer', height: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="var(--text-secondary)">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"/>
            </svg>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--accent-1)' }}>
              {repo.name}
            </span>
          </div>
          {repo.private && (
            <span style={{ fontSize: '0.7rem', background: 'rgba(99,102,241,0.15)', color: 'var(--accent-1)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>
              Private
            </span>
          )}
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '2.4rem', lineHeight: 1.5 }}>
          {repo.description || 'No description provided.'}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          {repo.language && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: langColor, display: 'inline-block' }} />
              {repo.language}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            ⭐ {repo.stargazers_count}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            🍴 {repo.forks_count}
          </span>
          <span style={{ marginLeft: 'auto' }}>{updatedAt}</span>
        </div>
      </div>
    </Link>
  );
}
