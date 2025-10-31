import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRupeeSign, FaMotorcycle, FaCalendarAlt, FaMapMarkerAlt, FaChartLine, FaChartBar, FaChartPie, FaUsers, FaClock, FaCheckCircle, FaTimesCircle, FaDownload, FaFilter } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import MainLogo from '../../assets/image/MainLogo.png';

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('month');
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0
    },
    bookings: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0
    },
    services: {
      washPolish: 0,
      engineService: 0,
      generalService: 0,
      majorRepairs: 0,
      breakdown: 0
    },
    locations: {
      shop: 0,
      home: 0
    },
    monthlyData: [],
    topServices: [],
    recentBookings: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeFilter]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from API
      const [bookingsResponse, revenueResponse] = await Promise.all([
        api.get('/api/bookings/analytics', { params: { timeFilter } }),
        api.get('/api/bookings/revenue', { params: { timeFilter } })
      ]);

      const bookingsData = bookingsResponse.data;
      const revenueData = revenueResponse.data;

      // Process and structure the data
      const processedAnalytics = {
        revenue: {
          total: revenueData.total || 0,
          thisMonth: revenueData.thisMonth || 0,
          lastMonth: revenueData.lastMonth || 0,
          growth: revenueData.growth || 0
        },
        bookings: {
          total: bookingsData.total || 0,
          thisMonth: bookingsData.thisMonth || 0,
          lastMonth: bookingsData.lastMonth || 0,
          growth: bookingsData.growth || 0
        },
        services: bookingsData.serviceBreakdown || {
          washPolish: 0,
          engineService: 0,
          generalService: 0,
          majorRepairs: 0,
          breakdown: 0
        },
        locations: bookingsData.locationBreakdown || {
          shop: 0,
          home: 0
        },
        monthlyData: bookingsData.monthlyData || [],
        topServices: bookingsData.topServices || [],
        recentBookings: bookingsData.recentBookings || []
      };

      setAnalytics(processedAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock data if API fails
      setAnalytics(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const getMockAnalytics = () => ({
    revenue: {
      total: 45000,
      thisMonth: 8500,
      lastMonth: 7200,
      growth: 18.1
    },
    bookings: {
      total: 156,
      thisMonth: 28,
      lastMonth: 24,
      growth: 16.7
    },
    services: {
      washPolish: 45,
      engineService: 38,
      generalService: 32,
      majorRepairs: 25,
      breakdown: 16
    },
    locations: {
      shop: 98,
      home: 58
    },
    monthlyData: [
      { month: 'Jan', revenue: 7200, bookings: 24 },
      { month: 'Feb', revenue: 6800, bookings: 22 },
      { month: 'Mar', revenue: 8100, bookings: 27 },
      { month: 'Apr', revenue: 7900, bookings: 26 },
      { month: 'May', revenue: 8500, bookings: 28 },
      { month: 'Jun', revenue: 9200, bookings: 31 }
    ],
    topServices: [
      { name: 'Wash & Polish', count: 45, revenue: 13500 },
      { name: 'Engine Service', count: 38, revenue: 30400 },
      { name: 'General Service', count: 32, revenue: 25600 },
      { name: 'Major Repairs', count: 25, revenue: 37500 },
      { name: 'Breakdown', count: 16, revenue: 24000 }
    ],
    recentBookings: [
      { id: 1, customerName: 'John Doe', service: 'Engine Service', amount: 800, status: 'completed', date: '2024-01-15' },
      { id: 2, customerName: 'Jane Smith', service: 'Wash & Polish', amount: 300, status: 'pending', date: '2024-01-14' },
      { id: 3, customerName: 'Mike Johnson', service: 'General Service', amount: 500, status: 'in-progress', date: '2024-01-13' },
      { id: 4, customerName: 'Sarah Wilson', service: 'Major Repairs', amount: 1500, status: 'completed', date: '2024-01-12' }
    ]
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="w-4 h-4" />;
      case 'pending': return <FaClock className="w-4 h-4" />;
      case 'in-progress': return <FaMotorcycle className="w-4 h-4" />;
      case 'cancelled': return <FaTimesCircle className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
                  <FaChartLine className="w-6 h-6 text-green-600" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
              </div>
            </div>
            
            {/* Time Filter */}
            <div className="flex items-center space-x-2">
              <FaFilter className="w-4 h-4 text-gray-500" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaRupeeSign className="w-6 h-6 text-green-600" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                analytics.revenue.growth >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
              }`}>
                {analytics.revenue.growth >= 0 ? '+' : ''}{analytics.revenue.growth}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(analytics.revenue.total)}</p>
            <p className="text-xs text-gray-500">This {timeFilter}: {formatCurrency(analytics.revenue.thisMonth)}</p>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaCalendarAlt className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                analytics.bookings.growth >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
              }`}>
                {analytics.bookings.growth >= 0 ? '+' : ''}{analytics.bookings.growth}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Bookings</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{analytics.bookings.total}</p>
            <p className="text-xs text-gray-500">This {timeFilter}: {analytics.bookings.thisMonth}</p>
          </div>

          {/* Services Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FaMotorcycle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Services Provided</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {Object.values(analytics.services).reduce((sum, count) => sum + count, 0)}
            </p>
            <p className="text-xs text-gray-500">Across all service types</p>
          </div>

          {/* Locations Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <FaMapMarkerAlt className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Service Locations</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {analytics.locations.shop + analytics.locations.home}
            </p>
            <p className="text-xs text-gray-500">Shop: {analytics.locations.shop} | Home: {analytics.locations.home}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Breakdown */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <FaChartPie className="w-5 h-5 mr-2 text-green-600" />
                Service Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(analytics.services).map(([service, count]) => (
                  <div key={service} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {service.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${(count / Object.values(analytics.services).reduce((sum, c) => sum + c, 0)) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Services by Revenue */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <FaChartBar className="w-5 h-5 mr-2 text-green-600" />
              Top Services
            </h3>
            <div className="space-y-4">
              {analytics.topServices.slice(0, 5).map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.count} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(service.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaCalendarAlt className="w-5 h-5 mr-2 text-green-600" />
                Recent Bookings
              </h3>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
                <FaDownload className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Service</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-800">{booking.customerName}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">{booking.service}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold text-gray-800">{formatCurrency(booking.amount)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">{new Date(booking.date).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
