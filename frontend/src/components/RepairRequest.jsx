import React, { useState } from 'react';
import {
  MapPin, Calendar, Clock, AlertTriangle, CheckCircle
} from 'lucide-react';

const RepairRequest = () => {
  const [formData, setFormData] = useState({
    bikeType: '',
    issue: '',
    description: '',
    urgency: 'medium',
    preferredDate: '',
    preferredTime: '',
    location: 'pickup',
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const bikeTypes = ['Mountain Bike', 'Road Bike', 'City Bike', 'Electric Bike', 'BMX', 'Hybrid'];
  const commonIssues = [
    'Brake problems',
    'Gear shifting issues',
    'Chain problems',
    'Tire/wheel issues',
    'Electrical problems (e-bikes)',
    'Frame damage',
    'Other',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setShowCart(true);
    }, 2500);
  };

  const renderCart = () => (
    <div className="bg-green-600 p-10 rounded-xl shadow-lg border border-green-200 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Your Repair Summary</h2>
      <ul className="space-y-4 text-gray-700 text-lg">
        <li><strong>Bike Type:</strong> {formData.bikeType}</li>
        <li><strong>Issue:</strong> {formData.issue}</li>
        <li><strong>Description:</strong> {formData.description}</li>
        <li><strong>Urgency:</strong> {formData.urgency}</li>
        <li><strong>Date:</strong> {formData.preferredDate}</li>
        <li><strong>Time:</strong> {formData.preferredTime}</li>
        <li><strong>Location:</strong> {formData.location}</li>
      </ul>
      <button
        onClick={() => {
          setShowCart(false);
          setFormData({
            bikeType: '',
            issue: '',
            description: '',
            urgency: 'medium',
            preferredDate: '',
            preferredTime: '',
            location: 'pickup',
          });
        }}
        className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Make Another Request
      </button>
    </div>
  );

  const urgencyColors = {
    low: 'bg-green-100 border-green-500 text-green-700',
    medium: 'bg-orange-100 border-orange-400 text-orange-600',
    high: 'bg-red-100 border-red-500 text-red-700'
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-3xl mt-12 border border-green-100">
      {showPopup && (
        <div className="fixed inset-0 bg-green-100 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-700">Request Submitted!</h3>
            <p className="text-gray-600 mt-2">We’ll contact you shortly to confirm your repair.</p>
          </div>
        </div>
      )}

      {!showCart ? (
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-green-800">Book a Bike Repair</h2>
            <p className="text-gray-500 mt-2">Fill in your details and we’ll get it fixed!</p>
          </div>

          {/* Bike Info */}
          <section>
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Bike Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-green-800 font-medium mb-2">Bike Type</label>
                <select
                  value={formData.bikeType}
                  onChange={(e) => setFormData({ ...formData, bikeType: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3"
                  required
                >
                  <option value="">Select bike type</option>
                  {bikeTypes.map(type => <option key={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-green-800 font-medium mb-2">Issue</label>
                <select
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3"
                  required
                >
                  <option value="">Select issue type</option>
                  {commonIssues.map(issue => <option key={issue}>{issue}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Description */}
          <section>
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Issue Description</h3>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Describe your bike's issue..."
              required
            />
          </section>

          {/* Urgency */}
          <section>
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Urgency Level</h3>
            <div className="flex gap-4">
              {['low', 'medium', 'high'].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: level })}
                  className={`px-6 py-4 rounded-xl border-2 font-medium capitalize transition-all duration-200 ${
                    formData.urgency === level ? urgencyColors[level] : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {level === 'high' && <AlertTriangle className="inline mr-2 h-5 w-5" />}
                  {level}
                </button>
              ))}
            </div>
          </section>

          {/* Preferences */}
          <section>
            <h3 className="text-2xl font-semibold text-green-900 mb-4">Service Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-800 mb-2">Preferred Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-green-400" />
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-800 mb-2">Preferred Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-green-400" />
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (9AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 8PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              {['pickup', 'dropoff'].map(loc => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setFormData({ ...formData, location: loc })}
                  className={`p-5 border-2 rounded-xl text-center transition ${
                    formData.location === loc ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <MapPin className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-semibold capitalize">{loc}</p>
                  <p className="text-xs">{loc === 'pickup' ? 'We’ll collect your bike' : 'Bring it to our shop'}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg text-lg font-semibold transition"
            >
              Submit Repair Request
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              We’ll contact you shortly to confirm your booking
            </p>
          </div>
        </form>
      ) : renderCart()}
    </div>
  );
};

export default RepairRequest;
