import { CompanyTimeline } from '../types/milestones';
import { companies } from './companies';

// Create timeline data for all companies
export const vendors: CompanyTimeline[] = companies.map(company => ({
  companyId: company.id,
  companyName: company.name,
  ndaReceived: {
    id: `${company.id}-1`,
    name: 'NDA Received',
    date: null,
    isCompleted: false
  },
  ndaSigned: {
    id: `${company.id}-2`,
    name: 'NDA Signed',
    date: null,
    isCompleted: false
  },
  rfiSent: {
    id: `${company.id}-3`,
    name: 'RFI Sent',
    date: null,
    isCompleted: false
  },
  rfiDue: {
    id: `${company.id}-4`,
    name: 'RFI Due',
    date: null,
    isCompleted: false
  },
  offerReceived: {
    id: `${company.id}-5`,
    name: 'Offer Received',
    date: null,
    isCompleted: false
  }
}));