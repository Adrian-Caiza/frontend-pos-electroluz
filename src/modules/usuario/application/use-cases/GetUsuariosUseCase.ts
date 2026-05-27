import type { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import type { PaginatedUsuarios } from '../../domain/entities/Usuario';

export class GetUsuariosUseCase {
  private repository: IUsuarioRepository;

  constructor(repository: IUsuarioRepository) {
    this.repository = repository;
  }

  async execute(page: number, pageSize: number): Promise<PaginatedUsuarios> {
    return this.repository.getUsuarios(page, pageSize);
  }
}
