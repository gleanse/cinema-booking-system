import {
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineFilm,
  HiOutlineGlobeAlt,
  HiOutlinePlay,
  HiOutlineTicket,
  HiOutlineBuildingOffice2,
} from 'react-icons/hi2';

const MovieDetails = ({ movie, showtimes, showtimesLoading, onBuyTicket }) => {
  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
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

  const formatShowDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatShowTime = (timeString) => {
    if (!timeString) return '';
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  const groupShowtimesByDate = (showtimes) => {
    if (!showtimes || showtimes.length === 0) return {};

    return showtimes.reduce((groups, showtime) => {
      const date = showtime.show_date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(showtime);
      return groups;
    }, {});
  };

  const handleBuyTicket = (showtime = null) => {
    if (onBuyTicket) {
      onBuyTicket(movie, showtime);
    }
  };

  const handleWatchTrailer = () => {
    if (movie.trailer_url) {
      window.open(movie.trailer_url, '_blank');
    }
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="relative aspect-[2/3] bg-neutral/20 rounded-xl overflow-hidden shadow-form">
                {movie.poster ? (
                  <img
                    src={getImageUrl(movie.poster)}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}

                {/* Fallback for missing/broken images */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/40 flex items-center justify-center"
                  style={{ display: movie.poster ? 'none' : 'flex' }}
                >
                  <HiOutlineFilm className="h-24 w-24 text-primary/60" />
                </div>

                {/* Age Rating Badge */}
                {movie.age_rating && (
                  <div className="absolute top-4 right-4 bg-accent text-white text-sm font-bold px-3 py-1 rounded-lg">
                    {movie.age_rating_detail || movie.age_rating}
                  </div>
                )}
              </div>
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Genre */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">
                  {movie.title}
                </h1>

                {movie.genre_detail && (
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-primary/30 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {movie.genre_detail.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Movie Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 text-neutral">
                {/* Duration */}
                {movie.duration && (
                  <div className="flex items-center space-x-3">
                    <HiOutlineClock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-neutral/90">Duration</p>
                      <p className="font-medium text-foreground">
                        {formatDuration(movie.duration)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Release Date */}
                {movie.release_date && (
                  <div className="flex items-center space-x-3">
                    <HiOutlineCalendarDays className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-neutral/90">Release Date</p>
                      <p className="font-medium text-foreground">
                        {formatReleaseDate(movie.release_date)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Language */}
                {movie.language && (
                  <div className="flex items-center space-x-3">
                    <HiOutlineGlobeAlt className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-neutral/90">Language</p>
                      <p className="font-medium text-foreground">
                        {movie.language}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {movie.description && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Synopsis
                  </h3>
                  <p className="text-neutral leading-relaxed">
                    {movie.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {movie.is_active && showtimes && showtimes.length > 0 && (
                  <button
                    onClick={() => handleBuyTicket()}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Buy Tickets
                  </button>
                )}

                {movie.is_active && (!showtimes || showtimes.length === 0) && (
                  <div className="bg-neutral/10 text-neutral font-semibold py-3 px-8 rounded-lg border border-neutral/20">
                    No showtimes available
                  </div>
                )}

                {!movie.is_active && (
                  <div className="bg-accent/10 text-accent font-semibold py-3 px-8 rounded-lg border border-accent/20">
                    Not currently showing
                  </div>
                )}

                {movie.trailer_url && (
                  <button
                    onClick={handleWatchTrailer}
                    className="bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-3 px-8 rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <HiOutlinePlay className="h-5 w-5" />
                    <span>Watch Trailer</span>
                  </button>
                )}
              </div>

              {/* Showtimes Section */}
              {movie.is_active && (
                <div className="pt-6 border-t border-neutral/20">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                    <HiOutlineTicket className="h-5 w-5 text-primary" />
                    <span>Available Showtimes</span>
                  </h3>

                  {showtimesLoading ? (
                    <div className="space-y-4">
                      <div className="h-6 w-32 bg-neutral/20 rounded animate-pulse" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="h-12 bg-neutral/20 rounded-lg animate-pulse"
                          />
                        ))}
                      </div>
                    </div>
                  ) : showtimes && showtimes.length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(groupShowtimesByDate(showtimes)).map(
                        ([date, dateShowtimes]) => (
                          <div key={date} className="space-y-3">
                            <h4 className="font-medium text-foreground">
                              {formatShowDate(date)}
                            </h4>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                              {dateShowtimes.map((showtime) => (
                                <button
                                  key={showtime.id}
                                  onClick={() => handleBuyTicket(showtime)}
                                  className="bg-background border border-neutral/20 hover:border-primary hover:bg-primary/5 rounded-lg p-3 transition-colors duration-200 cursor-pointer group"
                                >
                                  <div className="text-center">
                                    <div className="font-semibold text-foreground group-hover:text-primary">
                                      {formatShowTime(showtime.show_time)}
                                    </div>

                                    {showtime.room.name && (
                                      <div className="text-xs text-neutral mt-1 flex items-center justify-center space-x-1">
                                        <HiOutlineBuildingOffice2 className="h-3 w-3" />
                                        <span className="truncate">
                                          {showtime.room.name}
                                        </span>
                                      </div>
                                    )}

                                    {showtime.ticket_price && (
                                      <div className="text-xs font-medium text-primary mt-1">
                                        ₱{showtime.ticket_price}
                                      </div>
                                    )}

                                    {showtime.room?.capacity && (
                                      <div className="text-xs text-neutral mt-1">
                                        {showtime.room.capacity} seats
                                      </div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-neutral/5 rounded-lg border border-neutral/20">
                      <HiOutlineTicket className="h-12 w-12 text-neutral/50 mx-auto mb-3" />
                      <p className="text-neutral font-medium mb-2">
                        No showtimes available
                      </p>
                      <p className="text-neutral/70 text-sm">
                        Showtimes for this movie haven't been scheduled yet.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Genre Description */}
              {movie.genre_detail?.description && (
                <div className="bg-neutral/5 rounded-lg p-4 border border-neutral/20">
                  <h4 className="font-medium text-foreground mb-2">
                    About {movie.genre_detail.name}
                  </h4>
                  <p className="text-sm text-neutral">
                    {movie.genre_detail.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
