import { useEffect } from 'react';
import { CompanyTimeline } from '../types/milestones';
import { generateNotifications } from '../utils/notificationUtils';

export function useNotificationUpdates(
  timelines: CompanyTimeline[],
  onUpdate: (notifications: ReturnType<typeof generateNotifications>) => void
) {
  useEffect(() => {
    const notifications = generateNotifications(timelines);
    onUpdate(notifications);
  }, [timelines, onUpdate]);
}