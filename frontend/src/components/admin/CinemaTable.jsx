import {
  FaEdit,
  FaTrash,
  FaBuilding,
  FaMapMarkerAlt,
  FaSpinner,
} from 'react-icons/fa';
import { GiTheater } from 'react-icons/gi';

const CinemaTable = ({
  cinemas = [],
  loading = false,
  onEdit,
  onDelete,
  canModify = false,
  canDelete = false,
}) => {
  if (loading) {
    return (
      <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s overflow-hidden">
        <div className="bg-primary bg-opacity-5 px-4 sm:px-6 py-3 border-b border-inputbrdr">
          <h3 className="text-lg font-medium text-white">Cinemas</h3>
        </div>

        {/* MOBILE LOADING SKELETON */}
        <div className="block sm:hidden divide-y divide-inputbrdr">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="p-4">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-12 h-12 bg-neutral/20 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral/25 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-neutral/15 rounded animate-pulse w-1/2"></div>
                </div>
              </div>

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
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-20"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-24"></div>
                </th>
                <th className="px-6 py-3 text-right">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-16 ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inputbrdr">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-neutral/20 rounded-full mr-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-neutral/25 rounded w-32"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral/20 rounded w-40"></div>
                    </div>
                  </td>
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
          <span className="text-sm text-neutral">Loading cinemas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s overflow-hidden">
      <div className="bg-primary bg-opacity-5 px-4 sm:px-6 py-3 border-b border-inputbrdr">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Cinemas</h3>
          <span className="text-sm text-white">
            {cinemas.length} total cinema{cinemas.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* MOBILE */}
      <div className="block sm:hidden divide-y divide-inputbrdr">
        {cinemas.map((cinema) => (
          <div
            key={cinema.id}
            className="p-4 hover:bg-footerbg hover:bg-opacity-3 transition-colors"
          >
            <div className="flex items-start space-x-3 mb-3">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 border border-primary/30">
                <FaBuilding className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {cinema.name}
                </h4>
                <div className="flex items-center text-xs text-neutral mt-1">
                  <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                  <span className="truncate">
                    {cinema.location || 'No location'}
                  </span>
                </div>
                {cinema.screening_rooms && (
                  <div className="flex items-center text-xs text-neutral mt-1">
                    <GiTheater className="h-3 w-3 mr-1" />
                    <span>{cinema.screening_rooms.length} screening rooms</span>
                  </div>
                )}
              </div>
            </div>

            {(canModify || canDelete) && (
              <div className="flex items-center justify-end space-x-2">
                {canModify && (
                  <button
                    onClick={() => onEdit(cinema)}
                    className="p-2 text-neutral hover:text-editicon active:scale-95 transition-all duration-200 rounded-md hover:bg-neutral/5"
                    title="Edit cinema"
                  >
                    <FaEdit className="h-4 w-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDelete(cinema)}
                    className="p-2 text-neutral hover:text-accent active:scale-95 transition-all duration-200 rounded-md hover:bg-accent/5"
                    title="Delete cinema"
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
                Cinema
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Screening Rooms
              </th>
              {(canModify || canDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-inputbrdr">
            {cinemas.map((cinema) => (
              <tr
                key={cinema.id}
                className="hover:bg-footerbg hover:bg-opacity-5 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mr-4 border border-primary/30">
                      <FaBuilding className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {cinema.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-foreground">
                    <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                    {cinema.location || 'No location'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-foreground">
                    <GiTheater className="h-4 w-4 mr-1" />
                    {cinema.screening_rooms?.length
                      ? `${cinema.screening_rooms.length} ${
                          cinema.screening_rooms.length === 1 ? 'room' : 'rooms'
                        }`
                      : 'No rooms'}
                  </div>
                </td>
                {(canModify || canDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {canModify && (
                        <button
                          onClick={() => onEdit(cinema)}
                          className="text-neutral hover:text-editicon transition-all duration-200 p-2 rounded-md cursor-pointer hover:bg-neutral/5 active:scale-95"
                          title="Edit cinema"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDelete(cinema)}
                          className="text-neutral hover:text-accent transition-all duration-200 p-2 rounded-md cursor-pointer hover:bg-accent/5 active:scale-95"
                          title="Delete cinema"
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

export default CinemaTable;
