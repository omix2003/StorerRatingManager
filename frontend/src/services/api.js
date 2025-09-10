import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  logout: () => api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getDashboardStats: () => api.get('/users/dashboard/stats'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
};

// Stores API
export const storesAPI = {
  getAll: (params) => api.get('/stores', { params }),
  getById: (id) => api.get(`/stores/${id}`),
  create: (storeData) => api.post('/stores', storeData),
  update: (id, storeData) => api.put(`/stores/${id}`, storeData),
  delete: (id) => api.delete(`/stores/${id}`),
  getRatings: (id, params) => api.get(`/stores/${id}/ratings`, { params }),
  // Store owner specific endpoints
  getMyStores: (params) => api.get('/stores/my/stores', { params }),
  getMyStoreRatings: (params) => api.get('/stores/my/ratings', { params }),
  getMyStoreStats: () => api.get('/stores/my/stats'),
};

// Ratings API
export const ratingsAPI = {
  getAll: (params) => api.get('/ratings', { params }),
  getById: (id) => api.get(`/ratings/${id}`),
  create: (ratingData) => api.post('/ratings', ratingData),
  update: (id, ratingData) => api.put(`/ratings/${id}`, ratingData),
  delete: (id) => api.delete(`/ratings/${id}`),
  getMyRatings: (params) => api.get('/ratings/my-ratings', { params }),
};

export default api;
