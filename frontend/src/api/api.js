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

// MOVIE api functions
export const movieAPI = {
  // GET all movies (summary by default)
  getMovies: (detail = 'summary') => api.get(`movies/?detail=${detail}`),

  // GET movie by ID with full details
  getMovieDetails: (id) => api.get(`movies/${id}/?detail=full`),

  // SEARCH movies
  searchMovies: (query) =>
    api.get(`movies/search/?search=${encodeURIComponent(query)}`),

  // GET movies by genre
  getMoviesByGenre: (genreId, limit = 5, detail = 'summary') =>
    api.get(`genres/${genreId}/movies/?limit=${limit}&detail=${detail}`),
};

// GENRE api functions
export const genreAPI = {
  // GET all genres
  getGenres: (includeCount = false) =>
    api.get(`genres/?include_count=${includeCount}`),

  // GET genre by ID
  getGenreDetails: (id, includeCount = false) =>
    api.get(`genres/${id}/?include_count=${includeCount}`),
};

// SHOWTIME api functions
export const showtimeAPI = {
  // GET all showtimes
  getShowtimes: (detail = 'summary') => api.get(`showtimes/?detail=${detail}`),

  // GET showtime by ID
  getShowtimeDetails: (id, detail = 'summary') =>
    api.get(`showtimes/${id}/?detail=${detail}`),

  // GET showtimes for a specific movie (you might need to add this endpoint)
  getMovieShowtimes: (movieId) => api.get(`showtimes/?movie=${movieId}`),
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
