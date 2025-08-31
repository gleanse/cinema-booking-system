import { useState, useEffect, useCallback } from 'react';
import { movieAPI } from '../api/api';

const useMovieDetails = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovieDetails = useCallback(async (id) => {
    if (!id) {
      setLoading(false);
      setError('Movie ID is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await movieAPI.getMovieDetails(id);
      setMovie(response.data);
    } catch (err) {
      console.error('Error fetching movie details:', err);

      if (err.response?.status === 404) {
        setError('Movie not found');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection.');
      } else {
        setError(err.response?.data?.detail || 'Failed to load movie details');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (movieId) {
      fetchMovieDetails(movieId);
    }
  }, [movieId, fetchMovieDetails]);

  useEffect(() => {
    fetchMovieDetails(movieId);
  }, [movieId, fetchMovieDetails]);

  return {
    movie,
    loading,
    error,
    refetch,
  };
};

export default useMovieDetails;
