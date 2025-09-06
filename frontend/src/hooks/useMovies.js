import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';

const useMovies = (options = {}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    detail = 'summary', // 'summary' or 'full' fields
    autoFetch = true,
  } = options;

  const fetchMovies = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          detail,
          ...params,
        });

        const response = await api.get(`movies/?${queryParams}`);
        setMovies(response.data.results || response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch movies');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    },
    [detail]
  );

  const searchMovies = useCallback(async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(
        `movies/search/?search=${encodeURIComponent(searchQuery)}`
      );
      setMovies(response.data.results || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search movies');
      console.error('Error searching movies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMovieById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`movies/${id}/`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movie details');
      console.error('Error fetching movie details:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchMovies();
    }
  }, [autoFetch, fetchMovies]);

  const refetch = useCallback(() => fetchMovies(), [fetchMovies]);

  return {
    movies,
    loading,
    error,
    fetchMovies,
    searchMovies,
    getMovieById,
    refetch,
  };
};

export default useMovies;
