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
  description,
  ...props
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      <label
        htmlFor={name}
        className={`flex items-start gap-3 select-none ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        }`}
      >
        <div className="relative flex items-center mt-0.5">
          <input
            id={name}
            type="checkbox"
            name={name}
            checked={!!checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-150
              ${
                checked
                  ? 'bg-indigo-600 border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-400'
              }
              ${error ? 'border-rose-500' : ''}
            `}
          >
            {checked && <FiCheck className="text-white text-xs stroke-[3]" />}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Checkbox;
