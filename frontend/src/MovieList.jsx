import React, { useEffect, useState } from 'react';
import { MdMovie, MdPlayArrow, MdArrowBack, MdCalendarToday, MdEventSeat, MdAccessTime } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

// Movie List Component (Enhanced Design)
const MovieList = ({ onMovieSelect }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/movies/?detail=full')
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  }, []);

  const handleImageError = (movieId) => {
    setImageErrors(prev => ({ ...prev, [movieId]: true }));
  };

  const handleImageLoad = (movieId) => {
    setImageErrors(prev => ({ ...prev, [movieId]: false }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="px-6 py-12 lg:px-12 xl:px-16 2xl:px-24 max-w-[1800px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          Now Showing
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 lg:gap-10 xl:gap-12">
        {movies.map((movie, index) => (
          <div 
            key={movie.id}
            className="group cursor-pointer transform transition-all duration-500 hover:scale-[1.05] hover:-translate-y-2"
            onClick={() => onMovieSelect(movie.id)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-700/50 hover:border-blue-500/50">
              <div className="relative overflow-hidden aspect-[3/4]">
                {movie.poster ? (
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <MdMovie className="text-gray-400 text-8xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* RATING BADGE */}
                <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {movie.age_rating}
                </div>

                {/* PLAY BUTTON */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-blue-500/80 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <MdPlayArrow className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="p-6 xl:p-8">
                <h3 className="font-bold text-xl xl:text-2xl text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
                  {movie.title}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 rounded-full text-sm font-medium text-blue-400">
                    {movie.genre_detail?.name || 'Drama'}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <MdAccessTime className="w-4 h-4" />
                    <span>{movie.duration} min</span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <MdCalendarToday className="w-3 h-3" />
                      <span>{movie.release_date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Movie Detail Component (Enhanced Design)
const MovieDetail = ({ movieId, onBack }) => {
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:8000/api/v1/movies/${movieId}/?detail=full`).then(r => r.json()),
      fetch('http://localhost:8000/api/v1/showtimes/?detail=full').then(r => r.json())
    ]).then(([movieData, showtimeData]) => {
      setMovie(movieData);
      const movieShowtimes = showtimeData.filter(showtime => showtime.movie.id === parseInt(movieId));
      setShowtimes(movieShowtimes);
      setLoading(false);
      setImageError(false); // Reset image error when new movie loads
    }).catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, [movieId]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <AiOutlineLoading3Quarters className="animate-spin h-16 w-16 text-blue-500" />
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-24 px-6 py-16 lg:px-12 xl:px-16 2xl:px-24 max-w-[1800px] mx-auto">
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 xl:gap-20 mb-24">
          <div className="lg:col-span-2">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl animate-fade-in sticky top-32 border-2 border-gray-700">
              {movie.poster && !imageError ? (
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <MdMovie className="text-gray-400 text-8xl" />
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-8">
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
                {movie.title}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mb-8 rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
                <div className="text-sm text-blue-400 mb-2 font-medium">Genre</div>
                <div className="font-bold text-lg text-white">{movie.genre_detail?.name || 'Drama'}</div>
              </div>
              <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
                <div className="text-sm text-blue-400 mb-2 font-medium">Duration</div>
                <div className="font-bold text-lg text-white">{movie.duration} min</div>
              </div>
              <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
                <div className="text-sm text-blue-400 mb-2 font-medium">Rating</div>
                <div className="font-bold text-lg text-white">{movie.age_rating}</div>
              </div>
              <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
                <div className="text-sm text-blue-400 mb-2 font-medium">Language</div>
                <div className="font-bold text-lg text-white">{movie.language}</div>
              </div>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
              <h3 className="text-2xl xl:text-3xl font-bold mb-6 text-white">Synopsis</h3>
              <p className="text-gray-300 leading-relaxed text-lg xl:text-xl">{movie.description}</p>
            </div>

            {movie.trailer_url && (
              <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
                <a 
                  href={movie.trailer_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-2xl hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 text-lg font-bold shadow-xl"
                >
                  <MdPlayArrow className="w-6 h-6" />
                  <span>Watch Trailer</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* SHOWTIME */}
        <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 drop-shadow-lg">
              Showtimes
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
          </div>

          {showtimes.length === 0 ? (
            <div className="text-center py-20">
              <MdCalendarToday className="text-gray-400 text-6xl mx-auto mb-6" />
              <p className="text-gray-400 text-lg">No showtimes available for this movie</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
              {showtimes.map((showtime, index) => (
                <div 
                  key={showtime.id} 
                  className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:shadow-xl hover:border-blue-500/50 transform hover:-translate-y-2 hover:scale-105 transition-all duration-400 group"
                  style={{ animationDelay: `${700 + index * 100}ms` }}
                >
                  <div className="text-center space-y-4">
                    <div className="text-lg font-medium text-blue-400">
                      {new Date(showtime.show_date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {showtime.show_time}
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-400">{showtime.theater_name}</div>
                      <div className="text-lg font-bold text-white">₱{showtime.ticket_price}</div>
                      <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
                        <MdEventSeat className="w-3 h-3" />
                        <span>{showtime.available_seats} available</span>
                      </div>
                    </div>
                    <button 
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 transform group-hover:scale-105 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:transform-none font-bold"
                      disabled={showtime.available_seats === 0}
                    >
                      {showtime.available_seats === 0 ? 'Sold Out' : 'Book Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleMovieSelect = (movieId) => {
    setSelectedMovieId(movieId);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedMovieId(null);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* NAVIGATION */}
      <nav className="bg-black/90 backdrop-blur-lg border-b border-blue-500/20 fixed top-0 left-0 right-0 z-50 shadow-2xl">
        <div className="px-6 py-4 lg:px-12 xl:px-16 2xl:px-24">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-lg">
                <MdMovie className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl xl:text-3xl font-bold text-white">
                Cinema
              </h1>
            </div>
            
            {currentView === 'detail' && (
              <button 
                onClick={handleBack}
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300 group bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/50 hover:border-blue-500/50"
              >
                <MdArrowBack className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Back to Movies</span>
              </button>
            )}
            
            <div className="hidden md:flex text-sm text-blue-400 font-bold tracking-wider items-center space-x-2">
              <span>Book</span>
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <span>Watch</span>
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <span>Enjoy</span>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="pt-20">
        {currentView === 'list' ? (
          <MovieList onMovieSelect={handleMovieSelect} />
        ) : (
          <MovieDetail movieId={selectedMovieId} onBack={handleBack} />
        )}
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slide-up {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }
  
  .animate-slide-up {
    animation: slide-up 0.8s ease-out both;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
document.head.appendChild(style);

export default App;