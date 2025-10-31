  import React from 'react';
  import { useNavigate } from 'react-router-dom';
  import { FaMapMarkerAlt, FaPhone, FaClock, FaStar, FaArrowLeft, FaDirections, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
  import { toast } from 'react-hot-toast';
  import FloatingNotificationCard from './FloatingNotificationCard';
  import logo from '../assets/image/FixMyBike New Logo.png'

  const Location = () => {
    const navigate = useNavigate();

    const shopInfo = {
      name: "FixMyBike Service Center",
      address: "123 Bike Street, Coimbatore District",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641001",
      phone: "+917395860211",
      whatsapp: "+917395860211",
      email: "ownerfixmybike@gmail.com",
      hours: "24/7 Available",
      rating: 4.8,
      reviews: 127,
      coordinates: { lat: 40.7128, lng: -74.0060 } // demo coords
    };

    const handleContact = (method) => {
      switch (method) {
        case 'phone':
          window.open(`tel:${shopInfo.phone}`);
          break;
        case 'whatsapp':
          window.open(`https://wa.me/${shopInfo.whatsapp.replace(/\D/g, '')}`);
          break;
        case 'email':
          window.open(`mailto:${shopInfo.email}`);
          break;
        case 'directions':
          const url = `https://www.google.com/maps/dir/?api=1&destination=${shopInfo.coordinates.lat},${shopInfo.coordinates.lng}`;
          window.open(url, '_blank');
          break;
        default:
          break;
      }
    };

    const handleBookService = () => {
      navigate('/customer/book-service');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
       
          <div className="bg-white border-b border-gray-200 shadow">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              {/* Logo on Left */}
            <div className="flex items-center gap-2">
              <img
                src= {logo}
                alt="FixMyBike Logo"
                className="h-12 w-12 object-contain"
              />
            </div>

            {/* Center Text */}
            <h2 className="text-green-800 font-semibold text-xl absolute left-1/2 transform -translate-x-1/2">
              PitStop
            </h2>
          </div>
        </div>

        {/* Main Header Section */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:text-green-200 transition-colors"
              >
                <FaArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold mb-2 ml-2">Find Our Shop</h1>
                <p className="text-green-100 text-base ml-2">Visit us for the best bike service experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Map */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">📍 Location</h2>
                  <p className="text-gray-600">Find us on the map below</p>
                </div>
                <div className="h-80 bg-gray-100 relative">
                  <iframe
                    title="FixMyBike Location"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${shopInfo.coordinates.lat},${shopInfo.coordinates.lng}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleContact('directions')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
                    >
                      <FaDirections className="h-4 w-4" />
                      Directions
                    </button>
                  </div>
                </div>
              </div>

              {/* Shop Details */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <FaMapMarkerAlt className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{shopInfo.name}</h3>
                    <div className="flex items-center gap-2 text-green-600">
                      <FaStar className="h-5 w-5 fill-current" />
                      <span className="font-semibold">{shopInfo.rating}</span>
                      <span className="text-gray-500">({shopInfo.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{shopInfo.address}</p>
                      <p className="text-gray-600">{shopInfo.city}, {shopInfo.state} {shopInfo.pincode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaPhone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{shopInfo.phone}</p>
                      <p className="text-gray-600">Call us anytime</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaClock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{shopInfo.hours}</p>
                      <p className="text-gray-600">Emergency services available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">🚀 Quick Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={handleBookService}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <span>Book a Service</span>
                    <span>→</span>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleContact('phone')}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FaPhone className="h-4 w-4" />
                      Call Now
                    </button>
                    <button
                      onClick={() => handleContact('whatsapp')}
                      className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FaWhatsapp className="h-4 w-4" />
                      WhatsApp
                    </button>
                  </div>

                  <button
                    onClick={() => handleContact('email')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEnvelope className="h-4 w-4" />
                    Send Email
                  </button>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4">✨ Why Choose FixMyBike?</h3>
                <div className="space-y-3">
                  {["24/7 Emergency Service", "Certified Mechanics", "Genuine Parts", "Warranty on Services", "Competitive Pricing"].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">🕒 Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-green-600 font-semibold">6:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium">Saturday</span>
                    <span className="text-green-600 font-semibold">7:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium">Sunday</span>
                    <span className="text-green-600 font-semibold">8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-red-600">Emergency Service</span>
                    <span className="text-red-600 font-semibold">24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Notification Card */}
        <FloatingNotificationCard />
      </div>
    );
  };

  export default Location;
  // This component displays the location of the bike service center, including a map, contact information, and quick actions for booking services or contacting the shop.