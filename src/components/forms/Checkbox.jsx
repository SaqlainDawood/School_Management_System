import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  error,
  disabled,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={name}
        className={`flex items-center space-x-3 ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="relative">
          <input
            id={name}
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
              ${
                checked
                  ? 'bg-primary-600 border-primary-600'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${error ? 'border-red-500' : ''}
            `}
          >
            {checked && <FiCheck className="text-white text-sm" />}
          </div>
        </div>
        {label && (
          <span
            className={`text-sm ${
              disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {label}
          </span>
        )}
      </label>
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

export default Checkbox;