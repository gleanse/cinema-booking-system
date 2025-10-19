import { useState, useCallback } from 'react';
import { bookingAPI } from '../api/api';

const useBookingOverview = () => {
  const [overview, setOverview] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const getBookingOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingAPI.getBookingOverview();
      setOverview(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || 'Failed to fetch booking overview';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookingSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingAPI.getBookingSummary();
      setSummary(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || 'Failed to fetch booking summary';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [overviewData, summaryData] = await Promise.all([
        bookingAPI.getBookingOverview(),
        bookingAPI.getBookingSummary(),
      ]);
      setOverview(overviewData.data);
      setSummary(summaryData.data);
      return { overview: overviewData.data, summary: summaryData.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || 'Failed to refresh booking data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    overview,
    summary,
    loading,
    error,
    getBookingOverview,
    getBookingSummary,
    refreshAll,
    clearError,
  };
};

export default useBookingOverview;
