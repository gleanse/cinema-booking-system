import MovieCard from './MovieCard';

const MovieGrid = ({
  movies = [],
  loading = false,
  error = null,
  onMovieClick,
  onBuyTicket,
  className = '',
  emptyMessage = 'No movies found',
  showBuyButton = true,
}) => {
  if (loading) {
    return (
      <div
        className={`grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 xl:grid-cols-6 ${className}`}
      >
        {[...Array(12)].map((_, index) => (
          <MovieCard key={index} loading={true} showBuyButton={showBuyButton} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
          <p className="text-accent font-medium">Error loading movies</p>
          <p className="text-neutral text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral">
          <p className="text-base sm:text-lg">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 xl:grid-cols-6 ${className}`}
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={onMovieClick}
          onBuyTicket={onBuyTicket}
          showBuyButton={showBuyButton}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
