import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaFacebookF, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import ForgotPassword from '../components/ForgotPassword';
import Logo from '../assets/image/TopLogo.png';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async () => {
    if (!emailOrUser || !password) {
      toast.error('Please enter both email/username and password');
      return;
    }

    setLoading(true);
    try {
      const result = await login(emailOrUser, password);
      if (result.success) {
        if (result.user.role === 'owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }
    } catch (error) {
      // Error is already handled by AuthContext with toast
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="bg-white rounded-2xl shadow-xl px-10 py-10 w-full max-w-md text-center border border-green-100">
          <ForgotPassword onBack={() => setShowForgotPassword(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="bg-white rounded-2xl shadow-xl px-10 py-10 w-full max-w-md text-center border border-green-100">
        <div className="flex justify-center mb-6">
          <div className="p-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500">
            <img src={Logo} alt="Logo" className="w-24 h-24 rounded-full object-contain bg-white" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700 mb-6">Welcome Back</h2>

        <div className="relative mb-4">
          <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Username or Email"
            value={emailOrUser}
            onChange={(e) => setEmailOrUser(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div className="relative mb-4">
          <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
          />
          <button
            type="button"
            aria-label="Toggle password visibility"
            onClick={() => setShowPassword(s => !s)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition duration-300 mb-4 disabled:opacity-50 disabled:cursor-not-allowed shadow"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <button
          onClick={() => setShowForgotPassword(true)}
          className="w-full py-2 text-green-600 hover:text-green-700 font-medium text-sm mb-4"
        >
          Forgot Password?
        </button>

        <p className="text-sm text-gray-500 mb-2">or sign in with</p>

        <div className="flex justify-center gap-4 mb-4">
          <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"><FaFacebookF /></button>
          <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"><FaGoogle /></button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-500 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
