import { marcaApi } from '../services/marcaApi';
import type { Marca } from '../../domain/entities/Marca';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export class MarcaRepository {
  async getMarcas(page: number, pageSize: number): Promise<PaginatedResponse<Marca>> {
    return marcaApi.getMarcas(page, pageSize);
  }

  async getMarcaById(id: string): Promise<Marca> {
    return marcaApi.getMarcaById(id);
  }

  async createMarca(data: Partial<Marca>): Promise<Marca> {
    return marcaApi.createMarca(data);
  }

  async updateMarca(id: string, data: Partial<Marca>): Promise<Marca> {
    return marcaApi.updateMarca(id, data);
  }
}
