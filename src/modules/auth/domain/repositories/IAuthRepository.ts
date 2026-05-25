/**
 * Repository interface for Authentication.
 * This contract isolates the business logic from infrastructure implementation details.
 */
import type { AuthResponse } from '../entities/User';
export interface LoginCredentials {
  emruc: string;
  usapodo: string;
  uspassword: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
}
