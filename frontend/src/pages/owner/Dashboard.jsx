import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMotorcycle, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTools, FaCheckCircle, FaTimes, FaEye, FaUsers, FaMoneyBillWave, FaChartLine, FaCog } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Import user's components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ChatBot from '../../components/ChatBot';
import FloatingNotificationCard from '../../components/FloatingNotificationCard';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
    todayBookings: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Fetch both bookings and dashboard stats in parallel
      const [bookingsResponse, statsResponse] = await Promise.all([
        api.get('/api/bookings'),
        api.get('/api/bookings/stats/dashboard')
      ]);
      
      if (bookingsResponse.data.success) {
        const bookingsData = bookingsResponse.data.bookings;
        setBookings(bookingsData);
      }
      
      if (statsResponse.data.success) {
        const statsData = statsResponse.data.stats;
        setStats({
          total: statsData.totalBookings || 0,
          pending: statsData.pendingBookings || 0,
          completed: statsData.completedBookings || 0,
          cancelled: statsData.cancelledBookings || 0,
          totalRevenue: statsData.totalRevenue || 0,
          todayBookings: statsData.todayBookings || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'confirmed': return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      case 'completed': return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'cancelled': return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      case 'rejected': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleMenuClick = () => {
    console.log('Mobile menu clicked');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header onMenuClick={handleMenuClick} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onMenuClick={handleMenuClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.username}! 🏪
              </h1>
              <p className="text-blue-100 text-lg">
                Here's an overview of your bike service business and recent activities.
              </p>
            </div>
            <div className="hidden md:block">
              <FaTools className="h-16 w-16 text-blue-200 opacity-50" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl">
                <FaMotorcycle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl">
                <FaClock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-400 to-green-600 rounded-xl">
                <FaCheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-red-400 to-red-600 rounded-xl">
                <FaTimes className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-3xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-emerald-500">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl">
                <FaMoneyBillWave className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl">
                <FaCalendarAlt className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todayBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaCog className="mr-3 text-blue-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/owner/bookings')}
              className="group bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex flex-col items-center gap-3"
            >
              <FaTools className="h-8 w-8 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-lg">Manage Bookings</span>
            </button>
            <button
              onClick={() => navigate('/owner/analytics')}
              className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex flex-col items-center gap-3"
            >
              <FaChartLine className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg">View Analytics</span>
            </button>
            <button
              onClick={() => navigate('/owner/profile')}
              className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex flex-col items-center gap-3"
            >
              <FaUsers className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg">Update Profile</span>
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaEye className="mr-3 text-blue-600" />
            Recent Bookings
          </h2>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FaMotorcycle className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-500 mb-6">Bookings will appear here when customers make service requests.</p>
              <div className="text-gray-400 text-sm">
                <p>Share your service link with customers to start receiving bookings!</p>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {booking.customer?.username || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.customer?.mobile || 'No phone'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {booking.serviceName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.bikeModel} - {booking.bikeNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-900 capitalize">
                              {booking.location}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{booking.cost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {bookings.length > 5 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/owner/bookings')}
                className="text-blue-600 hover:text-blue-700 font-semibold text-lg hover:underline transition-all duration-300"
              >
                View All Bookings →
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ChatBot />
      <FloatingNotificationCard />
    </div>
  );
};

export default OwnerDashboard;
