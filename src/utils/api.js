import axios from 'axios';

// Use import.meta.env for Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle 401 (except on login page)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage =
      window.location.pathname.includes('/login') ||
      window.location.pathname.includes('/register') ||
      window.location.pathname.includes('/forgot-password') ||
      window.location.pathname.includes('/reset-password');

    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (
      error.response?.status === 401 &&
      !isAuthPage &&
      !isLoginRequest
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;