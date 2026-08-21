import axios from 'axios';

// Vite default base url matches our backend ports
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token for admin endpoints
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Format Axios responses to return response.data directly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(errMsg));
  }
);

export default api;
