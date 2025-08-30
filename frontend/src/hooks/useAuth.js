import { useState } from 'react';
import { authAPI, tokenUtils } from '../api/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // LOGINNNNNNNNNN
  const login = async (username, password) => {
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
      // store the token in localstorage after success login for auth
      tokenUtils.setToken(token);

      return {
        success: true,
        token,
        isNewToken,
        username,
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

  // LOGOUTTTTTTTTTTTTT
  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
      tokenUtils.removeToken();
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      tokenUtils.removeToken();
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // checking if theres token or AUTHENTICATED
  const isAuthenticated = () => {
    return tokenUtils.isAuthenticated();
  };

  return {
    login,
    logout,
    isAuthenticated,
    loading,
    error,
    clearError: () => setError(''),
  };
};
