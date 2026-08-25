import axios from 'axios';

// The browser only talks to the Vite/Laravel origin. In production this keeps
// tokens and WebSocket upgrades behind the same trusted domain.
export const api = axios.create({ baseURL: '/api/v1', withCredentials: true, headers: { Accept: 'application/json' } });

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('nexora_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const dashboardApi = {
  get: () => api.get('/dashboard'),
  games: (params) => api.get('/games', { params }),
  tournaments: (params) => api.get('/tournaments', { params }),
  leaderboard: (params) => api.get('/leaderboard', { params }),
  wallet: () => api.get('/wallet'),
  transactions: (params) => api.get('/wallet/transactions', { params }),
  depositIntent: (amount) => api.post('/wallet/deposits/intent', { amount }),
};
