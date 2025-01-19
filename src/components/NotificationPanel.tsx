import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, XCircle, Info, Mail } from 'lucide-react';
import { Notification, NotificationType } from '../types/notifications';
import { useTimeline } from '../context/TimelineContext';

interface NotificationPanelProps {}

const notificationConfig: Record<NotificationType, { icon: React.ElementType; className: string }> = {
  warning: { icon: AlertTriangle, className: 'text-yellow-500 bg-yellow-50' },
  overdue: { icon: XCircle, className: 'text-red-500 bg-red-50' },
  info: { icon: Info, className: 'text-blue-500 bg-blue-50' },
  email: { icon: Mail, className: 'text-indigo-500 bg-indigo-50' }
};

export default function NotificationPanel({}: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications } = useTimeline();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.getElementById('notification-panel');
      const button = document.getElementById('notification-button');
      if (
        panel && 
        button && 
        !panel.contains(event.target as Node) && 
        !button.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        id="notification-button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-red-500 text-[10px] sm:text-xs text-white">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          id="notification-panel"
          className="fixed inset-x-0 top-16 mx-4 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-96 bg-white rounded-lg shadow-lg z-50 max-h-[80vh] sm:max-h-96 overflow-y-auto"
        >
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium">Notifications</h3>
          </div>
          {notifications.length === 0 ? (
            <div className="p-3 sm:p-4 text-center text-gray-500 text-sm">
              No notifications
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => {
                const { icon: Icon, className } = notificationConfig[notification.type];
                return (
                  <li key={notification.id} className="p-3 sm:p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className={`p-1.5 sm:p-2 rounded-full ${className}`}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.companyName}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.date).toLocaleDateString()}
                          {notification.updatedBy && ` • ${notification.updatedBy}`}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}