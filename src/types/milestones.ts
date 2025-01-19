export interface Milestone {
  id: string;
  name: string;
  date: Date | null;
  isCompleted: boolean;
}

export interface CompanyTimeline {
  companyId: string;
  ndaReceived: Milestone;
  ndaSigned: Milestone;
  rfiSent: Milestone;
  rfiDue: Milestone;
  offerReceived: Milestone;
}

export type MilestoneStatus = 'pending' | 'completed' | 'warning' | 'overdue';