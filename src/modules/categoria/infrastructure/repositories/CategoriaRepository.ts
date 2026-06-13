import { categoriaApi, type PaginatedResponse } from '../services/categoriaApi';
import type { Categoria } from '../../domain/entities/Categoria';

export class CategoriaRepository {
  async getCategorias(page: number, pageSize: number): Promise<PaginatedResponse<Categoria>> {
    return categoriaApi.getCategorias(page, pageSize);
  }

  async getCategoriaById(id: string): Promise<Categoria> {
    return categoriaApi.getCategoriaById(id);
  }

  async createCategoria(data: Partial<Categoria>): Promise<Categoria> {
    return categoriaApi.createCategoria(data);
  }

  async updateCategoria(id: string, data: Partial<Categoria>): Promise<Categoria> {
    return categoriaApi.updateCategoria(id, data);
  }
}
