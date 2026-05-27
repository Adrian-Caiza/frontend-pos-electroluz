import type { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import type { UpdateUsuarioStatusDto } from '../../domain/entities/Usuario';

export class UpdateUsuarioStatusUseCase {
  private repository: IUsuarioRepository;

  constructor(repository: IUsuarioRepository) {
    this.repository = repository;
  }

  async execute(id: string, data: UpdateUsuarioStatusDto): Promise<{ message: string }> {
    return this.repository.updateUsuarioStatus(id, data);
  }
}
