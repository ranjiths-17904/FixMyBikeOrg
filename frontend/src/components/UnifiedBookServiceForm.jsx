import React, { useState } from 'react';
import { FaMotorcycle, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTools, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import PaymentGateway from './PaymentGateway';

// Service options (can be passed as props if needed)
const defaultServices = [
  { id: 'wash-polish', name: 'Wash & Polish', price: 300, description: 'Professional bike cleaning and polishing' },
  { id: 'engine-service', name: 'Engine Service', price: 800, description: 'Complete engine maintenance and repair' },
  { id: 'general-service', name: 'General Service', price: 500, description: 'Regular maintenance and tune-up' },
  { id: 'major-repairs', name: 'Major Repairs', price: 1200, description: 'Complex repair and restoration work' },
  { id: 'breakdown', name: 'Breakdown Service', price: 600, description: '24/7 emergency breakdown assistance' },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM'
];

export default function UnifiedBookServiceForm({ onSubmit, onClose, services = defaultServices, loading = false, user }) {
  const [formData, setFormData] = useState({
    services: [],
    date: '',
    time: '',
    location: 'shop',
    bikeModel: '',
    bikeNumber: '',
    description: '',
    urgency: 'medium'
  });
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceSelect = (serviceId) => {
    setFormData(prev => {
      const currentServices = prev.services;
      if (currentServices.includes(serviceId)) {
        return { ...prev, services: currentServices.filter(id => id !== serviceId) };
      } else {
        return { ...prev, services: [...currentServices, serviceId] };
      }
    });
  };

  const getMinDate = () => {
    const today = new Date();
    if (formData.urgency === 'high') {
      return today.toISOString().split('T')[0];
    }
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const errors = {};
    
    if (formData.services.length === 0) {
      errors.services = 'Please select at least one service';
    }
    
    if (!formData.date) {
      errors.date = 'Please select a preferred date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (formData.urgency === 'high' && selectedDate < today) {
        errors.date = 'For urgent service, please select today or a future date';
      } else if (formData.urgency !== 'high' && selectedDate <= today) {
        errors.date = 'Please select a future date for regular service';
      }
    }
    
    if (!formData.time) {
      errors.time = 'Please select a preferred time';
    }
    
    if (!formData.bikeModel.trim()) {
      errors.bikeModel = 'Please enter your bike model';
    } else if (formData.bikeModel.trim().length < 3) {
      errors.bikeModel = 'Bike model must be at least 3 characters';
    }
    
    if (!formData.bikeNumber.trim()) {
      errors.bikeNumber = 'Please enter your bike number';
    } else {
      // More flexible bike number validation for Indian format
      const bikeNumber = formData.bikeNumber.trim().toUpperCase();
      const bikeNumberRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;
      if (!bikeNumberRegex.test(bikeNumber)) {
        errors.bikeNumber = 'Please enter a valid bike number (e.g., MH12AB1234, DL01A1234)';
      }
    }
    
    if (formData.description.trim() && formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters if provided';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Prepare booking data
    const totalAmount = formData.services.reduce((total, id) => {
      const service = services.find(s => s.id === id);
      return total + (service?.price || 0);
    }, 0);

    const bookingData = {
      ...formData,
      totalAmount,
      customerName: user?.username || user?.email || 'Customer',
      bookingId: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      serviceNames: formData.services.map(id => {
        const service = services.find(s => s.id === id);
        return service?.name || '';
      }).filter(Boolean)
    };

    setBookingData(bookingData);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentResult) => {
    // Combine booking data with payment result
    const finalBookingData = {
      ...bookingData,
      payment: paymentResult,
      status: 'confirmed'
    };
    
    if (onSubmit) {
      onSubmit(finalBookingData);
    }
    
    setShowPayment(false);
    setBookingData(null);
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    setShowPayment(false);
    setBookingData(null);
  };

  const getTotalAmount = () => {
    return formData.services.reduce((total, id) => {
      const service = services.find(s => s.id === id);
      return total + (service?.price || 0);
    }, 0);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-4 md:p-8 border border-green-100">
        <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4 md:mb-6 text-center">Book a Bike Service</h2>
        {onClose && (
          <button onClick={onClose} className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-green-600 text-xl md:text-2xl">&times;</button>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* Service Selection */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Select Service</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-3 md:p-4 border-2 rounded-lg cursor-pointer transition duration-300 ${
                    formData.services.includes(service.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <FaTools className="w-5 h-5 md:w-6 md:h-6 text-green-600 mr-2" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">{service.name}</h4>
                      <p className="text-green-600 font-medium text-sm md:text-base">{formatAmount(service.price)}</p>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
            {formErrors.services && (
              <p className="text-red-500 text-sm mt-2">{formErrors.services}</p>
            )}
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2" /> Preferred Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={getMinDate()}
                required
                className={`w-full p-2.5 md:p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base ${
                  formErrors.date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.date && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{formErrors.date}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2" /> Preferred Time
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className={`w-full p-2.5 md:p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base ${
                  formErrors.time ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {formErrors.time && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{formErrors.time}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['low','medium','high'].map(level => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setFormData(prev => ({...prev, urgency: level}))}
                    className={`px-3 py-2 rounded-lg border text-sm capitalize transition ${
                      formData.urgency === level
                        ? (level === 'high' ? 'border-red-500 bg-red-50 text-red-700' : level === 'medium' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-green-500 bg-green-50 text-green-700')
                        : 'border-gray-200 hover:border-green-300 text-gray-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">High urgency aims for same-day completion.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" /> Service Location
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="shop">At Shop</option>
                <option value="home">At Home</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMotorcycle className="inline mr-2" /> Bike Model
              </label>
              <input
                type="text"
                name="bikeModel"
                value={formData.bikeModel}
                onChange={handleChange}
                placeholder="e.g., Honda Activa, Bajaj Pulsar"
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formErrors.bikeModel ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.bikeModel && (
                <p className="text-red-500 text-sm mt-1">{formErrors.bikeModel}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMotorcycle className="inline mr-2" /> Bike Number
              </label>
              <input
                type="text"
                name="bikeNumber"
                value={formData.bikeNumber}
                onChange={handleChange}
                placeholder="e.g., MH12AB1234"
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  formErrors.bikeNumber ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.bikeNumber && (
                <p className="text-red-500 text-sm mt-1">{formErrors.bikeNumber}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaTools className="inline mr-2" /> Additional Details (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe any specific issues or requirements..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
            )}
          </div>

          {/* Receipt-style Summary */}
          {formData.services.length > 0 && (
            <div className="bg-white border border-green-200 shadow-sm rounded-xl p-6 my-4 max-w-lg mx-auto">
              <h3 className="font-bold text-green-800 text-lg mb-4 flex items-center">
                <span className="mr-2">🧾</span> Booking Receipt
              </h3>
              <div className="mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-600 border-b">
                      <th className="text-left py-1">Service</th>
                      <th className="text-right py-1">Price (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.services.map(id => {
                      const service = services.find(s => s.id === id);
                      return (
                        <tr key={id} className="border-b last:border-b-0">
                          <td className="py-1">{service?.name}</td>
                          <td className="py-1 text-right">{formatAmount(service?.price)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="font-semibold pt-2">Total</td>
                      <td className="font-semibold text-right pt-2">
                        {formatAmount(getTotalAmount())}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-700">
                <div>
                  <p><span className="font-medium">Location:</span> {formData.location === 'shop' ? 'At Shop' : 'At Home'}</p>
                  <p><span className="font-medium">Urgency:</span> <span className={
                    formData.urgency === 'high' ? 'text-red-600 font-bold' :
                    formData.urgency === 'medium' ? 'text-yellow-700 font-bold' :
                    'text-green-700 font-bold'
                  }>{formData.urgency.charAt(0).toUpperCase() + formData.urgency.slice(1)}</span></p>
                </div>
                <div>
                  <p><span className="font-medium">Date:</span> {formData.date}</p>
                  <p><span className="font-medium">Time:</span> {formData.time}</p>
                  <p><span className="font-medium">Bike:</span> {formData.bikeModel} ({formData.bikeNumber})</p>
                </div>
              </div>
              {formData.description && (
                <div className="mt-3 text-xs text-gray-600">
                  <span className="font-medium">Notes:</span> {formData.description}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading || formData.services.length === 0 || !formData.date || !formData.time || !formData.bikeModel || !formData.bikeNumber}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Booking...
                </>
              ) : (
                <>
                  <FaCreditCard className="w-4 h-4" />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Payment Gateway Modal */}
      {showPayment && bookingData && (
        <PaymentGateway
          amount={getTotalAmount()}
          bookingId={bookingData.bookingId}
          customerName={bookingData.customerName}
          serviceName={bookingData.serviceNames.join(', ')}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
          onClose={() => setShowPayment(false)}
        />
      )}
    </>
  );
}
