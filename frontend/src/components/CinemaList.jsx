import { HiOutlineFilm } from 'react-icons/hi2';
import CinemaCard from './CinemaCard';

const CinemaList = ({
  cinemas = [],
  loading = false,
  error = null,
  onClearError = () => {},
}) => {
  const renderSkeletons = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <CinemaCard key={`skeleton-${index}`} loading={true} />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* PAGE HEADER */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
          Cinema Locations
        </h1>
        <p className="text-sm sm:text-base text-neutral">
          Find your nearest cinema and discover what's playing today
        </p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <HiOutlineFilm className="h-5 w-5 text-accent mr-3" />
              <div>
                <p className="text-accent font-medium">
                  Failed to load cinemas
                </p>
                <p className="text-neutral text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={onClearError}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors ml-4"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* CINEMA GRID */}
      {(loading || cinemas.length > 0) && (
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? renderSkeletons()
            : cinemas.map((cinema) => (
                <CinemaCard key={cinema.id} cinema={cinema} />
              ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && cinemas.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <HiOutlineFilm className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No cinemas available
            </h3>
            <p className="text-neutral">
              No cinema locations available at the moment
            </p>
            <p className="text-neutral text-sm mt-2">
              Check back later for new cinema locations
            </p>
          </div>
        </div>
      )}

      {/* CINEMA COUNT */}
      {!loading && !error && cinemas.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-neutral text-sm">
            Showing {cinemas.length} cinema location
            {cinemas.length === 1 ? '' : 's'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CinemaList;
