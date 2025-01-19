import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import ResponseForm from './ResponseForm';
import { db } from '../lib/database';

interface EmailCommunicationProps {
  communication: {
    id: string;
    subject: string;
    content: string;
    sent_date: string;
    created_by: string;
    responses: Array<{
      id: string;
      response: string;
      responder_name: string;
      created_at: string;
    }>;
  };
  isAdmin: boolean;
  onDelete: () => void;
  onResponseAdded: () => void;
}

export default function EmailCommunication({ 
  communication, 
  isAdmin,
  onDelete,
  onResponseAdded 
}: EmailCommunicationProps) {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this communication?')) return;
    
    try {
      // Delete all responses first
      await db.query(
        'DELETE FROM communication_responses WHERE communication_id = $1',
        [communication.id]
      );
      
      // Then delete the communication
      await db.query(
        'DELETE FROM communications WHERE id = $1',
        [communication.id]
      );
      
      onDelete();
    } catch (error) {
      console.error('Error deleting communication:', error);
    }
  };

  const handleDeleteResponse = async (responseId: string) => {
    if (!window.confirm('Are you sure you want to delete this response?')) return;
    
    try {
      await db.query(
        'DELETE FROM communication_responses WHERE id = $1',
        [responseId]
      );
      
      onResponseAdded();
    } catch (error) {
      console.error('Error deleting response:', error);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Rest of the component remains the same */}
    </div>
  );
}