const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`text-normal bg-inputbg mt-1 block w-full px-3 py-3 md:py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-base md:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? 'border-accent' : 'border-inputbrdr'
        }`}
      />
      {error && <p className="mt-1 text-sm text-accent-600">{error}</p>}
    </div>
  );
};

export default Input;
