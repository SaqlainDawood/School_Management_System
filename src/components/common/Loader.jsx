import React from 'react';

const Loader = ({ size = 'medium', color = 'primary', label = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-[3px]',
    large: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-indigo-600 border-t-transparent',
    secondary: 'border-slate-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-slate-400 border-t-transparent',
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[160px] p-6 space-y-3"
      role="status"
      aria-live="polite"
    >
      <div
        className={`${sizeClasses[size] || sizeClasses.medium} rounded-full animate-spin ${colorClasses[color] || colorClasses.primary}`}
      />
      {label && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
};

export default Loader;
