
import type { AuthResponse } from '../entities/User';
export interface LoginCredentials {
  emruc: string;
  usapodo: string;
  uspassword: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(refreshToken: string): Promise<void>;
}
