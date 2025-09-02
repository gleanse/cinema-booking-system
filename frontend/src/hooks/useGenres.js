import { useState, useEffect } from 'react';
import { genreAPI } from '../api/api';
export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGenres = async (includeCount = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await genreAPI.getGenres(includeCount);
      setGenres(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch genres');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createGenre = async (genreData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await genreAPI.createGenre(genreData);
      setGenres((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Failed to create genre');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGenre = async (id, genreData, partial = true) => {
    setLoading(true);
    setError(null);
    try {
      const response = partial
        ? await genreAPI.updateGenrePartial(id, genreData)
        : await genreAPI.updateGenre(id, genreData);

      setGenres((prev) =>
        prev.map((genre) => (genre.id === id ? response.data : genre))
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Failed to update genre');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGenre = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await genreAPI.deleteGenre(id);
      setGenres((prev) => prev.filter((genre) => genre.id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete genre');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getGenre = async (id, includeCount = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await genreAPI.getGenreDetails(id, includeCount);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch genre');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchGenres(true);
  }, []);

  return {
    genres,
    loading,
    error,
    fetchGenres,
    createGenre,
    updateGenre,
    deleteGenre,
    getGenre,
    clearError,
  };
};
