import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from '../../utils/helpers';

const SearchBar = ({
  onSearch,
  placeholder = 'Search...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearch = debounce((value) => {
    onSearch(value);
  }, 300);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2 transition-all duration-200 ${
          isFocused ? 'ring-2 ring-primary-500 shadow-sm' : ''
        }`}
      >
        <FiSearch
          className={`text-gray-400 transition-colors ${
            isFocused ? 'text-primary-500' : ''
          }`}
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="bg-transparent border-none focus:outline-none px-3 py-1 text-gray-700 dark:text-gray-200 w-full"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FiX className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchBar;