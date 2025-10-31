import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCheck, Clock, MapPin, User } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function FloatingNotificationCard() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });

  useEffect(() => {
    // Show the card when there are unread notifications
    if (unreadCount > 0) {
      setIsVisible(true);
    }
  }, [unreadCount]);

  const formatNotificationTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return notificationDate.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_created':
        return '📅';
      case 'booking_confirmed':
        return '✅';
      case 'booking_completed':
        return '🎉';
      case 'booking_cancelled':
        return '❌';
      case 'booking_rejected':
        return '🚫';
      case 'status_update':
        return '🔄';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking_created':
        return 'border-blue-500 bg-blue-50';
      case 'booking_confirmed':
        return 'border-green-500 bg-green-50';
      case 'booking_completed':
        return 'border-purple-500 bg-purple-50';
      case 'booking_cancelled':
        return 'border-red-500 bg-red-50';
      case 'booking_rejected':
        return 'border-orange-500 bg-orange-50';
      case 'status_update':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  if (!isVisible || unreadCount === 0) return null;

  return (
    <div 
      className="fixed z-40"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {/* Collapsed State */}
      {!isExpanded && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
             onClick={() => setIsExpanded(true)}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-green-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">New Notifications</h3>
              <p className="text-sm text-gray-600">You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            </div>
            <div className="ml-2">
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h3 className="font-semibold">Notifications</h3>
                <span className="bg-white/20 text-white text-xs rounded-full px-2 py-1 font-medium">
                  {unreadCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                    All Read
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  title="Collapse"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="p-2">
                {notifications.slice(0, 6).map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => markAsRead(notification._id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 border-l-4 ${
                      notification.isRead ? 'bg-gray-50 border-gray-200' : getNotificationColor(notification.type)
                    } hover:bg-gray-100`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 truncate">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-400">
                            {formatNotificationTime(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 6 && (
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <button className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium">
                View all {notifications.length} notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Drag Handle (for future drag functionality) */}
      <div className="absolute top-0 right-0 w-4 h-4 cursor-move opacity-0 hover:opacity-100 transition-opacity">
        <div className="w-full h-full bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}
