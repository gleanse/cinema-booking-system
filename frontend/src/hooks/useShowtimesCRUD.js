import { useState, useEffect, useCallback } from 'react';
import { showtimeAPI } from '../api/api';

const useShowtimesCRUD = (user = null) => {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShowtimes();
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
        throw new Error('only superusers can delete showtimes');
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

  const fetchShowtimes = useCallback(
    async (detail = 'summary') => {
      try {
        setLoading(true);
        setError(null);

        const response = await showtimeAPI.getShowtimes(detail);
        const showtimeData = response.data.results || response.data;
        setShowtimes(showtimeData);
        return showtimeData;
      } catch (err) {
        const errorMessage =
          extractErrorMessage(err) || 'failed to fetch showtimes';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [extractErrorMessage]
  );

  const getShowtimeDetails = useCallback(
    async (id, detail = 'summary') => {
      try {
        setLoading(true);
        setError(null);

        const response = await showtimeAPI.getShowtimeDetails(id, detail);
        return response.data;
      } catch (err) {
        const errorMessage =
          extractErrorMessage(err) || 'failed to fetch showtime details';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [extractErrorMessage]
  );

  const getMovieShowtimes = useCallback(
    async (movieId) => {
      try {
        setLoading(true);
        setError(null);

        const response = await showtimeAPI.getMovieShowtimes(movieId);
        const showtimeData = response.data.results || response.data;
        return showtimeData;
      } catch (err) {
        const errorMessage =
          extractErrorMessage(err) || 'failed to fetch movie showtimes';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [extractErrorMessage]
  );

  const getCinemaShowtimes = useCallback(
    async (cinemaId, filters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await showtimeAPI.getCinemaShowtimes(
          cinemaId,
          filters
        );
        const showtimeData = response.data;
        return showtimeData;
      } catch (err) {
        const errorMessage =
          extractErrorMessage(err) || 'failed to fetch cinema showtimes';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [extractErrorMessage]
  );

  const createShowtime = useCallback(
    async (showtimeData) => {
      try {
        checkPermission('create');
        setLoading(true);
        setError(null);

        console.log('Creating showtime with data:', showtimeData);

        const response = await showtimeAPI.createShowtime(showtimeData);
        console.log('Showtime created successfully:', response.data);

        setShowtimes((prev) => [response.data, ...prev]);
        return response.data;
      } catch (err) {
        console.error('Create showtime error details:', {
          message: err.message,
          response: err.response,
          data: err.response?.data,
        });

        let errorMessage;

        if (err.message === 'staff or superuser permission required') {
          errorMessage = err.message;
        } else {
          errorMessage =
            extractErrorMessage(err) || 'failed to create showtime';
        }

        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  const updateShowtime = useCallback(
    async (id, showtimeData) => {
      try {
        checkPermission('update');
        setLoading(true);
        setError(null);

        const response = await showtimeAPI.updateShowtime(id, showtimeData);
        setShowtimes((prev) =>
          prev.map((showtime) =>
            showtime.id === id ? response.data : showtime
          )
        );
        return response.data;
      } catch (err) {
        let errorMessage;

        if (err.message === 'staff or superuser permission required') {
          errorMessage = err.message;
        } else {
          errorMessage =
            extractErrorMessage(err) || 'failed to update showtime';
        }

        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  const updateShowtimePartial = useCallback(
    async (id, showtimeData) => {
      try {
        checkPermission('update');
        setLoading(true);
        setError(null);

        const response = await showtimeAPI.updateShowtimePartial(
          id,
          showtimeData
        );
        setShowtimes((prev) =>
          prev.map((showtime) =>
            showtime.id === id ? response.data : showtime
          )
        );
        return response.data;
      } catch (err) {
        let errorMessage;

        if (err.message === 'staff or superuser permission required') {
          errorMessage = err.message;
        } else {
          errorMessage =
            extractErrorMessage(err) || 'failed to update showtime';
        }

        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  const deleteShowtime = useCallback(
    async (id) => {
      try {
        checkPermission('delete');
        setLoading(true);
        setError(null);

        await showtimeAPI.deleteShowtime(id);
        setShowtimes((prev) => prev.filter((showtime) => showtime.id !== id));
        return true;
      } catch (err) {
        let errorMessage;

        if (err.message === 'only superusers can delete showtimes') {
          errorMessage = err.message;
        } else {
          errorMessage =
            extractErrorMessage(err) || 'failed to delete showtime';
        }

        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  return {
    showtimes,
    loading,
    error,
    canModify: canModify(),
    canDelete: canDelete(),
    fetchShowtimes,
    getShowtimeDetails,
    getMovieShowtimes,
    getCinemaShowtimes,
    createShowtime,
    updateShowtime,
    updateShowtimePartial,
    deleteShowtime,
    clearError,
  };
};

export default useShowtimesCRUD;
