import {
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineFilm,
} from 'react-icons/hi2';

const MovieCard = ({
  movie,
  onClick,
  className = '',
  showBuyButton = true,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    return `${duration} min`;
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).getFullYear();
    } catch {
      return 'N/A';
    }
  };

  const getImageUrl = (poster) => {
    if (!poster) return null;
    if (poster.startsWith('http')) return poster;
    return `${
      import.meta.env.VITE_API_URL?.replace('/api/v1/', '') ||
      'http://localhost:8000'
    }${poster}`;
  };

  return (
    <div
      className={`bg-background rounded-xl shadow-form border border-white/10 dark:border-primary/20 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group w-full max-w-sm mx-auto ${className}`}
      onClick={handleClick}
    >
      {/* POSTER */}
      <div className="relative aspect-[2/3] bg-neutral/20 overflow-hidden">
        {movie.poster ? (
          <img
            src={getImageUrl(movie.poster)}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* fallback for missing/broken images */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/40 flex items-center justify-center"
          style={{ display: movie.poster ? 'none' : 'flex' }}
        >
          <HiOutlineFilm className="h-16 w-16 text-primary/60" />
        </div>

        {/* AGE RATING */}
        {movie.age_rating && (
          <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
            {movie.age_rating}
          </div>
        )}
      </div>

      <div className="p-2 sm:p-4 space-y-1 sm:space-y-3">
        {/* TITLE */}
        <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {movie.title}
        </h3>

        {/* GENRE (optional) */}
        {movie.genre_detail && (
          <div className="flex items-center space-x-2">
            <span className="text-sm bg-secondary/20 text-secondary px-2 py-1 rounded-full">
              {movie.genre_detail.name}
            </span>
          </div>
        )}

        {/* MOVIE detail */}
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-neutral">
          {/* duration & release date (optional) */}
          <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            {movie.duration && (
              <div className="flex items-center space-x-1">
                <HiOutlineClock className="h-4 w-4" />
                <span>{formatDuration(movie.duration)}</span>
              </div>
            )}

            {movie.release_date && (
              <div className="flex items-center space-x-1">
                <HiOutlineCalendarDays className="h-4 w-4" />
                <span>{formatReleaseDate(movie.release_date)}</span>
              </div>
            )}
          </div>

          {/* language (optional) */}
          {movie.language && (
            <div className="text-xs text-neutral/80">
              Language: {movie.language}
            </div>
          )}
        </div>

        {/* description (optional) */}
        {movie.description && (
          <p className="text-xs sm:text-sm text-neutral line-clamp-2 mt-1 sm:mt-2">
            {movie.description}
          </p>
        )}

        {showBuyButton && (
          <div className="mt-4 pt-3 border-t border-white/10 dark:border-primary/20">
            <button
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg transition-colors duration-200 text-xs sm:text-sm cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Buy ticket for:', movie.title);
              }}
            >
              Buy Ticket
            </button>
          </div>
        )}
      </div>

      {/* HOVER fcx */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default MovieCard;
