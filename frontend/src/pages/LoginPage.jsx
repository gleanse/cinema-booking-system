import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { login, loading, error, clearError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData.username, formData.password);

    if (result.success && onLoginSuccess) {
      onLoginSuccess(result);
    }
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Alert type="error" message={error} onClose={clearError} />

          <div className="space-y-4">
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
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
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