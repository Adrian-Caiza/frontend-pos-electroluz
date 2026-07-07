
import type { IAuthRepository, LoginCredentials } from '../../domain/repositories/IAuthRepository';
import type { AuthResponse } from '../../domain/entities/User';
import { authApi } from '../services/authApi';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return authApi.login(credentials);
  }

  async logout(refreshToken: string): Promise<void> {
    await authApi.logout(refreshToken);
  }
}
