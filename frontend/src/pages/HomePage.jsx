import { useCallback, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilm, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import useMovies from '../hooks/useMovies';
import { usePolling } from '../hooks/usePolling';
import useCinemasCRUD from '../hooks/useCinemasCRUD';

const HomePage = () => {
  const navigate = useNavigate();
  const { movies, loading, error, refetch, searchMovies } = useMovies();

  const { cinemas, loading: cinemasLoading } = useCinemasCRUD();

  const [currentSearch, setCurrentSearch] = useState('');
  const isInitialMount = useRef(true);

  usePolling(() => {
    if (!currentSearch) {
      refetch();
    }
  }, 10000);

  const handleMovieClick = (movie) => {
    console.log('Selected movie:', movie);
    navigate(`/movies/${movie.id}`);
  };

  const handleBuyTicket = useCallback(
    (movie) => {
      console.log('Buy ticket for:', movie.title);

      if (cinemasLoading) {
        console.log('Cinemas still loading...');
        return;
      }

      if (cinemas && cinemas.length > 0) {
        // navigate to showtimes of the first available cinema
        navigate(`/cinemas/${cinemas[0].id}/showtimes`);
      } else {
        // fallback to cinema list
        navigate('/cinemas');
      }
    },
    [cinemas, cinemasLoading, navigate]
  );

  const handleSearch = useCallback(
    (searchTerm) => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
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
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 text-accent mr-3" />
              <div>
                <p className="text-accent font-medium">Failed to load movies</p>
                <p className="text-neutral text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors ml-4"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {(loading || moviesWithShowtimes.length > 0) && (
        <MovieGrid
          movies={moviesWithShowtimes}
          loading={loading}
          error={null}
          onMovieClick={handleMovieClick}
          onBuyTicket={handleBuyTicket}
          emptyMessage=""
        />
      )}

      {/* EMPTY state*/}
      {!loading && moviesWithShowtimes.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            {currentSearch ? (
              <>
                <FaSearch className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No movies found
                </h3>
                <p className="text-neutral mb-2">
                  No movies with showtimes found for "{currentSearch}"
                </p>
                <p className="text-neutral text-sm">
                  Try a different search term or check back later for new
                  showtimes
                </p>
              </>
            ) : (
              <>
                <FaFilm className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No movies available
                </h3>
                <p className="text-neutral">
                  No movies with showtimes available at the moment
                </p>
                <p className="text-neutral text-sm mt-2">
                  Check back later for new movie showtimes
                </p>
              </>
            )}
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
