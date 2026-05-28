import type { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import type { Cliente, UpdateClienteDto } from '../../domain/entities/Cliente';

export class UpdateClienteUseCase {
  private repository: IClienteRepository;

  constructor(repository: IClienteRepository) {
    this.repository = repository;
  }

  async execute(id: string, data: UpdateClienteDto): Promise<Cliente> {
    return this.repository.updateCliente(id, data);
  }
}
