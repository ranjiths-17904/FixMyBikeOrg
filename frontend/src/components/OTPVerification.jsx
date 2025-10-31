import React, { useState, useEffect } from 'react';
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaArrowLeft,
  FaRedo
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const OTPVerification = ({
  tempUserId,
  email,
  username,
  password,
  onBack,
  onSuccess
}) => {
  const { verifyOTP, resendOTP } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(
        `input[name="otp-${index + 1}"]`
      );
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name="otp-${index - 1}"]`
      );
      if (prevInput) prevInput.focus();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate OTP
    if (otp.join('').length !== 6) {
      newErrors.otp = 'Please enter the complete 6-digit code';
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await verifyOTP(tempUserId, otp.join(''), password);
      if (result.success) {
        onSuccess();
      }
    } catch (error) {
      // Error is already handled in the context
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendOTP(tempUserId);
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      // Error is already handled in the context
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-200 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-3xl font-extrabold text-gray-800 mb-2">
            Verify Your Email
          </h3>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to{' '}
            <span className="font-semibold text-green-600">{email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 text-center">
            Enter Verification Code
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
                  errors.otp
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-red-500 text-sm text-center">{errors.otp}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className={`pl-12 pr-12 py-4 w-full rounded-xl border-2 focus:ring-2 focus:ring-green-500 outline-none transition-all duration-200 ${
                errors.confirmPassword
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-semibold text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <FaSpinner className="animate-spin mr-3" />
              Verifying...
            </span>
          ) : (
            'Complete Registration'
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-gray-600 mb-3">Didn't receive the code?</p>
          <button
            onClick={handleResend}
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

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full py-3 text-gray-600 hover:text-gray-800 font-semibold flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Registration
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
