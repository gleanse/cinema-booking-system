import { useState, useEffect, useCallback } from 'react';
import { movieAPIcrud } from '../api/api';

const useMoviesCRUD = (user = null) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies('full');
  }, []);

  // permission checks
  const canModify = useCallback(() => {
    if (!user) return false;
    return user.is_staff === true || user.is_superuser === true;
  }, [user]);

  const canDelete = useCallback(() => {
    if (!user) return false;
    return user.is_superuser === true;
  }, [user]);

  const checkPermission = useCallback(
    (action) => {
      if (action === 'delete' && !canDelete()) {
        throw new Error('only superusers can delete movies');
      }
      if (['create', 'update'].includes(action) && !canModify()) {
        throw new Error('staff or superuser permission required');
      }
    },
    [canModify, canDelete]
  );

  const clearError = useCallback(() => setError(null), []);

  const extractErrorMessage = useCallback((err) => {
    if (err.response?.data) {
      const errorData = err.response.data;

      if (typeof errorData === 'object' && !Array.isArray(errorData)) {
        const firstErrorKey = Object.keys(errorData)[0];
        if (firstErrorKey) {
          const firstError = errorData[firstErrorKey];
          return Array.isArray(firstError) ? firstError[0] : firstError;
        }
      }

      if (typeof errorData === 'string') {
        return errorData;
      }

      if (errorData.message) {
        return errorData.message;
      }

      if (errorData.detail) {
        return errorData.detail;
      }
    }

    return 'An unexpected error occurred';
  }, []);

  const fetchMovies = useCallback(async (detail = 'summary') => {
    try {
      setLoading(true);
      setError(null);

      const response = await movieAPIcrud.getMovies(detail);
      const movieData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setMovies(movieData);
      return movieData;
    } catch (err) {
      setError(err.response?.data?.message || 'failed to fetch movies');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMoviesByGenre = useCallback(
    async (genreId, detail = 'summary') => {
      try {
        setLoading(true);
        setError(null);

        const response = await movieAPIcrud.getMoviesByGenre(genreId, detail);
        const movieData = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setMovies(movieData);
        return movieData;
      } catch (err) {
        setError(
          err.response?.data?.message || 'failed to fetch movies by genre'
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getMovieDetails = useCallback(async (id, detail = 'full') => {
    try {
      setLoading(true);
      setError(null);

      const response = await movieAPIcrud.getMovieDetails(id, detail);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'failed to fetch movie details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMovies = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);

      const response = await movieAPIcrud.searchMovies(query);
      const movieData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setMovies(movieData);
      return movieData;
    } catch (err) {
      setError(err.response?.data?.message || 'failed to search movies');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // create new movie (requires staff permission)
  const createMovie = useCallback(
    async (movieData) => {
      try {
        checkPermission('create');
        setLoading(true);
        setError(null);

        const response = await movieAPIcrud.createMovie(movieData);
        setMovies((prev) => [response.data, ...prev]);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.message === 'staff or superuser permission required'
            ? err.message
            : extractErrorMessage(err) || 'failed to create movie';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  // update movie (requires staff permission)
  const updateMovie = useCallback(
    async (id, movieData) => {
      try {
        checkPermission('update');
        setLoading(true);
        setError(null);

        const response = await movieAPIcrud.updateMovie(id, movieData);
        setMovies((prev) =>
          prev.map((movie) => (movie.id === id ? response.data : movie))
        );
        return response.data;
      } catch (err) {
        const errorMessage =
          err.message === 'staff or superuser permission required'
            ? err.message
            : extractErrorMessage(err) || 'failed to update movie';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  // partial update movie (requires staff permission)
  const updateMoviePartial = useCallback(
    async (id, movieData) => {
      try {
        checkPermission('update');
        setLoading(true);
        setError(null);

        const response = await movieAPIcrud.updateMoviePartial(id, movieData);
        setMovies((prev) =>
          prev.map((movie) => (movie.id === id ? response.data : movie))
        );
        return response.data;
      } catch (err) {
        const errorMessage =
          err.message === 'staff or superuser permission required'
            ? err.message
            : extractErrorMessage(err) || 'failed to update movie';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  // delete movie (requires superuser permission)
  const deleteMovie = useCallback(
    async (id) => {
      try {
        checkPermission('delete');
        setLoading(true);
        setError(null);

        await movieAPIcrud.deleteMovie(id);
        setMovies((prev) => prev.filter((movie) => movie.id !== id));
        return true;
      } catch (err) {
        const errorMessage =
          err.message === 'only superusers can delete movies'
            ? err.message
            : extractErrorMessage(err) || 'failed to delete movie';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  return {
    movies,
    loading,
    error,
    canModify: canModify(),
    canDelete: canDelete(),
    fetchMovies,
    fetchMoviesByGenre,
    getMovieDetails,
    searchMovies,
    createMovie,
    updateMovie,
    updateMoviePartial,
    deleteMovie,
    clearError,
  };
};

export default useMoviesCRUD;
