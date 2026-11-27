import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const variantClasses = {
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    text: 'rounded h-4 my-1',
  };

  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      style={style}
      className={`animate-pulse bg-slate-200 dark:bg-slate-700/60 ${variantClasses[variant] || 'rounded-lg'} ${className}`}
      aria-hidden="true"
    />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="w-full space-y-3 p-4">
    <div className="flex gap-4 mb-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-6 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4 items-center py-2 border-b border-slate-100 dark:border-slate-800">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-5 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const StatsCardSkeleton = () => (
  <div className="card p-6">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton variant="circular" className="w-12 h-12" />
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-8 w-20" />
    </div>
    <Skeleton className="h-40 w-full" />
  </div>
);

export default Skeleton;

