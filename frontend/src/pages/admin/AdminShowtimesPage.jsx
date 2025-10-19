import { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import useShowtimesCRUD from '../../hooks/useShowtimesCRUD';
import { useAuth } from '../../hooks/useAuth';
import useMoviesCRUD from '../../hooks/useMoviesCRUD';
import useCinemasCRUD from '../../hooks/useCinemasCRUD';
import useScreeningRoomsCRUD from '../../hooks/useScreeningRoomsCRUD';
import ShowtimeForm from '../../components/admin/ShowtimeForm';
import ShowtimeTable from '../../components/admin/ShowtimeTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const AdminShowtimesPage = () => {
  const { user, fetchCurrentUser } = useAuth();

  const {
    showtimes,
    loading,
    error,
    createShowtime,
    updateShowtime,
    updateShowtimePartial,
    deleteShowtime,
    clearError,
    canModify,
    canDelete,
    fetchShowtimes,
  } = useShowtimesCRUD(user);

  const { movies } = useMoviesCRUD(user);
  const { cinemas } = useCinemasCRUD(user);
  const { screeningRooms } = useScreeningRoomsCRUD(user);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [deletingShowtime, setDeletingShowtime] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        await fetchCurrentUser();
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setBackendErrors({});

    try {
      const submitData = {
        movie: formData.movie,
        room_id: formData.room,
        show_date: formData.show_date,
        show_time: formData.show_time,
        ticket_price: formData.price,
        is_active: formData.is_active,
      };

      if (editingShowtime) {
        await updateShowtime(editingShowtime.id, submitData);
      } else {
        await createShowtime(submitData);
      }

      await fetchShowtimes();

      setIsFormOpen(false);
      setEditingShowtime(null);
      setBackendErrors({});
    } catch (err) {
      console.error('Form submission error:', err);

      // handle backend validation errors
      if (err.response?.data) {
        const backendResponse = err.response.data;
        const validationErrors = {};

        console.log('Backend response:', backendResponse);

        // check for time conflict errors in various possible fields
        const checkForTimeConflict = (errorMessage) => {
          if (!errorMessage) return false;
          const message = Array.isArray(errorMessage)
            ? errorMessage[0]
            : errorMessage;
          return (
            message.includes('Time slot conflicts with') ||
            message.includes('This time conflicts with') ||
            message.includes('conflicts with') ||
            (message.toLowerCase().includes('time') &&
              message.toLowerCase().includes('conflict'))
          );
        };

        // check show_time field
        if (
          backendResponse.show_time &&
          checkForTimeConflict(backendResponse.show_time)
        ) {
          validationErrors.show_time = Array.isArray(backendResponse.show_time)
            ? backendResponse.show_time[0]
            : backendResponse.show_time;
        }

        // check non_field_errors
        if (
          backendResponse.non_field_errors &&
          checkForTimeConflict(backendResponse.non_field_errors)
        ) {
          validationErrors.show_time = Array.isArray(
            backendResponse.non_field_errors
          )
            ? backendResponse.non_field_errors[0]
            : backendResponse.non_field_errors;
        }

        // also check for room-level conflicts
        if (
          backendResponse.room &&
          checkForTimeConflict(backendResponse.room)
        ) {
          validationErrors.show_time = Array.isArray(backendResponse.room)
            ? backendResponse.room[0]
            : backendResponse.room;
        }

        setBackendErrors(validationErrors);

        // if no time conflict found but there are other validation errors, log them
        if (
          Object.keys(validationErrors).length === 0 &&
          Object.keys(backendResponse).length > 0
        ) {
          console.error('Other backend validation errors:', backendResponse);
        }
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (showtime) => {
    if (!canModify) {
      alert('You need staff permissions to edit showtimes');
      return;
    }
    setEditingShowtime(showtime);
    setIsFormOpen(true);
    setBackendErrors({});
  };

  const handleDelete = (showtime) => {
    if (!canDelete) {
      alert('You need superuser permissions to delete showtimes');
      return;
    }
    setDeletingShowtime(showtime);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingShowtime) return;

    try {
      await deleteShowtime(deletingShowtime.id);
      setIsDeleteModalOpen(false);
      setDeletingShowtime(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleStatus = async (showtime) => {
    if (!canModify) {
      alert('You need staff permissions to toggle showtime status');
      return;
    }

    try {
      await updateShowtimePartial(showtime.id, {
        is_active: !showtime.is_active,
      });
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingShowtime(null);
    setBackendErrors({});
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingShowtime(null);
  };

  const handleCloseError = () => {
    clearError();
  };

  // for NEW showtimes, only show active movies
  const activeMoviesForNewShowtimes = movies.filter(
    (movie) => movie.is_active === true
  );

  // permission denied screen
  if (user && !canModify) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FaTimes className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Access Denied
              </h2>
              <p className="text-neutral">
                You need staff permissions to access this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Showtime Management
          </h1>
          <p className="text-neutral mt-2">
            Manage your cinema's movie schedules and showtimes
          </p>
        </div>

        {/* show general errors from the hook (not form-specific) */}
        {error && !isFormOpen && (
          <div className="mb-6 bg-accent/10 border border-accent rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground">Error</h3>
                <p className="text-sm text-neutral mt-1">{error}</p>
              </div>
              <button
                onClick={handleCloseError}
                className="ml-4 flex-shrink-0 text-neutral hover:text-foreground"
              >
                <span className="sr-only">Close</span>
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">
              {isFormOpen
                ? editingShowtime
                  ? 'Edit Showtime'
                  : 'Schedule New Showtime'
                : 'All Showtimes'}
            </h2>
          </div>
          {!isFormOpen && !loading && canModify && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all"
            >
              <FaPlus className="h-5 w-5 mr-2" />
              Schedule Showtime
            </button>
          )}
        </div>

        <div className="flex flex-col gap-8">
          {isFormOpen && (
            <div>
              <ShowtimeForm
                showtime={editingShowtime}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={formLoading}
                movies={activeMoviesForNewShowtimes}
                cinemas={cinemas}
                screeningRooms={screeningRooms}
                backendErrors={backendErrors} // only pass backend time conflicts
              />
            </div>
          )}

          <div>
            {(loading || showtimes.length > 0) && (
              <ShowtimeTable
                showtimes={showtimes}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                canModify={canModify}
                canDelete={canDelete}
              />
            )}

            {!loading && showtimes.length === 0 && (
              <div className="text-center py-12 bg-surface rounded-lg">
                <FaCalendarAlt className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Showtimes Found
                </h3>
                <p className="text-neutral mb-6">
                  Get started by scheduling your first movie showtime.
                </p>
                {canModify && (
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all"
                  >
                    <FaPlus className="h-4 w-4 mr-2" />
                    Schedule Your First Showtime
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Delete Showtime"
          message="Are you sure you want to delete this showtime? This action cannot be undone and may affect existing bookings."
          itemName={deletingShowtime?.movie_title}
          confirmText="Delete"
          cancelText="Cancel"
          loading={loading}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default AdminShowtimesPage;
