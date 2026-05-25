import { marcaApi } from '../services/marcaApi';
import type { Marca } from '../../domain/entities/Marca';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export class MarcaRepository {
  async getMarcas(page: number, pageSize: number): Promise<PaginatedResponse<Marca>> {
    return marcaApi.getMarcas(page, pageSize);
  }
}
