import {
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaFilm,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
} from 'react-icons/fa';

const MovieTable = ({
  movies = [],
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
  canModify = false,
  canDelete = false,
}) => {
  if (loading) {
    return (
      <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s overflow-hidden">
        <div className="bg-primary bg-opacity-5 px-4 sm:px-6 py-3 border-b border-inputbrdr">
          <h3 className="text-lg font-medium text-white">Movies</h3>
        </div>

        {/* MOBILE LOADING SKELETON */}
        <div className="block sm:hidden divide-y divide-inputbrdr">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="p-4">
              <div className="flex items-start space-x-3 mb-3">
                {/* Poster skeleton */}
                <div className="w-12 h-16 bg-neutral/20 rounded animate-pulse flex-shrink-0"></div>

                <div className="flex-1 space-y-2">
                  {/* Title */}
                  <div className="h-4 bg-neutral/25 rounded animate-pulse w-3/4"></div>
                  {/* Genre/Rating */}
                  <div className="h-3 bg-neutral/15 rounded animate-pulse w-1/2"></div>
                  {/* Duration/Date */}
                  <div className="h-3 bg-neutral/15 rounded animate-pulse w-2/3"></div>
                </div>

                {/* Status toggle skeleton */}
                <div className="h-6 w-12 bg-neutral/20 rounded-full animate-pulse flex-shrink-0"></div>
              </div>

              {/* Description skeleton */}
              <div className="space-y-1 mb-3">
                <div className="h-3 bg-neutral/15 rounded animate-pulse w-full"></div>
                <div className="h-3 bg-neutral/15 rounded animate-pulse w-4/5"></div>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex items-center justify-end space-x-2">
                <div className="h-6 w-6 bg-neutral/20 rounded animate-pulse"></div>
                <div className="h-6 w-6 bg-neutral/20 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP LOADING SKELETON */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary bg-opacity-5">
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-16"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-20"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-24"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-12"></div>
                </th>
                <th className="px-6 py-3 text-right">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-16 ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inputbrdr">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {/* Movie column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-16 w-12 bg-neutral/20 rounded mr-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-neutral/25 rounded w-32"></div>
                        <div className="h-3 bg-neutral/15 rounded w-48"></div>
                      </div>
                    </div>
                  </td>
                  {/* Genre/Rating column */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral/20 rounded w-20"></div>
                      <div className="h-3 bg-neutral/15 rounded w-16"></div>
                    </div>
                  </td>
                  {/* Duration/Release column */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral/20 rounded w-16"></div>
                      <div className="h-3 bg-neutral/15 rounded w-20"></div>
                    </div>
                  </td>
                  {/* Status column */}
                  <td className="px-6 py-4">
                    <div className="h-6 bg-neutral/20 rounded-full w-16"></div>
                  </td>
                  {/* Actions column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="h-6 w-6 bg-neutral/20 rounded"></div>
                      <div className="h-6 w-6 bg-neutral/20 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center py-4 border-t border-inputbrdr">
          <FaSpinner className="h-4 w-4 text-primary animate-spin mr-2" />
          <span className="text-sm text-neutral">Loading movies...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s overflow-hidden">
      <div className="bg-primary bg-opacity-5 px-4 sm:px-6 py-3 border-b border-inputbrdr">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Movies</h3>
          <span className="text-sm text-white">
            {movies.length} total movie{movies.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* MOBILE */}
      <div className="block sm:hidden divide-y divide-inputbrdr">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="p-4 hover:bg-footerbg hover:bg-opacity-3 transition-colors"
          >
            <div className="flex items-start space-x-3 mb-3">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-16 w-12 rounded object-cover flex-shrink-0 shadow-sm"
                />
              ) : (
                <div className="h-16 w-12 bg-neutral/20 rounded flex items-center justify-center flex-shrink-0 border border-neutral/10">
                  <FaFilm className="h-6 w-6 text-neutral" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {movie.title}
                </h4>
                <div className="flex items-center text-xs text-neutral mt-1">
                  <span>{movie.genre_detail?.name || 'No genre'}</span>
                  <span className="mx-2">•</span>
                  <span>Rated {movie.age_rating}</span>
                </div>
                <div className="flex items-center text-xs text-neutral mt-1">
                  <FaClock className="h-3 w-3 mr-1" />
                  <span>{movie.duration} min</span>
                  <span className="mx-2">•</span>
                  <FaCalendarAlt className="h-3 w-3 mr-1" />
                  <span>{movie.release_date}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => canModify && onToggleStatus(movie)}
                  disabled={!canModify}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    movie.is_active
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  } ${
                    !canModify
                      ? 'cursor-not-allowed opacity-60'
                      : 'cursor-pointer hover:scale-105'
                  }`}
                >
                  {movie.is_active ? (
                    <FaToggleOn className="h-3 w-3" />
                  ) : (
                    <FaToggleOff className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-neutral line-clamp-2 leading-relaxed mb-3">
              {movie.description}
            </p>

            {(canModify || canDelete) && (
              <div className="flex items-center justify-end space-x-2">
                {canModify && (
                  <button
                    onClick={() => onEdit(movie)}
                    className="p-2 text-neutral hover:text-editicon active:scale-95 transition-all duration-200 rounded-md hover:bg-neutral/5"
                    title="Edit movie"
                  >
                    <FaEdit className="h-4 w-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDelete(movie)}
                    className="p-2 text-neutral hover:text-accent active:scale-95 transition-all duration-200 rounded-md hover:bg-accent/5"
                    title="Delete movie"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary bg-opacity-5">
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Movie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Genre / Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Duration / Release
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              {(canModify || canDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-inputbrdr">
            {movies.map((movie) => (
              <tr
                key={movie.id}
                className="hover:bg-footerbg hover:bg-opacity-5 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="h-16 w-12 rounded object-cover mr-4 shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-12 bg-neutral/20 rounded flex items-center justify-center mr-4 border border-neutral/10">
                        <FaFilm className="h-6 w-6 text-neutral" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {movie.title}
                      </div>
                      <div className="text-sm text-neutral truncate max-w-xs">
                        {movie.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">
                    {movie.genre_detail?.name || 'No genre'}
                  </div>
                  <div className="text-sm text-neutral">
                    Rated {movie.age_rating}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-foreground">
                    <FaClock className="h-3 w-3 mr-1" />
                    {movie.duration} min
                  </div>
                  <div className="flex items-center text-sm text-neutral">
                    <FaCalendarAlt className="h-3 w-3 mr-1" />
                    {movie.release_date}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => canModify && onToggleStatus(movie)}
                    disabled={!canModify}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      movie.is_active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } ${
                      !canModify
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:scale-105 active:scale-95'
                    }`}
                  >
                    {movie.is_active ? (
                      <>
                        <FaToggleOn className="mr-1 h-3 w-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <FaToggleOff className="mr-1 h-3 w-3" />
                        Inactive
                      </>
                    )}
                  </button>
                </td>
                {(canModify || canDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {canModify && (
                        <button
                          onClick={() => onEdit(movie)}
                          className="text-neutral hover:text-editicon transition-all duration-200 p-2 rounded-md cursor-pointer hover:bg-neutral/5 active:scale-95"
                          title="Edit movie"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDelete(movie)}
                          className="text-neutral hover:text-accent transition-all duration-200 p-2 rounded-md cursor-pointer hover:bg-accent/5 active:scale-95"
                          title="Delete movie"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovieTable;
