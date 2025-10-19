import {
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaClock,
  FaFilm,
  FaBuilding,
  FaDoorOpen,
  FaMoneyBillWave,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
} from 'react-icons/fa';

const ShowtimeTable = ({
  showtimes = [],
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
  canModify = false,
  canDelete = false,
}) => {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEditClick = (showtime) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    onEdit(showtime);
  };

  if (loading) {
    return (
      <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s overflow-hidden">
        <div className="bg-primary bg-opacity-5 px-4 sm:px-6 py-3 border-b border-inputbrdr">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Showtimes</h3>
          </div>
        </div>
        <div className="p-8 text-center">
          <FaSpinner className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
          <p className="text-neutral">Loading showtimes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s overflow-hidden">
      <div className="bg-primary bg-opacity-5 px-4 sm:px-6 py-3 border-b border-inputbrdr">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Showtimes</h3>
          <span className="text-sm text-white">
            {showtimes.length} total showtime{showtimes.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="block sm:hidden divide-y divide-inputbrdr">
        {showtimes.map((showtime) => (
          <div
            key={showtime.id}
            className="p-4 hover:bg-footerbg hover:bg-opacity-3 transition-colors"
          >
            <div className="flex items-start space-x-3 mb-3">
              {showtime.movie?.poster ? (
                <img
                  src={showtime.movie.poster}
                  alt={showtime.movie_title}
                  className="h-16 w-12 rounded object-cover flex-shrink-0 shadow-sm"
                />
              ) : (
                <div className="h-16 w-12 bg-neutral/20 rounded flex items-center justify-center flex-shrink-0 border border-neutral/10">
                  <FaFilm className="h-6 w-6 text-neutral" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {showtime.movie_title || 'Unknown Movie'}
                </h4>
                <div className="flex items-center text-xs text-neutral mt-1">
                  <FaBuilding className="h-3 w-3 mr-1" />
                  <span>{showtime.room?.cinema_name || 'Unknown Cinema'}</span>
                  <span className="mx-2">•</span>
                  <FaDoorOpen className="h-3 w-3 mr-1" />
                  <span>{showtime.room?.name || 'Unknown Room'}</span>
                </div>
                <div className="flex items-center text-xs text-neutral mt-1">
                  <FaCalendarAlt className="h-3 w-3 mr-1" />
                  <span>{formatDate(showtime.show_date)}</span>
                  <span className="mx-2">•</span>
                  <FaClock className="h-3 w-3 mr-1" />
                  <span>{formatTime(showtime.show_time)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => canModify && onToggleStatus(showtime)}
                  disabled={!canModify}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    showtime.is_active
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  } ${
                    !canModify
                      ? 'cursor-not-allowed opacity-60'
                      : 'cursor-pointer hover:scale-105'
                  }`}
                >
                  {showtime.is_active ? (
                    <FaToggleOn className="h-3 w-3" />
                  ) : (
                    <FaToggleOff className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-sm text-foreground font-medium">
                <FaMoneyBillWave className="h-4 w-4 mr-1 text-green-600" />₱
                {parseFloat(showtime.ticket_price || 0).toFixed(2)}
              </div>
            </div>

            {(canModify || canDelete) && (
              <div className="flex items-center justify-end space-x-2">
                {canModify && (
                  <button
                    onClick={() => handleEditClick(showtime)}
                    className="p-2 text-neutral hover:text-editicon active:scale-95 transition-all duration-200 rounded-md hover:bg-neutral/5"
                    title="Edit showtime"
                  >
                    <FaEdit className="h-4 w-4" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDelete(showtime)}
                    className="p-2 text-neutral hover:text-accent active:scale-95 transition-all duration-200 rounded-md hover:bg-accent/5"
                    title="Delete showtime"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary bg-opacity-5">
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Movie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Cinema / Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Price
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
            {showtimes.map((showtime) => (
              <tr
                key={showtime.id}
                className="hover:bg-footerbg hover:bg-opacity-5 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {showtime.movie?.poster ? (
                      <img
                        src={showtime.movie.poster}
                        alt={showtime.movie_title}
                        className="h-16 w-12 rounded object-cover mr-4 shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-12 bg-neutral/20 rounded flex items-center justify-center mr-4 border border-neutral/10">
                        <FaFilm className="h-6 w-6 text-neutral" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {showtime.movie_title || 'Unknown Movie'}
                      </div>
                      <div className="text-sm text-neutral">
                        {showtime.movie?.age_rating || 'N/A'} •{' '}
                        {showtime.movie?.duration || 'N/A'} min
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">
                    <div className="flex items-center">
                      <FaBuilding className="h-3 w-3 mr-1 text-neutral" />
                      {showtime.room?.cinema_name || 'Unknown Cinema'}
                    </div>
                  </div>
                  <div className="text-sm text-neutral">
                    <div className="flex items-center">
                      <FaDoorOpen className="h-3 w-3 mr-1 text-neutral" />
                      {showtime.room?.name || 'Unknown Room'}
                      {showtime.room?.capacity &&
                        ` (${showtime.room.capacity} seats)`}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-foreground">
                    <FaCalendarAlt className="h-3 w-3 mr-1 text-neutral" />
                    {formatDate(showtime.show_date)}
                  </div>
                  <div className="flex items-center text-sm text-neutral">
                    <FaClock className="h-3 w-3 mr-1 text-neutral" />
                    {formatTime(showtime.show_time)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm font-medium text-foreground">
                    <FaMoneyBillWave className="h-4 w-4 mr-1 text-green-600" />₱
                    {parseFloat(showtime.ticket_price || 0).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => canModify && onToggleStatus(showtime)}
                    disabled={!canModify}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      showtime.is_active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } ${
                      !canModify
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:scale-105 active:scale-95'
                    }`}
                  >
                    {showtime.is_active ? (
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
                          onClick={() => handleEditClick(showtime)}
                          className="text-neutral hover:text-editicon transition-all duration-200 p-2 rounded-md cursor-pointer hover:bg-neutral/5 active:scale-95"
                          title="Edit showtime"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDelete(showtime)}
                          className="text-neutral hover:text-accent transition-all duration-200 p-2 rounded-md cursor-pointer hover:bg-accent/5 active:scale-95"
                          title="Delete showtime"
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

export default ShowtimeTable;
