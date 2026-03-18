// src/api/api.js
import axios from 'axios';
import { refresh } from './authService';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
});

let accessToken = null; // простой in-memory storage, можно заменить на state management

export function setAccessToken(token) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}

api.interceptors.request.use((config) => {
  if (!config.headers['Authorization'] && accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Не пытаться обновлять токен, если 401 пришёл с refresh или login — сразу выходим
    const isAuthRequest =
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/login');
    if (
      isAuthRequest ||
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // ставим запрос в очередь, вернём промис, который выполнится после refresh
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const resp = await refresh(); // вызывает /auth/refresh и возвращает { accessToken }
      const newToken = resp.accessToken;
      setAccessToken(newToken);
      processQueue(null, newToken);
      originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      // при неудаче — можно редиректить на логин
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
