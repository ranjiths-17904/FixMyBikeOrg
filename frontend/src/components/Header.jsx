import React, { useState, useEffect } from 'react';
import { MapPin, User, Menu, Bell, LogOut, X, Settings, BarChart3, Home, Info, Wrench, TrendingUp } from 'lucide-react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import logo from '../assets/image/FixMyBikeHeaderLogo.png';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { unreadCount, notifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
      if (showProfileMenu && !event.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showProfileMenu]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const formatNotificationTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return notificationDate.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_created':
        return '📅';
      case 'booking_confirmed':
        return '✅';
      case 'booking_completed':
        return '🎉';
      case 'booking_cancelled':
        return '❌';
      case 'booking_rejected':
        return '🚫';
      case 'status_update':
        return '🔄';
      default:
        return '🔔';
    }
  };

  return (
    <header className={`bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-xl' : ''}`} role="navigation">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-16 min-h-[4rem]">
          {/* Logo */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 cursor-pointer shrink-0" onClick={() => navigate('/')}> 
            <img src={logo} alt="FixMyBike Logo" className="h-10 w-10 sm:h-8 sm:w-8 lg:h-10 lg:w-10 object-contain" />
            <div className="min-w-0 hidden sm:block">
              <h1 className="text-sm sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent truncate">
                FixMyBike
              </h1>
              <p className="text-xs text-gray-500 truncate">Save time. Ride better</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg ml-1 font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                FixMyBike
              </h1>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" aria-label="Primary">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center gap-2"
            >
              {/* <Home className="h-4 w-4" /> */}
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center gap-2"
            >
              {/* <Info className="h-4 w-4" /> */}
              About
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center gap-2"
            >
              {/* <Wrench className="h-4 w-4" /> */}
              Services
            </button>
            {location.pathname === '/' && (
              <button 
                onClick={() => scrollToSection('progress')} 
                className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center gap-2"
              >
                {/* <TrendingUp className="h-4 w-4" /> */}
                Our Progress
              </button>
            )}
            {user && (
              <Link 
                to={user.role === 'owner' ? '/owner/dashboard' : '/customer/dashboard'} 
                className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center gap-2"
              >
                {/* <BarChart3 className="h-4 w-4" /> */}
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            {!user ? (
              <>
                {/* Find Shop(Pitstop) - Hidden on mobile */}
                <button onClick={() => navigate('/location')} className="hidden md:flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Pitstop</span>
                </button>

                {/* Sign Up - Responsive */}
                <Link
                  to="/signup"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 lg:px-6 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 text-sm sm:text-base"
                >
                  <User className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Sign Up</span>
                </Link>
              </>
            ) : (
              <>
                {/* Pitstop - Hidden on mobile */}
                <button onClick={() => navigate('/location')} className="hidden md:flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Pitstop</span>
                </button>

                {/* Notifications - Desktop */}
                <div className="relative notification-dropdown hidden md:block">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors relative"
                  >
                    <Bell className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Ping</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto right-0" style={{ top: '100%' }}>
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Ping</h3>
                      </div>
                      <div className="p-2">
                        {notifications.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No notifications</p>
                        ) : (
                          notifications.slice(0, 5).map((notification) => (
                            <div
                              key={notification._id}
                              className={`p-3 rounded-lg transition-colors ${
                                notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-l-blue-500'
                              } mb-2`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-800">
                                    {notification.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatNotificationTime(notification.createdAt)}
                                  </p>
                                </div>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                        {notifications.length > 5 && (
                          <div className="text-center py-2">
                            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                              View all notifications
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile - Desktop */}
                <div className="relative profile-dropdown hidden md:block">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 px-3 py-2 rounded-lg transition-colors relative"
                    title="Profile"
                  >
                    <User className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">Profile</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 right-0" style={{ top: '100%' }}>
                      <div className="px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-semibold text-red-600">{user?.username || user?.email || 'User'}</span>
                      </div>
                      <button 
                        onClick={() => {
                          navigate(user.role === 'owner' ? '/owner/profile' : '/customer/profile');
                          setShowProfileMenu(false);
                        }} 
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Manage
                      </button>
                      <button 
                        onClick={() => {
                          navigate(user.role === 'owner' ? '/owner/dashboard' : '/customer/dashboard');
                          setShowProfileMenu(false);
                        }} 
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Dashboard
                      </button>
                    </div>
                  )}
                </div>

                {/* Logout - Always visible */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

            {/* Mobile Menu Button - Always visible on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors relative"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar - Integrated into header */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 shadow-lg transition-all duration-300 ease-in-out w-80">
          <div className="w-full px-3 py-3">
            {/* Mobile Notifications Section */}
            {user && (
              <div className="bg-white/20 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium flex items-center gap-2 text-sm">
                    <Bell className="h-3 w-3" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </h3>
                </div>
                
                {showMobileNotifications ? (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-white/70 text-xs text-center py-1">No notifications</p>
                    ) : (
                      notifications.slice(0, 2).map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-2 rounded-lg transition-colors ${
                            notification.isRead ? 'bg-white/10' : 'bg-white/20 border-l-2 border-l-yellow-400'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1">
                              <h4 className="text-white text-xs font-medium">
                                {notification.title}
                              </h4>
                              <p className="text-white/80 text-xs mt-1">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowMobileNotifications(true)}
                    className="w-full text-left text-white/80 hover:text-white text-xs py-1"
                  >
                    {notifications.length === 0 ? 'No new notifications' : `View ${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`}
                  </button>
                )}
                
                {showMobileNotifications && (
                  <button
                    onClick={() => setShowMobileNotifications(false)}
                    className="text-white/60 hover:text-white text-xs mt-1"
                  >
                    Hide notifications
                  </button>
                )}
              </div>
            )}

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-2 mb-3" aria-label="Mobile">
              <button onClick={() => {scrollToSection('hero'); setMobileMenuOpen(false);}} className="text-base text-white hover:text-green-200 transition-colors flex items-center gap-3 py-1.5">
                <Home className="h-4 w-4" />
                Home
              </button>
              <button onClick={() => {scrollToSection('about'); setMobileMenuOpen(false);}} className="text-base text-white hover:text-green-200 transition-colors flex items-center gap-3 py-1.5">
                <Info className="h-4 w-4" />
                About
              </button>
              <button onClick={() => {scrollToSection('services'); setMobileMenuOpen(false);}} className="text-base text-white hover:text-green-200 transition-colors flex items-center gap-3 py-1.5">
                <Wrench className="h-4 w-4" />
                Services
              </button>
              {location.pathname === '/' && (
                <button onClick={() => {scrollToSection('progress'); setMobileMenuOpen(false);}} className="text-base text-white hover:text-green-200 transition-colors flex items-center gap-3 py-1.5">
                  <TrendingUp className="h-4 w-4" />
                  RideLog
                </button>
              )}
              <button onClick={() => {navigate('/location'); setMobileMenuOpen(false);}} className="text-base text-white hover:text-green-200 transition-colors flex items-center gap-3 py-1.5">
                <MapPin className="h-4 w-4" />
                Pitstop
              </button>
              {user && (
                <Link to={user.role === 'owner' ? '/owner/dashboard' : '/customer/dashboard'} onClick={() => setMobileMenuOpen(false)} className="text-base text-white hover:text-green-200 transition-colors flex items-center gap-3 py-1.5">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
            </nav>
            
            {/* Mobile Action Buttons */}
            <div className="flex flex-col gap-3">
              {!user ? (
                <>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="bg-white hover:bg-green-100 text-green-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2 justify-center transition-colors">
                    <User className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className="bg-white/20 rounded-lg p-4 mb-3">
                    <p className="text-white text-sm mb-3">Profile Actions</p>
                    <div className="mb-3 px-3 py-2 bg-white/10 rounded">
                      <span className="text-white text-sm font-semibold">{user?.username || user?.email || 'User'}</span>
                    </div>
                    <div className="space-y-2">
                      <button onClick={() => {navigate(user.role==='owner'?'/owner/profile':'/customer/profile'); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 rounded bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Manage
                      </button>
                      <button onClick={() => {navigate(user.role==='owner'?'/owner/dashboard':'/customer/dashboard'); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 rounded bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Dashboard
                      </button>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2 justify-center">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
