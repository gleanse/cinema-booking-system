import { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import useMovies from '../hooks/useMovies';

const HomePage = () => {
  const navigate = useNavigate();
  const { movies, loading, error, refetch, searchMovies } = useMovies();
  const [currentSearch, setCurrentSearch] = useState('');

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
      (movie) => movie.showtimes && movie.showtimes.length > 0
    );
  }, [movies]);

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
