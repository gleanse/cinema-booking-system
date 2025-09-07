import { FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';

const GenreTable = ({
  genres = [],
  loading = false,
  onEdit,
  onDelete,
  showMovieCount = true,
  user = null,
}) => {
  const canDelete = user?.is_superuser;

  if (loading) {
    return (
      <div className="bg-background border border-inputbrdr rounded-lg shadow-form overflow-hidden">
        <div className="bg-primary bg-opacity-5 px-4 sm:px-6 py-3 border-b border-inputbrdr">
          <h3 className="text-lg font-medium text-white">Genres</h3>
        </div>

        {/* MOBILE LOADING SKELETON */}
        <div className="block sm:hidden divide-y divide-inputbrdr">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral/25 rounded animate-pulse w-3/4"></div>
                  {/* Movie count skeleton */}
                  <div className="h-3 bg-neutral/15 rounded animate-pulse w-1/2"></div>
                </div>

                {/* Action buttons skeleton */}
                <div className="flex items-center space-x-2 ml-2">
                  <div className="h-6 w-6 bg-neutral/20 rounded animate-pulse"></div>
                  <div className="h-6 w-6 bg-neutral/20 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Description skeleton */}
              <div className="space-y-1">
                <div className="h-3 bg-neutral/15 rounded animate-pulse w-full"></div>
                <div className="h-3 bg-neutral/15 rounded animate-pulse w-4/5"></div>
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
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-24"></div>
                </th>
                {showMovieCount && (
                  <th className="px-6 py-3 text-left">
                    <div className="h-3 bg-neutral/20 rounded animate-pulse w-12"></div>
                  </th>
                )}
                <th className="px-6 py-3 text-right">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-16 ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inputbrdr">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {/* Name column */}
                  <td className="px-6 py-4">
                    <div className="h-4 bg-neutral/25 rounded w-32"></div>
                  </td>
                  {/* Description column */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-3 bg-neutral/15 rounded w-48"></div>
                      <div className="h-3 bg-neutral/15 rounded w-40"></div>
                    </div>
                  </td>
                  {/* Movie count column */}
                  {showMovieCount && (
                    <td className="px-6 py-4">
                      <div className="h-6 bg-neutral/20 rounded-full w-16"></div>
                    </td>
                  )}
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

        {/* Loading indicator */}
        <div className="flex items-center justify-center py-4 border-t border-inputbrdr">
          <FaSpinner className="h-4 w-4 text-primary animate-spin mr-2" />
          <span className="text-sm text-neutral">Loading genres...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-inputbrdr rounded-lg shadow-form overflow-hidden">
      <div className="bg-primary bg-opacity-5 px-4 sm:px-6 py-3 border-b border-inputbrdr">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Genres</h3>
          <span className="text-sm text-white">
            {genres.length} total genre{genres.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* MOBILE */}
      <div className="block sm:hidden divide-y divide-inputbrdr">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="p-4 hover:bg-footerbg hover:bg-opacity-3 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {genre.name}
                </h4>
                {showMovieCount && genre.movie_count !== undefined && (
                  <p className="text-xs text-white mt-1">
                    {genre.movie_count} movies
                  </p>
                )}
              </div>
              {(onEdit || (onDelete && canDelete)) && (
                <div className="flex items-center space-x-2 ml-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(genre)}
                      className="p-1 text-neutral hover:text-editicon active:scale-95 transition-all duration-200 rounded-md hover:bg-neutral/5"
                      title="Edit genre"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && canDelete && (
                    <button
                      onClick={() => onDelete(genre)}
                      className="p-1 text-neutral hover:text-accent active:scale-95 transition-all duration-200 rounded-md hover:bg-accent/5"
                      title="Delete genre"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-neutral line-clamp-2 leading-relaxed">
              {genre.description}
            </p>
          </div>
        ))}
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary bg-opacity-5">
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Description
              </th>
              {showMovieCount && (
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Movies
                </th>
              )}
              {(onEdit || (onDelete && canDelete)) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-inputbrdr">
            {genres.map((genre) => (
              <tr
                key={genre.id}
                className="hover:bg-footerbg hover:bg-opacity-5 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">
                    {genre.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral line-clamp-2 max-w-md">
                    {genre.description}
                  </div>
                </td>
                {showMovieCount && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-movite-count-tag bg-opacity-10 text-white">
                      {genre.movie_count ?? 0} movies
                    </span>
                  </td>
                )}
                {(onEdit || (onDelete && canDelete)) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(genre)}
                          className="text-neutral hover:text-editicon transition-all duration-200 p-2 rounded-md cursor-pointer hover:bg-neutral/5 active:scale-95"
                          title="Edit genre"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && canDelete && (
                        <button
                          onClick={() => onDelete(genre)}
                          className="text-neutral hover:text-accent transition-all duration-200 p-2 rounded-md cursor-pointer hover:bg-accent/5 active:scale-95"
                          title="Delete genre"
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

export default GenreTable;
