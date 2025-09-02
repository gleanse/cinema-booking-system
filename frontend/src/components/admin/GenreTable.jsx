import { FaBoxOpen, FaEdit, FaTrash } from 'react-icons/fa';

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
      <div className="bg-background border border-inputbrdr rounded-lg shadow-form p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral bg-opacity-20 rounded w-1/4"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-neutral bg-opacity-10 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!genres || genres.length === 0) {
    return (
      <div className="bg-background border border-inputbrdr rounded-lg shadow-form p-8 text-center">
        <div className="text-neutral mb-4">
          <FaBoxOpen className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No Genres Found
        </h3>
        <p className="text-neutral">
          Get started by creating your first genre.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background border border-inputbrdr rounded-lg shadow-form overflow-hidden">
      <div className="bg-primary bg-opacity-5 px-4 sm:px-6 py-3 border-b border-inputbrdr">
        <h3 className="text-lg font-medium text-white">Genres</h3>
      </div>

      {/* MOBILE */}
      <div className="block sm:hidden divide-y divide-inputbrdr">
        {genres.map((genre) => (
          <div key={genre.id} className="p-4">
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
                      className="p-1 text-neutral active:text-editicon transition-colors"
                      title="Edit genre"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && canDelete && (
                    <button
                      onClick={() => onDelete(genre)}
                      className="p-1 text-neutral active:text-accent transition-colors"
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
                className="hover:bg-footerbg hover:bg-opacity-5 transition-colors"
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
                          className="text-neutral hover:text-editicon transition-colors p-1 rounded cursor-pointer"
                          title="Edit genre"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && canDelete && (
                        <button
                          onClick={() => onDelete(genre)}
                          className="text-neutral hover:text-accent transition-colors p-1 rounded cursor-pointer"
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
