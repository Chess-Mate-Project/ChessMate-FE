import { writable } from 'svelte/store';
import { generateRandomString, generateCodeChallenge } from '$lib/utils/pkce';

export const isAuthenticated = writable(false);

// 초기화 시 로컬스토리지에서 인증 상태 복원
if (typeof window !== 'undefined') {
  const savedAuth = localStorage.getItem('isAuthenticated');
  if (savedAuth === 'true') {
    isAuthenticated.set(true);
  }
}

export async function initiateLogin() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem('code_verifier', codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: import.meta.env.VITE_LICHESS_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `https://lichess.org/oauth?${params}`;
}

export async function handleCallback(code) {
  const codeVerifier = localStorage.getItem('code_verifier');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        code: code,
        code_verifier: codeVerifier,
      }),
    });

    if (response.ok) {
      isAuthenticated.set(true);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.removeItem('code_verifier');
      return true;
    }
    throw new Error('Login failed');
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

export async function checkAuthStatus() {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      isAuthenticated.set(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    } else {
      isAuthenticated.set(false);
      localStorage.removeItem('isAuthenticated');
      return false;
    }
  } catch (error) {
    console.error('Auth check error:', error);
    isAuthenticated.set(false);
    localStorage.removeItem('isAuthenticated');
    return false;
  }
}
