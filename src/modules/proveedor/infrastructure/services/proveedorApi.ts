import { apiClient as api } from '../../../../shared/lib/apiClient';
import type { Proveedor, CreateProveedorDto, UpdateProveedorDto } from '../../domain/entities/Proveedor';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export const proveedorApiService = {
  getProveedores: async (page: number = 1, pageSize: number = 10, search?: string, status?: string): Promise<PaginatedResponse<Proveedor>> => {
    const params: Record<string, any> = { page, pageSize };
    if (search) params.search = search;
    if (status) params.status = status;
    const response = await api.get('/proveedores', { params });
    return response.data;
  },

  getProveedorById: async (id: string): Promise<Proveedor> => { 
    const response = await api.get(`/proveedores/${id}`);
    return response.data;
  },

  createProveedor: async (data: CreateProveedorDto): Promise<Proveedor> => {
    const response = await api.post('/proveedores', data);
    return response.data;
  },

  updateProveedor: async (id: string, data: UpdateProveedorDto): Promise<Proveedor> => {
    const response = await api.patch(`/proveedores/${id}`, data);
    return response.data;
  }
};
