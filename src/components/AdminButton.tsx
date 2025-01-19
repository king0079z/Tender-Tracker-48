import React from 'react';
import { Settings } from 'lucide-react';

interface AdminButtonProps {
  onClick: () => void;
  className?: string;
}

export default function AdminButton({ onClick, className = '' }: AdminButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-20 right-4 bg-indigo-600 text-white rounded-full p-3 shadow-lg 
        hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        transition-all duration-200 z-50 ${className}`}
    >
      <Settings className="h-6 w-6" />
    </button>
  );
}