import React from 'react';
import { TableSkeleton } from './Skeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items to display matching your criteria.',
  emptyAction,
  rowKey = '_id',
  onRowClick,
  className = '',
}) => {
  if (loading) {
    return (
      <div className="card overflow-hidden">
        <TableSkeleton rows={5} cols={columns.length || 4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load records"
          message={typeof error === 'string' ? error : 'Unable to retrieve table data from the server.'}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#162033]">
          {data.map((row, rowIdx) => {
            const key = typeof rowKey === 'function' ? rowKey(row) : (row[rowKey] || rowIdx);
            return (
              <tr
                key={key}
                onClick={() => onRowClick && onRowClick(row)}
                className={`group transition-colors duration-100 ${
                  onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={`py-3.5 px-4 text-slate-700 dark:text-slate-300 ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    } ${col.cellClassName || ''}`}
                  >
                    {col.render ? col.render(row[col.key], row, rowIdx) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

