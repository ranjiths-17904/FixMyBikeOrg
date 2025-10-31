import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Plus, Trash2 } from 'lucide-react';
import FloatingNotificationCard from './FloatingNotificationCard';

export default function NotificationTest() {
  const { notifications, unreadCount, addNotification, markAsRead, markAllAsRead } = useNotifications();

  const createSampleNotification = (type) => {
    const sampleNotifications = {
      booking_created: {
        type: 'booking_created',
        title: 'New Service Booking',
        message: 'Your bike service has been booked successfully for tomorrow at 10:00 AM.',
        recipient: 'user123',
        sender: 'system'
      },
      booking_confirmed: {
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: 'Your service appointment has been confirmed by the mechanic.',
        recipient: 'user123',
        sender: 'system'
      },
      status_update: {
        type: 'status_update',
        title: 'Service Update',
        message: 'Your bike service is now in progress. Estimated completion: 2 hours.',
        recipient: 'user123',
        sender: 'system'
      },
      booking_completed: {
        type: 'booking_completed',
        title: 'Service Completed',
        message: 'Your bike service has been completed successfully. You can collect your bike now.',
        recipient: 'user123',
        sender: 'system'
      },
      booking_rejected: {
        type: 'booking_rejected',
        title: 'Booking Rejected',
        message: 'Your service booking has been rejected due to unavailability.',
        recipient: 'user123',
        sender: 'system'
      }
    };

    addNotification(sampleNotifications[type]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="h-6 w-6 text-green-600" />
          Notification System Test
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Unread: <span className="font-semibold text-red-500">{unreadCount}</span>
          </span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Notifications */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Create Test Notifications</h3>
          <div className="space-y-2">
            <button
              onClick={() => createSampleNotification('booking_created')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Booking Created
            </button>
            <button
              onClick={() => createSampleNotification('booking_confirmed')}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Booking Confirmed
            </button>
            <button
              onClick={() => createSampleNotification('status_update')}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Status Update
            </button>
            <button
              onClick={() => createSampleNotification('booking_completed')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Service Completed
            </button>
            <button
              onClick={() => createSampleNotification('booking_rejected')}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Booking Rejected
            </button>
          </div>
        </div>

        {/* Current Notifications */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Notifications ({notifications.length})</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 rounded-lg border ${
                    notification.isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="text-blue-600 hover:text-blue-700 text-xs"
                        >
                          Mark Read
                        </button>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        notification.isRead ? 'bg-gray-200 text-gray-600' : 'bg-blue-200 text-blue-600'
                      }`}>
                        {notification.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Test</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
          <li>Click the notification buttons above to create test notifications</li>
          <li>Check the header notification bell for the unread count badge</li>
          <li>Click on the bell icon to see the notification dropdown</li>
          <li>Click on individual notifications to mark them as read</li>
          <li>Use "Mark All Read" to mark all notifications as read</li>
          <li>Check the mobile menu for mobile notification display</li>
        </ol>
      </div>
      
      {/* Floating Notification Card for testing */}
      <FloatingNotificationCard />
    </div>
  );
}
