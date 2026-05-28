import type { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import type { PaginatedClientes } from '../../domain/entities/Cliente';

export class GetClientesUseCase {
  private repository: IClienteRepository;

  constructor(repository: IClienteRepository) {
    this.repository = repository;
  }

  async execute(page: number, pageSize: number): Promise<PaginatedClientes> {
    return this.repository.getClientes(page, pageSize);
  }
}
