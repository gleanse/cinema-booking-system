import { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaUser, FaEdit, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import AccountForm from '../../components/admin/AccountForm';
import AccountTable from '../../components/admin/AccountTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const AdminAccountsPage = () => {
  const {
    user,
    fetchCurrentUser,
    register,
    getAllUsers,
    updateUser,
    updateCurrentUser,
    deleteUser,
    toggleUserActive,
    loading: authLoading,
    error: authError,
    clearError: clearAuthError,
  } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const isLoading = loading || authLoading;
  const combinedError = error || authError;

  const clearError = () => {
    setError(null);
    clearAuthError();
  };

  // check if current user is staff but NOT superuser
  const isStaffOnly = user?.is_staff && !user?.is_superuser;
  const isSuperUser = user?.is_superuser;

  // wait for user to load before fetching accounts
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        await fetchCurrentUser();
      }
      await fetchAccounts();
    };
    loadData();
  }, [user]);

  // auto open form for staff only users when accounts are loaded
  useEffect(() => {
    if (isStaffOnly && accounts.length > 0 && !isFormOpen) {
      const ownAccount = accounts.find((acc) => acc.id === user.id);
      if (ownAccount) {
        setEditingAccount(ownAccount);
        setIsFormOpen(true);
      }
    }
  }, [accounts, isStaffOnly, user, isFormOpen]);

  const fetchAccounts = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      if (isSuperUser) {
        const result = await getAllUsers();
        if (result.success) {
          setAccounts(result.users || []);
        } else {
          throw new Error(result.error);
        }
      } else if (user?.is_staff) {
        // staff-only users see only their own account
        const ownAccount = {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          is_staff: user.is_staff,
          is_superuser: user.is_superuser,
          is_active: user.is_active,
          date_joined: user.date_joined,
        };
        setAccounts([ownAccount]);
      }
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
      setError(err.message || 'Failed to load accounts.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setError(null);

    try {
      console.log('SUBMITTING FORM - User:', {
        id: user?.id,
        is_staff: user?.is_staff,
        is_superuser: user?.is_superuser,
        editingAccount: editingAccount?.id,
        isEditingOwnAccount: editingAccount?.id === user?.id,
      });

      if (editingAccount) {
        const isEditingOwnAccount = editingAccount.id === user?.id;

        // superusers can update any account
        if (isSuperUser) {
          const result = await updateUser(editingAccount.id, formData);
          if (!result.success) throw new Error(result.error);
        }
        // staff only users editing their own account
        else if (isEditingOwnAccount && user?.is_staff) {
          const allowedFields = {
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
          };

          if (formData.password) {
            allowedFields.password = formData.password;
          }

          const result = await updateCurrentUser(allowedFields);
          if (!result.success) throw new Error(result.error);
        } else {
          throw new Error('You do not have permission to edit this account');
        }
      } else {
        // only superusers can create accounts
        if (!isSuperUser) {
          throw new Error('Only superusers can create new accounts');
        }
        const result = await register(formData);
        if (!result.success) throw new Error(result.error);
      }

      // For staff only users, keep the form open after update
      if (!isStaffOnly) {
        setIsFormOpen(false);
        setEditingAccount(null);
      }

      await fetchAccounts();
      if (editingAccount?.id === user?.id) {
        await fetchCurrentUser();
      }
    } catch (err) {
      console.error('❌ Form submission error:', err);
      setError(err.message || 'Failed to save account.');
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (account) => {
    // superusers can edit any account
    // staff only users can only edit their own account
    if (isStaffOnly && account.id !== user?.id) {
      setError('You can only edit your own account information');
      return;
    }
    setEditingAccount(account);
    setIsFormOpen(true);
    clearError();
  };

  const handleDelete = (account) => {
    if (!isSuperUser) {
      setError('Only superusers can delete accounts');
      return;
    }
    if (account.id === user?.id) {
      setError('You cannot delete your own account');
      return;
    }
    setDeletingAccount(account);
    setIsDeleteModalOpen(true);
    clearError();
  };

  const handleConfirmDelete = async () => {
    if (!deletingAccount) return;
    setError(null);
    try {
      const result = await deleteUser(deletingAccount.id);
      if (result.success) {
        setIsDeleteModalOpen(false);
        setDeletingAccount(null);
        await fetchAccounts();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete account.');
    }
  };

  const handleCancel = () => {
    // for staff only users, dont allow closing the form its their main view
    if (!isStaffOnly) {
      setIsFormOpen(false);
      setEditingAccount(null);
      clearError();
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingAccount(null);
  };

  if (user && !user?.is_staff && !user?.is_superuser) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FaTimes className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Access Denied
              </h2>
              <p className="text-neutral">
                You need staff permissions to access account management.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {isSuperUser ? 'Account Management' : 'My Account'}
          </h1>
          <p className="text-neutral mt-2">
            {isSuperUser
              ? 'Manage user accounts and permissions'
              : 'Manage your account information and password'}
          </p>
        </div>

        {isStaffOnly && (
          <div className="mb-6 bg-primary/10 border border-primary rounded-md p-4">
            <div className="flex items-center">
              <FaUserCircle className="h-5 w-5 text-primary mr-3" />
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Personal Account Management
                </h3>
                <p className="text-sm text-neutral mt-1">
                  You can update your personal information and password here.
                  Contact a superuser for permission changes.
                </p>
              </div>
            </div>
          </div>
        )}

        {combinedError && (
          <div className="mb-6 bg-accent/10 border border-accent rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground">Error</h3>
                <p className="text-sm text-neutral mt-1">{combinedError}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-4 flex-shrink-0 text-neutral hover:text-foreground"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* SHOW FORM DIRECTLY FOR STAFF-ONLY USERS, SHOW TABLE/FORM FOR SUPERUSERS */}
        <div className="flex flex-col gap-8">
          {(isFormOpen || isStaffOnly) && (
            <div>
              <AccountForm
                account={editingAccount}
                onSubmit={handleSubmit}
                onCancel={isStaffOnly ? undefined : handleCancel}
                loading={formLoading}
                user={user}
                existingAccounts={accounts}
                isEditingOwnAccount={editingAccount?.id === user?.id}
                isStaffView={isStaffOnly}
              />
            </div>
          )}

          {/* Only show table for superusers when form is not open */}
          {isSuperUser && !isFormOpen && (
            <div>
              {(isLoading || accounts.length > 0) && (
                <AccountTable
                  accounts={accounts}
                  loading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canModify={true}
                  canDelete={(account) => account.id !== user?.id} // superusers can delete any account except their own
                  currentUserId={user?.id}
                />
              )}

              {!isLoading && accounts.length === 0 && (
                <div className="text-center py-12 bg-surface rounded-lg">
                  <FaUser className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Accounts Found
                  </h3>
                  <p className="text-neutral mb-6">
                    Get started by creating your first user account.
                  </p>
                  <button
                    onClick={() => {
                      setEditingAccount(null);
                      setIsFormOpen(true);
                      clearError();
                    }}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all"
                  >
                    <FaPlus className="h-4 w-4 mr-2" />
                    Create Your First Account
                  </button>
                </div>
              )}
            </div>
          )}

          {isStaffOnly &&
            !isFormOpen &&
            accounts.length === 0 &&
            !isLoading && (
              <div className="text-center py-12 bg-surface rounded-lg">
                <FaUser className="h-16 w-16 text-neutral/40 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Account Information
                </h3>
                <p className="text-neutral mb-6">
                  Your account information will appear here.
                </p>
                <button
                  onClick={fetchAccounts}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all"
                >
                  Load Account Information
                </button>
              </div>
            )}
        </div>

        {isSuperUser && !isFormOpen && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                setEditingAccount(null);
                setIsFormOpen(true);
                clearError();
              }}
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all"
            >
              <FaPlus className="h-5 w-5 mr-2" />
              Add Account
            </button>
          </div>
        )}

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Delete Account"
          message="Are you sure you want to delete this account? This action cannot be undone."
          itemName={deletingAccount?.username}
          confirmText="Delete"
          cancelText="Cancel"
          loading={isLoading}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default AdminAccountsPage;
