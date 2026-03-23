import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API errors
const handleError = (error) => {
  if (error.response) {
    const message = error.response.data?.detail || error.response.data?.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    throw new Error('Network error. Please check your connection.');
  } else {
    throw new Error('Unexpected error occurred');
  }
};

const adminService = {
  // User management
  async getUsers() {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  async updateUserRole(userId, role) {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // System configuration
  async getSystemConfig() {
    try {
      const response = await api.get('/admin/system-config');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  async updateSystemConfig(config) {
    try {
      const response = await api.put('/admin/system-config', config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default adminService;
