import { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaFilm } from 'react-icons/fa';
import useMoviesCRUD from '../../hooks/useMoviesCRUD';
import { useAuth } from '../../hooks/useAuth';
import MovieForm from '../../components/admin/MovieForm';
import MovieTable from '../../components/admin/MovieTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const AdminMoviesPage = () => {
  const { user, fetchCurrentUser } = useAuth();

  const {
    movies,
    loading,
    error,
    createMovie,
    updateMovie,
    updateMoviePartial,
    deleteMovie,
    clearError,
    canModify,
    canDelete,
  } = useMoviesCRUD(user);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [deletingMovie, setDeletingMovie] = useState(null);
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
      if (editingMovie) {
        await updateMovie(editingMovie.id, formData);
      } else {
        await createMovie(formData);
      }
      setIsFormOpen(false);
      setEditingMovie(null);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (movie) => {
    if (!canModify) {
      alert('You need staff permissions to edit movies');
      return;
    }
    setEditingMovie(movie);
    setIsFormOpen(true);
  };

  const handleDelete = (movie) => {
    if (!canDelete) {
      alert('You need superuser permissions to delete movies');
      return;
    }
    setDeletingMovie(movie);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMovie) return;

    try {
      await deleteMovie(deletingMovie.id);
      setIsDeleteModalOpen(false);
      setDeletingMovie(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleStatus = async (movie) => {
    if (!canModify) {
      alert('You need staff permissions to toggle movie status');
      return;
    }

    try {
      await updateMoviePartial(movie.id, { is_active: !movie.is_active });
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingMovie(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingMovie(null);
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
            Movie Management
          </h1>
          <p className="text-neutral mt-2">
            Manage your cinema's movie collection
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
                ? editingMovie
                  ? 'Edit Movie'
                  : 'Create New Movie'
                : 'All Movies'}
            </h2>
          </div>
          {!isFormOpen && !loading && canModify && movies.length > 0 && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all"
            >
              <FaPlus className="h-5 w-5 mr-2" />
              Add Movie
            </button>
          )}
        </div>

        <div className="flex flex-col gap-8">
          {isFormOpen && (
            <div>
              <MovieForm
                movie={editingMovie}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={formLoading}
                existingMovies={movies}
              />
            </div>
          )}

          <div>
            {(loading || movies.length > 0) && (
              <MovieTable
                movies={movies}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                user={user}
                canModify={canModify}
                canDelete={canDelete}
              />
            )}

            {!loading && movies.length === 0 && (
              <div className="text-center py-12 bg-surface rounded-lg">
                <FaFilm className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Movies Found
                </h3>
                <p className="text-neutral mb-6">
                  Get started by adding your first movie to the collection.
                </p>
                {canModify && (
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all"
                  >
                    <FaPlus className="h-4 w-4 mr-2" />
                    Add Your First Movie
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
          title="Delete Movie"
          message="Are you sure you want to delete this movie? This action cannot be undone."
          itemName={deletingMovie?.title}
          confirmText="Delete"
          cancelText="Cancel"
          loading={loading}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default AdminMoviesPage;
