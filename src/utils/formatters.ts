import { CompanyTimeline } from '../types/milestones';

export function formatTimelineData(item: any): CompanyTimeline {
  return {
    companyId: item.company_id,
    companyName: item.company_name,
    ndaReceived: {
      id: `${item.company_id}-1`,
      name: 'NDA Received',
      date: item.nda_received_date,
      isCompleted: item.nda_received_completed
    },
    ndaSigned: {
      id: `${item.company_id}-2`,
      name: 'NDA Signed',
      date: item.nda_signed_date,
      isCompleted: item.nda_signed_completed
    },
    rfiSent: {
      id: `${item.company_id}-3`,
      name: 'RFI Sent',
      date: item.rfi_sent_date,
      isCompleted: item.rfi_sent_completed
    },
    rfiDue: {
      id: `${item.company_id}-4`,
      name: 'RFI Due',
      date: item.rfi_due_date,
      isCompleted: item.rfi_due_completed
    },
    offerReceived: {
      id: `${item.company_id}-5`,
      name: 'Offer Received',
      date: item.offer_received_date,
      isCompleted: item.offer_received_completed
    }
  };
}