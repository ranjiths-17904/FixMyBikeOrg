import React from 'react';
import { ArrowRight, Play, Zap, Leaf, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import image from '../assets/image/HeroMain.png';

export default function Hero({ onBookService }) {
  const navigate = useNavigate();
  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-green-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-emerald-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 border-2 border-teal-500 rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <Leaf className="h-4 w-4" />
                <span>100%  Dedicated to Two-Wheelers </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-800">FixMy</span>
                <span className="bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent block">
                  Bike
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                FixMyBike is a reliable bike repair and maintenance platform offering quick, affordable, and doorstep service.
                It is managed by a single admin-owner, ensuring personalized care and smooth operations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onBookService}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>Book Services</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button onClick={() => navigate('/location')} className="border-2 border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center space-x-2 group">
                <MapPin className="h-5 w-4 group-hover:text-green-600" />
                <span>Pitstop</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-4">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">2.5k+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>

              <div className="text-center mb-6">
                <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Leaf className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">Real-Time</div>
                <div className="text-sm text-gray-600">Service Updates</div>
              </div>
            </div>
          </div>

          <div className="relative mb-16">
            <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30">
              <img
                src={image}
                alt="Green Bike"
                className="w-96 h-80 rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                <Leaf className="h-6 w-6" />
              </div>
            </div>

            <div className="flex absolute -top-12 -left-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/50 sm:block">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-gray-700 ">Available to Book Now</span>
              </div>
            </div>

            <div className="flex absolute -bottom-16 -right-2 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 sm:block">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">Affordable</div>
                <div className="text-xs text-gray-600">Repairs, Assured</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
