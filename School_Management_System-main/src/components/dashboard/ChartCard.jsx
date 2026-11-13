import React from 'react';

const ChartCard = ({
  title,
  icon: Icon,
  children,
  subtitle,
  action,
  className = '',
  height = 'min-h-[280px]',
}) => {
  return (
    <div
      className={`card p-5 sm:p-6 flex flex-col ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5 min-w-0">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Icon className="text-base" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
      <div className={`w-full flex-1 ${height}`}>{children}</div>
    </div>
  );
};

export default ChartCard;
