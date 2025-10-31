import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await api.patch(`/api/notifications/${notificationId}/read`, {});
      
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification._id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // For testing purposes, update locally
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await api.patch('/api/notifications/read-all', {});
      
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all as read. Please try again.');
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const createNotification = async (notificationData) => {
    try {
      const response = await api.post('/api/notifications', notificationData);
      if (response.data.success) {
        // Refresh notifications after creating new one
        await fetchNotifications();
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      return { success: false, message: error.message };
    }
  };

  // Create mock notifications for testing
  const createMockNotifications = () => {
    const mockNotifications = [
      {
        _id: '1',
        type: 'booking_created',
        title: 'New Service Booking',
        message: 'Your bike service has been booked successfully for tomorrow at 10:00 AM.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        isRead: false
      },
      {
        _id: '2',
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: 'Your service appointment has been confirmed by the mechanic.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        isRead: false
      },
      {
        _id: '3',
        type: 'status_update',
        title: 'Service Update',
        message: 'Your bike service is now in progress. Estimated completion: 2 hours.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        isRead: true
      },
      {
        _id: '4',
        type: 'booking_completed',
        title: 'Service Completed',
        message: 'Your bike service has been completed successfully. You can collect your bike now.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        isRead: true
      }
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);
      
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    createNotification,
    createMockNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
