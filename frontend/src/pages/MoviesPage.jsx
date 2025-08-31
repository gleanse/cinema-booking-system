import { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import useMovies from '../hooks/useMovies';
import { HiOutlineFilm, HiOutlineClock } from 'react-icons/hi2';

const MoviesPage = () => {
  const navigate = useNavigate();
  const { movies, loading, error, refetch, searchMovies } = useMovies();
  const [currentSearch, setCurrentSearch] = useState('');
  const [activeTab, setActiveTab] = useState('showing'); // 'showing' or 'coming'

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

  const getEmptyMessage = () => {
    if (currentSearch) {
      return `No movies found for "${currentSearch}"`;
    }
    if (activeTab === 'showing') {
      return 'No movies currently showing with available showtimes';
    }
    return 'No upcoming movies scheduled yet';
  };

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
        movies={getCurrentMovies()}
        loading={loading}
        error={null}
        onMovieClick={handleMovieClick}
        emptyMessage={getEmptyMessage()}
        showBuyButton={false}
      />

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
