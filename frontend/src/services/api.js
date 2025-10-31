import axios from 'axios';
import toast from 'react-hot-toast';

const resolvedBaseUrl = 'https://fixmybike-server.onrender.com';

// Add fallback for development
const isDevelopment = import.meta.env.DEV;
const baseUrl = isDevelopment ? 'http://localhost:5001' : resolvedBaseUrl;

// Debug logging
console.log('API Configuration:', {
  isDevelopment,
  baseUrl,
  resolvedBaseUrl,
  currentEnv: import.meta.env.MODE
});

const api = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging for requests
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL}${config.url}`,
      hasToken: !!token
    });
    
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Debug logging for successful responses
    console.log('API Response Success:', {
      status: response.status,
      url: response.config?.url,
      method: response.config?.method
    });
    return response;
  },
  (error) => {
    // Enhanced error logging for debugging
    const errorInfo = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      baseURL: error.config?.baseURL,
      fullUrl: error.config?.baseURL ? `${error.config?.baseURL}${error.config?.url}` : error.config?.url
    };
    
    console.error('API Error Details:', errorInfo);

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.log('401 Unauthorized - Clearing token and redirecting to login');
          localStorage.removeItem('token');
          
          // Only redirect if not already on login page and not on signup page
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
            // Add a small delay to prevent immediate redirect
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          }
          
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('Access denied. You do not have permission for this action.');
          break;
        case 404:
          console.error('404 Error - Resource not found:', errorInfo);
          toast.error('Resource not found. Please check the URL.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data?.message || 'An error occurred. Please try again.');
      }
    } else if (error.request) {
      console.error('Network Error - No response received:', error.request);
      toast.error('Network error. Please check your connection and try again.');
    } else {
      console.error('Unexpected Error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
