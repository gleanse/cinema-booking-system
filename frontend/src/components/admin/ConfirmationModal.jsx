import {
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaSpinner,
} from 'react-icons/fa';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  itemName = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !loading) {
      onClose();
    }
  };

  const variantStyles = {
    danger: {
      icon: <FaExclamationTriangle className="h-6 w-6 text-accent" />,
      iconBg: 'bg-accent/10',
      button: 'bg-accent hover:bg-accent/90 focus:ring-accent',
    },
    warning: {
      icon: <FaExclamationTriangle className="h-6 w-6 text-yellow-500" />,
      iconBg: 'bg-yellow-500/10',
      button: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    },
    info: {
      icon: <FaExclamationTriangle className="h-6 w-6 text-secondary" />,
      iconBg: 'bg-secondary/10',
      button: 'bg-secondary hover:bg-secondary/90 focus:ring-secondary',
    },
  };

  const { icon, iconBg, button } =
    variantStyles[variant] || variantStyles.danger;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleBackdropClick}
      >
        <div
          className="fixed inset-0 backdrop-blur-xs transition-opacity duration-300 opacity-0 bg-black/30 animate-fade-in"
          aria-hidden="true"
        />

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="relative inline-block align-bottom bg-background rounded-lg text-left overflow-hidden shadow-form transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-inputbrdr animate-scale-in">
          <div className="bg-background px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconBg} sm:mx-0 sm:h-10 sm:w-10`}
              >
                {icon}
              </div>

              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3
                  className="text-lg leading-6 font-semibold text-foreground"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-neutral">
                    {message}
                    {itemName && (
                      <>
                        {' '}
                        <span className="font-medium text-foreground">
                          "{itemName}"
                        </span>
                      </>
                    )}
                    ?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-footerbg px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              disabled={loading}
              className={`cursor-pointer w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm ${button} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
              onClick={onConfirm}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCheck className="-ml-1 mr-2 h-4 w-4" />
                  {confirmText}
                </>
              )}
            </button>
            <button
              type="button"
              disabled={loading}
              className="cursor-pointer mt-3 w-full inline-flex justify-center items-center rounded-md border border-inputbrdr shadow-sm px-4 py-2 bg-background text-base font-medium text-foreground hover:bg-neutral/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              onClick={onClose}
            >
              <FaTimes className="-ml-1 mr-2 h-4 w-4" />
              {cancelText}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
