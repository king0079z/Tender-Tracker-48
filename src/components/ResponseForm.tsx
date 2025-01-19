import React, { useState } from 'react';
import { db } from '../lib/database';

interface ResponseFormProps {
  communicationId: string;
  onResponseAdded: () => void;
}

export default function ResponseForm({ communicationId, onResponseAdded }: ResponseFormProps) {
  const [response, setResponse] = useState({ response: '', name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await db.query(
        `INSERT INTO communication_responses (communication_id, response, responder_name)
         VALUES ($1, $2, $3)`,
        [communicationId, response.response, response.name]
      );

      setResponse({ response: '', name: '' });
      onResponseAdded();
    } catch (error) {
      console.error('Error adding response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of the component remains the same
  return (
    // ... existing JSX
  );
}