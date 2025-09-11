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

  const fetchScreeningRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await screeningRoomAPI.getScreeningRooms();
      const roomData = response.data.results || response.data;
      setScreeningRooms(roomData);
      return roomData;
    } catch (err) {
      setError(
        err.response?.data?.message || 'failed to fetch screening rooms'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getScreeningRoomDetails = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await screeningRoomAPI.getScreeningRoomDetails(id);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message || 'failed to fetch screening room details'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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

        const errorMessage =
          err.message === 'staff or superuser permission required'
            ? err.message
            : err.response?.data?.message ||
              err.response?.data ||
              'failed to create screening room';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission]
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
        const errorMessage =
          err.message === 'staff or superuser permission required'
            ? err.message
            : err.response?.data?.message || 'failed to update screening room';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission]
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
        const errorMessage =
          err.message === 'staff or superuser permission required'
            ? err.message
            : err.response?.data?.message || 'failed to update screening room';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission]
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
        const errorMessage =
          err.message === 'only superusers can delete screening rooms'
            ? err.message
            : err.response?.data?.message || 'failed to delete screening room';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [checkPermission]
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
