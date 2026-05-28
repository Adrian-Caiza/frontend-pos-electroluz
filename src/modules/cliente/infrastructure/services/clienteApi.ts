import { apiClient } from '../../../../shared/lib/apiClient';
import type {
  Cliente,
  PaginatedClientes,
  CreateClienteDto,
  UpdateClienteDto,
} from '../../domain/entities/Cliente';

export const clienteApi = {
  getClientes: async (page: number, pageSize: number): Promise<PaginatedClientes> => {
    const response = await apiClient.get('/clients', {
      params: { page, pageSize },
    });
    return response.data;
  },

  createCliente: async (data: CreateClienteDto): Promise<Cliente> => {
    const response = await apiClient.post('/clients', data);
    return response.data;
  },

  updateCliente: async (id: string, data: UpdateClienteDto): Promise<Cliente> => {
    const response = await apiClient.patch(`/clients/${id}`, data);
    return response.data;
  },
};
