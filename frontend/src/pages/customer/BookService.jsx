import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import UnifiedBookServiceForm from '../../components/UnifiedBookServiceForm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FloatingNotificationCard from '../../components/FloatingNotificationCard';

const BookService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const services = [
    { id: 'wash-polish', name: 'Wash & Polish', price: 300, description: 'Professional bike cleaning and polishing' },
    { id: 'engine-service', name: 'Engine Service', price: 800, description: 'Complete engine maintenance and repair' },
    { id: 'general-service', name: 'General Service', price: 500, description: 'Regular maintenance and tune-up' },
    { id: 'major-repairs', name: 'Major Repairs', price: 1200, description: 'Complex repair and restoration work' },
    { id: 'breakdown', name: 'Breakdown Service', price: 600, description: '24/7 emergency breakdown assistance' },
  ];

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const bookingPromises = formData.services.map(serviceId => {
        const selectedService = services.find(s => s.id === serviceId);
        const bookingData = {
          service: serviceId,
          serviceName: selectedService.name,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          bikeModel: formData.bikeModel,
          bikeNumber: formData.bikeNumber,
          description: formData.description,
          urgency: formData.urgency,
          cost: selectedService.price
        };
        return api.post('/api/bookings', bookingData);
      });

      await Promise.all(bookingPromises);
      toast.success(`${formData.services.length} booking(s) created successfully!`);
      navigate('/customer/dashboard');
    } catch (error) {
      console.error('Error booking service:', error);
      const message = error.response?.data?.message || 'Failed to create booking';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <Header />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <UnifiedBookServiceForm onSubmit={handleSubmit} services={services} loading={loading} />
      </div>
      <Footer />
      <FloatingNotificationCard />
    </div>
  );
};

export default BookService;
