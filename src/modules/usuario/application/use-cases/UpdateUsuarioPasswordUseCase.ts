import type { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';

export class UpdateUsuarioPasswordUseCase {
  private repository: IUsuarioRepository;

  constructor(repository: IUsuarioRepository) {
    this.repository = repository;
  }

  async execute(id: string, uspassword: string): Promise<{ message: string }> {
    if (!uspassword || uspassword.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    return this.repository.updateUsuarioPassword(id, uspassword);
  }
}
