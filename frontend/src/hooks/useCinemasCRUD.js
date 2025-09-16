import { useState, useEffect, useCallback } from 'react';
import { cinemaAPI } from '../api/api';

const useCinemasCRUD = (user = null) => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCinemas('full');
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
        throw new Error('only superusers can delete cinemas');
      }
      if (['create', 'update'].includes(action) && !canModify()) {
        throw new Error('staff or superuser permission required');
      }
    },
    [canModify, canDelete]
  );

  const clearError = useCallback(() => setError(null), []);

  const fetchCinemas = useCallback(async (detail = 'summary') => {
    try {
      setLoading(true);
      setError(null);

      const response = await cinemaAPI.getCinemas(detail);
      const cinemaData = response.data.results || response.data;
      setCinemas(cinemaData);
      return cinemaData;
    } catch (err) {
      setError(err.response?.data?.message || 'failed to fetch cinemas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCinemaDetails = useCallback(async (id, detail = 'full') => {
    try {
      setLoading(true);
      setError(null);

      const response = await cinemaAPI.getCinemaDetails(id, detail);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'failed to fetch cinema details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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

  // create new cinema (requires staff permission)
  const createCinema = useCallback(
    async (cinemaData) => {
      try {
        checkPermission('create');
        setLoading(true);
        setError(null);

        console.log('Creating cinema with data:', cinemaData);

        const response = await cinemaAPI.createCinema(cinemaData);
        console.log('Cinema created successfully:', response.data);

        setCinemas((prev) => [response.data, ...prev]);
        return response.data;
      } catch (err) {
        console.error('Create cinema error details:', {
          message: err.message,
          response: err.response,
          data: err.response?.data,
        });

        let errorMessage;

        if (err.message === 'staff or superuser permission required') {
          errorMessage = err.message;
        } else {
          errorMessage = extractErrorMessage(err) || 'failed to create cinema';
        }

        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  // update cinema (requires staff permission)
  const updateCinema = useCallback(
    async (id, cinemaData) => {
      try {
        checkPermission('update');
        setLoading(true);
        setError(null);

        const response = await cinemaAPI.updateCinema(id, cinemaData);
        setCinemas((prev) =>
          prev.map((cinema) => (cinema.id === id ? response.data : cinema))
        );
        return response.data;
      } catch (err) {
        let errorMessage;

        if (err.message === 'staff or superuser permission required') {
          errorMessage = err.message;
        } else {
          errorMessage = extractErrorMessage(err) || 'failed to update cinema';
        }

        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  // partial update cinema (requires staff permission)
  const updateCinemaPartial = useCallback(
    async (id, cinemaData) => {
      try {
        checkPermission('update');
        setLoading(true);
        setError(null);

        const response = await cinemaAPI.updateCinemaPartial(id, cinemaData);
        setCinemas((prev) =>
          prev.map((cinema) => (cinema.id === id ? response.data : cinema))
        );
        return response.data;
      } catch (err) {
        let errorMessage;

        if (err.message === 'staff or superuser permission required') {
          errorMessage = err.message;
        } else {
          errorMessage = extractErrorMessage(err) || 'failed to update cinema';
        }

        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  // delete cinema (requires superuser permission)
  const deleteCinema = useCallback(
    async (id) => {
      try {
        checkPermission('delete');
        setLoading(true);
        setError(null);

        await cinemaAPI.deleteCinema(id);
        setCinemas((prev) => prev.filter((cinema) => cinema.id !== id));
        return true;
      } catch (err) {
        let errorMessage;

        if (err.message === 'only superusers can delete cinemas') {
          errorMessage = err.message;
        } else {
          errorMessage = extractErrorMessage(err) || 'failed to delete cinema';
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
    cinemas,
    loading,
    error,
    canModify: canModify(),
    canDelete: canDelete(),
    fetchCinemas,
    getCinemaDetails,
    createCinema,
    updateCinema,
    updateCinemaPartial,
    deleteCinema,
    clearError,
  };
};

export default useCinemasCRUD;
