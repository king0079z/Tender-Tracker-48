export type NotificationType = 'warning' | 'overdue' | 'info' | 'email';

export interface Notification {
  id: string;
  type: NotificationType;
  companyName: string;
  message: string;
  date: Date;
  updatedBy?: string;
}