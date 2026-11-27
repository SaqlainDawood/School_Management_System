import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumbs = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 ${className}`}>
      <ol className="flex items-center space-x-1.5 flex-wrap">
        <li>
          <Link
            to="/"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center"
            title="Home"
          >
            <FiHome className="text-sm" />
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-1.5">
              <FiChevronRight className="text-slate-400 text-xs flex-shrink-0" aria-hidden="true" />
              {isLast || !item.to ? (
                <span
                  className="text-slate-800 dark:text-slate-200 font-semibold"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

