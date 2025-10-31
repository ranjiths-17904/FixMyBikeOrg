import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import logo from '../../assets/image/FixMyBike New Logo.png';

import {
  FaEye,
  FaDownload,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaWrench,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowLeft,
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ServiceHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Load real service history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/bookings');
        const bookings = (res.data?.bookings || []).filter(b => ['completed', 'delivered', 'picked-by-customer', 'service-done'].includes(b.status));
        const mapped = bookings.map(b => ({
          _id: b._id,
          serviceType: b.serviceName || b.service,
          bikeModel: b.bikeModel,
          bookingDate: b.date,
          completionDate: b.receipt?.completedAt || b.receipt?.pickedAt || b.updatedAt || b.date,
          status: b.status,
          cost: b.actualCost ?? b.cost ?? 0,
          workDone: {
            workDescription: Array.isArray(b.receipt?.workDone) ? b.receipt.workDone.join(', ') : '',
            partsUsed: Array.isArray(b.receipt?.partsReplaced) ? b.receipt.partsReplaced.join(', ') : '',
            laborHours: undefined,
            totalCost: b.actualCost ?? b.cost ?? 0,
            notes: b.receipt?.additionalNotes || '',
            receipt: ''
          },
          mechanic: 'FixMyBike Service',
          shopLocation: b.location === 'home' ? 'Home Service' : 'Service Center'
        }));
        setServiceHistory(mapped);
      } catch (e) {
        setServiceHistory([]);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };

  const handleDownloadReceipt = (receiptUrl) => {
    toast.success('Receipt download started');
    window.open(receiptUrl, '_blank');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800 border-green-300', icon: <FaCheckCircle className="w-4 h-4" /> },
      in_progress: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: <FaClock className="w-4 h-4" /> },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-300', icon: <FaTimesCircle className="w-4 h-4" /> },
    };

    const config = statusConfig[status] || statusConfig.completed;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service history...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm h-20 flex items-center px-4 z-50">
     
        <div className="flex items-center flex-1">
          
          <img
            src= {logo}
            alt="Logo"
            className="h-16 w-16 ml-2"
          />
        </div>

        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-green-900">
          Service History
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors flex-1 justify-end"
          aria-label="Go back"
          title="Back"
        >
          <span className="hidden sm:inline text-lg font-semibold">Back</span>
          <FaArrowLeft className="h-5 w-5 sm:ml-2" />
        </button>
      </header>

      <main className="pt-24 min-h-screen bg-green-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Services', value: serviceHistory.length, color: 'bg-blue-500' },
              { label: 'Completed', value: serviceHistory.filter((s) => s.status === 'completed').length, color: 'bg-green-500' },
              { label: 'Total Spent', value: `₹${serviceHistory.reduce((sum, s) => sum + s.cost, 0)}`, color: 'bg-purple-500' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                  <FaWrench className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Service History List */}
          <div className="space-y-6">
            {serviceHistory.length === 0 && (
              <div className="text-center py-12">
                <FaWrench className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No service history found</h3>
                <p className="mt-1 text-sm text-gray-500">You haven't completed any services yet.</p>
              </div>
            )}

            {serviceHistory.map((service) => (
              <div key={service._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{service.serviceType}</h3>
                        {getStatusBadge(service.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaWrench className="h-4 w-4 text-green-600" />
                          <span>{service.bikeModel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaUser className="h-4 w-4 text-green-600" />
                          <span>Mechanic: {service.mechanic}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="h-4 w-4 text-green-600" />
                          <span>Booked: {formatDate(service.bookingDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="h-4 w-4 text-green-600" />
                          <span>Completed: {formatDate(service.completionDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-2">₹{service.cost}</div>
                      <button
                        onClick={() => handleViewDetails(service)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <FaEye className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>

                  {service.workDone && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Work Summary:</h4>
                      <p className="text-gray-600 text-sm">{service.workDone.workDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Service Details Modal */}
      {showDetailsModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedService.serviceType}</h2>
                  <p className="text-gray-600">{selectedService.bikeModel}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimesCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Service Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedService.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Date:</span>
                      <span className="font-medium">{formatDate(selectedService.bookingDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion Date:</span>
                      <span className="font-medium">{formatDate(selectedService.completionDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Cost:</span>
                      <span className="font-bold text-green-600">₹{selectedService.cost}</span>
                    </div>
                  </div>
                </div>

                {/* Mechanic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Mechanic Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FaUser className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{selectedService.mechanic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="h-4 w-4 text-green-600" />
                      <span>{selectedService.shopLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Details */}
              {selectedService.workDone && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Work Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Work Description</label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">{selectedService.workDone.workDescription}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Parts Used</label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">{selectedService.workDone.partsUsed}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Labor Hours</label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">{selectedService.workDone.laborHours} hours</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost Breakdown</label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">₹{selectedService.workDone.totalCost}</p>
                      </div>
                    </div>
                  </div>
                  {selectedService.workDone.notes && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-800">{selectedService.workDone.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Receipt Download */}
              {selectedService.workDone?.receipt && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Service Receipt</h3>
                      <p className="text-gray-600 text-sm">Download your service receipt for records</p>
                    </div>
                    <button
                      onClick={() => handleDownloadReceipt(selectedService.workDone.receipt)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaDownload className="h-4 w-4" />
                      Download Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceHistory;
