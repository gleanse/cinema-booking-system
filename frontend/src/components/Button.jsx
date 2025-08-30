const Button = ({
  children,
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  className = '',
}) => {
  const baseClasses =
    'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

  const variants = {
    primary:
      'text-white bg-primary hover:bg-primary/90 focus:ring-primary disabled:bg-primary/60',
    secondary:
      'text-primary bg-secondary hover:bg-secondary/80 focus:ring-secondary disabled:bg-secondary/60',
    accent:
      'text-white bg-accent hover:bg-accent/90 focus:ring-accent disabled:bg-accent/60',
    neutral:
      'text-white bg-neutral hover:bg-neutral/80 focus:ring-neutral disabled:bg-neutral/60',
    outline:
      'text-primary bg-transparent border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary disabled:border-primary/40 disabled:text-primary/40',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };

  const classes = `${baseClasses} ${variants[variant]} ${
    sizes[size]
  } ${className} ${
    disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'
  }`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
