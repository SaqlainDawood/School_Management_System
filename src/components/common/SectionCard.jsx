import React from 'react';

const SectionCard = ({
  title,
  subtitle,
  actions,
  children,
  className = '',
  bodyClassName = 'p-5 sm:p-6',
  headerClassName = 'px-5 py-4 border-b border-slate-100 dark:border-slate-800/80',
  footer,
  footerClassName = 'px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20',
  noPadding = false,
}) => {
  return (
    <section className={`card overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className={`flex items-center justify-between gap-4 ${headerClassName}`}>
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={noPadding ? '' : bodyClassName}>
        {children}
      </div>
      {footer && (
        <div className={footerClassName}>
          {footer}
        </div>
      )}
    </section>
  );
};

export default SectionCard;

