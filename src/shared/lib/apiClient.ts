import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import { toast } from 'sonner';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh') && !originalRequest.url?.includes('/auth/login')) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token available');

        const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        });

       
        const currentUser = useAuthStore.getState().user;
        const currentCompany = useAuthStore.getState().company;
        
        if (currentUser && currentCompany) {
          useAuthStore.getState().setAuth(
            currentUser,
            currentCompany,
            data.accessToken,
            data.refreshToken
          );
        }

        
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        
        useAuthStore.getState().logout();
        window.location.href = '/auth/login'; 
        return Promise.reject(refreshError);
      }
    }

    const errorMessage = error.response?.data?.message || error.response?.data?.error || "Ha ocurrido un error inesperado. Intente nuevamente.";
    toast.error('Ocurrió un error', {
        description: errorMessage
      });

    return Promise.reject(error);
  }
);
