import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { Skeleton } from '../common/Skeleton';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection,
  trendLabel = 'from last period',
  color = 'primary',
  subtitle,
  loading = false,
  className = '',
  onClick,
}) => {
  const colorVariants = {
    primary: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
    },
    secondary: {
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
    },
    danger: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
    },
    info: {
      bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/50',
    },
  };

  const scheme = colorVariants[color] || colorVariants.primary;

  if (loading) {
    return (
      <div className={`card p-5 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-7 w-28" />
          </div>
          <Skeleton variant="circular" className="w-10 h-10" />
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  const displayValue = value !== undefined && value !== null && value !== '' ? value : '—';

  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : undefined}
      onClick={onClick}
      className={`card p-5 ${onClick ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700' : ''} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1 truncate">
            {displayValue}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border flex-shrink-0 ${scheme.bg}`}>
            <Icon className="text-xl" aria-hidden="true" />
          </div>
        )}
      </div>

      {trend !== undefined && trend !== null && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <span
            className={`font-semibold inline-flex items-center ${
              trendDirection === 'up'
                ? 'text-emerald-600 dark:text-emerald-400'
                : trendDirection === 'down'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {trendDirection === 'up' && <FiTrendingUp className="mr-0.5" />}
            {trendDirection === 'down' && <FiTrendingDown className="mr-0.5" />}
            {trendDirection === 'neutral' && <FiMinus className="mr-0.5" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-slate-400 dark:text-slate-500 truncate">
            {trendLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
