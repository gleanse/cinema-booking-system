import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiExclamationTriangle } from 'react-icons/hi2';
import MovieDetails from '../components/MovieDetails';
import useMovieDetails from '../hooks/useMovieDetails';
import useMovieShowtimes from '../hooks/useMovieShowtimes';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, loading, error, refetch } = useMovieDetails(id);
  const {
    showtimes,
    loading: showtimesLoading,
    error: showtimesError,
  } = useMovieShowtimes(id);

  const handleBuyTicket = (movie, showtime = null) => {
    console.log('Buy ticket for:', movie);
    if (showtime) {
      console.log('Selected showtime:', showtime);
    }
    // TODO: implement ticket purchasing logic
    // this could open a modal, navigate to checkout, etc.
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
            <div className="h-10 w-24 bg-neutral/20 rounded-lg animate-pulse" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] bg-neutral/20 rounded-xl animate-pulse" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                <div className="h-10 bg-neutral/20 rounded animate-pulse" />
                <div className="h-6 w-32 bg-neutral/20 rounded animate-pulse" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-neutral/20 rounded animate-pulse"
                  />
                ))}
              </div>

              <div className="space-y-3">
                <div className="h-6 w-24 bg-neutral/20 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-neutral/20 rounded animate-pulse" />
                  <div className="h-4 bg-neutral/20 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-neutral/20 rounded animate-pulse" />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-32 bg-neutral/20 rounded-lg animate-pulse" />
                <div className="h-12 w-36 bg-neutral/20 rounded-lg animate-pulse" />
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
          <span>Back to Movies</span>
        </button>

        {movie && (
          <MovieDetails
            movie={movie}
            showtimes={showtimes}
            showtimesLoading={showtimesLoading}
            onBuyTicket={handleBuyTicket}
          />
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
