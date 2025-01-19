import React from 'react';
import { X } from 'lucide-react';
import { CompanyTimeline, Milestone } from '../types/milestones';
import { addDays } from '../utils/dateUtils';
import { RFI_RESPONSE_DAYS } from '../utils/timelineUtils';

interface TimelineUpdateModalProps {
  timeline: CompanyTimeline;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTimeline: CompanyTimeline) => void;
}

export default function TimelineUpdateModal({ 
  timeline, 
  isOpen, 
  onClose, 
  onUpdate 
}: TimelineUpdateModalProps) {
  const [formData, setFormData] = React.useState<CompanyTimeline>(timeline);

  React.useEffect(() => {
    setFormData(timeline);
  }, [timeline]);

  const updateMilestone = (key: keyof CompanyTimeline, data: Partial<Milestone>) => {
    setFormData(prev => {
      const newData = { ...prev, [key]: { ...prev[key], ...data } };
      
      // If RFI Sent is completed and has a date, allow custom RFI Due date
      if (key === 'rfiSent' && data.isCompleted && newData.rfiSent.date) {
        // Only set default due date if there isn't one already
        if (!newData.rfiDue.date) {
          const dueDate = addDays(new Date(newData.rfiSent.date), RFI_RESPONSE_DAYS);
          newData.rfiDue = {
            ...newData.rfiDue,
            date: dueDate,
            isCompleted: false
          };
        }
      }

      // Reset RFI Due if RFI Sent is uncompleted
      if (key === 'rfiSent' && !data.isCompleted) {
        newData.rfiDue = {
          ...newData.rfiDue,
          date: null,
          isCompleted: false
        };
      }
      
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Update Timeline: {timeline.companyName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {Object.entries(formData).map(([key, milestone]) => {
            if (key === 'companyId' || key === 'companyName') return null;

            const isRfiDue = key === 'rfiDue';
            const canEditRfiDue = formData.rfiSent.isCompleted && formData.rfiSent.date;

            return (
              <div key={key} className="mb-4">
                <h3 className="text-sm font-medium mb-2">{milestone.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={milestone.date ? new Date(milestone.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateMilestone(key as keyof CompanyTimeline, {
                        date: e.target.value ? new Date(e.target.value) : null
                      })}
                      disabled={isRfiDue && !canEditRfiDue}
                      min="2024-01-01"
                      max="2026-12-31"
                      className={`w-full border rounded-md px-3 py-2 ${
                        isRfiDue && !canEditRfiDue ? 'bg-gray-100' : ''
                      }`}
                    />
                    {isRfiDue && (
                      <p className="text-xs text-gray-500 mt-1">
                        {canEditRfiDue 
                          ? 'You can customize the due date' 
                          : 'Complete RFI Sent first to set due date'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={milestone.isCompleted}
                        onChange={(e) => updateMilestone(key as keyof CompanyTimeline, {
                          isCompleted: e.target.checked
                        })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Completed</span>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}