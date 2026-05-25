import { apiClient as api } from '../../../../shared/lib/apiClient';
import type { Marca } from '../../domain/entities/Marca';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export const marcaApi = {
  getMarcas: async (page: number = 1, pageSize: number = 100): Promise<PaginatedResponse<Marca>> => {
    const response = await api.get('/brands', { params: { page, pageSize } });
    return response.data;
  }
};
