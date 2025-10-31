import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import BikeServices from '../components/BikeServices';
import OurProgress from '../components/OurProgress';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import FloatingNotificationCard from '../components/FloatingNotificationCard';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookService = () => {
    if (user) {
      navigate('/customer/book-service');
    } else {
      navigate('/login');
    }
  };

  const handleMenuClick = () => {
    // Mobile menu functionality
    // Handled inside Header
  };

  return (
    <div className="min-h-screen">
      <Header onMenuClick={handleMenuClick} />
      <Hero onBookService={handleBookService} />
      <About />
      <BikeServices />
      <OurProgress />
      <Footer />
      <ChatBot />
      <FloatingNotificationCard />
    </div>
  );
};

export default Home;
