import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TextArea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required,
  disabled,
  rows = 4,
  className = '',
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);

  useEffect(() => {
    setCharCount(value?.length || 0);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    onChange(e);
  };

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
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 outline-none resize-y
          ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : isFocused
              ? 'border-primary-500 ring-2 ring-primary-500/20'
              : 'border-gray-300 dark:border-gray-600'
          }
          ${
            disabled
              ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60'
              : 'bg-white dark:bg-gray-700'
          }
          text-gray-900 dark:text-white
        `}
      />
      {maxLength && (
        <div className="flex justify-end mt-1">
          <span
            className={`text-xs ${
              charCount > maxLength ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {charCount} / {maxLength}
          </span>
        </div>
      )}
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

export default TextArea;