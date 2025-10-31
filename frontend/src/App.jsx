// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Public Pages
import Home from './pages/Home';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import BookService from './pages/customer/BookService';
import ServiceHistory from './pages/customer/ServiceHistory';
import CustomerProfile from './pages/customer/CustomerProfile';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import BookingManagement from './pages/owner/BookingManagement';
import OwnerProfile from './pages/owner/Profile';
import Analytics from './pages/owner/Analytics';
import LocationPage from './components/Location';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import NotificationTest from './components/NotificationTest';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/location" element={<LocationPage />} />
      <Route path="/notification-test" element={<NotificationTest />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'owner' ? '/owner/dashboard' : '/customer/dashboard'} />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to={user.role === 'owner' ? '/owner/dashboard' : '/customer/dashboard'} />} />

      {/* Customer Routes */}
      <Route path="/customer" element={<ProtectedRoute role="customer" />}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="book-service" element={<BookService />} />
        <Route path="service-history" element={<ServiceHistory />} />
        <Route path="profile" element={<CustomerProfile />} />

       

      </Route>

      {/* Owner Routes */}
      <Route path="/owner" element={<ProtectedRoute role="owner" />}>
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<OwnerProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="app-wrapper">
            <div className="min-h-screen bg-gray-50">
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
