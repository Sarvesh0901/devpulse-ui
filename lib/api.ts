// API base URL — always points to backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include', // sends httpOnly JWT cookie
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const getMe = () => apiFetch<{ user: User }>('/auth/me');
export const logout = () => apiFetch('/auth/logout', { method: 'POST' });
export const loginUrl = () => `${API_BASE}/auth/github`;

// ── Repos ─────────────────────────────────────────────────────────────────────
export const getRepos = () => apiFetch<{ repos: Repo[] }>('/api/repos');
export const getRepo = (owner: string, repo: string) =>
  apiFetch<{ repo: Repo }>(`/api/repos/${owner}/${repo}`);

// ── Repo data ─────────────────────────────────────────────────────────────────
export const getCommits = (owner: string, repo: string) =>
  apiFetch<{ commits: Commit[] }>(`/api/repos/${owner}/${repo}/commits`);
export const getLanguages = (owner: string, repo: string) =>
  apiFetch<{ languages: Record<string, number> }>(`/api/repos/${owner}/${repo}/languages`);
export const getContributors = (owner: string, repo: string) =>
  apiFetch<{ contributors: Contributor[] }>(`/api/repos/${owner}/${repo}/contributors`);
export const getHealth = (owner: string, repo: string) =>
  apiFetch<{ health: HealthScore }>(`/api/repos/${owner}/${repo}/health`);
export const getPulse = (owner: string, repo: string) =>
  apiFetch<{ pulse: Pulse }>(`/api/repos/${owner}/${repo}/pulse`);

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  github_id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string; avatar_url: string };
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
  open_issues_count: number;
  private: boolean;
}

export interface Commit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  author: { login: string; avatar_url: string } | null;
}

export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface HealthScore {
  score: number;
  grade: string;
  breakdown: {
    commitConsistency: number;
    prTurnaround: number;
    issueResolution: number;
    recentActivity: number;
  };
}

export interface Pulse {
  summary: string;
  categories: {
    Feature: string[];
    Fix: string[];
    Refactor: string[];
    Chore: string[];
  };
  insights: string[];
  mood: 'Productive' | 'Steady' | 'Fixing' | 'Refactoring';
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function getAdminUsers(username?: string, password?: string): Promise<{ users: any[] }> {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch admin data');
  }
  return res.json();
}
