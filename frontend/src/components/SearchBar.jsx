import { useState, useEffect } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import { FaSpinner } from 'react-icons/fa';

const SearchBar = ({
  onSearch,
  isSearching = false,
  placeholder = 'Search movies...',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  // DEBOUNCED search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <FaSpinner className="h-5 w-5 text-primary animate-spin mr-2" />
          ) : (
            <HiOutlineMagnifyingGlass className="h-4 w-4 sm:h-5 sm:w-5 text-neutral" />
          )}
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="block w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-3 sm:py-2 border border-inputbrdr rounded-lg bg-inputbg text-foreground placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm sm:text-base"
        />

        {/* clear button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-neutral hover:text-foreground transition-colors"
          >
            <HiOutlineXMark className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        )}
      </div>

      {/* search results count/status */}
      {searchTerm && (
        <div className="absolute left-0 top-full mt-1">
          <div className="text-xs text-neutral">
            {isSearching ? <span>Searching...</span> : null}
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
