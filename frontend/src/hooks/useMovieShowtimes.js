import { useState, useEffect, useCallback } from 'react';
import { showtimeAPI } from '../api/api';

const useMovieShowtimes = (movieId) => {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShowtimes = useCallback(async (id) => {
    if (!id) {
      setShowtimes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await showtimeAPI.getMovieShowtimes(id);
      setShowtimes(response.data || []);
    } catch (err) {
      console.error('Error fetching showtimes:', err);

      if (err.response?.status === 404) {
        setShowtimes([]);
        setError(null);
      } else {
        setError('Failed to load showtimes');
        setShowtimes([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    if (movieId) {
      fetchShowtimes(movieId);
    }
  }, [movieId, fetchShowtimes]);

  useEffect(() => {
    fetchShowtimes(movieId);
  }, [movieId, fetchShowtimes]);

  return {
    showtimes,
    loading,
    error,
    refetch,
    hasShowtimes: showtimes.length > 0,
  };
};

export default useMovieShowtimes;
