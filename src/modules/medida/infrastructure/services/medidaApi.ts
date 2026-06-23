import { apiClient as api } from '../../../../shared/lib/apiClient';
import type { Medida, CreateMedidaDto, UpdateMedidaDto } from '../../domain/entities/Medida';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export const medidaApi = {
  getMedidas: async (page: number = 1, pageSize: number = 10, search?: string, status?: string): Promise<PaginatedResponse<Medida>> => {
    const params: Record<string, any> = { page, pageSize };
    if (search) params.search = search;
    if (status) params.status = status;
    const response = await api.get('/medidas', { params });
    return response.data;
  },

  getMedidaById: async (id: string): Promise<Medida> => { 
    const response = await api.get(`/medidas/${id}`);
    return response.data;
  },

  createMedida: async (data: CreateMedidaDto): Promise<Medida> => {
    const response = await api.post('/medidas', data);
    return response.data;
  },

  updateMedida: async (id: string, data: UpdateMedidaDto): Promise<Medida> => {
    const response = await api.patch(`/medidas/${id}`, data);
    return response.data;
  }
};
