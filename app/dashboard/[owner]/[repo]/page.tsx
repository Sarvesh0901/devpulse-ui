'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { getCommits, getLanguages, getContributors, getHealth, getPulse, getRepo } from '@/lib/api';
import type { Repo, Commit, HealthScore, Pulse, Contributor } from '@/lib/api';
import Navbar from '@/components/Navbar';
import CommitChart from '@/components/CommitChart';
import LanguageChart from '@/components/LanguageChart';
import HealthScoreRing from '@/components/HealthScoreRing';
import PulseCard from '@/components/PulseCard';
import ContributorList from '@/components/ContributorList';
import SkeletonCard from '@/components/SkeletonCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Props { params: Promise<{ owner: string; repo: string }>; }

export default function RepoDashboardPage({ params }: Props) {
  const { owner, repo: repoName } = use(params);

  const [repoData, setRepoData]       = useState<Repo | null>(null);
  const [commits, setCommits]         = useState<Commit[]>([]);
  const [languages, setLanguages]     = useState<Record<string, number>>({});
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [health, setHealth]           = useState<HealthScore | null>(null);
  const [pulse, setPulse]             = useState<Pulse | null>(null);

  const [loading, setLoading]         = useState(true);
  const [pulseLoading, setPulseLoading] = useState(true);
  const [error, setError]             = useState<string | null>(null);

  const [commitsLoaded, setCommitsLoaded] = useState(false);
  const [langLoaded, setLangLoaded] = useState(false);
  const [contribsLoaded, setContribsLoaded] = useState(false);
  const [healthLoaded, setHealthLoaded] = useState(false);

  useEffect(() => {
    // ── Fire ALL requests independently ──────────────────────────────────────
    // This ensures the UI renders progressively as data arrives, instead of 
    // waiting for the slowest endpoint (Health Score) to finish.

    getRepo(owner, repoName)
      .then((r) => {
        setRepoData(r.repo);
        setLoading(false); // Repo header loaded
      })
      .catch((err) => setError(err.message));

    getCommits(owner, repoName)
      .then((c) => setCommits(c.commits))
      .catch(console.error)
      .finally(() => setCommitsLoaded(true));

    getLanguages(owner, repoName)
      .then((l) => setLanguages(l.languages))
      .catch(console.error)
      .finally(() => setLangLoaded(true));

    getContributors(owner, repoName)
      .then((c) => setContributors(c.contributors))
      .catch(console.error)
      .finally(() => setContribsLoaded(true));

    getHealth(owner, repoName)
      .then((h) => setHealth(h.health))
      .catch(console.error)
      .finally(() => setHealthLoaded(true));

    // AI Pulse
    getPulse(owner, repoName)
      .then(({ pulse }) => setPulse(pulse))
      .catch(() => {
        setPulse({
          summary: 'AI analysis is temporarily unavailable. Please try again later.',
          categories: { Feature: [], Fix: [], Refactor: [], Chore: [] },
          insights: ['Quota may be exceeded — results will appear once it resets.'],
          mood: 'Steady',
        });
      })
      .finally(() => setPulseLoading(false));
  }, [owner, repoName]);

  if (error) return (
    <>
      <Navbar />
      <div className="container-app" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#f87171', marginBottom: '1rem' }}>⚠️ {error}</p>
        <Link href="/dashboard" className="btn-secondary">← Back to Dashboard</Link>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <main className="container-app" style={{ padding: '2rem 1.5rem 4rem' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link href="/dashboard" style={{ color: 'var(--accent-1)', textDecoration: 'none' }}>Dashboard</Link>
          <span>/</span>
          <span>{owner}</span>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{repoName}</span>
        </div>

        {/* Repo header */}
        {loading ? (
          <div className="skeleton" style={{ height: 80, marginBottom: '2rem', borderRadius: 12 }} />
        ) : repoData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass" 
            style={{ padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
          >
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                ⚡ {repoData.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                {repoData.description || 'No description'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: `⭐ ${repoData.stargazers_count}` },
                { label: `🍴 ${repoData.forks_count}` },
                { label: `⚠️ ${repoData.open_issues_count} issues` },
              ].map(({ label }) => (
                <span key={label} style={{ padding: '0.3rem 0.8rem', background: 'rgba(99,102,241,0.08)', border: '1px solid var(--border)', borderRadius: 20, fontSize: '0.8rem' }}>
                  {label}
                </span>
              ))}
              <a href={repoData.html_url} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.3rem 0.9rem', fontSize: '0.8rem' }}>
                View on GitHub ↗
              </a>
            </div>
          </motion.div>
        )}

        {/* AI Pulse — loads independently, never blocks rest of page */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: '1.25rem' }}
        >
          {pulseLoading
            ? <SkeletonCard height={180} />
            : pulse && <PulseCard pulse={pulse} />
          }
        </motion.div>

        {/* Health + Contributors */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}
        >
          {!healthLoaded || !contribsLoaded ? (
            <><SkeletonCard height={220} /><SkeletonCard height={220} /></>
          ) : (
            <>
              {health && <HealthScoreRing health={health} />}
              <ContributorList contributors={contributors} />
            </>
          )}
        </motion.div>

        {/* Commit chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ marginBottom: '1.25rem' }}
        >
          {!commitsLoaded ? <SkeletonCard height={240} /> : <CommitChart commits={commits} />}
        </motion.div>

        {/* Language chart */}
        {langLoaded && Object.keys(languages).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ maxWidth: 520, marginBottom: '1.25rem' }}
          >
            <LanguageChart languages={languages} />
          </motion.div>
        )}

        {/* Recent commits */}
        {commitsLoaded && commits.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass" 
            style={{ padding: '1.5rem' }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>📜 Recent Commits</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {commits.slice(0, 8).map(commit => (
                <div key={commit.sha} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                  {commit.author && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={commit.author.avatar_url} alt={commit.author.login} style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {commit.commit.message.split('\n')[0]}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {commit.commit.author.name}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {new Date(commit.commit.author.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </main>
    </>
  );
}
