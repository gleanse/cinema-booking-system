import {
  FaEdit,
  FaTrash,
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaSpinner,
} from 'react-icons/fa';

const AccountTable = ({
  accounts = [],
  loading = false,
  onEdit,
  onDelete,
  canModify = false,
  canDelete = false,
  currentUserId = null,
}) => {
  const handleEditClick = (account) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    onEdit(account);
  };

  const getRoleBadge = (account) => {
    if (account.is_superuser) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
          <FaUserTag className="h-3 w-3 mr-1" />
          Superuser
        </span>
      );
    } else if (account.is_staff) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
          <FaUserTag className="h-3 w-3 mr-1" />
          Staff
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral/20 text-neutral border border-neutral/30">
          <FaUser className="h-3 w-3 mr-1" />
          User
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s overflow-hidden">
        <div className="bg-primary bg-opacity-5 px-4 sm:px-6 py-3 border-b border-inputbrdr">
          <h3 className="text-lg font-medium text-white">Accounts</h3>
        </div>

        {/* MOBILE LOADING SKELETON */}
        <div className="block sm:hidden divide-y divide-inputbrdr">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="p-4">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-12 h-12 bg-neutral/20 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral/25 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-neutral/15 rounded animate-pulse w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-neutral/20 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <div className="h-6 w-6 bg-neutral/20 rounded animate-pulse"></div>
                <div className="h-6 w-6 bg-neutral/20 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP LOADING SKELETON */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary bg-opacity-5">
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-24"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-32"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-20"></div>
                </th>
                <th className="px-6 py-3 text-right">
                  <div className="h-3 bg-neutral/20 rounded animate-pulse w-16 ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inputbrdr">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-neutral/20 rounded-full mr-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-neutral/25 rounded w-32"></div>
                        <div className="h-3 bg-neutral/20 rounded w-24"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral/20 rounded w-40"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-16 bg-neutral/20 rounded"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="h-6 w-6 bg-neutral/20 rounded"></div>
                      <div className="h-6 w-6 bg-neutral/20 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center py-4 border-t border-inputbrdr">
          <FaSpinner className="h-4 w-4 text-primary animate-spin mr-2" />
          <span className="text-sm text-neutral">Loading accounts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-inputbrdr rounded-lg shadow-form-s overflow-hidden">
      <div className="bg-primary bg-opacity-5 px-4 sm:px-6 py-3 border-b border-inputbrdr">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Accounts</h3>
          <span className="text-sm text-white">
            {accounts.length} total account{accounts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="block sm:hidden divide-y divide-inputbrdr">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="p-4 hover:bg-footerbg hover:bg-opacity-3 transition-colors"
          >
            <div className="flex items-start space-x-3 mb-3">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 border border-primary/30">
                <FaUser className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {account.username}
                </h4>
                <div className="flex items-center text-xs text-neutral mt-1">
                  <FaEnvelope className="h-3 w-3 mr-1" />
                  <span className="truncate">{account.email}</span>
                </div>
                {account.first_name || account.last_name ? (
                  <div className="text-xs text-neutral mt-1">
                    {account.first_name} {account.last_name}
                  </div>
                ) : null}
                <div className="flex gap-2 mt-2">{getRoleBadge(account)}</div>
              </div>
            </div>

            {(canModify || canDelete) && (
              <div className="flex items-center justify-end space-x-2">
                {canModify && (
                  <button
                    onClick={() => handleEditClick(account)}
                    className="p-2 transition-all duration-200 rounded-md active:scale-95 text-neutral hover:text-editicon hover:bg-neutral/5"
                    title="Edit account"
                  >
                    <FaEdit className="h-4 w-4" />
                  </button>
                )}
                {canDelete && account.id !== currentUserId && (
                  <button
                    onClick={() => onDelete(account)}
                    className="p-2 transition-all duration-200 rounded-md active:scale-95 text-neutral hover:text-accent hover:bg-accent/5"
                    title="Delete account"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary bg-opacity-5">
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Role
              </th>
              {(canModify || canDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-inputbrdr">
            {accounts.map((account) => (
              <tr
                key={account.id}
                className="hover:bg-footerbg hover:bg-opacity-5 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mr-4 border border-primary/30">
                      <FaUser className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {account.username}
                      </div>
                      {(account.first_name || account.last_name) && (
                        <div className="text-sm text-neutral">
                          {account.first_name} {account.last_name}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-foreground">
                    <FaEnvelope className="h-4 w-4 mr-2 text-neutral" />
                    {account.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(account)}
                </td>
                {(canModify || canDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {canModify && (
                        <button
                          onClick={() => handleEditClick(account)}
                          className="transition-all duration-200 p-2 rounded-md active:scale-95 text-neutral hover:text-editicon hover:bg-neutral/5"
                          title="Edit account"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && account.id !== currentUserId && (
                        <button
                          onClick={() => onDelete(account)}
                          className="transition-all duration-200 p-2 rounded-md active:scale-95 text-neutral hover:text-accent hover:bg-accent/5"
                          title="Delete account"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountTable;
