import React from 'react';

const statusConfig = {
  // General status
  active: { label: 'Active', variant: 'success', dot: true },
  inactive: { label: 'Inactive', variant: 'secondary', dot: true },
  pending: { label: 'Pending', variant: 'warning', dot: true },
  suspended: { label: 'Suspended', variant: 'danger', dot: true },
  archived: { label: 'Archived', variant: 'secondary', dot: false },

  // Attendance
  present: { label: 'Present', variant: 'success', dot: true },
  absent: { label: 'Absent', variant: 'danger', dot: true },
  late: { label: 'Late', variant: 'warning', dot: true },
  excused: { label: 'Excused', variant: 'info', dot: false },
  holiday: { label: 'Holiday', variant: 'secondary', dot: false },
  'not logged': { label: 'Not Logged', variant: 'secondary', dot: false },
  unmarked: { label: 'Unmarked', variant: 'secondary', dot: false },

  // Fees & Finance
  paid: { label: 'Paid', variant: 'success', dot: true },
  unpaid: { label: 'Unpaid', variant: 'danger', dot: true },
  overdue: { label: 'Overdue', variant: 'danger', dot: true },
  partial: { label: 'Partial', variant: 'warning', dot: true },
  waived: { label: 'Waived', variant: 'info', dot: false },

  // Exams & Results
  draft: { label: 'Draft', variant: 'secondary', dot: false },
  published: { label: 'Published', variant: 'success', dot: true },
  ongoing: { label: 'Ongoing', variant: 'info', dot: true },
  scheduled: { label: 'Scheduled', variant: 'info', dot: true },
  upcoming: { label: 'Upcoming', variant: 'info', dot: true },
  completed: { label: 'Completed', variant: 'success', dot: false },
  concluded: { label: 'Concluded', variant: 'success', dot: false },
  cancelled: { label: 'Cancelled', variant: 'danger', dot: false },
  pass: { label: 'Pass', variant: 'success', dot: false },
  fail: { label: 'Fail', variant: 'danger', dot: false },

  // Academic Enrollment
  enrolled: { label: 'Enrolled', variant: 'success', dot: true },
  graduated: { label: 'Graduated', variant: 'info', dot: false },
  transferred: { label: 'Transferred', variant: 'secondary', dot: false },
  withdrawn: { label: 'Withdrawn', variant: 'danger', dot: false },

  // Transport & Operations
  maintenance: { label: 'Maintenance', variant: 'warning', dot: true },
  urgent: { label: 'Urgent', variant: 'danger', dot: true },
  high: { label: 'High', variant: 'warning', dot: true },
  medium: { label: 'Medium', variant: 'info', dot: false },
  low: { label: 'Low', variant: 'secondary', dot: false },
};

const StatusBadge = ({
  status,
  children,
  label: customLabel,
  variant: customVariant,
  dot: customDot,
  size = 'md',
  className = '',
}) => {
  // Normalize status key
  let normalizedKey = '';
  if (typeof status === 'boolean') {
    normalizedKey = status ? 'active' : 'inactive';
  } else if (typeof status === 'string') {
    normalizedKey = status.trim().toLowerCase();
  } else if (children && typeof children === 'string') {
    normalizedKey = children.trim().toLowerCase();
  } else if (customLabel && typeof customLabel === 'string') {
    normalizedKey = customLabel.trim().toLowerCase();
  }

  // Look up config from known dictionary
  const matchedConfig = statusConfig[normalizedKey];

  // Resolve display label
  let displayLabel =
    children !== undefined && children !== null && children !== ''
      ? children
      : customLabel !== undefined && customLabel !== null && customLabel !== ''
      ? customLabel
      : matchedConfig?.label || (typeof status === 'string' && status.trim() ? status : 'Unknown');

  // If displayLabel is still empty or evaluates to unknown, force neutral styling
  const isUnknown =
    !displayLabel ||
    String(displayLabel).toLowerCase() === 'unknown' ||
    String(displayLabel).toLowerCase() === 'undefined';

  if (isUnknown) {
    displayLabel = 'Unknown';
  }

  // Resolve variant:
  // If unknown, NEVER show a misleading green/red dot; use neutral/secondary variant
  let variant = isUnknown
    ? 'secondary'
    : customVariant || matchedConfig?.variant || 'secondary';

  // Normalize 'neutral' to 'secondary' for CSS class compatibility
  if (variant === 'neutral') {
    variant = 'secondary';
  }

  // Resolve dot:
  // If unknown, hide dot
  const showDot = isUnknown
    ? false
    : customDot !== undefined
    ? customDot
    : matchedConfig?.dot !== undefined
    ? matchedConfig.dot
    : false;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    primary: 'bg-indigo-500',
    secondary: 'bg-slate-400',
  };

  return (
    <span
      className={`badge badge-${variant} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-current'} flex-shrink-0`}
          aria-hidden="true"
        />
      )}
      <span className="capitalize">{displayLabel}</span>
    </span>
  );
};

export default StatusBadge;
