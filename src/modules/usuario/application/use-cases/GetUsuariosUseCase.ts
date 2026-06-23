import type { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import type { PaginatedUsuarios } from '../../domain/entities/Usuario';

export class GetUsuariosUseCase {
  private repository: IUsuarioRepository;

  constructor(repository: IUsuarioRepository) {
    this.repository = repository;
  }

  async execute(page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedUsuarios> {
    return this.repository.getUsuarios(page, pageSize, search, status);
  }
}
