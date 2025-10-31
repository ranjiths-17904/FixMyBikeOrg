// SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaSpinner,
  FaArrowLeft
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import OTPVerification from '../components/OTPVerification';
import Logo from '../assets/image/TopLogo.png';

const SignUp = () => {
  const navigate = useNavigate();
  const { sendOTP } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // OTP states
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await sendOTP(
        formData.email,
        formData.username,
        formData.phone
      );
      if (result.success) {
        setTempUserId(result.tempUserId);
        setShowOTPVerification(true);
      }
    } catch (error) {
      console.error('OTP send error:', error);
      setErrors({
        general:
          error.message || 'Failed to send verification code. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPBack = () => {
    setShowOTPVerification(false);
    setTempUserId(null);
  };

  const handleOTPSuccess = () => {
    navigate('/customer/dashboard');
  };

  if (showOTPVerification) {
    return (
      <OTPVerification
        tempUserId={tempUserId}
        email={formData.email}
        username={formData.username}
        password={formData.password}
        onBack={handleOTPBack}
        onSuccess={handleOTPSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-200 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Decorative gradient ring */}
        <div className="absolute inset-0 -z-10 blur-xl opacity-70 bg-gradient-to-tr from-green-200 via-emerald-200 to-green-50 rounded-3xl"></div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl ring-1 ring-gray-100 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-md ring-1 ring-gray-200 bg-white">
                <img
                  src={Logo}
                  alt="FixMyBike Logo"
                  className="w-12 h-12 object-contain"
                />
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Join FixMyBike — your trusted bike service partner
            </p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 ${
                    errors.username ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Enter username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Enter 10-digit phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Create password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-green-400 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP & Continue'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
