import React from 'react';
import TimelineItem from './TimelineItem';
import { CompanyTimeline as Timeline } from '../types/milestones';
import { getMilestoneStatus } from '../utils/timelineUtils';

interface CompanyTimelineProps {
  timeline: Timeline;
  isAdmin?: boolean;
}

export default function CompanyTimeline({ timeline, isAdmin = false }: CompanyTimelineProps) {
  return (
    <div className="space-y-2">
      <TimelineItem
        milestone={timeline.ndaReceived}
        status={getMilestoneStatus(timeline.ndaReceived.date, timeline.ndaReceived.isCompleted)}
      />
      <div className="w-0.5 h-3 bg-gray-200 ml-[11px]" />
      <TimelineItem
        milestone={timeline.ndaSigned}
        status={getMilestoneStatus(timeline.ndaSigned.date, timeline.ndaSigned.isCompleted)}
      />
      <div className="w-0.5 h-3 bg-gray-200 ml-[11px]" />
      <TimelineItem
        milestone={timeline.rfiSent}
        status={getMilestoneStatus(timeline.rfiSent.date, timeline.rfiSent.isCompleted)}
        showEmailHistory={true}
        companyId={timeline.companyId}
        companyName={timeline.companyName}
        isAdmin={isAdmin}
      />
      <div className="w-0.5 h-3 bg-gray-200 ml-[11px]" />
      <TimelineItem
        milestone={timeline.rfiDue}
        status={getMilestoneStatus(
          timeline.rfiDue.date,
          timeline.rfiDue.isCompleted,
          timeline.rfiDue.date || undefined
        )}
        isRfiDue={true}
      />
      <div className="w-0.5 h-3 bg-gray-200 ml-[11px]" />
      <TimelineItem
        milestone={timeline.offerReceived}
        status={getMilestoneStatus(
          timeline.offerReceived.date,
          timeline.offerReceived.isCompleted,
          timeline.rfiDue.date || undefined
        )}
      />
    </div>
  );
}