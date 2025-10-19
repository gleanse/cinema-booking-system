import { useState, useEffect } from 'react';
import {
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserTag,
  FaPlus,
  FaTimes,
  FaEdit,
  FaCheck,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

const AccountForm = ({
  account = null,
  onSubmit,
  onCancel,
  loading = false,
  user = null,
  existingAccounts = [],
  isEditingOwnAccount = false,
  isStaffView = false,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
    is_staff: false,
    is_superuser: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        username: account.username || '',
        email: account.email || '',
        first_name: account.first_name || '',
        last_name: account.last_name || '',
        password: '',
        confirm_password: '',
        is_staff: account.is_staff || false,
        is_superuser: account.is_superuser || false,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
        is_staff: false,
        is_superuser: false,
      });
    }
    setErrors({});
    setSuccessMessage('');
    setHasChanges(false);
  }, [account]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (
      (name === 'is_staff' || name === 'is_superuser') &&
      errors.permissions
    ) {
      setErrors((prev) => ({ ...prev, permissions: '' }));
    }
    setHasChanges(true);
    setSuccessMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    // username validation only required for new accounts or superusers editing others
    if ((!isStaffView || !isEditing) && !formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim() && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (
      formData.username.trim() &&
      !/^[a-zA-Z0-9_]+$/.test(formData.username)
    ) {
      newErrors.username =
        'Username can only contain letters, numbers, and underscores';
    }

    // email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!account || formData.password) {
      if (!formData.password && !account) {
        newErrors.password = 'Password is required for new accounts';
      } else if (formData.password && formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (
        formData.password &&
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)
      ) {
        newErrors.password =
          'Password must contain uppercase, lowercase, and numbers';
      }

      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match';
      }
    }

    // check for duplicate username (only for superusers or new accounts)
    if (formData.username.trim() && (!isStaffView || !isEditing)) {
      const isDuplicate = existingAccounts.some(
        (existing) =>
          existing.username.toLowerCase() ===
            formData.username.toLowerCase().trim() &&
          existing.id !== account?.id
      );
      if (isDuplicate) {
        newErrors.username = 'Username already exists';
      }
    }

    // check for duplicate email
    if (formData.email.trim()) {
      const isDuplicate = existingAccounts.some(
        (existing) =>
          existing.email?.toLowerCase() ===
            formData.email.toLowerCase().trim() && existing.id !== account?.id
      );
      if (isDuplicate) {
        newErrors.email = 'Email already exists';
      }
    }

    // PERMISSIONS VALIDATION: at least one permission must be selected for both create and update
    if (!isStaffView && !formData.is_staff && !formData.is_superuser) {
      newErrors.permissions =
        'Please select at least one permission (Staff Member or Superuser)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const extractServerErrors = (errorResponse) => {
    const serverErrors = {};

    if (errorResponse && typeof errorResponse === 'object') {
      Object.keys(errorResponse).forEach((field) => {
        const errorValue = errorResponse[field];
        if (Array.isArray(errorValue)) {
          serverErrors[field] = errorValue[0];
        } else if (typeof errorValue === 'string') {
          serverErrors[field] = errorValue;
        }
      });
    }

    return serverErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      let submitData = {
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      };

      if (!isStaffView || !isEditing) {
        submitData.username = formData.username.trim();
      }

      // only include permissions for superusers (staff users cant change permissions)
      if (!isStaffView) {
        submitData.is_staff = formData.is_staff;
        submitData.is_superuser = formData.is_superuser;
      }

      if (formData.password) {
        submitData.password = formData.password;
      }

      await onSubmit(submitData);

      // SUCCESS: show success message
      if (isEditing) {
        setSuccessMessage('Account updated successfully!');
      } else {
        setSuccessMessage('Account created successfully!');
      }

      // reset form changes tracking
      setHasChanges(false);

      // clear password fields after successful submission
      if (formData.password) {
        setFormData((prev) => ({
          ...prev,
          password: '',
          confirm_password: '',
        }));
      }

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);

      if (error.response?.data) {
        const serverErrors = extractServerErrors(error.response.data);
        if (Object.keys(serverErrors).length > 0) {
          setErrors(serverErrors);
        } else {
          setErrors({
            general: error.message || 'An error occurred. Please try again.',
          });
        }
      } else {
        setErrors({
          general: error.message || 'An error occurred. Please try again.',
        });
      }
    }
  };

  const isEditing = !!account;

  const getFormTitle = () => {
    if (isStaffView && isEditingOwnAccount) {
      return 'My Account Settings';
    }
    return isEditing ? 'Edit Account' : 'Create New Account';
  };

  const getFormDescription = () => {
    if (isStaffView && isEditingOwnAccount) {
      return 'Update your personal information and password';
    }
    return isEditing
      ? 'Update the account information'
      : 'Create a new user account with appropriate permissions';
  };

  return (
    <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
          {getFormTitle()}
        </h3>
        <p className="text-sm text-neutral mt-1">{getFormDescription()}</p>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 animate-fade-in">
          <div className="flex items-center">
            <FaCheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <p className="text-sm text-green-700 mt-1">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage('')}
              className="ml-auto flex-shrink-0 text-green-500 hover:text-green-700"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* GENERAL ERROR */}
      {errors.general && (
        <div className="mb-6 bg-accent/10 border border-accent rounded-md p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground">Error</h3>
              <p className="text-sm text-neutral mt-1">{errors.general}</p>
            </div>
            <button
              onClick={() => setErrors((prev) => ({ ...prev, general: '' }))}
              className="ml-4 flex-shrink-0 text-neutral hover:text-foreground"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFORMATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Username field - hidden for staff users editing their own account */}
          {(!isStaffView || !isEditing) && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Username {!isEditing && '*'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-neutral" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  disabled={isStaffView && isEditing}
                  className={`w-full pl-10 pr-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                    errors.username ? 'border-accent' : 'border-inputbrdr'
                  } ${
                    isStaffView && isEditing
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-accent text-xs mt-1">{errors.username}</p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-4 w-4 text-neutral" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={`w-full pl-10 pr-3 py-2 bg-inputbg border rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors ${
                  errors.email ? 'border-accent' : 'border-inputbrdr'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-accent text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
              className="w-full px-3 py-2 bg-inputbg border border-inputbrdr rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full px-3 py-2 bg-inputbg border border-inputbrdr rounded-md text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* PASSWORD SECTION */}
        <div className="border border-inputbrdr rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-4 flex items-center">
            <FaLock className="h-4 w-4 mr-2" />
            {isEditing ? 'Change Password' : 'Password'}
            <span className="text-xs text-neutral ml-2">
              {isEditing ? '(Leave blank to keep current password)' : ''}
            </span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-foreground mb-1">
                Password {!isEditing && '*'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    isEditing ? 'Enter new password' : 'Enter password'
                  }
                  className={`w-full pr-10 pl-3 py-2 bg-inputbg border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-secondary ${
                    errors.password ? 'border-accent' : 'border-inputbrdr'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral hover:text-foreground"
                >
                  {showPassword ? (
                    <FaTimes className="h-4 w-4" />
                  ) : (
                    <FaCheck className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-accent text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-foreground mb-1">
                Confirm Password {!isEditing && '*'}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`w-full pr-10 pl-3 py-2 bg-inputbg border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-secondary ${
                    errors.confirm_password
                      ? 'border-accent'
                      : 'border-inputbrdr'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <FaTimes className="h-4 w-4" />
                  ) : (
                    <FaCheck className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-accent text-xs mt-1">
                  {errors.confirm_password}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* PERMISSIONS SECTION - hidden for staff users */}
        {!isStaffView && (
          <div className="border border-inputbrdr rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-4 flex items-center">
              <FaUserTag className="h-4 w-4 mr-2" />
              Permissions *
            </h4>

            {/* Permissions Error Message */}
            {errors.permissions && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-start">
                  <FaExclamationTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    {errors.permissions}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_staff"
                  checked={formData.is_staff}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-inputbrdr rounded"
                />
                <span className="ml-2 text-sm text-foreground">
                  Staff Member
                </span>
                <span className="ml-2 text-xs text-neutral">
                  (Can access admin interface)
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_superuser"
                  checked={formData.is_superuser}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-inputbrdr rounded"
                />
                <span className="ml-2 text-sm text-foreground">Superuser</span>
                <span className="ml-2 text-xs text-neutral">
                  (Full system access and can create other accounts)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || (!hasChanges && isEditing)}
            className="cursor-pointer w-full sm:w-auto px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </span>
            ) : isEditing ? (
              hasChanges ? (
                'Update Account'
              ) : (
                'No Changes'
              )
            ) : (
              'Create Account'
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="cursor-pointer w-full sm:w-auto px-6 py-2 bg-accent text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
