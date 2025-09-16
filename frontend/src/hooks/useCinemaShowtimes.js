import { useState, useCallback, useEffect } from 'react';
import { showtimeAPI } from '../api/api';

const useCinemaShowtimes = (cinemaId) => {
  const [cinema, setCinema] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchCinemaShowtimes = useCallback(async () => {
    if (!cinemaId) {
      setError('Cinema ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching showtimes for cinema:', cinemaId);
      const response = await showtimeAPI.getCinemaShowtimes(cinemaId);
      console.log('API Response:', response.data);

      setCinema(response.data.cinema);
      setShowtimes(response.data.showtimes || []);

      return response.data;
    } catch (err) {
      console.error('Error fetching cinema showtimes:', err);
      const errorMessage =
        extractErrorMessage(err) || 'Failed to fetch cinema showtimes';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cinemaId, extractErrorMessage]);

  useEffect(() => {
    fetchCinemaShowtimes();
  }, [fetchCinemaShowtimes]);

  const refetch = useCallback(() => {
    return fetchCinemaShowtimes();
  }, [fetchCinemaShowtimes]);

  return {
    cinema,
    showtimes,
    loading,
    error,
    refetch,
    fetchCinemaShowtimes,
  };
};

export default useCinemaShowtimes;
