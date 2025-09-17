import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiExclamationTriangle } from 'react-icons/hi2';
import CinemaShowtimes from '../components/CinemaShowtimes';
import useCinemaShowtimes from '../hooks/useCinemaShowtimes';

const CinemaShowtimesPage = () => {
  const { cinemaId } = useParams();
  const navigate = useNavigate();
  const { cinema, showtimes, loading, error, refetch } =
    useCinemaShowtimes(cinemaId);

  const handleBookTicket = (showtime) => {
    navigate(`/booking/${showtime.id}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="h-6 w-24 bg-neutral/20 rounded animate-pulse"></div>
          </div>

          {/* SKELETON */}
          <div className="space-y-6">
            {/* CINEMA HEADER SKELETON */}
            <div className="space-y-4">
              <div className="h-8 w-64 bg-neutral/25 rounded animate-pulse"></div>
              <div className="h-5 w-48 bg-neutral/20 rounded animate-pulse"></div>
            </div>

            {/* SHOWTIMES GRID SKELETON */}
            <div className="space-y-4">
              <div className="h-6 w-32 bg-neutral/20 rounded animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-neutral/10 rounded-xl p-4 space-y-4 animate-pulse"
                  >
                    <div className="h-5 w-40 bg-neutral/20 rounded"></div>
                    <div className="h-4 w-24 bg-neutral/15 rounded"></div>
                    <div className="h-10 w-full bg-neutral/20 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-neutral hover:text-foreground transition-colors duration-200 mb-6"
          >
            <HiArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center justify-center min-h-96">
            <div className="text-center max-w-md mx-auto">
              <div className="bg-accent/10 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <HiExclamationTriangle className="h-10 w-10 text-accent" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Oops! Something went wrong
              </h2>

              <p className="text-neutral mb-6">{error}</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRetry}
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>

                <button
                  onClick={handleGoBack}
                  className="bg-neutral/10 hover:bg-neutral/20 text-neutral font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-neutral hover:text-foreground transition-colors duration-200 mb-6 cursor-pointer"
        >
          <HiArrowLeft className="h-5 w-5" />
          <span>Back to Cinemas</span>
        </button>

        {cinema && (
          <CinemaShowtimes
            cinema={cinema}
            showtimes={showtimes}
            onBookTicket={handleBookTicket}
          />
        )}
      </div>
    </div>
  );
};

export default CinemaShowtimesPage;
