'use client';

import { useState } from 'react';
import { getAdminUsers } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await getAdminUsers(username, password);
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container-app" style={{ padding: '4rem 1.5rem' }}>
        
        {!users ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass" 
            style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}
          >
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
              Admin Access
            </h1>
            {error && (
              <div style={{ padding: '0.75rem', background: 'rgba(248,113,113,0.1)', color: '#f87171', borderRadius: 8, marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid rgba(248,113,113,0.3)' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Verifying...' : 'Unlock Dashboard'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>Users Analytics</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Monitoring DevPulse active sessions</p>
              </div>
              <div className="glass" style={{ padding: '0.8rem 1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Total Users</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-2)' }}>{users.length}</span>
              </div>
            </div>

            <div className="glass" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>User</th>
                    <th style={{ padding: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>GitHub ID</th>
                    <th style={{ padding: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>First Joined</th>
                    <th style={{ padding: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-hover)' }}>
                      <td style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={u.avatar_url} alt={u.github_login} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                          <a href={`https://github.com/${u.github_login}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none' }}>
                            @{u.github_login}
                          </a>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem', color: 'var(--text-muted)' }}>{u.github_id}</td>
                      <td style={{ padding: '1.25rem', color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '1.25rem', color: 'var(--accent-1)' }}>{new Date(u.last_seen_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </>
  );
}
