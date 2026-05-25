import { apiClient as api } from '../../../../shared/lib/apiClient';
import type { Proveedor } from '../../domain/entities/Proveedor';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export const proveedorApi = {
  getProveedores: async (page: number = 1, pageSize: number = 100): Promise<PaginatedResponse<Proveedor>> => {
    const response = await api.get('/proveedores', { params: { page, pageSize } });
    return response.data;
  }
};
