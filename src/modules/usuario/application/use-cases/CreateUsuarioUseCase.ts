import type { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import type { Usuario, CreateUsuarioDto } from '../../domain/entities/Usuario';

export class CreateUsuarioUseCase {
  private repository: IUsuarioRepository;

  constructor(repository: IUsuarioRepository) {
    this.repository = repository;
  }

  async execute(data: CreateUsuarioDto): Promise<Usuario> {
    return this.repository.createUsuario(data);
  }
}
