import { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaFilm } from 'react-icons/fa';
import { useGenres } from '../../hooks/useGenres';
import { useAuth } from '../../hooks/useAuth';
import GenreForm from '../../components/admin/GenreForm';
import GenreTable from '../../components/admin/GenreTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const GenresPage = () => {
  const {
    genres,
    loading,
    error,
    createGenre,
    updateGenre,
    deleteGenre,
    clearError,
  } = useGenres();

  const { user, fetchCurrentUser } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [deletingGenre, setDeletingGenre] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

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
    try {
      if (editingGenre) {
        await updateGenre(editingGenre.id, formData, true);
      } else {
        await createGenre(formData);
      }
      setIsFormOpen(false);
      setEditingGenre(null);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (genre) => {
    setEditingGenre(genre);
    setIsFormOpen(true);
  };

  const handleDelete = (genre) => {
    setDeletingGenre(genre);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingGenre) return;

    try {
      await deleteGenre(deletingGenre.id);
      setIsDeleteModalOpen(false);
      setDeletingGenre(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingGenre(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingGenre(null);
  };

  const handleCloseError = () => {
    clearError();
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Genre Management
          </h1>
          <p className="text-neutral mt-2">Manage movie genres in the system</p>
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
                ? editingGenre
                  ? 'Edit Genre'
                  : 'Create New Genre'
                : 'All Genres'}
            </h2>
          </div>
          {!isFormOpen && !loading && genres.length > 0 && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all"
            >
              <FaPlus className="h-5 w-5 mr-2" />
              Add Genre
            </button>
          )}
        </div>

        <div className="flex flex-col gap-8">
          {isFormOpen && (
            <div>
              <GenreForm
                genre={editingGenre}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={formLoading}
                existingGenres={genres}
              />
            </div>
          )}

          <div>
            {(loading || genres.length > 0) && (
              <GenreTable
                genres={genres}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showMovieCount={true}
                user={user}
              />
            )}

            {/* show empty state only when not loading and no genres */}
            {!loading && genres.length === 0 && (
              <div className="text-center py-12 bg-surface rounded-lg">
                <FaFilm className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Genres Found
                </h3>
                <p className="text-neutral mb-6">
                  Get started by adding your first genre to the collection.
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Add Your First Genre
                </button>
              </div>
            )}
          </div>
        </div>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Delete Genre"
          message="Are you sure you want to delete this genre? This action cannot be undone."
          itemName={deletingGenre?.name}
          confirmText="Delete"
          cancelText="Cancel"
          loading={loading}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default GenresPage;
