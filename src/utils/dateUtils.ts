export const calculateDaysRemaining = (dueDate: Date | string | null): number => {
  if (!dueDate) return 0;
  
  // Create date objects and normalize to midnight UTC
  const dueDateObj = new Date(dueDate);
  dueDateObj.setUTCHours(0, 0, 0, 0);
  
  const nowObj = new Date();
  nowObj.setUTCHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = dueDateObj.getTime() - nowObj.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDate = (date: Date | string | null): string => {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const addDays = (date: Date | string, days: number): Date => {
  const dateObj = new Date(date);
  dateObj.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

export const isValidDate = (date: any): boolean => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

export const formatTimeRemaining = (daysRemaining: number | null): string => {
  if (daysRemaining === null) return '';
  if (daysRemaining < 0) {
    return `${Math.abs(daysRemaining)}d overdue`;
  }
  if (daysRemaining === 0) {
    return 'Due today';
  }
  return `${daysRemaining}d remaining`;
};