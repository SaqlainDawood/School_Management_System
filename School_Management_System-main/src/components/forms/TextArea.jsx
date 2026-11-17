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
  helperText,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);

  useEffect(() => {
    setCharCount(value?.length || 0);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    if (onChange) onChange(e);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={name}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && <span className="text-rose-500 ml-1" title="Required">*</span>}
          </label>
          {maxLength && (
            <span
              className={`text-xs ${
                charCount > maxLength
                  ? 'text-rose-500 font-semibold'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {charCount} / {maxLength}
            </span>
          )}
        </div>
      )}
      <textarea
        id={name}
        name={name}
        value={value ?? ''}
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
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all duration-150 outline-none resize-y
          ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-rose-900 dark:text-rose-200'
              : isFocused
              ? 'border-indigo-600 ring-2 ring-indigo-600/20 text-slate-900 dark:text-slate-100'
              : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
          }
          ${
            disabled
              ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-60'
              : 'bg-white dark:bg-[#111827]'
          }
          placeholder:text-slate-400 dark:placeholder:text-slate-500
        `}
        {...props}
      />
      {error && (
        <motion.p
          id={`${name}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
        >
          {error}
        </motion.p>
      )}
      {!error && helperText && (
        <p id={`${name}-helper`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default TextArea;
