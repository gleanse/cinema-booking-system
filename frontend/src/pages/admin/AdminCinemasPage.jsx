import { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaBuilding } from 'react-icons/fa';
import useCinemasCRUD from '../../hooks/useCinemasCRUD';
import useScreeningRoomsCRUD from '../../hooks/useScreeningRoomsCRUD';
import { useAuth } from '../../hooks/useAuth';
import CinemaForm from '../../components/admin/CinemaForm';
import CinemaTable from '../../components/admin/CinemaTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const AdminCinemasPage = () => {
  const { user, fetchCurrentUser } = useAuth();

  // for CINEMA
  const {
    cinemas,
    loading,
    error,
    fetchCinemas,
    createCinema,
    updateCinema,
    updateCinemaPartial,
    deleteCinema,
    clearError,
    canModify,
    canDelete,
  } = useCinemasCRUD(user);

  // for SCREENING ROOMS
  const {
    screeningRooms,
    fetchScreeningRooms,
    createScreeningRoom,
    updateScreeningRoom,
    deleteScreeningRoom,
  } = useScreeningRoomsCRUD(user);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState(null);
  const [deletingCinema, setDeletingCinema] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        await fetchCurrentUser();
      }
    };
    loadUser();
    fetchCinemas('full');
    fetchScreeningRooms();
  }, []);

  const getCinemaRooms = (cinemaId) => {
    return screeningRooms.filter(
      (room) => room.cinema === cinemaId || room.cinema?.id === cinemaId
    );
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingCinema) {
        await updateCinema(editingCinema.id, {
          name: formData.name,
          location: formData.location,
        });

        await handleScreeningRoomsUpdate(
          editingCinema.id,
          formData.screening_rooms
        );
      } else {
        const newCinema = await createCinema({
          name: formData.name,
          location: formData.location,
        });

        await handleScreeningRoomsUpdate(
          newCinema.id,
          formData.screening_rooms
        );
      }

      setIsFormOpen(false);
      setEditingCinema(null);
      fetchCinemas('full');
      fetchScreeningRooms();
    } catch (err) {
      console.error('Form submission error:', err);
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleScreeningRoomsUpdate = async (cinemaId, roomsData) => {
    setRoomsLoading(true);
    try {
      const currentRooms = getCinemaRooms(cinemaId);

      const roomsToCreate = [];
      const roomsToUpdate = [];
      const roomIdsToKeep = [];

      for (const room of roomsData) {
        if (!room.id) {
          roomsToCreate.push(room);
        } else {
          const existingRoom = currentRooms.find((r) => r.id === room.id);
          if (
            existingRoom &&
            (existingRoom.name !== room.name ||
              existingRoom.capacity !== room.capacity ||
              existingRoom.seats_per_row !== room.seats_per_row)
          ) {
            roomsToUpdate.push(room);
          }
          roomIdsToKeep.push(room.id);
        }
      }

      const roomsToDelete = currentRooms.filter(
        (room) => !roomIdsToKeep.includes(room.id)
      );

      for (const room of roomsToCreate) {
        await createScreeningRoom({
          name: room.name,
          capacity: room.capacity,
          seats_per_row: room.seats_per_row,
          cinema: cinemaId,
        });
      }

      for (const room of roomsToUpdate) {
        await updateScreeningRoom(room.id, {
          name: room.name,
          capacity: room.capacity,
          seats_per_row: room.seats_per_row,
          cinema: cinemaId,
        });
      }

      for (const room of roomsToDelete) {
        await deleteScreeningRoom(room.id);
      }
    } catch (err) {
      console.error('Room update error:', err);
      throw err;
    } finally {
      setRoomsLoading(false);
    }
  };

  const handleEdit = (cinema) => {
    if (!canModify) {
      alert('You need staff permissions to edit cinemas');
      return;
    }

    const cinemaWithRooms = {
      ...cinema,
      screening_rooms: getCinemaRooms(cinema.id),
    };

    setEditingCinema(cinemaWithRooms);
    setIsFormOpen(true);
  };

  const handleDelete = (cinema) => {
    if (!canDelete) {
      alert('You need superuser permissions to delete cinemas');
      return;
    }
    setDeletingCinema(cinema);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCinema) return;

    try {
      const cinemaRooms = getCinemaRooms(deletingCinema.id);
      for (const room of cinemaRooms) {
        await deleteScreeningRoom(room.id);
      }

      await deleteCinema(deletingCinema.id);
      setIsDeleteModalOpen(false);
      setDeletingCinema(null);
      fetchScreeningRooms();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleStatus = async (cinema) => {
    if (!canModify) {
      alert('You need staff permissions to toggle cinema status');
      return;
    }

    try {
      await updateCinemaPartial(cinema.id, { is_active: !cinema.is_active });
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingCinema(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingCinema(null);
  };

  const handleCloseError = () => {
    clearError();
  };

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
            Cinema Management
          </h1>
          <p className="text-neutral mt-2">
            Manage your cinema locations and screening rooms
          </p>
        </div>

        {error && (
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
                ? editingCinema
                  ? 'Edit Cinema'
                  : 'Create New Cinema'
                : 'All Cinemas'}
            </h2>
          </div>
          {!isFormOpen && !loading && canModify && cinemas.length > 0 && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all"
            >
              <FaPlus className="h-5 w-5 mr-2" />
              Add Cinema
            </button>
          )}
        </div>

        <div className="flex flex-col gap-8">
          {isFormOpen && (
            <div>
              <CinemaForm
                cinema={editingCinema}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={formLoading || roomsLoading}
                user={user}
                existingCinemas={cinemas}
              />
            </div>
          )}

          <div>
            {(loading || cinemas.length > 0) && (
              <CinemaTable
                cinemas={cinemas}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                canModify={canModify}
                canDelete={canDelete}
              />
            )}

            {!loading && cinemas.length === 0 && (
              <div className="text-center py-12 bg-surface rounded-lg">
                <FaBuilding className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Cinemas Found
                </h3>
                <p className="text-neutral mb-6">
                  Get started by adding your first cinema location.
                </p>
                {canModify && (
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all"
                  >
                    <FaPlus className="h-4 w-4 mr-2" />
                    Add Your First Cinema
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
          title="Delete Cinema"
          message="Are you sure you want to delete this cinema? This action cannot be undone and will also remove all associated screening rooms."
          itemName={deletingCinema?.name}
          confirmText="Delete"
          cancelText="Cancel"
          loading={loading}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default AdminCinemasPage;
