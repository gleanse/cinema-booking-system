import { useState, useEffect, useCallback } from 'react';
import { screeningRoomAPI } from '../api/api';

const useScreeningRoomsCRUD = (user = null) => {
  const [screeningRooms, setScreeningRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScreeningRooms();
  }, []);

  // permission checks
  const canModify = useCallback(() => {
    if (!user) return false;
    return user.is_staff === true || user.is_superuser === true;
  }, [user]);

  const canDelete = useCallback(() => {
    if (!user) return false;
    return user.is_superuser === true;
  }, [user]);

  const checkPermission = useCallback(
    (action) => {
      if (action === 'delete' && !canDelete()) {
        throw new Error('only superusers can delete screening rooms');
      }
      if (['create', 'update'].includes(action) && !canModify()) {
        throw new Error('staff or superuser permission required');
      }
    },
    [canModify, canDelete]
  );

  const clearError = useCallback(() => setError(null), []);

  const extractErrorMessage = useCallback((err) => {
    if (err.response?.data) {
      const errorData = err.response.data;

      if (typeof errorData === 'object' && !Array.isArray(errorData)) {
        const firstErrorKey = Object.keys(errorData)[0];
        if (firstErrorKey) {
          const firstError = errorData[firstErrorKey];
          return Array.isArray(firstError) ? firstError[0] : firstError;
        }
      }

      if (typeof errorData === 'string') {
        return errorData;
      }

      if (errorData.message) {
        return errorData.message;
      }

      if (errorData.detail) {
        return errorData.detail;
      }
    }

    return 'An unexpected error occurred';
  }, []);

  const fetchScreeningRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await screeningRoomAPI.getScreeningRooms();
      const roomData = response.data.results || response.data;
      setScreeningRooms(roomData);
      return roomData;
    } catch (err) {
      const errorMessage =
        extractErrorMessage(err) || 'failed to fetch screening rooms';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [extractErrorMessage]);

  const getScreeningRoomDetails = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);

        const response = await screeningRoomAPI.getScreeningRoomDetails(id);
        return response.data;
      } catch (err) {
        const errorMessage =
          extractErrorMessage(err) || 'failed to fetch screening room details';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [extractErrorMessage]
  );

  const createScreeningRoom = useCallback(
    async (roomData) => {
      try {
        checkPermission('create');
        setLoading(true);
        setError(null);

        console.log('Creating screening room with data:', roomData);

        const response = await screeningRoomAPI.createScreeningRoom(roomData);
        console.log('Screening room created successfully:', response.data);

        setScreeningRooms((prev) => [response.data, ...prev]);
        return response.data;
      } catch (err) {
        console.error('Create screening room error details:', {
          message: err.message,
          response: err.response,
          data: err.response?.data,
        });

        let errorMessage;

        if (err.message === 'staff or superuser permission required') {
          errorMessage = err.message;
        } else {
          errorMessage =
            extractErrorMessage(err) || 'failed to create screening room';
        }

        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  const updateScreeningRoom = useCallback(
    async (id, roomData) => {
      try {
        checkPermission('update');
        setLoading(true);
        setError(null);

        const response = await screeningRoomAPI.updateScreeningRoom(
          id,
          roomData
        );
        setScreeningRooms((prev) =>
          prev.map((room) => (room.id === id ? response.data : room))
        );
        return response.data;
      } catch (err) {
        let errorMessage;

        if (err.message === 'staff or superuser permission required') {
          errorMessage = err.message;
        } else {
          errorMessage =
            extractErrorMessage(err) || 'failed to update screening room';
        }

        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  const updateScreeningRoomPartial = useCallback(
    async (id, roomData) => {
      try {
        checkPermission('update');
        setLoading(true);
        setError(null);

        const response = await screeningRoomAPI.updateScreeningRoomPartial(
          id,
          roomData
        );
        setScreeningRooms((prev) =>
          prev.map((room) => (room.id === id ? response.data : room))
        );
        return response.data;
      } catch (err) {
        let errorMessage;

        if (err.message === 'staff or superuser permission required') {
          errorMessage = err.message;
        } else {
          errorMessage =
            extractErrorMessage(err) || 'failed to update screening room';
        }

        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  const deleteScreeningRoom = useCallback(
    async (id) => {
      try {
        checkPermission('delete');
        setLoading(true);
        setError(null);

        await screeningRoomAPI.deleteScreeningRoom(id);
        setScreeningRooms((prev) => prev.filter((room) => room.id !== id));
        return true;
      } catch (err) {
        let errorMessage;

        if (err.message === 'only superusers can delete screening rooms') {
          errorMessage = err.message;
        } else {
          errorMessage =
            extractErrorMessage(err) || 'failed to delete screening room';
        }

        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission, extractErrorMessage]
  );

  return {
    screeningRooms,
    loading,
    error,
    canModify: canModify(),
    canDelete: canDelete(),
    fetchScreeningRooms,
    getScreeningRoomDetails,
    createScreeningRoom,
    updateScreeningRoom,
    updateScreeningRoomPartial,
    deleteScreeningRoom,
    clearError,
  };
};

export default useScreeningRoomsCRUD;
