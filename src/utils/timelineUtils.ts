import { CompanyTimeline, MilestoneStatus } from '../types/milestones';
import { addDays, calculateDaysRemaining } from './dateUtils';

export const RFI_RESPONSE_DAYS = 18;

export const calculateRfiDueDate = (rfiSentDate: Date): Date => {
  return addDays(rfiSentDate, RFI_RESPONSE_DAYS);
};

export const shouldShowWarning = (dueDate: Date): boolean => {
  const warningDate = addDays(dueDate, -3);
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now >= warningDate && now < dueDate;
};

export const getMilestoneStatus = (
  date: Date | null,
  isCompleted: boolean,
  dueDate?: Date
): MilestoneStatus => {
  if (isCompleted) return 'completed';
  if (!date) return 'pending';
  if (dueDate) {
    const daysRemaining = calculateDaysRemaining(dueDate);
    if (daysRemaining < 0) return 'overdue';
    if (daysRemaining <= 3) return 'warning';
  }
  return 'pending';
};

export const hasAnyCompletedMilestone = (timeline: CompanyTimeline): boolean => {
  return (
    timeline.ndaReceived.isCompleted ||
    timeline.ndaSigned.isCompleted ||
    timeline.rfiSent.isCompleted ||
    timeline.rfiDue.isCompleted ||
    timeline.offerReceived.isCompleted
  );
};

export const getCompletedMilestonesCount = (timeline: CompanyTimeline): number => {
  return [
    timeline.ndaReceived,
    timeline.ndaSigned,
    timeline.rfiSent,
    timeline.rfiDue,
    timeline.offerReceived
  ].filter(milestone => milestone.isCompleted).length;
};

export const getLatestCompletedDate = (timeline: CompanyTimeline): Date | null => {
  const completedDates = [
    timeline.ndaReceived.isCompleted ? timeline.ndaReceived.date : null,
    timeline.ndaSigned.isCompleted ? timeline.ndaSigned.date : null,
    timeline.rfiSent.isCompleted ? timeline.rfiSent.date : null,
    timeline.rfiDue.isCompleted ? timeline.rfiDue.date : null,
    timeline.offerReceived.isCompleted ? timeline.offerReceived.date : null
  ].filter((date): date is Date => date !== null);

  return completedDates.length > 0 
    ? new Date(Math.max(...completedDates.map(d => new Date(d).getTime())))
    : null;
};

export const sortTimelines = (timelines: CompanyTimeline[]): CompanyTimeline[] => {
  return [...timelines].sort((a, b) => {
    // First, sort by offer received
    if (a.offerReceived.isCompleted !== b.offerReceived.isCompleted) {
      return b.offerReceived.isCompleted ? 1 : -1;
    }

    // Then by number of completed milestones
    const aCompletedCount = getCompletedMilestonesCount(a);
    const bCompletedCount = getCompletedMilestonesCount(b);
    if (aCompletedCount !== bCompletedCount) {
      return bCompletedCount - aCompletedCount;
    }

    // If same number of completed milestones, sort by latest completion date
    const aLatestDate = getLatestCompletedDate(a);
    const bLatestDate = getLatestCompletedDate(b);
    if (aLatestDate && bLatestDate) {
      return bLatestDate.getTime() - aLatestDate.getTime();
    }
    if (aLatestDate) return -1;
    if (bLatestDate) return 1;

    // If no completed milestones, sort by company name
    return a.companyName.localeCompare(b.companyName);
  });
};