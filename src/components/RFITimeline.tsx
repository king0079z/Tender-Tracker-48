import React, { useMemo, useState } from 'react';
import { Calendar, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate, calculateDaysRemaining, formatTimeRemaining } from '../utils/dateUtils';
import { useTimeline } from '../context/TimelineContext';
import { useTimeUpdate } from '../hooks/useTimeUpdate';

export default function RFITimeline() {
  const { timelines } = useTimeline();
  const now = useTimeUpdate(60000);
  const [isUpdatesExpanded, setIsUpdatesExpanded] = useState(false);
  const [isDeadlinesExpanded, setIsDeadlinesExpanded] = useState(false);
  
  const { upcomingDeadlines, recentUpdates } = useMemo(() => {
    const timelinesWithUpdates = timelines.filter(timeline => 
      timeline.rfiSent.date || 
      timeline.rfiDue.date || 
      timeline.offerReceived.date ||
      timeline.ndaReceived.date ||
      timeline.ndaSigned.date
    );

    const getLatestDate = (timeline: typeof timelines[0]) => {
      const dates = [
        timeline.ndaReceived.date,
        timeline.ndaSigned.date,
        timeline.rfiSent.date,
        timeline.rfiDue.date,
        timeline.offerReceived.date
      ].filter(Boolean) as Date[];
      return Math.max(...dates.map(d => new Date(d).getTime()));
    };

    const sortedByUpdate = [...timelinesWithUpdates].sort((a, b) => 
      getLatestDate(b) - getLatestDate(a)
    );

    const upcoming = timelines
      .filter(timeline => timeline.rfiDue.date && !timeline.rfiDue.isCompleted)
      .sort((a, b) => {
        const dateA = a.rfiDue.date ? new Date(a.rfiDue.date).getTime() : Infinity;
        const dateB = b.rfiDue.date ? new Date(b.rfiDue.date).getTime() : Infinity;
        return dateA - dateB;
      });

    return {
      upcomingDeadlines: upcoming,
      recentUpdates: sortedByUpdate
    };
  }, [timelines, now]);

  if (upcomingDeadlines.length === 0 && recentUpdates.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          No timeline data available yet
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recent Updates Panel */}
      <div className="bg-white shadow rounded-lg">
        <div 
          onClick={() => setIsUpdatesExpanded(!isUpdatesExpanded)}
          className="px-4 py-5 sm:px-6 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-900">Recent Updates</h2>
            {recentUpdates.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {recentUpdates.length}
              </span>
            )}
          </div>
          {isUpdatesExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        {/* Recent Updates Preview */}
        {!isUpdatesExpanded && recentUpdates.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {recentUpdates[0].companyName}
                </p>
                {getLatestMilestone(recentUpdates[0])}
              </div>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            {recentUpdates.length > 1 && (
              <p className="text-xs text-gray-500 mt-2">
                +{recentUpdates.length - 1} more updates
              </p>
            )}
          </div>
        )}

        {/* Recent Updates Expanded View */}
        {isUpdatesExpanded && (
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentUpdates.map((item) => (
                <li key={item.companyId} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.companyName}
                      </p>
                      {getLatestMilestone(item)}
                    </div>
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Upcoming Deadlines Panel */}
      <div className="bg-white shadow rounded-lg">
        <div 
          onClick={() => setIsDeadlinesExpanded(!isDeadlinesExpanded)}
          className="px-4 py-5 sm:px-6 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
            {upcomingDeadlines.length > 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {upcomingDeadlines.length}
              </span>
            )}
          </div>
          {isDeadlinesExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Deadlines Preview */}
        {!isDeadlinesExpanded && upcomingDeadlines.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {upcomingDeadlines[0].companyName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Due: {formatDate(upcomingDeadlines[0].rfiDue.date!)}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                calculateDaysRemaining(upcomingDeadlines[0].rfiDue.date!) < 0
                  ? 'bg-red-100 text-red-800'
                  : calculateDaysRemaining(upcomingDeadlines[0].rfiDue.date!) <= 3
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {formatTimeRemaining(calculateDaysRemaining(upcomingDeadlines[0].rfiDue.date!))}
              </span>
            </div>
            {upcomingDeadlines.length > 1 && (
              <p className="text-xs text-gray-500 mt-2">
                +{upcomingDeadlines.length - 1} more deadlines
              </p>
            )}
          </div>
        )}

        {/* Deadlines Expanded View */}
        {isDeadlinesExpanded && (
          <div className="border-t border-gray-200">
            {upcomingDeadlines.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {upcomingDeadlines.map((item) => {
                  const daysRemaining = item.rfiDue.date ? calculateDaysRemaining(item.rfiDue.date) : 0;
                  const isOverdue = daysRemaining < 0;
                  const isWarning = daysRemaining <= 3 && daysRemaining >= 0;
                  
                  return (
                    <li key={item.companyId} className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.companyName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {formatDate(item.rfiDue.date!)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isOverdue ? 'bg-red-100 text-red-800' :
                          isWarning ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {formatTimeRemaining(daysRemaining)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No upcoming deadlines
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getLatestMilestone(timeline: typeof timelines[0]) {
  const updates = [
    { date: timeline.offerReceived.date, text: 'Offer Received' },
    { date: timeline.rfiDue.date, text: 'RFI Due' },
    { date: timeline.rfiSent.date, text: 'RFI Sent' },
    { date: timeline.ndaSigned.date, text: 'NDA Signed' },
    { date: timeline.ndaReceived.date, text: 'NDA Received' }
  ].find(update => update.date);

  if (updates) {
    return (
      <p className="text-xs text-gray-500 mt-1">
        {updates.text}: {formatDate(updates.date)}
      </p>
    );
  }
  return null;
}