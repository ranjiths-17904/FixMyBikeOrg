import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/api/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (field, value) => {
    try {
      const response = await api.post('/api/auth/check-availability', { field, value });
      return response.data.available;
    } catch (error) {
      return false;
    }
  };

  const sendOTP = async (email, username, phone) => {
    try {
      const response = await api.post('/api/auth/send-otp', { email, username, phone });
      
      if (response.data.success) {
        toast.success('Verification code sent to your email!');
        if (response.data.previewUrl) {
          toast((t) => (
            <span>
              OTP email preview: <a href={response.data.previewUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Open</a>
            </span>
          ));
        }
        return { success: true, tempUserId: response.data.tempUserId };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send verification code';
      toast.error(message);
      throw new Error(message);
    }
  };

  const verifyOTP = async (tempUserId, otp, password) => {
    try {
      const response = await api.post('/api/auth/verify-otp', { tempUserId, otp, password });
      
      if (response.data.success) {
        const { token, user: newUser } = response.data;
        localStorage.setItem('token', token);
        setUser(newUser);
        toast.success('Account created successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const resendOTP = async (tempUserId) => {
    try {
      const response = await api.post('/api/auth/resend-otp', { tempUserId });
      
      if (response.data.success) {
        toast.success('New verification code sent!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend verification code';
      toast.error(message);
      throw new Error(message);
    }
  };

  const sendForgotPasswordOTP = async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      
      if (response.data.success) {
        toast.success('Password reset code sent to your email!');
        if (response.data.previewUrl) {
          toast((t) => (
            <span>
              OTP email preview: <a href={response.data.previewUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Open</a>
            </span>
          ));
        }
        return { success: true, userId: response.data.userId };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send password reset code';
      toast.error(message);
      throw new Error(message);
    }
  };

  const resetPasswordWithOTP = async (userId, otp, newPassword) => {
    try {
      const response = await api.post('/api/auth/reset-password', { userId, otp, newPassword });
      
      if (response.data.success) {
        toast.success('Password reset successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      throw new Error(message);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/api/auth/signup', userData);
      
      if (response.data.success) {
        const { token, user: newUser } = response.data;
        localStorage.setItem('token', token);
        setUser(newUser);
        toast.success('Account created successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const login = async (emailOrUser, password) => {
    try {
      console.log('Attempting login with:', { emailOrUser, hasPassword: !!password });
      
      const response = await api.post('/api/auth/login', {
        emailOrUser: emailOrUser,
        password: password,
      });

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        toast.success('Login successful!');
        console.log('Login successful for user:', user.username);
        return { success: true, user };
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (inputData) => {
    try {
      // Normalize payload to API contract: top-level fields + nested profile
      const { username, email, mobile, ...rest } = inputData || {};
      const profile = {
        address: rest.address,
        city: rest.city,
        state: rest.state,
        pincode: rest.pincode,
        shopName: rest.shopName,
        shopAddress: rest.shopAddress,
        avatarUrl: rest.avatarUrl
      };
      // Remove undefined keys
      Object.keys(profile).forEach((k) => profile[k] === undefined && delete profile[k]);
      const payload = { username, email, mobile };
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
      if (Object.keys(profile).length) payload.profile = profile;

      const response = await api.put('/api/auth/profile', payload);
      
      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return false;
      }

      const response = await api.get('/api/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
        return true;
      } else {
        localStorage.removeItem('token');
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Session check failed:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
        return false;
      }
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    sendOTP,
    verifyOTP,
    resendOTP,
    sendForgotPasswordOTP,
    resetPasswordWithOTP,
    checkAvailability,
    logout,
    updateProfile,
    checkSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
