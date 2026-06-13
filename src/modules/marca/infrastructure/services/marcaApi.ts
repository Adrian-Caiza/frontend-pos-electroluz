import { apiClient as api } from '../../../../shared/lib/apiClient';
import type { Marca } from '../../domain/entities/Marca';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export const marcaApi = {
  getMarcas: async (page: number = 1, pageSize: number = 100): Promise<PaginatedResponse<Marca>> => {
    const response = await api.get('/brands', { params: { page, pageSize } });
    return response.data;
  },
  getMarcaById: async (id: string): Promise<Marca> => {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },
  createMarca: async (data: Partial<Marca>): Promise<Marca> => {
    const response = await api.post('/brands', data);
    return response.data;
  },
  updateMarca: async (id: string, data: Partial<Marca>): Promise<Marca> => {
    const response = await api.patch(`/brands/${id}`, data);
    return response.data;
  }
};
