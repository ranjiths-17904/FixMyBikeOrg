import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaArrowLeft, FaCamera, FaUpload, FaDownload, FaShieldAlt, FaCalendarAlt, FaMotorcycle, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import FloatingNotificationCard from '../../components/FloatingNotificationCard';
import MainLogo from '../../assets/image/FixMyBike New Logo.png';
import api from '../../services/api';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || '',
    state: user?.profile?.state || '',
    pincode: user?.profile?.pincode || '',
    avatarUrl: user?.profile?.avatarUrl || ''
  });

  // Fetch booking statistics
  useEffect(() => {
    fetchBookingStats();
  }, []);

  const fetchBookingStats = async () => {
    try {
      const response = await api.get('/api/bookings');
      if (response.data.success) {
        const bookings = response.data.bookings;
        const total = bookings.length;
        const completed = bookings.filter(b => ['completed', 'delivered', 'picked-by-customer'].includes(b.status)).length;
        const pending = bookings.filter(b => ['pending', 'confirmed', 'in-progress', 'service-done', 'pickup-notification'].includes(b.status)).length;
        
        setBookingStats({ total, completed, pending });
      }
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      address: user?.profile?.address || '',
      city: user?.profile?.city || '',
      state: user?.profile?.state || '',
      pincode: user?.profile?.pincode || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/customer/dashboard')}
                className="text-gray-600 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <img src={MainLogo} alt="FixMyBike" className="h-12 w-12" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Profile
                </h1>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg"
              >
                <FaEdit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Overview Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  {formData.avatarUrl ? (
                    <img 
                      src={formData.avatarUrl} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-12 h-12 text-white/80" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white text-green-600 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                    <FaCamera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{user?.username || 'Customer'}</h2>
                <p className="text-green-100 mb-1 flex items-center">
                  <FaEnvelope className="w-4 h-4 mr-2" />
                  {user?.email}
                </p>
                {user?.mobile && (
                  <p className="text-green-100 flex items-center">
                    <FaPhone className="w-4 h-4 mr-2" />
                    {user.mobile}
                  </p>
                )}
                <div className="mt-3 flex items-center space-x-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    <FaMotorcycle className="w-4 h-4 inline mr-1" />
                    Customer
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    <FaShieldAlt className="w-4 h-4 inline mr-1" />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="w-4 h-4 inline mr-2 text-green-600" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                    isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="w-4 h-4 inline mr-2 text-green-600" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                    isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="w-4 h-4 inline mr-2 text-green-600" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                    isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="w-4 h-4 inline mr-2 text-green-600" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                    isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                    isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                    isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                    isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCalendarAlt className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats.completed}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaMotorcycle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{bookingStats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingNotificationCard />
    </div>
  );
};

export default CustomerProfile;
