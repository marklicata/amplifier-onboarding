/**
 * Authentication utilities
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '';

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  avatar_url: string;
  mode: 'normie' | 'explorer' | 'developer' | 'expert';
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Initiate GitHub OAuth flow
 */
export function initiateGitHubLogin(mode: string) {
  // Store selected mode in session storage
  sessionStorage.setItem('amplifier_selected_mode', mode);

  // Redirect to GitHub OAuth
  const redirectUri = `${window.location.origin}/auth/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=read:user user:email`;

  window.location.href = githubAuthUrl;
}

/**
 * Exchange GitHub OAuth code for JWT token
 */
export async function exchangeCodeForToken(
  code: string,
  mode: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/github/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, mode }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Authentication failed');
  }

  const data: AuthResponse = await response.json();

  // Store token
  localStorage.setItem('amplifier_token', data.token);
  localStorage.setItem('amplifier_user', JSON.stringify(data.user));

  return data;
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem('amplifier_user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Get auth token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('amplifier_token');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Logout user
 */
export function logout() {
  localStorage.removeItem('amplifier_token');
  localStorage.removeItem('amplifier_user');
  window.location.href = '/';
}

/**
 * Fetch with auth token
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
