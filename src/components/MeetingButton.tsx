import React from 'react';
import { Calendar } from 'lucide-react';
import MeetingModal from './MeetingModal';

interface MeetingButtonProps {
  companyId: string;
  companyName: string;
  disabled?: boolean;
}

export default function MeetingButton({ companyId, companyName, disabled = false }: MeetingButtonProps) {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={disabled}
        className={`p-1 rounded-full ${
          disabled 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-indigo-600 hover:bg-indigo-50'
        }`}
        title={disabled ? 'Send RFI first to schedule meetings' : 'Schedule Meeting'}
      >
        <Calendar className="h-4 w-4" />
      </button>

      {showModal && (
        <MeetingModal
          companyId={companyId}
          companyName={companyName}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}