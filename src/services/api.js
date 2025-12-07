import axios from 'axios';

// IMPORTANT: Replace with your actual backend URL
const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the JWT token to every protected request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;