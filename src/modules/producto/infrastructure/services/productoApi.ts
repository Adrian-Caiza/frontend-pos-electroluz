import { apiClient as api } from '../../../../shared/lib/apiClient';
import type { Producto, CreateProductoDto, UpdateProductoDto } from '../../domain/entities/Producto';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export const productoApi = {
  create: async (data: CreateProductoDto): Promise<Producto> => {
    const formData = new FormData();
    
    // Append all string fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'imagen') {
        formData.append(key, String(value));
      }
    });

    // Append file if exists
    if (data.imagen instanceof File) {
      formData.append('imagen', data.imagen);
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: UpdateProductoDto): Promise<Producto> => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'imagen') {
        formData.append(key, String(value));
      }
    });

    if (data.imagen instanceof File) {
      formData.append('imagen', data.imagen);
    }

    const response = await api.patch(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (page: number = 1, pageSize: number = 10, search?: string, status?: string): Promise<PaginatedResponse<Producto>> => {
    const params: Record<string, any> = { page, pageSize };
    if (search) params.search = search;
    if (status) params.status = status;
    const response = await api.get('/products', { params });
    return response.data;
  }
};
