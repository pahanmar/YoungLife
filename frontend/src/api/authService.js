// frontend/src/api/authService.js
import api, { setAccessToken } from './api';

// login: POST /api/auth/login
export async function login(email, password) {
  const res = await api.post('/api/auth/login', { email, password });
  const data = res.data;
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
}

// refresh: POST /api/auth/refresh (таймаут 8 с — при отсутствии куки не ждём долго)
const REFRESH_TIMEOUT_MS = 8000;

export async function refresh() {
  const res = await Promise.race([
    api.post('/api/auth/refresh'),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), REFRESH_TIMEOUT_MS)
    ),
  ]);
  const data = res.data;
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
}

// logout: POST /api/auth/logout
export async function logout() {
  try {
    await api.post('/api/auth/logout');
  } finally {
    setAccessToken(null);
  }
}

// me: GET /api/auth/me
export async function me() {
  const res = await api.get('/api/auth/me');
  return res.data;
}
