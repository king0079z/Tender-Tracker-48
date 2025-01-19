import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { db } from '../lib/database';

interface MeetingModalProps {
  companyId: string;
  companyName: string;
  onClose: () => void;
}

interface Meeting {
  id: string;
  meeting_date: string;
  subject: string;
  notes: string;
  attendees: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}

export default function MeetingModal({ companyId, companyName, onClose }: MeetingModalProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    subject: '',
    notes: '',
    attendees: [{ name: '', email: '', role: '' }]
  });

  useEffect(() => {
    fetchMeetings();
  }, [companyId]);

  const fetchMeetings = async () => {
    try {
      const result = await db.query(
        `SELECT m.*, json_agg(
          json_build_object(
            'id', a.id,
            'name', a.name,
            'email', a.email,
            'role', a.role
          )
        ) as attendees
         FROM meetings m
         LEFT JOIN meeting_attendees a ON m.id = a.meeting_id
         WHERE m.company_id = $1
         GROUP BY m.id
         ORDER BY m.meeting_date DESC`,
        [companyId]
      );

      setMeetings(result.rows);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create meeting
      const meetingDate = new Date(`${formData.date}T${formData.time}`);
      const meetingResult = await db.query(
        `INSERT INTO meetings (company_id, meeting_date, subject, notes)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [companyId, meetingDate, formData.subject, formData.notes]
      );

      const meetingId = meetingResult.rows[0].id;

      // Add attendees
      for (const attendee of formData.attendees) {
        if (attendee.name) {
          await db.query(
            `INSERT INTO meeting_attendees (meeting_id, name, email, role)
             VALUES ($1, $2, $3, $4)`,
            [meetingId, attendee.name, attendee.email, attendee.role]
          );
        }
      }

      setShowNewForm(false);
      fetchMeetings();
    } catch (error) {
      console.error('Error saving meeting:', error);
    }
  };

  const addAttendee = () => {
    setFormData(prev => ({
      ...prev,
      attendees: [...prev.attendees, { name: '', email: '', role: '' }]
    }));
  };

  const removeAttendee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Meetings - {companyName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-4">Loading meetings...</div>
          ) : (
            <>
              {!showNewForm && (
                <button
                  onClick={() => setShowNewForm(true)}
                  className="mb-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Schedule New Meeting
                </button>
              )}

              {showNewForm && (
                <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Attendees</label>
                      <button
                        type="button"
                        onClick={addAttendee}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Add Attendee
                      </button>
                    </div>
                    {formData.attendees.map((attendee, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={attendee.name}
                          onChange={e => {
                            const newAttendees = [...formData.attendees];
                            newAttendees[index].name = e.target.value;
                            setFormData(prev => ({ ...prev, attendees: newAttendees }));
                          }}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={attendee.email}
                          onChange={e => {
                            const newAttendees = [...formData.attendees];
                            newAttendees[index].email = e.target.value;
                            setFormData(prev => ({ ...prev, attendees: newAttendees }));
                          }}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Role"
                          value={attendee.role}
                          onChange={e => {
                            const newAttendees = [...formData.attendees];
                            newAttendees[index].role = e.target.value;
                            setFormData(prev => ({ ...prev, attendees: newAttendees }));
                          }}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeAttendee(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowNewForm(false)}
                      className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Save Meeting
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {meetings.map(meeting => (
                  <div key={meeting.id} className="bg-white border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{meeting.subject}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(meeting.meeting_date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {meeting.notes && (
                      <p className="text-sm text-gray-600 mt-2">{meeting.notes}</p>
                    )}
                    {meeting.attendees && meeting.attendees.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700">Attendees:</h4>
                        <ul className="mt-1 space-y-1">
                          {meeting.attendees.map(attendee => (
                            <li key={attendee.id} className="text-sm text-gray-600">
                              {attendee.name}
                              {attendee.role && ` (${attendee.role})`}
                              {attendee.email && ` - ${attendee.email}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}