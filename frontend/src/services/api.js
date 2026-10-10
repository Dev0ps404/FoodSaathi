import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodrescue_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log network/server errors for observability
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.info('[FoodRescue AI] Backend service unavailable - using client-side resilient state mode.');
    }
    return Promise.reject(error);
  }
);

export default api;
