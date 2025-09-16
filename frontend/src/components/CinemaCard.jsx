import {
  HiOutlineMapPin,
  HiOutlineFilm,
  HiOutlineArrowRight,
} from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const CinemaCard = ({ cinema, loading = false }) => {
  const navigate = useNavigate();

  const handleSeeShowtimes = () => {
    navigate(`/cinemas/${cinema.id}/showtimes`);
  };

  // CINEMA CARD SKELETON
  if (loading) {
    return (
      <div className="bg-background rounded-xl shadow-form border border-inputbrdr overflow-hidden animate-pulse">
        <div className="p-4 sm:p-6 space-y-4">
          {/* CINEMA NAME SKELETON */}
          <div className="h-6 bg-neutral/25 rounded w-3/4"></div>

          {/* LOCATION SKELETON */}
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-neutral/15 rounded"></div>
            <div className="h-4 bg-neutral/15 rounded w-1/2"></div>
          </div>

          {/* BUTTON SKELETON */}
          <div className="pt-4 border-t border-inputbrdr">
            <div className="h-10 bg-neutral/20 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-xl shadow-form border border-white/10 dark:border-primary/20 overflow-hidden">
      <div className="p-4 sm:p-6 space-y-4">
        {/* CINEMA ICON & NAME */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-xl flex items-center justify-center">
            <HiOutlineFilm className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-2">
              {cinema.name}
            </h3>
          </div>
        </div>

        {/* LOCATION */}
        <div className="flex items-center space-x-2 text-neutral">
          <HiOutlineMapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm sm:text-base line-clamp-1">
            {cinema.location}
          </span>
        </div>

        {/* ACTION BUTTON */}
        <div className="pt-4 border-t border-white/10 dark:border-primary/20">
          <button
            className="cursor-pointer w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:space-x-3 group"
            onClick={handleSeeShowtimes}
          >
            <span>See What's Playing</span>
            <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinemaCard;
