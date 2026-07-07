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
      
      console.warn('Logout API call failed', error);
    }
  }
}
