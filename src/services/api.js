import axios from 'axios';

// Base URL for the backend API
// Using environment variables for flexible configuration
const API_HOST = process.env.EXPO_PUBLIC_API_HOST || 'localhost';
const API_PORT = process.env.EXPO_PUBLIC_API_PORT || '3001';
const API_PROTOCOL = process.env.EXPO_PUBLIC_API_PROTOCOL || 'http';
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || `${API_PROTOCOL}://${API_HOST}:${API_PORT}/api`;

console.log(`🔗 API Base URL: ${BASE_URL}`);

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network Error: Cannot connect to server at', BASE_URL);
      console.error('Please ensure:');
      console.error('1. Backend server is running on port 3001');
      console.error('2. You are connected to the same network');
      console.error('3. Firewall is not blocking the connection');
    } else {
      console.error('Response error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// API functions
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'User not found');
  }
};

export const checkInUser = async (userId, location = '', notes = '') => {
  try {
    const checkinData = {
      userId,
      location,
      notes,
      timestamp: new Date().toISOString(),
    };
    const response = await api.post('/checkin', checkinData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Check-in failed');
  }
};

export const getCheckInHistory = async (userId) => {
  try {
    const response = await api.get(`/checkin/history/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch check-in history');
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

export const getAllCheckIns = async () => {
  try {
    const response = await api.get('/checkin/all');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch all check-ins');
  }
};

export const getTodayCheckIns = async () => {
  try {
    const response = await api.get('/checkin/today');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch today\'s check-ins');
  }
};

export const getCheckInStats = async () => {
  try {
    const response = await api.get('/checkin/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch check-in statistics');
  }
};

export default api;
