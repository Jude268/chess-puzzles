import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email: string, username: string, password: string) =>
    client.post('/auth/register', { email, username, password }),
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),
  getProfile: () => client.get('/auth/profile'),
};

export const puzzleService = {
  getNextPuzzle: () => client.get('/puzzles/next'),
  recordAttempt: (data: any) => client.post('/puzzles/attempt', data),
  getStats: () => client.get('/puzzles/stats'),
  getHistory: (limit?: number, offset?: number) =>
    client.get('/puzzles/history', { params: { limit, offset } }),
};

export default client;
