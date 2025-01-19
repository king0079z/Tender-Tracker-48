import { CompanyTimeline } from '../types/milestones';

// Helper to create dates relative to today
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export const testTimelines: CompanyTimeline[] = [
  // Company with completed NDA process, RFI sent
  {
    companyId: '1',
    companyName: 'Accenture',
    ndaReceived: {
      id: '1-1',
      name: 'NDA Received',
      date: daysFromNow(-20),
      isCompleted: true
    },
    ndaSigned: {
      id: '1-2',
      name: 'NDA Signed',
      date: daysFromNow(-18),
      isCompleted: true
    },
    rfiSent: {
      id: '1-3',
      name: 'RFI Sent',
      date: daysFromNow(-15),
      isCompleted: true
    },
    rfiDue: {
      id: '1-4',
      name: 'RFI Due',
      date: daysFromNow(3), // Due in 3 days (should trigger warning)
      isCompleted: false
    },
    offerReceived: {
      id: '1-5',
      name: 'Offer Received',
      date: null,
      isCompleted: false
    }
  },
  // Company with overdue RFI
  {
    companyId: '2',
    companyName: 'BCG',
    ndaReceived: {
      id: '2-1',
      name: 'NDA Received',
      date: daysFromNow(-30),
      isCompleted: true
    },
    ndaSigned: {
      id: '2-2',
      name: 'NDA Signed',
      date: daysFromNow(-28),
      isCompleted: true
    },
    rfiSent: {
      id: '2-3',
      name: 'RFI Sent',
      date: daysFromNow(-20),
      isCompleted: true
    },
    rfiDue: {
      id: '2-4',
      name: 'RFI Due',
      date: daysFromNow(-2), // Overdue by 2 days
      isCompleted: false
    },
    offerReceived: {
      id: '2-5',
      name: 'Offer Received',
      date: null,
      isCompleted: false
    }
  },
  // Company in initial NDA phase
  {
    companyId: '3',
    companyName: 'Dell',
    ndaReceived: {
      id: '3-1',
      name: 'NDA Received',
      date: daysFromNow(-2),
      isCompleted: true
    },
    ndaSigned: {
      id: '3-2',
      name: 'NDA Signed',
      date: null,
      isCompleted: false
    },
    rfiSent: {
      id: '3-3',
      name: 'RFI Sent',
      date: null,
      isCompleted: false
    },
    rfiDue: {
      id: '3-4',
      name: 'RFI Due',
      date: null,
      isCompleted: false
    },
    offerReceived: {
      id: '3-5',
      name: 'Offer Received',
      date: null,
      isCompleted: false
    }
  }
];