import { useCallback, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import useMoviesLazyLoading from '../hooks/useMoviesLazyLoading';
import { usePolling } from '../hooks/usePolling';

const HomePage = () => {
  const navigate = useNavigate();
  const {
    movies,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error,
    refetch,
    searchMovies,
  } = useMoviesLazyLoading();

  const [currentSearch, setCurrentSearch] = useState('');

  usePolling(() => {
    if (!currentSearch) {
      refetch();
    }
  }, 10000);

  const handleMovieClick = (movie) => {
    console.log('Selected movie:', movie);
    navigate(`/movies/${movie.id}`);
  };

  const handleSearch = useCallback(
    (searchTerm) => {
      setCurrentSearch(searchTerm.trim());
      if (searchTerm.trim()) {
        searchMovies(searchTerm);
      } else {
        refetch();
      }
    },
    [searchMovies, refetch]
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const moviesWithShowtimes = useMemo(() => {
    if (!movies.length) return [];

    return movies.filter(
      (movie) =>
        movie.showtimes && movie.is_active && movie.showtimes.length > 0
    );
  }, [movies]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 200) {
        if (!loadingMore && hasMore && !currentSearch) {
          loadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, loadingMore, hasMore, currentSearch]);

  const getEmptyMessage = () => {
    if (currentSearch) {
      return `No movies with showtimes found for "${currentSearch}"`;
    }
    return 'No movies with showtimes available at the moment';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
          Featured Movies
        </h1>
        <p className="text-sm sm:text-base text-neutral">
          Discover the latest movies playing in cinemas
        </p>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} isSearching={loading} />
      </div>

      {currentSearch && (
        <div className="mb-4">
          <p className="text-neutral text-sm">
            Search results for "
            <span className="text-foreground font-medium">{currentSearch}</span>
            " ({moviesWithShowtimes.length} found with showtimes){' '}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-accent font-medium">Failed to load movies</p>
              <p className="text-neutral text-sm">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <MovieGrid
        movies={moviesWithShowtimes}
        loading={loading}
        error={null}
        onMovieClick={handleMovieClick}
        emptyMessage={getEmptyMessage()}
      />

      {/* loading more indicator */}
      {loadingMore && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            <span className="text-primary font-medium">
              Loading more movies...
            </span>
          </div>
        </div>
      )}

      {/* end of results */}
      {!loading &&
        !loadingMore &&
        !hasMore &&
        !currentSearch &&
        moviesWithShowtimes.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-neutral/10 rounded-lg">
              <span className="text-neutral">
                You've reached the end of the movie list
              </span>
            </div>
          </div>
        )}

      {/* MOVIES count */}
      {!loading && !error && moviesWithShowtimes.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-neutral text-sm">
            {currentSearch
              ? `Found ${moviesWithShowtimes.length} movie${
                  moviesWithShowtimes.length === 1 ? '' : 's'
                } with showtimes for "${currentSearch}"`
              : `Showing ${moviesWithShowtimes.length} movie${
                  moviesWithShowtimes.length === 1 ? '' : 's'
                } with available showtimes`}
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
