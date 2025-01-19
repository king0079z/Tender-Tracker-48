import { CompanyTimeline } from '../types/milestones';
import { hasAnyCompletedMilestone } from './timelineUtils';
import { companies } from '../data/companies';

export interface StatusCounts {
  totalBidders: number;
  activeVendors: number;
  pendingResponses: number;
}

export const calculateStatusCounts = (timelines: CompanyTimeline[]): StatusCounts => {
  // Filter timelines to only include companies that exist in the companies list
  const validTimelines = timelines.filter(timeline => 
    companies.some(company => company.id === timeline.companyId)
  );

  const activeVendors = validTimelines.filter(timeline => 
    hasAnyCompletedMilestone(timeline)
  ).length;

  return {
    totalBidders: companies.length, // Use the actual number of companies
    activeVendors,
    pendingResponses: companies.length - activeVendors
  };
};