import { useState, useEffect } from 'react';
import { cinemaAPI } from '../api/api';

export const useCinemas = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCinemas = async (detail = 'summary') => {
    setLoading(true);
    setError(null);
    try {
      const response = await cinemaAPI.getCinemas(detail);
      setCinemas(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cinemas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCinema = async (cinemaData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cinemaAPI.createCinema(cinemaData);
      setCinemas((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Failed to create cinema');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCinema = async (id, cinemaData, partial = true) => {
    setLoading(true);
    setError(null);
    try {
      const response = partial
        ? await cinemaAPI.updateCinemaPartial(id, cinemaData)
        : await cinemaAPI.updateCinema(id, cinemaData);

      setCinemas((prev) =>
        prev.map((cinema) => (cinema.id === id ? response.data : cinema))
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Failed to update cinema');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCinema = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await cinemaAPI.deleteCinema(id);
      setCinemas((prev) => prev.filter((cinema) => cinema.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete cinema');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCinema = async (id, detail = 'summary') => {
    setLoading(true);
    setError(null);
    try {
      const response = await cinemaAPI.getCinemaDetails(id, detail);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cinema');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchCinemas('summary');
  }, []);

  return {
    cinemas,
    loading,
    error,
    fetchCinemas,
    createCinema,
    updateCinema,
    deleteCinema,
    getCinema,
    clearError,
  };
};
