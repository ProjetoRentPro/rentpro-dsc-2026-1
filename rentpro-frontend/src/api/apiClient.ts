import axios from 'axios';
import { TOKEN_KEY, clearSession, redirectToLogin, redirectToUnauthorized } from '../auth/session';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url === '/auth/login';

    if (error.response?.status === 401 && !isLoginRequest) {
      clearSession();
      redirectToLogin();
    }

    if (error.response?.status === 403 && !isLoginRequest) {
      redirectToUnauthorized();
    }

    return Promise.reject(error);
  },
);
