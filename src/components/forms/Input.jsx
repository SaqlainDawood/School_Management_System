import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  helperText,
  placeholder,
  required,
  disabled,
  readOnly,
  className = '',
  icon: Icon,
  rightElement,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

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
        <input
          id={name}
          name={name}
          type={inputType}
          value={value ?? ''}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all duration-150 outline-none
            ${Icon ? 'pl-10' : ''}
            ${type === 'password' || rightElement ? 'pr-10' : ''}
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
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          >
            {showPassword ? (
              <FiEyeOff className="text-base" />
            ) : (
              <FiEye className="text-base" />
            )}
          </button>
        )}
        {rightElement && type !== 'password' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <motion.p
          id={`${name}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1"
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

export default Input;
