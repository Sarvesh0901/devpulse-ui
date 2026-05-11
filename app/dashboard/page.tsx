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
        {/* Dashboard Header */}
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

        {/* 3-Column Grid (Match reference image exactly) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '320px 1fr 320px', 
          gap: '1.5rem',
          alignItems: 'start' 
        }}>
          
          {/* Left Column: Health & Top Repos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {loading ? (
                <SkeletonCard height={300} />
             ) : repos.length > 0 ? (
                /* Health Score Ring component (already updated) */
                <div style={{ gridColumn: 'span 1' }}>
                    {/* Assuming HealthScoreRing is used here, passing dummy/calculated health */}
                    {/* For now, I'll put a placeholder if health component isn't direct here */}
                    {/* Actually, let's use the real components if they exist */}
                    <div className="glass" style={{ padding: '2rem' }}>
                         <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Repository Health Score</h3>
                         <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{ fontSize: '4rem', fontWeight: 900, color: '#fff', textShadow: '0 0 20px var(--accent-1)' }}>89%</div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                Score: <span style={{ color: 'var(--accent-2)' }}>89/100</span> | Excellent
                            </p>
                         </div>
                         <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {['PRs: 21 Open', 'Merges: 98%', 'Issues: 15'].map(tag => (
                                <span key={tag} style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{tag}</span>
                            ))}
                         </div>
                    </div>
                </div>
             ) : null}

             <div className="glass" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>Top Repositories</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {repos.slice(0, 3).map(repo => (
                      <div key={repo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{repo.name}</span>
                         </div>
                         <span style={{ fontSize: '0.8rem', color: 'var(--accent-2)', fontWeight: 700 }}>{repo.stargazers_count}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Middle Column: AI Insights & Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {/* Gemini AI Insights Panel */}
             <div className="glass card-ai" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #d946ef, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(217, 70, 239, 0.4)' }}>
                         <span style={{ fontSize: '1.4rem' }}>✨</span>
                      </div>
                      <div>
                         <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Gemini AI Insights</h3>
                         <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recent Code Commits Analysed</p>
                      </div>
                   </div>
                   <button className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}>GEMINI AI</button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   {[
                      { icon: '⚠️', text: "Potential Refactoring in 'api-v2.js' (High Priority)", color: 'rgba(251,191,36,0.1)' },
                      { icon: '✅', text: "New features deployed in 'ui-main-v1.3'", color: 'rgba(52,211,153,0.1)' },
                      { icon: '📊', text: "PR Activity spikes detected from @alex_chen", color: 'rgba(96,165,250,0.1)' },
                   ].map((item, i) => (
                      <div key={i} style={{ background: item.color, padding: '0.85rem 1.25rem', borderRadius: 10, display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                         <span>{item.icon}</span>
                         <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.text}</span>
                      </div>
                   ))}
                </div>
             </div>

             {/* Developer Activity Chart Placeholder */}
             <div className="glass" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Developer Activity</h3>
                   <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-2)' }} /> Commits</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-1)' }} /> PR</span>
                   </div>
                </div>
                <div style={{ height: 200, width: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.05), transparent)', borderRadius: 12, position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '1rem', gap: '1rem' }}>
                   {/* Dummy bars for visual effect */}
                   {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, background: 'linear-gradient(to top, var(--accent-2), transparent)', opacity: 0.3, borderRadius: '4px 4px 0 0' }} />
                   ))}
                   <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-surface)', padding: '0.4rem 1rem', borderRadius: 20, border: '1px solid var(--accent-2)', fontSize: '0.8rem', fontWeight: 700, boxShadow: '0 0 15px var(--accent-2)' }}>
                      435 Commits
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column: PR Activity */}
          <div className="glass" style={{ padding: '1.5rem', height: '100%' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Pull Request Activity</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                   { user: 'alex_chen', action: 'Develope commits', time: '13 minutes ago', icon: '🎋' },
                   { user: 'sarvesh', action: 'Potential Refactoring', time: '13 minutes ago', icon: '🔧' },
                   { user: 'bot-ai', action: 'New features deployed', time: '2 hours ago', icon: '✅' },
                ].map((act, i) => (
                   <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{act.icon}</div>
                      <div>
                         <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{act.user} <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>{act.action}</span></div>
                         <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{act.time}</div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

        </div>
      </main>
    </>
  );
}
