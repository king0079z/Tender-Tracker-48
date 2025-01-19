import React from 'react';
import { Clock, Users, AlertCircle, Database, Plus } from 'lucide-react';
import BiddersList from './BiddersList';
import RFITimeline from './RFITimeline';
import StatusSummary from './StatusSummary';
import NotificationPanel from './NotificationPanel';
import DatabaseMonitor from './DatabaseMonitor';
import { useTimeline } from '../context/TimelineContext';
import NewVendorModal from './NewVendorModal';
import { db } from '../lib/database';

interface DashboardProps {
  isAdmin: boolean;
}

export default function Dashboard({ isAdmin }: DashboardProps) {
  const { timelines } = useTimeline();
  const [showNewVendorModal, setShowNewVendorModal] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = db.onConnectionChange((connected) => {
      setIsConnected(connected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
              <span className="ml-2 text-lg sm:text-xl font-semibold">Tender Track</span>
            </div>
            <div className="flex items-center space-x-4">
              {!isConnected ? (
                <div className="flex items-center text-red-600">
                  <Database className="h-5 w-5 mr-2" />
                  <span className="text-sm">Database Disconnected</span>
                </div>
              ) : (
                <div className="flex items-center text-green-600">
                  <Database className="h-5 w-5 mr-2" />
                  <span className="text-sm">Database Connected</span>
                </div>
              )}
              {isAdmin && isConnected && (
                <button
                  onClick={() => setShowNewVendorModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Vendor
                </button>
              )}
              <NotificationPanel />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-8">
          <StatusSummary />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2">
            <BiddersList isAdmin={isAdmin} />
          </div>
          <div className="order-first lg:order-none mb-4 lg:mb-0">
            <RFITimeline />
          </div>
        </div>
      </main>

      {showNewVendorModal && isConnected && (
        <NewVendorModal
          onClose={() => setShowNewVendorModal(false)}
        />
      )}

      <DatabaseMonitor isAdmin={isAdmin} />
    </div>
  );
}