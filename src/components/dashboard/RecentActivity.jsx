import React from 'react';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import EmptyState from '../common/EmptyState';

const typeColors = {
  student:    'bg-indigo-500',
  assignment: 'bg-emerald-500',
  fee:        'bg-amber-500',
  result:     'bg-purple-500',
  attendance: 'bg-indigo-600',
  exam:       'bg-rose-500',
  notice:     'bg-amber-500',
  default:    'bg-slate-400',
};

const RecentActivity = ({ items, showViewAll = true, onViewAll }) => {
  const hasItems = Array.isArray(items) && items.length > 0;

  if (!hasItems) {
    return (
      <EmptyState
        icon={FiClock}
        title="No recent activity"
        description="Activity will appear here as things happen in the system."
      />
    );
  }

  return (
    <div className="space-y-1">
      {items.map((activity) => {
        const dotColor = typeColors[activity.type] || typeColors.default;
        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            {/* Colored dot */}
            <div className="mt-1.5 flex-shrink-0">
              <span className={`block w-2 h-2 rounded-full ${dotColor}`} />
            </div>

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">
                {activity.message}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <FiClock className="w-3 h-3 flex-shrink-0" />
                {activity.time}
              </p>
            </div>
          </div>
        );
      })}

      {showViewAll && (
        <div className="pt-3 mt-1 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onViewAll}
            className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            View all activities
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
