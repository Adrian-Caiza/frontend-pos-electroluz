import { medidaApi } from '../services/medidaApi';
import type { Medida } from '../../domain/entities/Medida';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export class MedidaRepository {
  async getMedidas(page: number, pageSize: number): Promise<PaginatedResponse<Medida>> {
    return medidaApi.getMedidas(page, pageSize);
  }
}
