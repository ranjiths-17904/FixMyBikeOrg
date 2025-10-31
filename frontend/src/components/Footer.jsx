import React from 'react';
import {
  Bike,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl">
                <Bike className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  FixMyBike
                </h3>
                <p className="text-xs text-gray-400">Save time. Ride better</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              FixMyBike is a reliable bike repair and maintenance platform offering quick, affordable, and doorstep service.
            </p>

            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-green-600 p-3 rounded-lg transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-green-600 p-3 rounded-lg transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-green-600 p-3 rounded-lg transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-green-600 p-3 rounded-lg transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#hero" className="text-gray-300 hover:text-green-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-green-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-green-400 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#rideLog" className="text-gray-300 hover:text-green-400 transition-colors">
                 RideLog
                </a>
              </li>
              <li>
                <a href="/location" className="text-gray-300 hover:text-green-400 transition-colors">
                  PitStop
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Report Issue
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-400 mt-1" />
                <div>
                  <p className="text-gray-300">Coimbatore , TamilNadu</p>
                  {/* <p className="text-gray-300">Eco City, EC 12345</p> */}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">7395860255</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">owner@fixmybike.com</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h5 className="font-semibold text-green-400 mb-2">24/7 Support</h5>
              <p className="text-sm text-gray-300">
                Need help? Our support team is available around the clock to assist you.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 FixMyBike. All rights reserved. Making cities greener, one ride at a time.
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-400">
              <span>Available 24/7</span>
              <span>•</span>
              <span>2,500+ Bikes</span>
              <span>•</span>
              <span>Zero Emissions</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
