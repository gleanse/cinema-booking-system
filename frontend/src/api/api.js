import axios from 'axios';

// BASE CONFIGURATION
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

// for adding AUTH TOKENS
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// common errors handler
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// AUTH api functions
export const authAPI = {
  // LOGIN user
  login: (username, password) =>
    api.post('users/login/', { username, password }),

  // LOGOUT user
  logout: () => api.post('users/logout/'),

  // CREATE user
  register: (userData) => api.post('users/create/', userData),
};

export const tokenUtils = {
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  setToken: (token) => {
    localStorage.setItem('token', token);
  },
};

export default api;
