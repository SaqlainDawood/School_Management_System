/**
 * Format date
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Rs. 0';
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Truncate text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get status color
 */
export const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning',
    completed: 'success',
    cancelled: 'danger',
    paid: 'success',
    unpaid: 'danger',
    overdue: 'danger',
    present: 'success',
    absent: 'danger',
    late: 'warning',
    excused: 'info',
    pass: 'success',
    fail: 'danger',
    submitted: 'info',
    graded: 'success',
    draft: 'warning',
    published: 'success',
    ongoing: 'info',
    partial: 'warning',
    waived: 'info',
  };
  return colors[status] || 'info';
};

/**
 * Get status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    paid: 'Paid',
    unpaid: 'Unpaid',
    overdue: 'Overdue',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    excused: 'Excused',
    pass: 'Pass',
    fail: 'Fail',
    submitted: 'Submitted',
    graded: 'Graded',
    draft: 'Draft',
    published: 'Published',
    ongoing: 'Ongoing',
    partial: 'Partial',
    waived: 'Waived',
  };
  return labels[status] || status;
};

/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return 'N/A';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get greeting based on time
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

/**
 * Calculate Grade from percentage
 */
export const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C+';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

/**
 * Calculate GPA from Grade
 */
export const calculateGPA = (grade) => {
  const grades = {
    'A+': 4.0,
    A: 3.7,
    'B+': 3.3,
    B: 3.0,
    'C+': 2.3,
    C: 2.0,
    D: 1.0,
    F: 0.0,
  };
  return grades[grade] || 0;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (obtained, total) => {
  if (total === 0) return 0;
  return ((obtained / total) * 100).toFixed(2);
};

/**
 * Class names utility
 */
export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
};

/**
 * Download file
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if string is valid JSON
 */
export const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Generate random ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

/**
 * Get grade badge color
 */
export const getGradeColor = (grade) => {
  const colors = {
    'A+': 'success',
    A: 'success',
    'B+': 'info',
    B: 'info',
    'C+': 'warning',
    C: 'warning',
    D: 'danger',
    F: 'danger',
  };
  return colors[grade] || 'info';
};

export default {
  formatDate,
  formatDateTime,
  formatCurrency,
  truncateText,
  getInitials,
  getStatusColor,
  getStatusLabel,
  calculateAge,
  debounce,
  getGreeting,
  calculateGrade,
  calculateGPA,
  calculatePercentage,
  classNames,
  copyToClipboard,
  downloadFile,
  getFileExtension,
  formatFileSize,
  isValidJSON,
  generateId,
  getGradeColor,
};