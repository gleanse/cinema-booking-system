import { useState, useCallback } from 'react';
import { bookingAPI } from '../api/api';

const useBookingsCRUD = () => {
  const [booking, setBooking] = useState(null);
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

  const createBooking = useCallback(
    async (bookingData) => {
      try {
        setLoading(true);
        setError(null);

        console.log('Creating booking with data:', bookingData);

        const response = await bookingAPI.createBooking(bookingData);
        console.log('Booking created successfully:', response.data);

        setBooking(response.data);
        return response.data;
      } catch (err) {
        console.error('Create booking error details:', {
          message: err.message,
          response: err.response,
          data: err.response?.data,
        });

        const errorMessage =
          extractErrorMessage(err) || 'Failed to create booking';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [extractErrorMessage]
  );

  const getBooking = useCallback(
    async (bookingReference) => {
      try {
        setLoading(true);
        setError(null);

        const response = await bookingAPI.getBooking(bookingReference);
        setBooking(response.data);
        return response.data;
      } catch (err) {
        const errorMessage =
          extractErrorMessage(err) || 'Failed to fetch booking';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [extractErrorMessage]
  );

  const downloadTicket = useCallback(
    async (bookingReference) => {
      try {
        setLoading(true);
        setError(null);

        const response = await bookingAPI.downloadTicket(bookingReference);

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket_${bookingReference}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return true;
      } catch (err) {
        const errorMessage =
          extractErrorMessage(err) || 'Failed to download ticket';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [extractErrorMessage]
  );

  return {
    booking,
    loading,
    error,
    createBooking,
    getBooking,
    downloadTicket,
    clearError,
  };
};

export default useBookingsCRUD;
