// Authentication utility functions
import axios from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4009/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Check for both sellerToken and regular token
    const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login/register page and not during logout
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register' || currentPath === '/seller-login';
      const isLoggingOut = localStorage.getItem('loggingOut') === 'true';
      
      if (!isAuthPage && !isLoggingOut) {
        console.log('🔐 Token expired or invalid, clearing auth data');
        clearAuthData();
        // Use React Router navigation instead of window.location
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Validate current token with backend
export const validateToken = async () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return { isValid: false, user: null };
  }

  try {
    const response = await api.get('/auth/verify');
    return { 
      isValid: true, 
      user: response.data.user || JSON.parse(user) 
    };
  } catch (error) {
    console.log('🔐 Token validation failed:', error.message);
    return { isValid: false, user: null };
  }
};

// Clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('sellerToken');
  localStorage.removeItem('seller');
  localStorage.removeItem('deliveryToken');
  // Don't force page reload - let React handle navigation
};

// Login function
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.token && response.data.user) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { success: true, user: response.data.user };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    return { success: false, error: message };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user?.role === role;
};

// Logout function
export const logout = () => {
  clearAuthData();
};

// Export configured axios instance
export { api };
export default api;