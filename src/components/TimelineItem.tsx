import React from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { Milestone, MilestoneStatus } from '../types/milestones';
import { formatDate, calculateDaysRemaining, formatTimeRemaining } from '../utils/dateUtils';
import { useTimeUpdate } from '../hooks/useTimeUpdate';
import EmailHistory from './EmailHistory';
import MeetingButton from './MeetingButton';

interface TimelineItemProps {
  milestone: Milestone;
  status: MilestoneStatus;
  isRfiDue?: boolean;
  showEmailHistory?: boolean;
  companyId?: string;
  companyName?: string;
  isAdmin?: boolean;
}

const statusConfig = {
  pending: { 
    icon: Clock, 
    className: 'text-gray-400',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  },
  completed: { 
    icon: CheckCircle, 
    className: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  warning: { 
    icon: AlertTriangle, 
    className: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  overdue: { 
    icon: XCircle, 
    className: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
};

export default function TimelineItem({ 
  milestone, 
  status, 
  isRfiDue = false,
  showEmailHistory = false,
  companyId,
  companyName,
  isAdmin = false
}: TimelineItemProps) {
  const now = useTimeUpdate(60000);
  const StatusIcon = statusConfig[status].icon;
  const daysRemaining = milestone.date ? calculateDaysRemaining(milestone.date) : null;
  
  return (
    <div className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border text-sm ${statusConfig[status].borderColor} ${statusConfig[status].bgColor}`}>
      <StatusIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${statusConfig[status].className}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{milestone.name}</p>
          {isRfiDue && daysRemaining !== null && !milestone.isCompleted && (
            <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-medium rounded-full whitespace-nowrap
              ${status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                status === 'overdue' ? 'bg-red-100 text-red-800' : 
                'bg-green-100 text-green-800'}`}>
              {formatTimeRemaining(daysRemaining)}
            </span>
          )}
        </div>
        {milestone.date && (
          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">{formatDate(milestone.date)}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {showEmailHistory && companyId && companyName && (
          <>
            <EmailHistory 
              companyId={companyId}
              companyName={companyName}
              isAdmin={isAdmin}
            />
            <MeetingButton
              companyId={companyId}
              companyName={companyName}
              disabled={!milestone.isCompleted}
            />
          </>
        )}
      </div>
    </div>
  );
}