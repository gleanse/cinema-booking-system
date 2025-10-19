import { useState, useEffect } from 'react';
import {
  FaSpinner,
  FaCalendarAlt,
  FaClock,
  FaFilm,
  FaBuilding,
  FaDoorOpen,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from 'react-icons/fa';

const ShowtimeForm = ({
  showtime = null,
  onSubmit,
  onCancel,
  loading = false,
  movies = [],
  cinemas = [],
  screeningRooms = [],
  backendErrors = {}, // only receive backend errors (time conflicts)
}) => {
  const [formData, setFormData] = useState({
    movie: '',
    cinema: '',
    room: '',
    show_date: '',
    show_time: '',
    price: '',
    is_active: true,
  });

  const [frontendErrors, setFrontendErrors] = useState({});

  // filter active movies and screening rooms based on selected cinema
  const activeMovies = movies.filter((movie) => movie.is_active);
  const availableRooms = screeningRooms.filter(
    (room) => room.cinema === parseInt(formData.cinema)
  );

  useEffect(() => {
    if (showtime) {
      setFormData({
        movie: showtime.movie_id || showtime.movie || '',
        cinema: showtime.room?.cinema || '',
        room: showtime.room?.id || showtime.room || '',
        show_date: showtime.show_date || '',
        show_time: showtime.show_time || '',
        price: showtime.ticket_price || '',
        is_active: showtime.is_active !== undefined ? showtime.is_active : true,
      });
    } else {
      setFormData({
        movie: '',
        cinema: '',
        room: '',
        show_date: '',
        show_time: '',
        price: '',
        is_active: true,
      });
    }
    setFrontendErrors({});
  }, [showtime]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: newValue };

      if (name === 'cinema' && prev.cinema !== newValue) {
        updatedFormData.room = '';
      }

      return updatedFormData;
    });

    if (frontendErrors[name]) {
      setFrontendErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // clear backend time conflict error when time/date/room changes
    if (
      (name === 'show_time' || name === 'show_date' || name === 'room') &&
      backendErrors.show_time
    ) {
      setBackendErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // required field validations
    if (!formData.movie) newErrors.movie = 'Please select a movie';
    if (!formData.cinema) newErrors.cinema = 'Please select a cinema';
    if (!formData.room) newErrors.room = 'Please select a screening room';
    if (!formData.show_date) newErrors.show_date = 'Please select a show date';
    if (!formData.show_time) newErrors.show_time = 'Please select a show time';

    // price validation
    if (!formData.price || formData.price.toString().trim() === '') {
      newErrors.price = 'Please enter a ticket price';
    } else {
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue)) {
        newErrors.price = 'Please enter a valid price';
      } else if (priceValue < 0) {
        newErrors.price = 'Price must be positive';
      } else if (priceValue > 99999.99) {
        newErrors.price = 'Price cannot exceed ₱99,999.99';
      } else {
        // check for too many decimal places
        const priceStr = formData.price.toString();
        if (priceStr.includes('.') && priceStr.split('.')[1].length > 2) {
          newErrors.price = 'Price can only have up to 2 decimal places';
        }
      }
    }

    // date/time validation
    if (formData.show_date && formData.show_time) {
      const showDateTime = new Date(
        `${formData.show_date}T${formData.show_time}`
      );
      const now = new Date();

      if (showDateTime < now) {
        newErrors.show_date = 'Show date and time must be in the future';
      }
    }

    // clear backend errors when frontend validation fails (to avoid confusion)
    if (
      Object.keys(newErrors).length > 0 &&
      Object.keys(backendErrors).length > 0
    ) {
      setBackendErrors({});
    }

    setFrontendErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // only run frontend validation
    if (!validateForm()) return;

    // submit the form data to parent
    onSubmit(formData);
  };

  const isEditing = !!showtime;

  return (
    <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
          {isEditing ? 'Edit Showtime' : 'Schedule New Showtime'}
        </h3>
        <p className="text-sm text-neutral mt-1">
          {isEditing
            ? 'Update the showtime information'
            : 'Schedule a new movie showtime'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Movie Selection */}
            <div>
              <label
                htmlFor="movie"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Movie *
              </label>
              <div className="relative">
                <FaFilm className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral" />
                <select
                  id="movie"
                  name="movie"
                  value={formData.movie}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 bg-inputbg border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                    frontendErrors.movie ? 'border-accent' : 'border-inputbrdr'
                  }`}
                >
                  <option value="">Select a movie</option>
                  {activeMovies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title} ({movie.release_date?.split('-')[0]})
                    </option>
                  ))}
                </select>
              </div>
              {frontendErrors.movie && (
                <p className="text-accent text-xs mt-1 flex items-center">
                  <FaExclamationTriangle className="h-3 w-3 mr-1" />
                  {frontendErrors.movie}
                </p>
              )}
            </div>

            {/* Cinema Selection */}
            <div>
              <label
                htmlFor="cinema"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Cinema *
              </label>
              <div className="relative">
                <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral" />
                <select
                  id="cinema"
                  name="cinema"
                  value={formData.cinema}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 bg-inputbg border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                    frontendErrors.cinema ? 'border-accent' : 'border-inputbrdr'
                  }`}
                >
                  <option value="">Select a cinema</option>
                  {cinemas.map((cinema) => (
                    <option key={cinema.id} value={cinema.id}>
                      {cinema.name} - {cinema.location}
                    </option>
                  ))}
                </select>
              </div>
              {frontendErrors.cinema && (
                <p className="text-accent text-xs mt-1 flex items-center">
                  <FaExclamationTriangle className="h-3 w-3 mr-1" />
                  {frontendErrors.cinema}
                </p>
              )}
            </div>

            {/* Screening Room */}
            <div>
              <label
                htmlFor="room"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Screening Room *
              </label>
              <div className="relative">
                <FaDoorOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral" />
                <select
                  id="room"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  disabled={!formData.cinema}
                  className={`w-full pl-10 pr-3 py-2 bg-inputbg border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                    frontendErrors.room ? 'border-accent' : 'border-inputbrdr'
                  } ${!formData.cinema ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select a room</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.capacity} seats)
                    </option>
                  ))}
                </select>
              </div>
              {frontendErrors.room && (
                <p className="text-accent text-xs mt-1 flex items-center">
                  <FaExclamationTriangle className="h-3 w-3 mr-1" />
                  {frontendErrors.room}
                </p>
              )}
              {!formData.cinema && (
                <p className="text-xs text-neutral mt-1">
                  Please select a cinema first
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Show Date */}
            <div>
              <label
                htmlFor="show_date"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Show Date *
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral" />
                <input
                  id="show_date"
                  name="show_date"
                  type="date"
                  value={formData.show_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-10 pr-3 py-2 bg-inputbg border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                    frontendErrors.show_date
                      ? 'border-accent'
                      : 'border-inputbrdr'
                  }`}
                />
              </div>
              {frontendErrors.show_date && (
                <p className="text-accent text-xs mt-1 flex items-center">
                  <FaExclamationTriangle className="h-3 w-3 mr-1" />
                  {frontendErrors.show_date}
                </p>
              )}
            </div>

            {/* Show Time */}
            <div>
              <label
                htmlFor="show_time"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Show Time *
              </label>
              <div className="relative">
                <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral" />
                <input
                  id="show_time"
                  name="show_time"
                  type="time"
                  value={formData.show_time}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 bg-inputbg border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                    backendErrors.show_time
                      ? 'border-amber-400'
                      : frontendErrors.show_time
                      ? 'border-accent'
                      : 'border-inputbrdr'
                  } ${backendErrors.show_time ? 'bg-amber-50' : ''}`}
                />
              </div>

              {/* Show backend time conflict error */}
              {backendErrors.show_time && (
                <div className="mt-2 p-3 border border-amber-300 bg-amber-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FaExclamationTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800 mb-1">
                        Scheduling Conflict Detected
                      </p>
                      <p className="text-sm text-amber-700">
                        {backendErrors.show_time}
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        Please adjust the show time or select a different room.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show frontend time error */}
              {frontendErrors.show_time && !backendErrors.show_time && (
                <p className="text-accent text-xs mt-1 flex items-center">
                  <FaExclamationTriangle className="h-3 w-3 mr-1" />
                  {frontendErrors.show_time}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Ticket Price (₱) *
              </label>
              <div className="relative">
                <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral" />
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full pl-10 pr-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                    frontendErrors.price ? 'border-accent' : 'border-inputbrdr'
                  }`}
                />
              </div>
              {frontendErrors.price && (
                <p className="text-accent text-xs mt-1 flex items-center">
                  <FaExclamationTriangle className="h-3 w-3 mr-1" />
                  {frontendErrors.price}
                </p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-3 pt-4">
              <span className="text-sm font-medium text-foreground">
                Status:
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: !prev.is_active,
                  }))
                }
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  formData.is_active
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                <span>{formData.is_active ? 'Active' : 'Inactive'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-inputbrdr">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full sm:w-auto px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                {isEditing ? 'Updating...' : 'Scheduling...'}
              </span>
            ) : isEditing ? (
              'Update Showtime'
            ) : (
              'Schedule Showtime'
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cursor-pointer w-full sm:w-auto px-6 py-2 bg-accent text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShowtimeForm;
