import { useState } from 'react';
import { authAPI, userAPI, tokenUtils } from '../api/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

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
