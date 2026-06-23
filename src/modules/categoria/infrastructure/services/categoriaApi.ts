import { apiClient as api } from '../../../../shared/lib/apiClient';
import type { Categoria } from '../../domain/entities/Categoria';

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const categoriaApi = {
  getCategorias: async (page: number = 1, pageSize: number = 100, search?: string, status?: string): Promise<PaginatedResponse<Categoria>> => {
    const params: Record<string, any> = { page, pageSize };
    if (search) params.search = search;
    if (status) params.status = status;
    const response = await api.get('/categories', { params });
    return response.data;
  },
  getCategoriaById: async (id: string): Promise<Categoria> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  createCategoria: async (data: Partial<Categoria>): Promise<Categoria> => {
    const response = await api.post('/categories', data);
    return response.data;
  },
  updateCategoria: async (id: string, data: Partial<Categoria>): Promise<Categoria> => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  }
};
