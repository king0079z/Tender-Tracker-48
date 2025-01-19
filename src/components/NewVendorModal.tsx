import React, { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '../lib/database';

interface NewVendorModalProps {
  onClose: () => void;
}

export default function NewVendorModal({ onClose }: NewVendorModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    scope: {
      media: false,
      ai: false
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.companyName.trim()) {
        throw new Error('Company name is required');
      }

      if (!formData.contactEmail.trim()) {
        throw new Error('Contact email is required');
      }

      if (!formData.scope.media && !formData.scope.ai) {
        throw new Error('At least one scope must be selected');
      }

      // Test database connection before proceeding
      const healthCheck = await fetch('/api/health');
      const healthData = await healthCheck.json();
      
      if (healthData.database !== 'connected') {
        throw new Error('Database connection is not available. Please try again.');
      }

      // Generate a unique ID for the new company
      const timestamp = Date.now();
      const companyId = `${timestamp}`;

      // Insert the new vendor into the timelines table
      await db.query(
        `INSERT INTO timelines (
          company_id, company_name,
          nda_received_completed, nda_signed_completed,
          rfi_sent_completed, rfi_due_completed,
          offer_received_completed
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [companyId, formData.companyName, false, false, false, false, false]
      );

      // Close the modal and refresh the page to show the new vendor
      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Error adding vendor:', err);
      setError(err instanceof Error ? err.message : 'Failed to add vendor. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Add New Vendor</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  companyName: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contactEmail: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scope
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.scope.media}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      scope: {
                        ...prev.scope,
                        media: e.target.checked
                      }
                    }))}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Media</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.scope.ai}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      scope: {
                        ...prev.scope,
                        ai: e.target.checked
                      }
                    }))}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">AI</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}