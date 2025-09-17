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
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
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
      sessionStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// USER api functions
export const userAPI = {
  // GET current user info
  getCurrentUser: () => api.get('users/me/'),
};

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

// MOVIE api functions CRUD
export const movieAPIcrud = {
  // GET all movies (summary by default)
  getMovies: (detail = 'summary') => api.get(`movies/?detail=${detail}`),

  // GET movies by genre with detail mode
  getMoviesByGenre: (genreId, detail = 'summary') =>
    api.get(`movies/?genre=${genreId}&detail=${detail}`),

  // GET movie by ID with full details
  getMovieDetails: (id, detail = 'full') =>
    api.get(`movies/${id}/?detail=${detail}`),

  // SEARCH movies
  searchMovies: (query) =>
    api.get(`movies/search/?search=${encodeURIComponent(query)}`),

  // CREATE new movie
  createMovie: (movieData) =>
    api.post('movies/', movieData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // UPDATE movie (full update)
  updateMovie: (id, movieData) =>
    api.put(`movies/${id}/`, movieData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // PARTIAL UPDATE movie
  updateMoviePartial: (id, movieData) =>
    api.patch(`movies/${id}/`, movieData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // DELETE movie
  deleteMovie: (id) => api.delete(`movies/${id}/`),
};

// GENRE api functions
export const genreAPI = {
  // GET all genres
  getGenres: (includeCount = false) =>
    api.get(`genres/?include_count=${includeCount}`),

  // GET genre by ID
  getGenreDetails: (id, includeCount = false) =>
    api.get(`genres/${id}/?include_count=${includeCount}`),

  // CREATE new genre
  createGenre: (genreData) => api.post('genres/', genreData),

  // UPDATE genre (full update)
  updateGenre: (id, genreData) => api.put(`genres/${id}/`, genreData),

  // PARTIAL UPDATE genre
  updateGenrePartial: (id, genreData) => api.patch(`genres/${id}/`, genreData),

  // DELETE genre
  deleteGenre: (id) => api.delete(`genres/${id}/`),
};

// SHOWTIME api functions - UPDATED
export const showtimeAPI = {
  // GET all showtimes
  getShowtimes: (detail = 'summary') => api.get(`showtimes/?detail=${detail}`),

  // GET showtime by ID
  getShowtimeDetails: (id, detail = 'summary') =>
    api.get(`showtimes/${id}/?detail=${detail}`),

  // GET showtimes for a specific movie
  getMovieShowtimes: (movieId) => api.get(`showtimes/?movie=${movieId}`),

  getCinemaShowtimes: (cinemaId, filters = {}) => {
    const params = new URLSearchParams();

    if (filters.date) params.append('date', filters.date);
    if (filters.movie) params.append('movie', filters.movie);

    const queryString = params.toString();
    return api.get(
      `cinemas/${cinemaId}/showtimes/${queryString ? `?${queryString}` : ''}`
    );
  },

  // CREATE new showtime
  createShowtime: (showtimeData) => api.post('showtimes/', showtimeData),

  // UPDATE showtime (full update)
  updateShowtime: (id, showtimeData) =>
    api.put(`showtimes/${id}/`, showtimeData),

  // PARTIAL UPDATE showtime
  updateShowtimePartial: (id, showtimeData) =>
    api.patch(`showtimes/${id}/`, showtimeData),

  // DELETE showtime
  deleteShowtime: (id) => api.delete(`showtimes/${id}/`),
};

// CINEMA api functions (CRUD)
export const cinemaAPI = {
  // GET all cinemas (summary by default)
  getCinemas: (detail = 'summary') => api.get(`cinemas/?detail=${detail}`),

  // GET cinema by ID with detail mode support
  getCinemaDetails: (id, detail = 'summary') =>
    api.get(`cinemas/${id}/?detail=${detail}`),

  getCinemaShowtimes: (cinemaId, filters = {}) => {
    const params = new URLSearchParams();

    if (filters.date) params.append('date', filters.date);
    if (filters.movie) params.append('movie', filters.movie);

    const queryString = params.toString();
    return api.get(
      `cinemas/${cinemaId}/showtimes/${queryString ? `?${queryString}` : ''}`
    );
  },

  // CREATE new cinema
  createCinema: (cinemaData) => api.post('cinemas/', cinemaData),

  // UPDATE cinema (full update)
  updateCinema: (id, cinemaData) => api.put(`cinemas/${id}/`, cinemaData),

  // PARTIAL UPDATE cinema
  updateCinemaPartial: (id, cinemaData) =>
    api.patch(`cinemas/${id}/`, cinemaData),

  // DELETE cinema
  deleteCinema: (id) => api.delete(`cinemas/${id}/`),
};

// SCREENING ROOM api functions (CRUD)
export const screeningRoomAPI = {
  // GET all screening rooms
  getScreeningRooms: () => api.get('rooms/'),

  // GET screening room by ID
  getScreeningRoomDetails: (id) => api.get(`rooms/${id}/`),

  // CREATE new screening room
  createScreeningRoom: (roomData) => api.post('rooms/', roomData),

  // UPDATE screening room (full update)
  updateScreeningRoom: (id, roomData) => api.put(`rooms/${id}/`, roomData),

  // PARTIAL UPDATE screening room
  updateScreeningRoomPartial: (id, roomData) =>
    api.patch(`rooms/${id}/`, roomData),

  // DELETE screening room
  deleteScreeningRoom: (id) => api.delete(`rooms/${id}/`),
};

// BOOKING api functions
export const bookingAPI = {
  // CREATE new booking
  createBooking: (bookingData) => api.post('bookings/', bookingData),

  // GET booking by reference
  getBooking: (bookingReference) => api.get(`bookings/${bookingReference}/`),

  // CONFIRM payment
  confirmPayment: (paymentData) => api.post('payments/confirm/', paymentData),

  // DOWNLOAD ticket
  downloadTicket: (bookingReference) =>
    api.get(`bookings/${bookingReference}/download-ticket/`, {
      responseType: 'blob',
    }),
};

export const tokenUtils = {
  isAuthenticated: () => {
    const localToken = localStorage.getItem('token');
    const sessionToken = sessionStorage.getItem('token');
    return !!(localToken || sessionToken);
  },

  getToken: () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },

  setToken: (token, rememberMe = false) => {
    tokenUtils.removeToken();
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  },

  getTokenSource: () => {
    if (localStorage.getItem('token')) return 'localStorage';
    if (sessionStorage.getItem('token')) return 'sessionStorage';
    return null;
  },
};

export default api;
