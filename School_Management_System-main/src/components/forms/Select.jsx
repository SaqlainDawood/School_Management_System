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
  helperText,
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
          {required && <span className="text-rose-500 ml-1" title="Required">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon className="text-base" aria-hidden="true" />
          </div>
        )}
        <select
          id={name}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all duration-150 outline-none appearance-none cursor-pointer
            ${Icon ? 'pl-10' : ''}
            pr-10
            ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-rose-900 dark:text-rose-200'
                : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-slate-900 dark:text-slate-100'
            }
            ${
              disabled
                ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-60'
                : 'bg-white dark:bg-[#111827]'
            }
          `}
          {...props}
        >
          {placeholder && (
            <option value="" className="bg-white dark:bg-[#111827] text-slate-500 dark:text-slate-400">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
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

export default Select;
