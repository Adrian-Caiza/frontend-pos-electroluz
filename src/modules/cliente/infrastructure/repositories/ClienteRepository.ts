import type { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import type {
  Cliente,
  PaginatedClientes,
  CreateClienteDto,
  UpdateClienteDto,
} from '../../domain/entities/Cliente';
import { clienteApi } from '../services/clienteApi';

export class ClienteRepository implements IClienteRepository {
  async getClientes(page: number, pageSize: number): Promise<PaginatedClientes> {
    return clienteApi.getClientes(page, pageSize);
  }

  async createCliente(data: CreateClienteDto): Promise<Cliente> {
    return clienteApi.createCliente(data);
  }

  async updateCliente(id: string, data: UpdateClienteDto): Promise<Cliente> {
    return clienteApi.updateCliente(id, data);
  }
}
