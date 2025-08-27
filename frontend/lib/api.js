import axios from 'axios';

const getBase = () => {
  // Use environment variable if set, otherwise fallback
  if (typeof window === 'undefined') {
    // server-side (inside container) -> use internal service name or localhost for development
    return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
  }
  // browser -> must reach host
  return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
};

const API = axios.create({ baseURL: getBase() });

API.interceptors.request.use(cfg => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default API;
