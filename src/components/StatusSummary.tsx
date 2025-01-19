import React from 'react';
import { Users, Clock, AlertCircle } from 'lucide-react';
import { useTimeline } from '../context/TimelineContext';
import { calculateStatusCounts } from '../utils/statusUtils';

export default function StatusSummary() {
  const { timelines } = useTimeline();
  const counts = calculateStatusCounts(timelines);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          <div className="ml-3 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Bidders</p>
            <p className="text-lg sm:text-2xl font-semibold text-gray-900">{counts.totalBidders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center">
          <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          <div className="ml-3 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Active Vendors</p>
            <p className="text-lg sm:text-2xl font-semibold text-gray-900">{counts.activeVendors}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
          <div className="ml-3 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Responses</p>
            <p className="text-lg sm:text-2xl font-semibold text-gray-900">{counts.pendingResponses}</p>
          </div>
        </div>
      </div>
    </div>
  );
}