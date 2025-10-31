import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaArrowLeft, FaCamera, FaUpload, FaDownload, FaShieldAlt, FaCalendarAlt, FaMotorcycle, FaClock, FaStore, FaBuilding } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import FloatingNotificationCard from '../../components/FloatingNotificationCard';
import MainLogo from '../../assets/image/MainLogo.png';
import api from '../../services/api';

const OwnerProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    revenue: 0
  });
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || '',
    state: user?.profile?.state || '',
    pincode: user?.profile?.pincode || '',
    shopName: user?.profile?.shopName || '',
    shopAddress: user?.profile?.shopAddress || '',
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
        
        // Calculate revenue from completed bookings
        const revenue = bookings
          .filter(b => ['completed', 'delivered', 'picked-by-customer'].includes(b.status))
          .reduce((sum, booking) => sum + (booking.actualCost || booking.cost || 0), 0);
        
        setBookingStats({ total, completed, pending, revenue });
      }
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    }
  };

  const formatRevenue = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  useEffect(() => {
    if (user?.profile?.avatarUrl) {
      setImagePreview(user.profile.avatarUrl);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you'd upload the image to a service like Cloudinary first
      // For now, we'll simulate the upload
      let avatarUrl = formData.avatarUrl;
      if (selectedFile) {
        // Simulate image upload
        avatarUrl = imagePreview;
      }

      const profileData = {
        ...formData,
        avatarUrl,
        profile: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          shopName: formData.shopName,
          shopAddress: formData.shopAddress,
          avatarUrl
        }
      };

      const result = await updateProfile(profileData);
      if (result.success) {
        setIsEditing(false);
        setSelectedFile(null);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
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
      pincode: user?.profile?.pincode || '',
      shopName: user?.profile?.shopName || '',
      shopAddress: user?.profile?.shopAddress || '',
      avatarUrl: user?.profile?.avatarUrl || ''
    });
    setImagePreview(user?.profile?.avatarUrl || null);
    setSelectedFile(null);
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
                onClick={() => navigate('/owner/dashboard')}
                className="text-gray-600 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaStore className="w-6 h-6 text-green-600" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Shop Profile
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Overview Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-12 h-12 text-white/80" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white text-green-600 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <FaCamera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{user?.username || 'Shop Owner'}</h2>
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
                {formData.shopName && (
                  <p className="text-green-100 flex items-center mt-2">
                    <FaBuilding className="w-4 h-4 mr-2" />
                    {formData.shopName}
                  </p>
                )}
                <div className="mt-3 flex items-center space-x-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    <FaStore className="w-4 h-4 inline mr-1" />
                    Shop Owner
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                {/* Personal Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="w-4 h-4 inline mr-2 text-green-600" />
                    Personal Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>
              </div>

              {/* Shop Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Shop Information
                </h3>
                
                {/* Shop Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBuilding className="w-4 h-4 inline mr-2 text-green-600" />
                    Shop Name
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your shop name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                      isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                {/* Shop Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="w-4 h-4 inline mr-2 text-green-600" />
                    Shop Address
                  </label>
                  <textarea
                    name="shopAddress"
                    value={formData.shopAddress}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Enter your shop address"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none ${
                      isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                </div>

                {/* Avatar URL */}
                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCamera className="w-4 h-4 inline mr-2 text-green-600" />
                      Profile Image URL
                    </label>
                    <input
                      type="url"
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Or upload an image using the camera icon above</p>
                  </div>
                )}
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

        {/* Business Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatRevenue(bookingStats.revenue)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaDownload className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingNotificationCard />
    </div>
  );
};

export default OwnerProfile;
