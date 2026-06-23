import type {
  Cliente,
  PaginatedClientes,
  CreateClienteDto,
  UpdateClienteDto,
} from '../entities/Cliente';

export interface IClienteRepository {
  getClientes(page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedClientes>;
  createCliente(data: CreateClienteDto): Promise<Cliente>;
  updateCliente(id: string, data: UpdateClienteDto): Promise<Cliente>;
}
