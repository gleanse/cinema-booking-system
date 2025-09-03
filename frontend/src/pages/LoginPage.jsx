import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tokenUtils } from '../api/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, error, clearError, fetchCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (tokenUtils.isAuthenticated()) {
        try {
          const result = await fetchCurrentUser();
          if (result.success) {
            console.log('User already authenticated, redirecting...');
            // if admin already authenticated or have existing token no need to show login form again
            navigate('/admin/genres', { replace: true });
          }
        } catch (err) {
          console.log('Invalid token found, clearing and staying on login');
          tokenUtils.removeToken();
        }
      }
    };

    checkAuthAndRedirect();
  }, [navigate, fetchCurrentUser]);
// FIXED ISSUE no more bug
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !loading) {
        const form = document.querySelector('form');
        if (
          form &&
          document.activeElement &&
          form.contains(document.activeElement)
        ) {
          form.dispatchEvent(
            new Event('submit', { cancelable: true, bubbles: true })
          );
        }
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [loading]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(
      formData.username,
      formData.password,
      formData.rememberMe
    );

    if (result.success) {
      console.log(
        `Token stored in ${
          result.rememberMe ? 'localStorage' : 'sessionStorage'
        }`
      );

      if (onLoginSuccess) {
        onLoginSuccess(result);
      }

      // TODO: change this when dashboard is available
      navigate('/admin/genres');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-background max-w-md w-full space-y-8 p-8 rounded-xl shadow-form border border-white/10 dark:border-primary/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-foreground">
            Welcome back! Please enter your credentials.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Alert type="error" message={error} onClose={clearError} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              disabled={loading}
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={loading}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
              </button>
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
                className="h-4 w-4 text-primary focus:ring-secondary border-inputbrdr rounded bg-inputbg cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-foreground cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
              variant="primary"
            >
              Sign in
            </Button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral">
            Don't have an account?{' '}
            <span className="text-primary hover:text-primary/80 cursor-pointer font-medium">
              Contact administrator
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
