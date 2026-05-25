import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    // We will hook this up with Zustand store later if needed
    return config;
  },
  (error) => Promise.reject(error)
);
