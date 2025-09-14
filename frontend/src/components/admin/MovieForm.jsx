import { useState, useEffect } from 'react';
import {
  FaTimes,
  FaUpload,
  FaSpinner,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
} from 'react-icons/fa';
import { useGenres } from '../../hooks/useGenres';

const MovieForm = ({ movie = null, onSubmit, onCancel, loading = false }) => {
  const { genres } = useGenres();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    age_rating: 'PG',
    duration: '',
    release_date: '',
    language: 'English',
    trailer_url: '',
    is_active: true,
    poster: null,
    remove_poster: false,
  });
  const [posterPreview, setPosterPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        genre: movie.genre_detail?.id || movie.genre || '',
        age_rating: movie.age_rating || 'PG',
        duration: movie.duration || '',
        release_date: movie.release_date || '',
        language: movie.language || 'English',
        trailer_url: movie.trailer_url || '',
        is_active: movie.is_active !== undefined ? movie.is_active : true,
        poster: null,
        remove_poster: false,
      });
      setPosterPreview(movie.poster || null);
    } else {
      setFormData({
        title: '',
        description: '',
        genre: '',
        age_rating: 'PG',
        duration: '',
        release_date: '',
        language: 'English',
        trailer_url: '',
        is_active: true,
        poster: null,
        remove_poster: false,
      });
      setPosterPreview(null);
    }
    setErrors({});
  }, [movie]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file' && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
        remove_poster: false,
      }));
      // create preview url
      const reader = new FileReader();
      reader.onload = (e) => setPosterPreview(e.target.result);
      reader.readAsDataURL(files[0]);
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const isValidUrl = (url) => {
    if (!url) return true;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (error) {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 150) {
      newErrors.title = 'Title must be 150 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less';
    }

    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }

    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = 'Valid duration is required';
    }

    if (!formData.release_date) {
      newErrors.release_date = 'Release date is required';
    }

    if (formData.language.length > 50) {
      newErrors.language = 'Language must be 50 characters or less';
    }

    // validate trailer URL if provided
    if (formData.trailer_url && !isValidUrl(formData.trailer_url)) {
      newErrors.trailer_url =
        'Please enter a valid URL (must start with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // create formdata for multipart upload
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === 'poster' && formData[key]) {
          submitData.append(key, formData[key]);
        } else if (key !== 'poster') {
          submitData.append(key, formData[key]);
        }
      });

      if (formData.remove_poster) {
        submitData.append('remove_poster', 'true');
      }

      onSubmit(submitData);
    }
  };

  const removePosterPreview = () => {
    setPosterPreview(null);
    setFormData((prev) => ({
      ...prev,
      poster: null,
      remove_poster: true,
    }));
  };

  const handleRemoveExistingPoster = () => {
    setPosterPreview(null);
    setFormData((prev) => ({
      ...prev,
      remove_poster: true,
    }));
  };

  const isEditing = !!movie;
  const hasExistingPoster = movie?.poster && !formData.remove_poster;

  return (
    <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
          {isEditing ? 'Edit Movie' : 'Create New Movie'}
        </h3>
        <p className="text-sm text-neutral mt-1">
          {isEditing
            ? 'Update the movie information'
            : 'Add a new movie to the system'}
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* left column */}
          <div className="space-y-4">
            {/* title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter movie title"
                className={`w-full px-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                  errors.title ? 'border-accent' : 'border-inputbrdr'
                }`}
                maxLength={150}
              />
              {errors.title && (
                <p className="text-accent text-xs mt-1">{errors.title}</p>
              )}
              <p className="text-xs text-neutral mt-1">
                {formData.title.length}/150 characters
              </p>
            </div>

            {/* description */}
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
                placeholder="Enter movie description"
                rows={4}
                className={`w-full px-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors resize-none ${
                  errors.description ? 'border-accent' : 'border-inputbrdr'
                }`}
                maxLength={2000}
              />
              {errors.description && (
                <p className="text-accent text-xs mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-neutral mt-1">
                {formData.description.length}/2000 characters
              </p>
            </div>

            {/* genre */}
            <div>
              <label
                htmlFor="genre"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-inputbg border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                  errors.genre ? 'border-accent' : 'border-inputbrdr'
                }`}
              >
                <option value="">Select genre</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
              {errors.genre && (
                <p className="text-accent text-xs mt-1">{errors.genre}</p>
              )}
            </div>

            {/* age rating */}
            <div>
              <label
                htmlFor="age_rating"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Age Rating
              </label>
              <select
                id="age_rating"
                name="age_rating"
                value={formData.age_rating}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-inputbg border border-inputbrdr rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
              >
                <option value="G">G - General Audience</option>
                <option value="PG">PG - Parental Guidance</option>
                <option value="R13">R13 - Restricted 13</option>
                <option value="R18">R18 - Restricted 18</option>
              </select>
            </div>

            {/* duration */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Duration (minutes) *
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                placeholder="e.g. 120"
                className={`w-full px-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                  errors.duration ? 'border-accent' : 'border-inputbrdr'
                }`}
              />
              {errors.duration && (
                <p className="text-accent text-xs mt-1">{errors.duration}</p>
              )}
            </div>
          </div>

          {/* right column */}
          <div className="space-y-4">
            {/* release date */}
            <div>
              <label
                htmlFor="release_date"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Release Date *
              </label>
              <input
                id="release_date"
                name="release_date"
                type="date"
                value={formData.release_date}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-inputbg border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                  errors.release_date ? 'border-accent' : 'border-inputbrdr'
                }`}
              />
              {errors.release_date && (
                <p className="text-accent text-xs mt-1">
                  {errors.release_date}
                </p>
              )}
            </div>

            {/* language */}
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Language
              </label>
              <input
                id="language"
                name="language"
                type="text"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g. English"
                className={`w-full px-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                  errors.language ? 'border-accent' : 'border-inputbrdr'
                }`}
                maxLength={50}
              />
              {errors.language && (
                <p className="text-accent text-xs mt-1">{errors.language}</p>
              )}
              <p className="text-xs text-neutral mt-1">
                {formData.language.length}/50 characters
              </p>
            </div>

            {/* trailer url */}
            <div>
              <label
                htmlFor="trailer_url"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Trailer URL
              </label>
              <input
                id="trailer_url"
                name="trailer_url"
                type="url"
                value={formData.trailer_url}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
                className={`w-full px-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                  errors.trailer_url ? 'border-accent' : 'border-inputbrdr'
                }`}
              />
              {errors.trailer_url && (
                <p className="text-accent text-xs mt-1">{errors.trailer_url}</p>
              )}
            </div>

            {/* active status */}
            <div className="flex items-center space-x-3">
              <label className="block text-sm font-medium text-foreground">
                Active Status
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: !prev.is_active,
                  }))
                }
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-colors ${
                  formData.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {formData.is_active ? (
                  <FaToggleOn className="h-4 w-4" />
                ) : (
                  <FaToggleOff className="h-4 w-4" />
                )}
                <span>{formData.is_active ? 'Active' : 'Inactive'}</span>
              </button>
            </div>

            {/* poster upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Movie Poster
              </label>

              {hasExistingPoster && !formData.poster ? (
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <img
                      src={posterPreview}
                      alt="Current poster"
                      className="w-full h-64 object-contain rounded-md border border-inputbrdr bg-gray-100 mb-2"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveExistingPoster}
                      className="cursor-pointer flex items-center px-3 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
                    >
                      <FaTrash className="h-4 w-4 mr-2" />
                      Remove Current Poster
                    </button>
                    <p className="text-xs text-neutral mt-2">
                      Upload a new image below to replace this poster
                    </p>
                  </div>
                </div>
              ) : posterPreview ? (
                <div className="relative">
                  <img
                    src={posterPreview}
                    alt="Poster preview"
                    className="w-full h-64 object-contain rounded-md border border-inputbrdr bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={removePosterPreview}
                    className="absolute top-2 right-2 bg-accent text-white rounded-full p-1 hover:bg-accent/90 transition-colors"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-inputbrdr border-dashed rounded-md cursor-pointer hover:border-secondary transition-colors bg-inputbg">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className="w-8 h-8 mb-4 text-neutral" />
                    <p className="mb-2 text-sm text-neutral">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-neutral">
                      PNG, JPG or JPEG (Recommended: 2:3 aspect ratio)
                    </p>
                  </div>
                  <input
                    type="file"
                    name="poster"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* form actions */}
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
              'Update Movie'
            ) : (
              'Create Movie'
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

export default MovieForm;
