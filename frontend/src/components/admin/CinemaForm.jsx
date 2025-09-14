import { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { GiTheater } from 'react-icons/gi';
import {
  FaSpinner,
  FaBuilding,
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
  FaEdit,
  FaCheck,
} from 'react-icons/fa';

const CinemaForm = ({
  cinema = null,
  onSubmit,
  onCancel,
  loading = false,
  user = null,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    screening_rooms: [],
  });
  const [roomToRemove, setRoomToRemove] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', capacity: 50 });
  const [errors, setErrors] = useState({});
  const [editingRoomIndex, setEditingRoomIndex] = useState(null);
  const [editingRoomData, setEditingRoomData] = useState({
    name: '',
    capacity: 0,
  });

  useEffect(() => {
    if (cinema) {
      setFormData({
        name: cinema.name || '',
        location: cinema.location || '',
        screening_rooms: cinema.screening_rooms || [],
      });
    } else {
      setFormData({
        name: '',
        location: '',
        screening_rooms: [],
      });
    }
    setErrors({});
  }, [cinema]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) : value,
    }));
  };

  const addScreeningRoom = () => {
    if (newRoom.name.trim() && newRoom.capacity > 0) {
      setFormData((prev) => ({
        ...prev,
        screening_rooms: [...prev.screening_rooms, { ...newRoom }],
      }));
      setNewRoom({ name: '', capacity: 50 });
    }
  };

  const confirmRemoveRoom = (index) => {
    setRoomToRemove(index);
    setShowRemoveConfirm(true);
  };

  const handleRemoveRoom = () => {
    if (roomToRemove !== null) {
      removeScreeningRoom(roomToRemove);
      setShowRemoveConfirm(false);
      setRoomToRemove(null);
    }
  };

  const cancelRemoveRoom = () => {
    setShowRemoveConfirm(false);
    setRoomToRemove(null);
  };

  const startEditingRoom = (index) => {
    const room = formData.screening_rooms[index];
    setEditingRoomIndex(index);
    setEditingRoomData({
      name: room.name,
      capacity: room.capacity,
      id: room.id,
    });
  };

  const cancelEditingRoom = () => {
    setEditingRoomIndex(null);
    setEditingRoomData({ name: '', capacity: 0 });
  };

  const saveEditedRoom = () => {
    if (editingRoomIndex !== null) {
      setFormData((prev) => ({
        ...prev,
        screening_rooms: prev.screening_rooms.map((room, index) =>
          index === editingRoomIndex
            ? { ...room, ...editingRoomData, id: room.id }
            : room
        ),
      }));
      setEditingRoomIndex(null);
      setEditingRoomData({ name: '', capacity: 0 });
    }
  };

  const handleEditRoomChange = (e) => {
    const { name, value } = e.target;
    setEditingRoomData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) : value,
    }));
  };

  const removeScreeningRoom = (index) => {
    setFormData((prev) => ({
      ...prev,
      screening_rooms: prev.screening_rooms.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Cinema name is required';
    if (formData.name.length > 100)
      newErrors.name = 'Name must be 100 characters or less';
    if (formData.location && formData.location.length > 255)
      newErrors.location = 'Location must be 255 characters or less';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const isEditing = !!cinema;

  return (
    <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
          {isEditing ? 'Edit Cinema' : 'Create New Cinema'}
        </h3>
        <p className="text-sm text-neutral mt-1">
          {isEditing
            ? 'Update the cinema information'
            : 'Add a new cinema with screening rooms'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cinema Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Cinema Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="h-4 w-4 text-neutral" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter cinema name"
                maxLength={100}
                className={`w-full pl-10 pr-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                  errors.name ? 'border-accent' : 'border-inputbrdr'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-accent text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="h-4 w-4 text-neutral" />
              </div>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter cinema location"
                maxLength={255}
                className={`w-full pl-10 pr-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                  errors.location ? 'border-accent' : 'border-inputbrdr'
                }`}
              />
            </div>
            {errors.location && (
              <p className="text-accent text-xs mt-1">{errors.location}</p>
            )}
          </div>
        </div>

        <div className="border border-inputbrdr rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-foreground flex items-center">
              <GiTheater className="h-4 w-4 mr-2" />
              Screening Rooms
            </h4>
            <span className="text-xs text-neutral">
              {formData.screening_rooms.length} room
              {formData.screening_rooms.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <input
                type="text"
                placeholder="Room name"
                name="name"
                value={newRoom.name}
                onChange={handleRoomChange}
                className="w-full px-3 py-2 bg-inputbg border border-inputbrdr rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Capacity"
                name="capacity"
                value={newRoom.capacity}
                onChange={handleRoomChange}
                min="1"
                max="1000"
                className="w-full px-3 py-2 bg-inputbg border border-inputbrdr rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={addScreeningRoom}
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                <FaPlus className="h-3 w-3 mr-1" />
                Add Room
              </button>
            </div>
          </div>

          {formData.screening_rooms.length > 0 && (
            <div className="space-y-2">
              {formData.screening_rooms.map((room, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-neutral/5 p-2 rounded"
                >
                  {editingRoomIndex === index ? (
                    // EDIT MODE
                    <div className="flex-1 flex gap-2 items-center">
                      <input
                        type="text"
                        name="name"
                        value={editingRoomData.name}
                        onChange={handleEditRoomChange}
                        className="flex-1 px-2 py-1 bg-inputbg text-foreground border border-inputbrdr rounded text-sm"
                        placeholder="Room name"
                      />
                      <input
                        type="number"
                        name="capacity"
                        value={editingRoomData.capacity}
                        onChange={handleEditRoomChange}
                        min="1"
                        max="1000"
                        className="w-20 px-2 py-1 bg-inputbg border border-inputbrdr rounded text-sm text-foreground"
                        placeholder="Capacity"
                      />
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={saveEditedRoom}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Save changes"
                        >
                          <FaCheck className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditingRoom}
                          className="text-neutral hover:text-foreground transition-colors"
                          title="Cancel edit"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // VIEW MODE
                    <>
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {room.name}
                        </span>
                        <span className="text-xs text-neutral ml-2">
                          ({room.capacity} seats)
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {(user?.is_staff || user?.is_superuser) && (
                          <button
                            type="button"
                            onClick={() => startEditingRoom(index)}
                            className="cursor-pointer text-editicon hover:text-editicon/80 transition-colors"
                            title="Edit room"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                        )}
                        {user?.is_superuser && (
                          <button
                            type="button"
                            onClick={() => confirmRemoveRoom(index)}
                            className="cursor-pointer text-accent hover:text-accent/80 transition-colors"
                            title="Remove room"
                          >
                            <FaTimes className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full sm:w-auto px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </span>
            ) : isEditing ? (
              'Update Cinema'
            ) : (
              'Create Cinema'
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

      <ConfirmationModal
        isOpen={showRemoveConfirm}
        onClose={cancelRemoveRoom}
        onConfirm={handleRemoveRoom}
        title="Remove Screening Room"
        message="This room will be marked for removal. To permanently delete it, you need to submit the form. Changes are not saved until you click 'Update Cinema'"
        confirmText="Remove Room"
        cancelText="Cancel"
        loading={false}
        variant="warning"
      />
    </div>
  );
};

export default CinemaForm;
