export interface Bidder {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  rfiSentDate?: Date;
  rfiDueDate?: Date;
  lastUpdate: Date;
}

export interface RFIStatus {
  bidder: string;
  sentDate: Date;
  dueDate: Date;
  daysRemaining: number;
  status: 'on_time' | 'delayed' | 'completed';
}