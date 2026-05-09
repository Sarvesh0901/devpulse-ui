'use client';

import { loginUrl } from '@/lib/api';
import Navbar from '@/components/Navbar';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Daily Pulse',
    desc: 'Gemini AI summarises your last 10 commits into a clear "Daily Pulse" report — categorised as Feature, Fix, Refactor or Chore.',
  },
  {
    icon: '📊',
    title: 'Visual Analytics',
    desc: 'Interactive commit-frequency bar charts, language-split pie charts, and contributor activity — all in one place.',
  },
  {
    icon: '❤️',
    title: 'Health Score',
    desc: 'A proprietary algorithm scores each repo 0–100 based on PR turnaround, issue resolution, commit consistency, and recency.',
  },
  {
    icon: '⚡',
    title: 'Smart Caching',
    desc: 'Supabase-backed response caching keeps you under GitHub\'s API rate limits while keeping data fresh.',
  },
  {
    icon: '🔒',
    title: 'Secure by Default',
    desc: 'GitHub OAuth with CSRF protection, httpOnly JWT cookies, Helmet security headers, and strict CORS.',
  },
  {
    icon: '🌐',
    title: 'Tech Stack Insights',
    desc: 'Instantly see language distribution across your codebase with beautiful, colour-coded visualisations.',
  },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section style={{ textAlign: 'center', padding: '7rem 1.5rem 5rem' }}>
          <div className="container-app">
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(99,102,241,0.12)', border: '1px solid var(--border)',
              borderRadius: 100, padding: '0.3rem 1rem', fontSize: '0.8rem',
              color: 'var(--accent-2)', marginBottom: '2rem',
            }}>
              <span>✨</span> Powered by Gemini AI + GitHub API
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Your GitHub repos,{' '}
              <span className="gradient-text">intelligently analysed</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 3rem', lineHeight: 1.7 }}>
              DevPulse gives you AI-powered commit summaries, repository health scores,
              and beautiful analytics dashboards — all in a single premium interface.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={loginUrl()} className="btn-primary" id="hero-login-btn" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Connect GitHub Account
              </a>
              <a href="#features" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem' }}>
                Explore Features ↓
              </a>
            </div>
          </div>
        </section>

        {/* ── Stats strip ──────────────────────────────────────────────── */}
        <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
          <div className="container-app" style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', textAlign: 'center' }}>
            {[['50+', 'Commits Analysed Daily'], ['0–100', 'Health Score Range'], ['1hr', 'AI Cache TTL'], ['0', 'Known Vulnerabilities']].map(([stat, label]) => (
              <div key={label}>
                <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>{stat}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────── */}
        <section id="features" style={{ padding: '6rem 1.5rem' }}>
          <div className="container-app">
            <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
              Everything you need to{' '}
              <span className="gradient-text">understand your code</span>
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3.5rem', fontSize: '1rem' }}>
              Built for developers who care about code quality and team velocity.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}>
              {FEATURES.map((f) => (
                <div key={f.title} className="glass" style={{ padding: '1.75rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <div className="container-app">
            <div className="glass" style={{ padding: '3.5rem 2rem', maxWidth: 600, margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '1rem' }}>
                Ready to pulse your repos?
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Free to use. No credit card required. Just your GitHub account.
              </p>
              <a href={loginUrl()} className="btn-primary" id="cta-login-btn" style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}>
                Get Started — It's Free
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
        <div className="container-app">
          Built with ⚡ by <span className="gradient-text" style={{ fontWeight: 600 }}>DevPulse</span>
          {' '}· GitHub Analytics powered by Gemini AI
        </div>
      </footer>
    </>
  );
}
