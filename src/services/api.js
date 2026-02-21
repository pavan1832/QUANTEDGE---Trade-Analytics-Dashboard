import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export const marketDataService = {
  getAll: () => api.get('/market-data'),
  getBySymbol: (symbol) => api.get(`/market-data/${symbol}`),
};

export const portfolioService = {
  get: () => api.get('/portfolio'),
};

export const tradesService = {
  getAll: (params = {}) => api.get('/trades', { params }),
};

export default api;
