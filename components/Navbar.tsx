'use client';

import { useEffect, useState } from 'react';
import { getMe, logout, loginUrl, type User } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push('/');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(6,8,10,0.85)',
      backdropFilter: 'blur(25px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container-app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="DevPulse AI" style={{ width: 26, height: 26, filter: 'drop-shadow(0 0 6px var(--accent-1))' }} />
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.02em', textTransform: 'uppercase', color: '#fff' }}>
              DEVPULSE <span style={{ color: 'var(--accent-1)' }}>AI</span>
            </span>
          </Link>

          {/* Navigation Links (Match reference image) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <Link href="/dashboard" style={{ 
              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, color: '#fff', 
              position: 'relative', padding: '0.5rem 0'
            }}>
              Dashboard
              <span style={{ 
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', 
                background: 'var(--accent-1)', boxShadow: '0 0 10px var(--accent-1)' 
              }} />
            </Link>
            {['Repositories', 'AI Insights', 'Teams', 'Settings'].map(link => (
              <Link key={link} href="#" style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side icons & user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-secondary)' }}>
             {/* Settings Icon */}
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
             {/* Notification Icon */}
             <div style={{ position: 'relative' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-3)', border: '2px solid var(--bg-base)' }} />
             </div>
          </div>

          {loading ? (
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          ) : user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', border: 'none', color: 'var(--text-secondary)', 
                  cursor: 'pointer', fontSize: '0.85rem' 
                }}
              >
                Logout
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar_url}
                alt={user.login}
                style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}
              />
            </div>
          ) : (
            <a href={loginUrl()} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
