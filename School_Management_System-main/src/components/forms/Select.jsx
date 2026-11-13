import React from 'react';
import { motion } from 'framer-motion';

const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  options = [],
  placeholder,
  required,
  disabled,
  className = '',
  icon: Icon,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="text-lg" />
          </div>
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 outline-none appearance-none
            ${Icon ? 'pl-10' : ''}
            ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            }
            ${
              disabled
                ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60'
                : 'bg-white dark:bg-gray-700'
            }
            text-gray-900 dark:text-white
          `}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Select;