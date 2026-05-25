/**
 * Concrete implementation of IAuthRepository.
 */
import type { IAuthRepository, LoginCredentials } from '../../domain/repositories/IAuthRepository';
import type { AuthResponse } from '../../domain/entities/User';
import { authApi } from '../services/authApi';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return authApi.login(credentials);
  }

  async logout(): Promise<void> {
    // Call logout endpoint if exists, else just clear client state
    // await apiClient.post('/auth/logout');
  }
}
