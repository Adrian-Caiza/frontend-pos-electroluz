import type { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import type { Usuario, UpdateUsuarioDto } from '../../domain/entities/Usuario';

export class UpdateUsuarioUseCase {
  private repository: IUsuarioRepository;

  constructor(repository: IUsuarioRepository) {
    this.repository = repository;
  }

  async execute(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
    return this.repository.updateUsuario(id, data);
  }
}
