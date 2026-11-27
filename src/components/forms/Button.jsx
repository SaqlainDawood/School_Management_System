import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  title,
  ariaLabel,
  ...props
}) => {
  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 border border-transparent',
    secondary:
      'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-subtle focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    success:
      'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm focus:ring-emerald-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 border border-transparent',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm focus:ring-rose-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 border border-transparent',
    warning:
      'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-sm focus:ring-amber-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 border border-transparent',
    outline:
      'border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 active:bg-indigo-100 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 bg-transparent',
    ghost:
      'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 active:bg-slate-200 bg-transparent border border-transparent focus:ring-indigo-600 focus:ring-offset-1 dark:focus:ring-offset-slate-900',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs rounded-md font-medium',
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
    md: 'px-4 py-2 text-sm font-semibold rounded-lg',
    lg: 'px-5 py-2.5 text-base font-semibold rounded-xl',
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-150
    focus:outline-none focus:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none
    ${fullWidth ? 'w-full' : ''}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${className}
  `;

  return (
    <motion.button
      whileTap={{ scale: !disabled && !loading ? 0.98 : 1 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel || title}
      title={title}
      className={baseClasses}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className="mr-2 text-base flex-shrink-0" aria-hidden="true" />
          )}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className="ml-2 text-base flex-shrink-0" aria-hidden="true" />
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;
