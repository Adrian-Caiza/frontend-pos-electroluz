/**
 * API service for Auth module.
 * Handles exact HTTP details.
 */
import { apiClient } from '../../../../shared/lib/apiClient';
import type { LoginCredentials } from '../../domain/repositories/IAuthRepository';
import type { AuthResponse } from '../../domain/entities/User';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
  },
};
