import {
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineFilm,
  HiOutlineTicket,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
} from 'react-icons/hi2';

const CinemaShowtimes = ({ cinema, showtimes, onBookTicket }) => {
  const formatShowDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
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

  const groupShowtimesByMovie = (showtimes) => {
    if (!showtimes || showtimes.length === 0) return {};

    return showtimes.reduce((groups, showtime) => {
      const movieId = showtime.movie.id;
      if (!groups[movieId]) {
        groups[movieId] = {
          movie: showtime.movie,
          showtimes: [],
        };
      }
      groups[movieId].showtimes.push(showtime);
      return groups;
    }, {});
  };

  const handleBookTicket = (showtime) => {
    if (onBookTicket) {
      onBookTicket(showtime);
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

  const groupedShowtimes = groupShowtimesByMovie(showtimes);

  return (
    <div className="space-y-8">
      {/* CINEMA HEADER */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
            <HiOutlineBuildingOffice2 className="h-8 w-8 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {cinema.name}
            </h1>

            <div className="flex items-center space-x-2 text-neutral">
              <HiOutlineMapPin className="h-5 w-5 flex-shrink-0" />
              <span className="text-base">{cinema.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SHOWTIMES SECTION */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
          <HiOutlineTicket className="h-6 w-6 text-primary" />
          <span>Now Showing</span>
        </h2>

        {showtimes.length === 0 ? (
          <div className="text-center py-12 bg-neutral/5 rounded-xl border border-neutral/20">
            <HiOutlineFilm className="h-16 w-16 text-neutral/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral mb-2">
              No movies currently showing
            </h3>
            <p className="text-neutral/70">
              Check back later for upcoming showtimes at this cinema.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.values(groupedShowtimes).map(
              ({ movie, showtimes: movieShowtimes }) => (
                <div
                  key={movie.id}
                  className="bg-background rounded-xl border border-white/10 dark:border-primary/20 p-6"
                >
                  {/* MOVIE HEADER */}
                  <div className="flex items-start space-x-4 mb-6">
                    {movie.poster ? (
                      <img
                        src={getImageUrl(movie.poster)}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-24 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                        <HiOutlineFilm className="h-8 w-8 text-primary/60" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {movie.title}
                      </h3>

                      {movie.genre_detail && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
                            {movie.genre_detail.name}
                          </span>
                          {movie.age_rating && (
                            <span className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-medium">
                              {movie.age_rating}
                            </span>
                          )}
                        </div>
                      )}

                      {movie.release_date && (
                        <p className="text-sm text-neutral">
                          Released:{' '}
                          {new Date(movie.release_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SHOWTIMES grid */}
                  <div className="space-y-4">
                    {movieShowtimes.map((showtime) => (
                      <div
                        key={showtime.id}
                        className="flex items-center justify-between p-4 bg-neutral/5 rounded-lg border border-neutral/20"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-foreground">
                              <HiOutlineCalendarDays className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {formatShowDate(showtime.show_date)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 text-foreground">
                              <HiOutlineClock className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {formatShowTime(showtime.show_time)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-neutral">
                            <span>Room: {showtime.room.name}</span>
                            <span>•</span>
                            <span>₱{showtime.ticket_price}</span>
                            <span>•</span>
                            <span>{showtime.room.capacity} seats</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onBookTicket(showtime)}
                          className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 cursor-pointer whitespace-nowrap"
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CinemaShowtimes;
