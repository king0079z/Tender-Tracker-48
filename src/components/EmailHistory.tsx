import React, { useState, useEffect } from 'react';
import { Mail, Plus, X } from 'lucide-react';
import { db } from '../lib/database';
import EmailCommunication from './EmailCommunication';
import NewEmailForm from './NewEmailForm';

interface EmailHistoryProps {
  companyId: string;
  companyName: string;
  isAdmin: boolean;
}

export default function EmailHistory({ companyId, companyName, isAdmin }: EmailHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [communications, setCommunications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCommunications = async () => {
    try {
      setLoading(true);
      const result = await db.query(
        'SELECT * FROM communications WHERE company_id = $1 ORDER BY sent_date DESC',
        [companyId]
      );

      const communicationsWithResponses = await Promise.all(result.rows.map(async (comm) => {
        const responses = await db.query(
          'SELECT * FROM communication_responses WHERE communication_id = $1 ORDER BY created_at ASC',
          [comm.id]
        );

        return {
          ...comm,
          responses: responses.rows || []
        };
      }));

      setCommunications(communicationsWithResponses);
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCommunications();
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        title="View email history"
      >
        <Mail className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">Email History - {companyName}</h2>
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : communications.length === 0 ? (
                <div className="text-center text-gray-500">No email communications yet</div>
              ) : (
                communications.map((comm) => (
                  <EmailCommunication
                    key={comm.id}
                    communication={comm}
                    isAdmin={isAdmin}
                    onDelete={fetchCommunications}
                    onResponseAdded={fetchCommunications}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <NewEmailForm
          companyId={companyId}
          onCancel={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchCommunications();
          }}
        />
      )}
    </div>
  );
}