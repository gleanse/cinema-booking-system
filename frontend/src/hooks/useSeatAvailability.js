import { useState, useCallback } from 'react';
import { showtimeAPI } from '../api/api';

const useSeatAvailability = () => {
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      if (errorData.error) {
        return errorData.error;
      }
    }

    return err.message || 'An unexpected error occurred';
  }, []);

  const checkSeatAvailability = useCallback(
    async (showtimeId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await showtimeAPI.getShowtimeDetails(
          showtimeId,
          'full'
        );

        const seatsData = response.data.seats_data || {};
        const available = Object.entries(seatsData)
          .filter(([_, seatInfo]) => seatInfo.available)
          .map(([seatCode]) => seatCode);

        setAvailableSeats(available);
        return available;
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [extractErrorMessage]
  );

  const areSeatsAvailable = useCallback(
    (selectedSeats) => {
      return selectedSeats.every((seat) => availableSeats.includes(seat));
    },
    [availableSeats]
  );

  return {
    availableSeats,
    loading,
    error,
    checkSeatAvailability,
    areSeatsAvailable,
    clearError,
  };
};

export default useSeatAvailability;
