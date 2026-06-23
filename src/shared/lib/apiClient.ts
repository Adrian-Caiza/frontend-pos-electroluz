import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import { toast } from 'sonner';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach access token
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

// Response Interceptor: Handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops if refresh itself fails
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh') && !originalRequest.url?.includes('/auth/login')) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token available');

        const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        });

        // Store new tokens
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

        // Update auth header for the failed request and retry
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        useAuthStore.getState().logout();
        window.location.href = '/auth/login'; // Redirect hard to login to clear memory
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
