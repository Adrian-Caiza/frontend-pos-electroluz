/**
 * Use case for logging in a user.
 * Pure business logic, no framework dependencies.
 */
import type { IAuthRepository, LoginCredentials } from '../../domain/repositories/IAuthRepository';
import type { AuthResponse } from '../../domain/entities/User';

export class LoginUseCase {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!credentials.emruc || !credentials.usapodo || !credentials.uspassword) {
      throw new Error('Todos los campos son obligatorios');
    }
    
    return this.authRepository.login(credentials);
  }
}
