import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';

const useMoviesLazyLoading = (options = {}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    detail = 'summary',
    autoFetch = true,
  } = options;

  const fetchMovies = useCallback(
    async (params = {}, page = 1, append = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const queryParams = new URLSearchParams({
          detail,
          page: page.toString(),
          ...params,
        });

        const response = await api.get(`movies/?${queryParams}`);
        const data = response.data;

        // handle paginated response
        const newMovies = data.results || data;

        if (append && page > 1) {
          setMovies((prevMovies) => [...prevMovies, ...newMovies]);
        } else {
          setMovies(newMovies);
          setCurrentPage(1);
        }

        // check if there are more pages
        setHasMore(!!data.next);

        if (page > 1) {
          setCurrentPage(page);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'failed to fetch movies');
        console.error('error fetching movies:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [detail]
  );

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    const nextPage = currentPage + 1;
    await fetchMovies({}, nextPage, true);
  }, [fetchMovies, currentPage, loadingMore, hasMore]);

  const searchMovies = useCallback(async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      const response = await api.get(
        `movies/search/?search=${encodeURIComponent(searchQuery)}&page=1`
      );
      const data = response.data;

      setMovies(data.results || data);
      setHasMore(!!data.next);
    } catch (err) {
      setError(err.response?.data?.message || 'failed to search movies');
      console.error('error searching movies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMovieById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`movies/${id}/`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'failed to fetch movie details');
      console.error('error fetching movie details:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setMovies([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  const refetch = useCallback(() => {
    reset();
    fetchMovies();
  }, [fetchMovies, reset]);

  useEffect(() => {
    if (autoFetch) {
      fetchMovies();
    }
  }, [autoFetch, fetchMovies]);

  return {
    movies,
    loading,
    loadingMore,
    error,
    hasMore,
    currentPage,
    fetchMovies,
    loadMore,
    searchMovies,
    getMovieById,
    refetch,
    reset,
  };
};

export default useMoviesLazyLoading;
