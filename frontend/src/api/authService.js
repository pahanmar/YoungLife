// frontend/src/api/authService.js
import api, { setAccessToken } from './api';

// register: POST /api/auth/register
export async function register({ name, email, password }) {
  const res = await api.post('/api/auth/register', { name, email, password });
  const data = res.data;
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
}

// login: POST /api/auth/login
export async function login(email, password) {
  const res = await api.post('/api/auth/login', { email, password });
  const data = res.data;
  if (data?.accessToken) {
    setAccessToken(data.accessToken);
  }
  return data;
}

// refresh: POST /api/auth/refresh
export async function refresh() {
  const res = await api.post('/api/auth/refresh');
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