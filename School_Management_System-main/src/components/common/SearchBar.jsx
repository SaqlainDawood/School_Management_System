import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from '../../utils/helpers';

const SearchBar = ({
  onSearch,
  placeholder = 'Search records...',
  className = '',
  size = 'md',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearch = debounce((value) => {
    if (onSearch) onSearch(value);
  }, 250);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2 px-3.5 text-sm',
    lg: 'py-2.5 px-4 text-base',
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center bg-white dark:bg-[#1E293B] border rounded-lg transition-all duration-150 ${
          sizeClasses[size] || sizeClasses.md
        } ${
          isFocused
            ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-sm'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
        }`}
      >
        <FiSearch
          className={`mr-2.5 flex-shrink-0 transition-colors ${
            isFocused
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-400 dark:text-slate-500'
          }`}
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full p-0 leading-normal"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-1.5"
              aria-label="Clear search input"
            >
              <FiX className="text-sm" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchBar;
