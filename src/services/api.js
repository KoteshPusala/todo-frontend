import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`;

// Create axios instance with timeout
const api = axios.create({
  baseURL: API_URL,
  timeout: 20000, // 8 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
  return config;
}, (error) => {
  console.error('❌ API Request Error:', error);
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // If it's a 401 error, remove token and redirect to login
    if (error.response?.status === 401) {
      console.log('🔐 Unauthorized - removing token');
      localStorage.removeItem('token');
      // Don't redirect automatically, let the component handle it
    }
    
    return Promise.reject(error);
  }
);

export default api;