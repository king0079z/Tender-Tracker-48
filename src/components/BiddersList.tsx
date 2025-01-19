import React, { useState } from 'react';
import { Mail, Edit2, Radio } from 'lucide-react';
import { companies } from '../data/companies';
import CompanyTimeline from './CompanyTimeline';
import TimelineUpdateModal from './TimelineUpdateModal';
import { useTimeline } from '../context/TimelineContext';
import { CompanyTimeline as TimelineType } from '../types/milestones';

interface BiddersListProps {
  isAdmin?: boolean;
}

export default function BiddersList({ isAdmin = false }: BiddersListProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineType | null>(null);
  const { timelines, updateTimeline } = useTimeline();
  const [selectedScope, setSelectedScope] = useState<'all' | 'media' | 'ai'>('all');

  const filteredTimelines = timelines.filter(timeline => {
    const company = companies.find(c => c.id === timeline.companyId);
    if (!company) return false;
    
    switch (selectedScope) {
      case 'media':
        return company.scope.media;
      case 'ai':
        return company.scope.ai;
      default:
        return true;
    }
  });

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-3 py-4 sm:px-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">Active Bidders</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedScope('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedScope === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedScope('media')}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedScope === 'media'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Media
            </button>
            <button
              onClick={() => setSelectedScope('ai')}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedScope === 'ai'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              AI
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {filteredTimelines.map((timeline) => {
            const company = companies.find(c => c.id === timeline.companyId);
            return (
              <li 
                key={timeline.companyId} 
                className={`p-3 sm:p-4 ${
                  timeline.offerReceived.isCompleted ? 'bg-green-50' :
                  timeline.rfiDue.isCompleted ? 'bg-blue-50' :
                  ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-base sm:text-lg font-medium text-gray-600">
                          {timeline.companyName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                          {timeline.companyName}
                        </p>
                        <div className="flex gap-1">
                          {company?.scope.media && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                              Media
                            </span>
                          )}
                          {company?.scope.ai && (
                            <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                              AI
                            </span>
                          )}
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => setSelectedTimeline(timeline)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="truncate">
                          {company?.contacts[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-11 sm:ml-0">
                    <CompanyTimeline timeline={timeline} isAdmin={isAdmin} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {selectedTimeline && isAdmin && (
        <TimelineUpdateModal
          timeline={selectedTimeline}
          isOpen={true}
          onClose={() => setSelectedTimeline(null)}
          onUpdate={updateTimeline}
        />
      )}
    </div>
  );
}