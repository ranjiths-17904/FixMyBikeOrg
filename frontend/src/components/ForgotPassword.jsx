import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner, FaArrowLeft, FaRedo } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = ({ onBack }) => {
  const { sendForgotPasswordOTP, resetPasswordWithOTP } = useAuth();
  
  const [step, setStep] = useState('email'); // 'email', 'otp', 'password'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [userId, setUserId] = useState(null);

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const validateEmail = () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateOTP = () => {
    if (otp.join('').length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePassword = () => {
    if (!newPassword) {
      setErrors({ password: 'New password is required' });
      return false;
    }
    if (newPassword.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateEmail()) return;
    
    setLoading(true);
    try {
      const result = await sendForgotPasswordOTP(email);
      if (result.success) {
        setUserId(result.userId);
        setStep('otp');
        setCountdown(60);
      }
    } catch (error) {
      // Error already handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP()) return;
    
    setStep('password');
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;
    
    setLoading(true);
    try {
      const result = await resetPasswordWithOTP(userId, otp.join(''), newPassword);
      if (result.success) {
        onBack(); // Go back to login
      }
    } catch (error) {
      // Error already handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await sendForgotPasswordOTP(email);
      setCountdown(60);
    } catch (error) {
      // Error already handled in context
    } finally {
      setResendLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Forgot Password?
          </h3>
          <p className="text-gray-600">
            Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={`pl-12 pr-4 py-4 w-full rounded-xl border-2 focus:ring-2 focus:ring-green-500 outline-none transition-all duration-200 ${
                errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <button
          onClick={handleSendOTP}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-semibold text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-3" />
              Sending Code...
            </span>
          ) : (
            'Send Reset Code'
          )}
        </button>

        <button
          onClick={onBack}
          className="w-full py-3 text-gray-600 hover:text-gray-800 font-semibold flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Login
        </button>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Enter Reset Code
          </h3>
          <p className="text-gray-600">
            We've sent a 6-digit code to{' '}
            <span className="font-semibold text-green-600">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Enter 6-Digit Code
          </label>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                name={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all duration-200 ${
                  errors.otp ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-red-500 text-sm text-center">{errors.otp}</p>
          )}
        </div>

        <button
          onClick={handleVerifyOTP}
          disabled={otp.join('').length !== 6}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-semibold text-lg"
        >
          Verify Code
        </button>

        <div className="text-center">
          <button
            onClick={handleResendOTP}
            disabled={resendLoading || countdown > 0}
            className="text-green-600 hover:text-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            {resendLoading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaRedo className="mr-2" />
            )}
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
          </button>
        </div>

        <button
          onClick={() => setStep('email')}
          className="w-full py-3 text-gray-600 hover:text-gray-800 font-semibold flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Email
        </button>
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Create New Password
          </h3>
          <p className="text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className={`pl-12 pr-12 py-4 w-full rounded-xl border-2 focus:ring-2 focus:ring-green-500 outline-none transition-all duration-200 ${
                errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={`pl-12 pr-12 py-4 w-full rounded-xl border-2 focus:ring-2 focus:ring-green-500 outline-none transition-all duration-200 ${
                errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-semibold text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-3" />
              Resetting Password...
            </span>
          ) : (
            'Reset Password'
          )}
        </button>

        <button
          onClick={() => setStep('otp')}
          className="w-full py-3 text-gray-600 hover:text-gray-800 font-semibold flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Code
        </button>
      </div>
    );
  }

  return null;
};

export default ForgotPassword;
