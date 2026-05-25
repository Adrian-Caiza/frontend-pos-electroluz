import type { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class LogoutUseCase {
  private authRepository: IAuthRepository;
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    try {
      await this.authRepository.logout(refreshToken);
    } catch (error) {
      // Even if the server fails to logout (e.g. token already expired), 
      // we proceed to log the user out locally.
      console.warn('Logout API call failed', error);
    }
  }
}
