import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { FaCheckCircle, FaTimesCircle, FaEye, FaEdit, FaTrash, FaDownload, FaEnvelope, FaClock, FaUser, FaPhone, FaMapMarkerAlt, FaWrench, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const BookingManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createNotification } = useNotifications();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showWorkDoneModal, setShowWorkDoneModal] = useState(false);
  const [workDoneData, setWorkDoneData] = useState({
    workDescription: '',
    partsUsed: '',
    laborHours: '',
    totalCost: '',
    notes: '',
    receipt: null
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/bookings');
      let bookings = response.data.bookings || [];
      
      // Sort bookings by date in ascending order (oldest first)
      bookings = bookings.sort((a, b) => {
        const dateA = new Date(a.bookingDate || a.createdAt || 0);
        const dateB = new Date(b.bookingDate || b.createdAt || 0);
        return dateA - dateB;
      });
      
      setBookings(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date properly
  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const handleStatusUpdate = async (bookingId, newStatus, reason = '') => {
    try {
      // Update booking status via API
      const response = await api.put(`/api/bookings/${bookingId}/status`, {
        status: newStatus,
        reason: reason
      });
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: newStatus, rejectionReason: reason }
          : booking
      ));
      
      // Backend already creates notifications for status changes
      
      if (newStatus === 'rejected') {
        toast.success('Booking rejected successfully');
        setShowRejectionModal(false);
        setRejectionReason('');
      } else {
        toast.success(`Booking ${newStatus} successfully`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleReject = (bookingId) => {
    setSelectedBooking(bookings.find(b => b._id === bookingId));
    setShowRejectionModal(true);
  };

  const confirmRejection = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    if (selectedBooking) {
      handleStatusUpdate(selectedBooking._id, 'rejected', rejectionReason);
    }
  };

  const handleDeleteBooking = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (bookingToDelete) {
      setBookings(prev => prev.filter(booking => booking._id !== bookingToDelete._id));
      toast.success('Booking deleted successfully!');
      setShowDeleteModal(false);
      setBookingToDelete(null);
    }
  };

  const handleWorkDone = (bookingId) => {
    setSelectedBooking(bookings.find(b => b._id === bookingId));
    setShowWorkDoneModal(true);
  };

  const submitWorkDone = async () => {
    try {
      // Update booking status to completed via API
      await api.put(`/api/bookings/${selectedBooking._id}/status`, {
        status: 'completed',
        actualCost: workDoneData.totalCost || selectedBooking.cost
      });
      
      // Update local state
      const updatedBooking = {
        ...selectedBooking,
        status: 'completed',
        actualCost: workDoneData.totalCost || selectedBooking.cost,
        workDone: workDoneData
      };
      
      setBookings(prev => prev.map(booking => 
        booking._id === selectedBooking._id ? updatedBooking : booking
      ));
      
      toast.success('Work completion details saved successfully');
      setShowWorkDoneModal(false);
      setWorkDoneData({
        workDescription: '',
        partsUsed: '',
        laborHours: '',
        totalCost: '',
        notes: '',
        receipt: null
      });
    } catch (error) {
      console.error('Error updating work completion:', error);
      toast.error('Failed to save work completion details');
    }
  };

  const handleSendReceipt = async (bookingId) => {
    const booking = bookings.find(b => b._id === bookingId);
    if (!booking) {
      toast.error('Booking not found');
      return;
    }

    try {
      const response = await api.post(`/api/bookings/${bookingId}/send-receipt`, {
        workDone: workDoneData.workDescription ? [workDoneData.workDescription] : [],
        partsReplaced: workDoneData.partsUsed ? [workDoneData.partsUsed] : [],
        additionalNotes: workDoneData.notes || '',
        mechanicNotes: workDoneData.notes || '',
        actualCost: workDoneData.totalCost || booking.cost
      });
      toast.success('Receipt sent successfully!');
      fetchBookings(); // Refresh bookings to get updated data
    } catch (error) {
      console.error('Error sending receipt:', error);
      toast.error('Failed to send receipt');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: <FaClock className="w-4 h-4" /> },
      confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: <FaCheckCircle className="w-4 h-4" /> },
      completed: { color: 'bg-green-100 text-green-800 border-green-300', icon: <FaCheckCircle className="w-4 h-4" /> },
      rejected: { color: 'bg-red-100 text-red-800 border-red-300', icon: <FaTimesCircle className="w-4 h-4" /> }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getActionButtons = (booking) => {
    switch (booking.status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
              className="inline-flex items-center px-3 py-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 transition-colors"
            >
              <FaCheckCircle className="w-4 h-4 mr-1" />
              Accept
            </button>
            <button
              onClick={() => handleReject(booking._id)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 transition-colors"
            >
              <FaTimesCircle className="w-4 h-4 mr-1" />
              Reject
            </button>
            <button
              onClick={() => handleDeleteBooking(booking)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-red-800 text-white hover:bg-red-900 border border-red-800 transition-colors"
            >
              <FaTrash className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(booking._id, 'in-progress')}
              className="inline-flex items-center px-3 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300 transition-colors"
            >
              <FaWrench className="w-4 h-4 mr-1" />
              Start Service
            </button>
            <button
              onClick={() => handleDeleteBooking(booking)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-red-800 text-white hover:bg-red-900 border border-red-800 transition-colors"
            >
              <FaTrash className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        );
      case 'in-progress':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(booking._id, 'service-done')}
              className="inline-flex items-center px-3 py-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 transition-colors"
            >
              <FaCheckCircle className="w-4 h-4 mr-1" />
              Service Done
            </button>
            <button
              onClick={() => handleDeleteBooking(booking)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-red-800 text-white hover:bg-red-900 border border-red-800 transition-colors"
            >
              <FaTrash className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        );
      case 'service-done':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(booking._id, 'pickup-notification')}
              className="inline-flex items-center px-3 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300 transition-colors"
            >
              <FaEnvelope className="w-4 h-4 mr-1" />
              Send Pickup Notification
            </button>
            <button
              onClick={() => handleSendReceipt(booking._id)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300 transition-colors"
            >
              <FaDownload className="w-4 h-4 mr-1" />
              Send Receipt
            </button>
            <button
              onClick={() => handleDeleteBooking(booking)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-red-800 text-white hover:bg-red-900 border border-red-800 transition-colors"
            >
              <FaTrash className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        );
      case 'pickup-notification':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(booking._id, 'picked-by-customer')}
              className="inline-flex items-center px-3 py-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 transition-colors"
            >
              <FaCheckCircle className="w-4 h-4 mr-1" />
              Picked by Customer
            </button>
            <button
              onClick={() => handleSendReceipt(booking._id)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300 transition-colors"
            >
              <FaDownload className="w-4 h-4 mr-1" />
              Send Receipt
            </button>
            <button
              onClick={() => handleDeleteBooking(booking)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-red-800 text-white hover:bg-red-900 border border-red-800 transition-colors"
            >
              <FaTrash className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        );
      case 'picked-by-customer':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate(booking._id, 'completed')}
              className="inline-flex items-center px-3 py-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 transition-colors"
            >
              <FaCheckCircle className="w-4 h-4 mr-1" />
              Mark Completed
            </button>
            <button
              onClick={() => handleSendReceipt(booking._id)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300 transition-colors"
            >
              <FaDownload className="w-4 h-4 mr-1" />
              Send Receipt
            </button>
            <button
              onClick={() => handleDeleteBooking(booking)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-red-800 text-white hover:bg-red-900 border border-red-800 transition-colors"
            >
              <FaTrash className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        );
      case 'completed':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleWorkDone(booking._id)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors"
            >
              <FaEdit className="w-4 h-4 mr-1" />
              Edit Details
            </button>
            <button
              onClick={() => handleStatusUpdate(booking._id, 'delivered')}
              className="relative inline-flex items-center px-3 py-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 transition-colors group"
            >
              <FaCheckCircle className="w-4 h-4 mr-1" />
              Mark Delivered

              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 px-2 py-1 text-xs text-white bg-gray-700 rounded-md shadow-lg transition-transform">
                Edit the form first
              </span>
            </button>
            
            <button
              onClick={() => handleSendReceipt(booking._id)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300 transition-colors"
            >
              <FaDownload className="w-4 h-4 mr-1" />
              Send Receipt
            </button>
            <button
              onClick={() => handleDeleteBooking(booking)}
              className="inline-flex items-center px-3 py-2 rounded-md bg-red-800 text-white hover:bg-red-900 border border-red-800 transition-colors"
            >
              <FaTrash className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/owner/dashboard')}
                className="text-gray-600 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Booking Management
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Bookings', value: bookings.length, color: 'bg-blue-500' },
              { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-yellow-500' },
              { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-blue-500' },
              { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-green-500' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                  <FaCalendarAlt className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Bookings List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <FaPhone className="h-3 w-3" />
                              {booking.customerPhone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{booking.serviceType}</div>
                          <div className="text-sm text-gray-500">{booking.bikeModel}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{formatDate(booking.bookingDate)}</div>
                          <div className="text-sm text-gray-500">{formatTime(booking.preferredTime)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                        {booking.rejectionReason && (
                          <div className="text-xs text-red-600 mt-1 max-w-xs truncate" title={booking.rejectionReason}>
                            Reason: {booking.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {getActionButtons(booking)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Booking</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this booking:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="3"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRejection}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Work Done Modal */}
      {showWorkDoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Completion Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Description</label>
                <textarea
                  value={workDoneData.workDescription}
                  onChange={(e) => setWorkDoneData(prev => ({ ...prev, workDescription: e.target.value }))}
                  placeholder="Describe the work performed..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parts Used</label>
                <textarea
                  value={workDoneData.partsUsed}
                  onChange={(e) => setWorkDoneData(prev => ({ ...prev, partsUsed: e.target.value }))}
                  placeholder="List parts used..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Labor Hours</label>
                <input
                  type="number"
                  value={workDoneData.laborHours}
                  onChange={(e) => setWorkDoneData(prev => ({ ...prev, laborHours: e.target.value }))}
                  placeholder="Hours worked"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost</label>
                <input
                  type="number"
                  value={workDoneData.totalCost}
                  onChange={(e) => setWorkDoneData(prev => ({ ...prev, totalCost: e.target.value }))}
                  placeholder="Total cost"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={workDoneData.notes}
                  onChange={(e) => setWorkDoneData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="2"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowWorkDoneModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitWorkDone}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Booking</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the booking for <strong>{bookingToDelete?.serviceType}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  
  );
};

export default BookingManagement;
