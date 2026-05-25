import { categoriaApi, type PaginatedResponse } from '../services/categoriaApi';
import type { Categoria } from '../../domain/entities/Categoria';

export class CategoriaRepository {
  async getCategorias(page: number, pageSize: number): Promise<PaginatedResponse<Categoria>> {
    return categoriaApi.getCategorias(page, pageSize);
  }
}
