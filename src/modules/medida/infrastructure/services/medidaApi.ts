import { apiClient as api } from '../../../../shared/lib/apiClient';
import type { Medida } from '../../domain/entities/Medida';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export const medidaApi = {
  getMedidas: async (page: number = 1, pageSize: number = 100): Promise<PaginatedResponse<Medida>> => {
    const response = await api.get('/medidas', { params: { page, pageSize } });
    return response.data;
  }
};
