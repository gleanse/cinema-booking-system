import { useState, useCallback, useEffect } from 'react';
import { showtimeAPI } from '../api/api';

const useShowtimeDetails = (showtimeId) => {
  const [showtime, setShowtime] = useState(null);
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

      if (errorData.error) {
        return errorData.error;
      }
    }

    return err.message || 'An unexpected error occurred';
  }, []);

  const fetchShowtimeDetails = useCallback(async () => {
    if (!showtimeId) {
      setError('Showtime ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching showtime details for:', showtimeId);
      const response = await showtimeAPI.getShowtimeDetails(showtimeId, 'full');
      console.log('Showtime details response:', response.data);

      setShowtime(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching showtime details:', err);
      const errorMessage =
        extractErrorMessage(err) || 'Failed to fetch showtime details';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showtimeId, extractErrorMessage]);

  useEffect(() => {
    fetchShowtimeDetails();
  }, [fetchShowtimeDetails]);

  const refetch = useCallback(() => {
    return fetchShowtimeDetails();
  }, [fetchShowtimeDetails]);

  return {
    showtime,
    loading,
    error,
    refetch,
    fetchShowtimeDetails,
  };
};

export default useShowtimeDetails;
