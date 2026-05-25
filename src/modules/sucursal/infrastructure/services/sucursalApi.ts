import { apiClient } from '../../../../shared/lib/apiClient';
import type { PaginatedSucursales } from '../../domain/entities/Sucursal';

export const sucursalApi = {
  getSucursales: async (page: number, pageSize: number): Promise<PaginatedSucursales> => {
    const response = await apiClient.get<PaginatedSucursales>('/branches', {
      params: { page, pageSize },
    });
    return response.data;
  },
};
