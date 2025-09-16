import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

const GenreForm = ({
  genre = null,
  onSubmit,
  onCancel,
  loading = false,
  existingGenres = [],
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (genre) {
      setFormData({
        name: genre.name || '',
        description: genre.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
    setErrors({});
  }, [genre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const extractServerErrors = (errorResponse) => {
    const serverErrors = {};

    if (errorResponse && typeof errorResponse === 'object') {
      Object.keys(errorResponse).forEach((field) => {
        const errorValue = errorResponse[field];
        if (Array.isArray(errorValue)) {
          serverErrors[field] = errorValue[0];
        } else if (typeof errorValue === 'string') {
          serverErrors[field] = errorValue;
        }
      });
    }

    return serverErrors;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Genre name is required';
    } else if (formData.name.length > 70) {
      newErrors.name = 'Genre name must be 70 characters or less';
    } else {
      if (!genre) {
        const isDuplicate = existingGenres.some(
          (existing) =>
            existing.name.toLowerCase() === formData.name.toLowerCase().trim()
        );
        if (isDuplicate) {
          newErrors.name = 'A genre with this name already exists';
        }
      } else {
        const isDuplicate = existingGenres.some(
          (existing) =>
            existing.id !== genre.id &&
            existing.name.toLowerCase() === formData.name.toLowerCase().trim()
        );
        if (isDuplicate) {
          newErrors.name = 'A genre with this name already exists';
        }
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1500) {
      newErrors.description = 'Description must be 1500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);

      if (error.response?.data) {
        const serverErrors = extractServerErrors(error.response.data);
        if (Object.keys(serverErrors).length > 0) {
          setErrors(serverErrors);
        } else {
          setErrors({
            general: error.message || 'An error occurred. Please try again.',
          });
        }
      } else {
        setErrors({
          general: error.message || 'An error occurred. Please try again.',
        });
      }
    }
  };

  const isEditing = !!genre;

  return (
    <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
          {isEditing ? 'Edit Genre' : 'Create New Genre'}
        </h3>
        <p className="text-sm text-neutral mt-1">
          {isEditing
            ? 'Update the genre information'
            : 'Add a new genre to the system'}
        </p>
      </div>

      {/* GENERAL ERROR */}
      {errors.general && (
        <div className="mb-6 bg-accent/10 border border-accent rounded-md p-4">
          <p className="text-sm text-accent">{errors.general}</p>
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Genre Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Action, Comedy, Drama"
            className={`w-full px-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
              errors.name ? 'border-accent' : 'border-inputbrdr'
            }`}
            maxLength={70}
          />
          {errors.name && (
            <p className="text-accent text-xs mt-1">{errors.name}</p>
          )}
          <p className="text-xs text-neutral mt-1">
            {formData.name.length}/70 characters
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe this genre..."
            rows={4}
            className={`w-full px-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors resize-none ${
              errors.description ? 'border-accent' : 'border-inputbrdr'
            }`}
            maxLength={1500}
          />
          {errors.description && (
            <p className="text-accent text-xs mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-neutral mt-1">
            {formData.description.length}/1500 characters
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer w-full sm:w-auto px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </span>
            ) : isEditing ? (
              'Update Genre'
            ) : (
              'Create Genre'
            )}
          </button>

          <button
            onClick={onCancel}
            disabled={loading}
            className="cursor-pointer w-full sm:w-auto px-6 py-2 bg-accent text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreForm;
