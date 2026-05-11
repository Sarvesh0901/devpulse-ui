'use client';

import { useEffect, useState } from 'react';
import { getRepos, getMe, loginUrl, type Repo, type User } from '@/lib/api';
import Navbar from '@/components/Navbar';
import RepoCard from '@/components/RepoCard';
import SkeletonCard from '@/components/SkeletonCard';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [filtered, setFiltered] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('All');
  const router = useRouter();

  useEffect(() => {
    // Fail-safe: capture token from URL if it exists
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem('devpulse_token', urlToken);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    Promise.all([getMe(), getRepos()])
      .then(([{ user }, { repos }]) => {
        setUser(user);
        setRepos(repos);
        setFiltered(repos);
      })
      .catch(() => {
        // If fetch fails, maybe the token is invalid, clear it
        localStorage.removeItem('devpulse_token');
        router.push('/');
      })
      .finally(() => setLoading(false));
  }, [router]);

  // Filter logic
  useEffect(() => {
    let result = repos;
    if (search) result = result.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase()));
    if (langFilter !== 'All') result = result.filter(r => r.language === langFilter);
    setFiltered(result);
  }, [search, langFilter, repos]);

  const languages = ['All', ...Array.from(new Set(repos.map(r => r.language).filter(Boolean) as string[]))];
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

  return (
    <>
      <Navbar />
      <main className="container-app" style={{ padding: '3.5rem 1.5rem' }}>
        {/* Dashboard Header (Match reference image) */}
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Dashboard Overview
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '1rem' }}>
            <span>Welcome Back, {user?.name || user?.login || 'User'}</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span>Date at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </header>

        {/* Stats row */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}
          >
            {[
              { label: 'Repositories', value: repos.length, icon: '📁' },
              { label: 'Total Stars', value: totalStars, icon: '⭐' },
              { label: 'Total Forks', value: totalForks, icon: '🍴' },
              { label: 'Languages', value: languages.length - 1, icon: '🌐' },
            ].map(({ label, value, icon }, index) => (
              <motion.div 
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass" 
                style={{ padding: '1.25rem', textAlign: 'center' }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }} className="gradient-text">{value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Search + filter */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          <input
            id="repo-search"
            type="text"
            placeholder="Search repositories…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200, padding: '0.65rem 1rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <select
            id="lang-filter"
            value={langFilter}
            onChange={e => setLangFilter(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.9rem',
              outline: 'none', cursor: 'pointer',
            }}
          >
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Repos grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} height={160} />)
            : filtered.length === 0
              ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
                  No repositories found.{' '}
                  {repos.length === 0 && <a href={loginUrl()} style={{ color: 'var(--accent-1)' }}>Reconnect GitHub</a>}
                </div>
              )
              : filtered.map(repo => (
                  <motion.div
                    key={repo.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                    }}
                  >
                    <RepoCard repo={repo} />
                  </motion.div>
                ))
          }
        </motion.div>
      </main>
    </>
  );
}
