import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import useMoviesLazyLoading from '../hooks/useMoviesLazyLoading';
import { usePolling } from '../hooks/usePolling';
import { HiOutlineFilm, HiOutlineClock } from 'react-icons/hi2';
import { FaFilm, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const MoviesPage = () => {
  const navigate = useNavigate();
  // changed hook and added new properties
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
  const [activeTab, setActiveTab] = useState('showing'); // 'showing' or 'coming'
  const isInitialMount = useRef(true);

  usePolling(() => {
    if (!currentSearch) {
      refetch();
    }
  }, 10000);

  // infinite scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // check if user scrolled near bottom
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // trigger when 200px from bottom
      if (scrollTop + windowHeight >= documentHeight - 200) {
        if (!loadingMore && hasMore && !currentSearch) {
          loadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, loadingMore, hasMore, currentSearch]);

  const handleMovieClick = (movie) => {
    console.log('Selected movie:', movie);
    navigate(`/movies/${movie.id}`);
  };

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

  const hasActiveShowtimes = (movie) => {
    if (!movie.is_active) return false;

    if (
      movie.showtimes &&
      Array.isArray(movie.showtimes) &&
      movie.showtimes.length > 0
    ) {
      return true;
    }

    return false;
  };

  const isComingSoon = (movie) => {
    if (!movie.is_active) return false;

    if (!movie.showtimes || movie.showtimes.length === 0) {
      return true;
    }

    return false;
  };

  const { nowShowing, comingSoon } = useMemo(() => {
    if (!movies.length) return { nowShowing: [], comingSoon: [] };

    if (currentSearch) {
      const activeMovies = movies.filter((movie) => movie.is_active);
      return { nowShowing: activeMovies, comingSoon: [] };
    }

    const showing = movies.filter((movie) => {
      if (!movie.is_active) return false;
      return hasActiveShowtimes(movie);
    });

    const coming = movies.filter((movie) => {
      return isComingSoon(movie);
    });

    return { nowShowing: showing, comingSoon: coming };
  }, [movies, currentSearch]);

  const getCurrentMovies = () => {
    if (currentSearch) return nowShowing;
    return activeTab === 'showing' ? nowShowing : comingSoon;
  };

  const getMovieCount = (type) => {
    if (type === 'showing') return nowShowing.length;
    return comingSoon.length;
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
          Movies
        </h1>
        <p className="text-sm sm:text-base text-neutral">
          Browse all movies - now showing and coming soon
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
            " ({nowShowing.length} found)
          </p>
        </div>
      )}

      {!currentSearch && (
        <div className="mb-6">
          <div className="flex space-x-1 bg-neutral/10 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('showing')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                activeTab === 'showing'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-neutral hover:text-foreground'
              }`}
            >
              <HiOutlineFilm className="h-4 w-4" />
              <span>Now Showing</span>
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {getMovieCount('showing')}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('coming')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                activeTab === 'coming'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-neutral hover:text-foreground'
              }`}
            >
              <HiOutlineClock className="h-4 w-4" />
              <span>Coming Soon</span>
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {getMovieCount('coming')}
              </span>
            </button>
          </div>
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

      {(loading || getCurrentMovies().length > 0) && (
        <MovieGrid
          movies={getCurrentMovies()}
          loading={loading}
          error={null}
          onMovieClick={handleMovieClick}
          emptyMessage="" // empty message handled by page now
          showBuyButton={false}
        />
      )}

      {/* EMPTY state */}
      {!loading && getCurrentMovies().length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            {currentSearch ? (
              <>
                <FaSearch className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No movies found
                </h3>
                <p className="text-neutral mb-2">
                  No movies found for "{currentSearch}"
                </p>
                <p className="text-neutral text-sm">
                  Try a different search term
                </p>
              </>
            ) : activeTab === 'showing' ? (
              <>
                <FaFilm className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No movies currently showing
                </h3>
                <p className="text-neutral">
                  No movies with showtimes available at the moment
                </p>
                <p className="text-neutral text-sm mt-2">
                  Check back later for new movie showtimes
                </p>
              </>
            ) : (
              <>
                <HiOutlineClock className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No upcoming movies
                </h3>
                <p className="text-neutral">No upcoming movies scheduled yet</p>
                <p className="text-neutral text-sm mt-2">
                  Check back later for new movie announcements
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* loading more indicator */}
      {loadingMore && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-lg">
            <FaSpinner className="h-4 w-4 text-primary animate-spin mr-2" />
            <span className="text-primary font-medium">
              Loading more movies...
            </span>
          </div>
        </div>
      )}

      {/* end of results indicator */}
      {!loading &&
        !loadingMore &&
        !error &&
        getCurrentMovies().length > 0 &&
        !hasMore &&
        !currentSearch && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-neutral/10 rounded-lg">
              <span className="text-neutral">
                You've reached the end of the movie list
              </span>
            </div>
          </div>
        )}

      {!loading && !error && getCurrentMovies().length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-neutral text-sm">
            {currentSearch
              ? `Found ${nowShowing.length} movie${
                  nowShowing.length === 1 ? '' : 's'
                } for "${currentSearch}"`
              : `Showing ${getCurrentMovies().length} ${
                  activeTab === 'showing' ? 'current' : 'upcoming'
                } movie${getCurrentMovies().length === 1 ? '' : 's'}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
