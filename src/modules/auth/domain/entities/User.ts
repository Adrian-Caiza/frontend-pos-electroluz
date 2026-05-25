/**
 * Domain entities for the Authentication module.
 */

export interface User {
  id?: string;
  usapodo: string;
  emruc: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface AuthToken {
  token: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthToken;
}
