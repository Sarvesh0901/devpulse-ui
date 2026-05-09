import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevPulse — AI-Powered GitHub Analytics',
  description:
    'Deep insights into your GitHub repositories. AI summaries, health scores, commit charts, and contributor analytics — all in one premium dashboard.',
  keywords: ['GitHub analytics', 'AI dashboard', 'developer tools', 'repository health'],
  openGraph: {
    title: 'DevPulse',
    description: 'AI-Powered GitHub Analytics Dashboard',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
