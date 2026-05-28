import type { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import type { Cliente, CreateClienteDto } from '../../domain/entities/Cliente';

export class CreateClienteUseCase {
  private repository: IClienteRepository;

  constructor(repository: IClienteRepository) {
    this.repository = repository;
  }

  async execute(data: CreateClienteDto): Promise<Cliente> {
    return this.repository.createCliente(data);
  }
}
