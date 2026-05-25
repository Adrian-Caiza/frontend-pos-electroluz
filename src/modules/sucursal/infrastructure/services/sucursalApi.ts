import { apiClient } from '../../../../shared/lib/apiClient';
import type { PaginatedSucursales, Sucursal, CreateSucursalDto, UpdateSucursalDto } from '../../domain/entities/Sucursal';

export const sucursalApi = {
  getSucursales: async (page: number, pageSize: number): Promise<PaginatedSucursales> => {
    const response = await apiClient.get<PaginatedSucursales>('/branches', {
      params: { page, pageSize },
    });
    return response.data;
  },

  createSucursal: async (data: CreateSucursalDto): Promise<Sucursal> => {
    const response = await apiClient.post<Sucursal>('/branches', data);
    return response.data;
  },

  updateSucursal: async (id: string, data: UpdateSucursalDto): Promise<Sucursal> => {
    const response = await apiClient.patch<Sucursal>(`/branches/${id}`, data);
    return response.data;
  },
};
