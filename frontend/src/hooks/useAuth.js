import { useState } from 'react';
import { authAPI, userAPI, tokenUtils } from '../api/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  // REGISTER NEW USER (superuser only)
  const register = async (userData) => {
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register(userData);
      console.log('User registration successful');

      const { token, user: newUser } = response.data;
      console.log('New user created:', newUser.username);

      return {
        success: true,
        user: newUser,
        token,
        message: 'User created successfully',
      };
    } catch (err) {
      console.error('Registration failed:', err);
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response?.status === 403) {
        errorMessage =
          'Permission denied. Only superusers can create new accounts.';
      } else if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const firstErrorKey = Object.keys(errorData)[0];
          if (firstErrorKey) {
            const firstError = errorData[firstErrorKey];
            errorMessage = Array.isArray(firstError)
              ? firstError[0]
              : firstError;
            if (
              firstErrorKey === 'username' &&
              errorMessage.includes('already exists')
            ) {
              errorMessage =
                'Username already exists. Please choose a different username.';
            } else if (
              firstErrorKey === 'email' &&
              errorMessage.includes('already exists')
            ) {
              errorMessage =
                'Email already exists. Please use a different email.';
            }
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // GET ALL USERS (superuser only)
  const getAllUsers = async () => {
    setError('');
    setLoading(true);

    try {
      console.log('Fetching all users...');
      const response = await userAPI.getAllUsers();
      console.log('Users fetched successfully');
      return {
        success: true,
        users: response.data,
      };
    } catch (err) {
      console.error('Failed to fetch users:', err);
      let errorMessage = 'Failed to fetch users. Please try again.';

      if (err.response?.status === 403) {
        errorMessage = 'Permission denied. Only superusers can view all users.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // UPDATE USER (superuser only)
  const updateUser = async (userId, userData) => {
    setError('');
    setLoading(true);

    try {
      const response = await userAPI.updateUser(userId, userData);
      console.log('User updated successfully');
      return {
        success: true,
        user: response.data,
        message: 'User updated successfully',
      };
    } catch (err) {
      console.error('User update failed:', err);
      let errorMessage = 'Failed to update user. Please try again.';

      if (err.response?.status === 403) {
        errorMessage = 'Permission denied. Only superusers can update users.';
      } else if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const firstErrorKey = Object.keys(errorData)[0];
          if (firstErrorKey) {
            const firstError = errorData[firstErrorKey];
            errorMessage = Array.isArray(firstError)
              ? firstError[0]
              : firstError;
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // UPDATE CURRENT USER (for staff users to update their own account)
  const updateCurrentUser = async (userData) => {
    setError('');
    setLoading(true);

    try {
      const response = await userAPI.updateCurrentUser(userData);
      console.log('Current user updated successfully');

      setUser((prev) => ({ ...prev, ...response.data }));

      return {
        success: true,
        user: response.data,
        message: 'Account updated successfully',
      };
    } catch (err) {
      console.error('Current user update failed:', err);
      let errorMessage = 'Failed to update account. Please try again.';

      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const firstErrorKey = Object.keys(errorData)[0];
          if (firstErrorKey) {
            const firstError = errorData[firstErrorKey];
            errorMessage = Array.isArray(firstError)
              ? firstError[0]
              : firstError;
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // DELETE USER (superuser only)
  const deleteUser = async (userId) => {
    setError('');
    setLoading(true);

    try {
      console.log('Deleting user:', userId);
      await userAPI.deleteUser(userId);
      console.log('User deleted successfully');
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (err) {
      console.error('User deletion failed:', err);
      let errorMessage = 'Failed to delete user. Please try again.';

      if (err.response?.status === 403) {
        errorMessage = 'Permission denied. Only superusers can delete users.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 404) {
        errorMessage = 'User not found.';
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // TOGGLE USER ACTIVE STATUS (superuser only)
  const toggleUserActive = async (userId) => {
    setError('');
    setLoading(true);

    try {
      console.log('Toggling user active status:', userId);
      const response = await userAPI.toggleUserActive(userId);
      console.log('User status toggled successfully');
      return {
        success: true,
        user: response.data,
        message: 'User status updated successfully',
      };
    } catch (err) {
      console.error('User status toggle failed:', err);
      let errorMessage = 'Failed to update user status. Please try again.';

      if (err.response?.status === 403) {
        errorMessage =
          'Permission denied. Only superusers can modify user status.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // CHECK IF CURRENT USER CAN REGISTER NEW ACCOUNTS
  const canRegister = () => {
    return user?.is_superuser === true;
  };

  // CHECK IF CURRENT USER CAN MANAGE USERS
  const canManageUsers = () => {
    return user?.is_superuser === true;
  };

  // LOGIN
  const login = async (username, password, rememberMe = false) => {
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login...');
      const response = await authAPI.login(username, password);
      console.log('Login API call successful');

      const { token, new: isNewToken } = response.data;
      console.log('Login successful!');
      console.log('Token:', !!token);
      console.log('Is new token:', isNewToken);
      console.log('Remember me:', rememberMe);

      // store token based on remember me preference
      tokenUtils.setToken(token, rememberMe);
      await fetchCurrentUser();

      return {
        success: true,
        token,
        isNewToken,
        username,
        rememberMe,
      };
    } catch (err) {
      console.error('Login failed:', err);
      let errorMessage = 'Login failed. Please try again.';

      if (err.response?.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
      tokenUtils.removeToken();
      setUser(null);
      console.log('Logout successful');
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      tokenUtils.removeToken();
      setUser(null);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // FETCH CURRENT USER
  const fetchCurrentUser = async () => {
    if (!tokenUtils.isAuthenticated()) {
      setUser(null);
      return { success: false, error: 'Not authenticated' };
    }

    setUserLoading(true);
    setError('');

    try {
      const response = await userAPI.getCurrentUser();
      setUser(response.data);
      return { success: true, user: response.data };
    } catch (err) {
      console.error('Failed to fetch user:', err);
      let errorMessage = 'Failed to fetch user data';

      if (err.response?.status === 401) {
        tokenUtils.removeToken();
        setUser(null);
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUserLoading(false);
    }
  };

  // checking if theres token or AUTHENTICATED
  const isAuthenticated = () => {
    return tokenUtils.isAuthenticated();
  };

  // REFRESH USER DATA
  const refreshUser = async () => {
    return await fetchCurrentUser();
  };

  return {
    register,
    getAllUsers,
    updateUser,
    updateCurrentUser,
    deleteUser,
    toggleUserActive,
    canRegister,
    canManageUsers,
    login,
    logout,
    isAuthenticated,
    fetchCurrentUser,
    refreshUser,
    loading,
    error,
    user,
    userLoading,
    clearError: () => setError(''),
  };
};
